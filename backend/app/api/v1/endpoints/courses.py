from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....core.deps import get_current_user, get_current_user_optional
from ....models import Course, Unit, Skill, Lesson, UserProgress, User
from ....schemas import CourseBase, CourseWithTree, UnitWithSkills, SkillStatus

router = APIRouter()

@router.get("", response_model=List[CourseBase])
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    return courses

@router.get("/{code}/tree", response_model=CourseWithTree)
def get_course_tree(
    code: str,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.code == code).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Fetch all user completed lesson IDs for this course
    completed_lesson_ids = set()
    if user:
        user_progress_records = db.query(UserProgress).filter(
            UserProgress.user_id == user.id,
            UserProgress.completed == True
        ).all()
        completed_lesson_ids = {p.lesson_id for p in user_progress_records}

    units_out = []
    # Track unlock progression across skills
    previous_skill_completed = True  # The very first skill is always unlocked

    for unit in course.units:
        skills_out = []
        for skill in unit.skills:
            all_lessons = skill.lessons
            total_lessons = len(all_lessons)
            completed_in_skill = sum(1 for l in all_lessons if l.id in completed_lesson_ids)

            is_completed = (completed_in_skill >= total_lessons and total_lessons > 0)
            
            # Determine status
            if is_completed:
                status = "completed"
                crowns_earned = skill.total_crowns
            elif previous_skill_completed:
                status = "available"
                crowns_earned = min(skill.total_crowns, completed_in_skill)
            else:
                status = "locked"
                crowns_earned = 0

            # Find next lesson ID to play
            next_lesson_id = None
            for l in all_lessons:
                if l.id not in completed_lesson_ids:
                    next_lesson_id = l.id
                    break
            # If all completed, practice the first lesson
            if not next_lesson_id and all_lessons:
                next_lesson_id = all_lessons[0].id

            skills_out.append(SkillStatus(
                id=skill.id,
                unit_id=unit.id,
                order_index=skill.order_index,
                title=skill.title,
                icon_name=skill.icon_name,
                total_crowns=skill.total_crowns,
                completed_lessons=completed_in_skill,
                total_lessons=total_lessons,
                status=status,
                crowns_earned=crowns_earned,
                next_lesson_id=next_lesson_id
            ))

            previous_skill_completed = is_completed

        units_out.append(UnitWithSkills(
            id=unit.id,
            course_id=course.id,
            unit_number=unit.unit_number,
            title=unit.title,
            description=unit.description,
            color_hex=unit.color_hex,
            skills=skills_out
        ))

    return CourseWithTree(
        id=course.id,
        code=course.code,
        title=course.title,
        flag_icon=course.flag_icon,
        description=course.description,
        units=units_out
    )

from ....services.guidebook_service import get_unit_guidebook

@router.get("/units/{unit_id}/guidebook")
def get_guidebook(unit_id: int, db: Session = Depends(get_db)):
    unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    course_code = unit.course.code if unit.course else "es"
    return get_unit_guidebook(unit.unit_number, course_code)

@router.post("/units/{unit_id}/jump-ahead")
def jump_ahead_to_unit(
    unit_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_unit = db.query(Unit).filter(Unit.id == unit_id).first()
    if not target_unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    # Complete all lessons from prior units
    prior_units = db.query(Unit).filter(
        Unit.course_id == target_unit.course_id,
        Unit.unit_number < target_unit.unit_number
    ).all()
    
    for u in prior_units:
        for sk in u.skills:
            for les in sk.lessons:
                prog = db.query(UserProgress).filter(
                    UserProgress.user_id == user.id,
                    UserProgress.lesson_id == les.id
                ).first()
                if not prog:
                    prog = UserProgress(
                        user_id=user.id,
                        lesson_id=les.id,
                        skill_id=sk.id,
                        completed=True,
                        xp_earned=les.xp_reward or 15
                    )
                    db.add(prog)
                else:
                    prog.completed = True
    
    user.total_xp += 50
    db.commit()
    return {"success": True, "message": f"Successfully jumped ahead to Unit {target_unit.unit_number}!"}
