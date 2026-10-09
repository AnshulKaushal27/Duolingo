import uuid
import unicodedata
from datetime import datetime
from typing import Any, Tuple, Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..models import Lesson, Exercise, LessonAttempt, UserProgress, User, DailyQuest, LeaderboardEntry
from .user_service import update_streak_and_activity

def normalize_text(text: str) -> str:
    """Normalizes string: strips whitespace, lowercases, removes redundant punctuation."""
    if not text:
        return ""
    normalized = text.strip().lower()
    # Also strip common punctuation like commas, periods, question marks, and Japanese punctuation
    for ch in [".", ",", "!", "?", "¿", "¡", "。", "、", "！", "？", "・", "「", "」", "〜", "ー"]:
        normalized = normalized.replace(ch, "")
    return " ".join(normalized.split())

def strip_accents(text: str) -> str:
    """Removes diacritics for accent-tolerant comparison."""
    return "".join(
        c for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )

def start_lesson(db: Session, user: User, lesson_id: int) -> Tuple[str, Lesson]:
    # 1. Enforce hearts > 0 (H3 [C])
    if user.hearts <= 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot start lesson with 0 hearts. Refill hearts with gems, practice, or wait for regeneration."
        )

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # 2. Enforce skill lock (P4 [C])
    current_skill = lesson.skill
    if current_skill:
        unit = current_skill.unit
        course = unit.course if unit else None
        if course:
            all_skills = []
            for u in sorted(course.units, key=lambda x: x.unit_number):
                for s in sorted(u.skills, key=lambda x: x.order_index):
                    all_skills.append(s)

            skill_idx = next((i for i, s in enumerate(all_skills) if s.id == current_skill.id), 0)
            if skill_idx > 0:
                completed_lesson_ids = {
                    p.lesson_id for p in db.query(UserProgress).filter(
                        UserProgress.user_id == user.id,
                        UserProgress.completed == True
                    ).all()
                }
                for prev_skill in all_skills[:skill_idx]:
                    if prev_skill.lessons:
                        prev_completed = any(l.id in completed_lesson_ids for l in prev_skill.lessons)
                        if not prev_completed:
                            raise HTTPException(
                                status_code=403,
                                detail=f"Skill '{current_skill.title}' is locked! You must complete '{prev_skill.title}' first."
                            )

    attempt_id = str(uuid.uuid4())
    attempt = LessonAttempt(
        id=attempt_id,
        user_id=user.id,
        lesson_id=lesson.id,
        answered_exercise_ids=[],
        mistakes_count=0,
        is_completed=False,
        started_at=datetime.utcnow()
    )
    db.add(attempt)
    db.commit()
    return attempt_id, lesson

def validate_and_submit_exercise(
    db: Session,
    user: User,
    lesson_id: int,
    exercise_id: int,
    attempt_id: str,
    submitted_answer: Any
) -> dict:
    attempt = db.query(LessonAttempt).filter(
        LessonAttempt.id == attempt_id,
        LessonAttempt.user_id == user.id,
        LessonAttempt.lesson_id == lesson_id
    ).first()

    if not attempt:
        raise HTTPException(status_code=404, detail="Lesson attempt not found or unauthorized")

    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id,
        Exercise.lesson_id == lesson_id
    ).first()

    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    # ANTI-DUPLICATE SUBMISSION SAFEGUARD
    raw_answered = attempt.answered_exercise_ids or {}
    if isinstance(raw_answered, list):
        answered_map = {str(eid): True for eid in raw_answered}
    elif isinstance(raw_answered, dict):
        answered_map = raw_answered
    else:
        answered_map = {}

    if answered_map.get(str(exercise_id)) is True:
        # Already submitted correctly for this attempt — reject duplicate evaluation safely
        return {
            "exercise_id": exercise_id,
            "is_correct": True,
            "correct_solution": "(Already submitted)",
            "hearts_remaining": user.hearts,
            "hearts_deducted": 0,
            "is_duplicate": True,
            "explanation": "This exercise was already submitted correctly."
        }

    sol = exercise.solution_payload or {}
    ex_type = exercise.type
    is_correct = False
    correct_solution_text = ""

    # Check for explicit Skip (counts as wrong, loses a heart, reveals solution)
    if submitted_answer == "__SKIPPED__":
        is_correct = False
        if ex_type == "multiple_choice":
            correct_solution_text = sol.get("correct_text", "")
        elif ex_type == "translate_word_bank":
            correct_solution_text = " ".join(sol.get("canonical_tokens", []))
        elif ex_type == "match_pairs":
            correct_solution_text = ", ".join([f"{k} = {v}" for k, v in sol.get("pairs", {}).items()])
        elif ex_type == "fill_in_the_blank":
            correct_solution_text = sol.get("correct_option", "")
        elif ex_type == "type_the_answer":
            correct_solution_text = sol.get("canonical_answer", "")
    elif ex_type == "multiple_choice":
        correct_id = sol.get("correct_option_id")
        correct_solution_text = sol.get("correct_text", "")
        # submitted_answer could be option_id (e.g. "opt_1") or text
        if isinstance(submitted_answer, str):
            is_correct = (submitted_answer == correct_id or normalize_text(submitted_answer) == normalize_text(correct_solution_text))
        elif isinstance(submitted_answer, dict):
            is_correct = (submitted_answer.get("id") == correct_id)

    elif ex_type == "translate_word_bank":
        canonical_tokens = sol.get("canonical_tokens", [])
        acceptable_sequences = sol.get("acceptable_token_sequences", [canonical_tokens])
        correct_solution_text = " ".join(canonical_tokens)

        # submitted_answer should be list of token strings or list of objects with text
        submitted_tokens = []
        if isinstance(submitted_answer, list):
            for item in submitted_answer:
                if isinstance(item, str):
                    submitted_tokens.append(item)
                elif isinstance(item, dict) and "text" in item:
                    submitted_tokens.append(item["text"])

        # Check exact or normalized match
        submitted_seq_str = normalize_text(" ".join(submitted_tokens))
        for seq in acceptable_sequences:
            if submitted_seq_str == normalize_text(" ".join(seq)):
                is_correct = True
                break

    elif ex_type == "match_pairs":
        # sol['pairs'] is a dict of left -> right
        expected_pairs = sol.get("pairs", {})
        correct_solution_text = ", ".join([f"{k} = {v}" for k, v in expected_pairs.items()])

        # submitted_answer is dict or list of pairs
        if isinstance(submitted_answer, dict):
            matched_all = True
            for left, right in expected_pairs.items():
                if normalize_text(submitted_answer.get(left, "")) != normalize_text(right):
                    matched_all = False
                    break
            is_correct = matched_all
        elif isinstance(submitted_answer, list):
            # List of [left, right]
            sub_dict = {item[0]: item[1] for item in submitted_answer if len(item) == 2}
            matched_all = True
            for left, right in expected_pairs.items():
                if normalize_text(sub_dict.get(left, "")) != normalize_text(right):
                    matched_all = False
                    break
            is_correct = matched_all

    elif ex_type == "fill_in_the_blank":
        correct_option = sol.get("correct_option", "")
        correct_solution_text = correct_option
        if isinstance(submitted_answer, str):
            is_correct = (normalize_text(submitted_answer) == normalize_text(correct_option))

    elif ex_type == "type_the_answer":
        canonical_ans = sol.get("canonical_answer", "")
        acceptable_list = sol.get("acceptable_answers", [canonical_ans])
        correct_solution_text = canonical_ans

        if isinstance(submitted_answer, str):
            clean_sub = normalize_text(submitted_answer)
            clean_sub_no_accents = strip_accents(clean_sub)
            for acc in acceptable_list:
                clean_acc = normalize_text(acc)
                if clean_sub == clean_acc or clean_sub_no_accents == strip_accents(clean_acc):
                    is_correct = True
                    break

    # Record answered exercise ID with correctness
    answered_map[str(exercise_id)] = is_correct
    attempt.answered_exercise_ids = answered_map

    hearts_deducted = 0
    if not is_correct:
        attempt.mistakes_count += 1
        if user.hearts > 0:
            user.hearts -= 1
            hearts_deducted = 1

    db.commit()
    db.refresh(user)

    return {
        "exercise_id": exercise_id,
        "is_correct": is_correct,
        "correct_solution": correct_solution_text,
        "hearts_remaining": user.hearts,
        "hearts_deducted": hearts_deducted,
        "is_duplicate": False,
        "explanation": "Nicely done!" if is_correct else f"Correct solution: {correct_solution_text}"
    }

def complete_lesson(db: Session, user: User, lesson_id: int, attempt_id: str) -> dict:
    attempt = db.query(LessonAttempt).filter(
        LessonAttempt.id == attempt_id,
        LessonAttempt.lesson_id == lesson_id
    ).first()

    if not attempt:
        raise HTTPException(status_code=404, detail="Lesson attempt not found")

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    if attempt.is_completed:
        # Already completed attempt
        return {
            "success": True,
            "xp_earned": 0,
            "total_xp": user.total_xp,
            "streak": user.streak,
            "streak_extended": False,
            "hearts_remaining": user.hearts,
            "lesson_id": lesson_id,
            "skill_completed": False,
            "next_skill_unlocked_id": None,
            "accuracy_percentage": 100,
            "gems": user.gems,
            "gems_earned": 0
        }

    attempt.is_completed = True
    attempt.completed_at = datetime.utcnow()

    # Award XP
    xp_to_award = lesson.xp_reward or 15
    user.total_xp += xp_to_award

    # Extend daily streak & activity
    streak_extended = update_streak_and_activity(db, user, xp_to_award)

    # Record UserProgress
    progress = UserProgress(
        user_id=user.id,
        lesson_id=lesson.id,
        skill_id=lesson.skill_id,
        completed=True,
        mistakes_count=attempt.mistakes_count,
        xp_earned=xp_to_award,
        completed_at=datetime.utcnow()
    )
    db.add(progress)

    # Calculate accuracy
    total_exercises = len(attempt.answered_exercise_ids or [])
    mistakes = attempt.mistakes_count
    accuracy = 100
    if total_exercises > 0:
        accuracy = max(0, int(((total_exercises - mistakes) / total_exercises) * 100))

    # Base gems reward for lesson completion
    gems_earned = 10
    user.gems += gems_earned

    # Update Daily Quests progress
    quests = db.query(DailyQuest).filter(DailyQuest.user_id == user.id, DailyQuest.completed == False).all()
    for q in quests:
        if "XP" in q.title:
            q.current_progress = min(q.target_progress, q.current_progress + xp_to_award)
        elif "lesson" in q.title.lower():
            q.current_progress = min(q.target_progress, q.current_progress + 1)
        if q.current_progress >= q.target_progress:
            q.completed = True
            user.gems += q.reward_gems
            gems_earned += q.reward_gems

    # Update Leaderboard weekly XP for current user
    lb_entry = db.query(LeaderboardEntry).filter(LeaderboardEntry.user_id == user.id).first()
    if lb_entry:
        lb_entry.weekly_xp += xp_to_award

    # Check if skill completed and find next unlocked skill (completing 1 lesson unlocks the next skill level)
    completed_lessons = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.skill_id == lesson.skill_id
    ).all()
    skill_completed = len(completed_lessons) >= 1

    next_skill_unlocked_id = None
    if skill_completed and lesson.skill:
        current_skill = lesson.skill
        next_skill = db.query(current_skill.__class__).filter(
            current_skill.__class__.unit_id == current_skill.unit_id,
            current_skill.__class__.order_index > current_skill.order_index
        ).order_by(current_skill.__class__.order_index).first()
        if next_skill:
            next_skill_unlocked_id = next_skill.id

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "xp_earned": xp_to_award,
        "total_xp": user.total_xp,
        "streak": user.streak,
        "streak_extended": streak_extended,
        "hearts_remaining": user.hearts,
        "lesson_id": lesson_id,
        "skill_completed": skill_completed,
        "next_skill_unlocked_id": next_skill_unlocked_id,
        "accuracy_percentage": accuracy,
        "gems": user.gems,
        "gems_earned": gems_earned
    }
