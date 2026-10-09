from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....core.deps import get_current_user_optional
from ....models import User
from ....schemas import (
    LessonStartResponse,
    ExerciseClientOut,
    ExerciseSubmitRequest,
    ExerciseSubmitResponse,
    LessonCompleteRequest,
    LessonCompleteResponse,
)
from ....services.lesson_service import (
    start_lesson,
    validate_and_submit_exercise,
    complete_lesson,
)

router = APIRouter()

@router.post("/{id}/start", response_model=LessonStartResponse)
def api_start_lesson(
    id: int,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if not user:
        user = db.query(User).first()
        if not user:
            raise HTTPException(status_code=401, detail="No user available")
    attempt_id, lesson = start_lesson(db, user, id)

    # Sanitize exercises: ONLY return client_payload, NEVER return solution_payload!
    client_exercises = [
        ExerciseClientOut(
            id=ex.id,
            lesson_id=ex.lesson_id,
            order_index=ex.order_index,
            type=ex.type,
            prompt=ex.prompt,
            question_text=ex.question_text,
            audio_text=ex.audio_text,
            client_payload=ex.client_payload
        )
        for ex in lesson.exercises
    ]

    return LessonStartResponse(
        attempt_id=attempt_id,
        lesson_id=lesson.id,
        lesson_title=lesson.title,
        skill_id=lesson.skill_id,
        skill_title=lesson.skill.title if lesson.skill else "",
        xp_reward=lesson.xp_reward,
        total_exercises=len(client_exercises),
        exercises=client_exercises
    )

@router.post("/{id}/exercises/{exercise_id}/submit", response_model=ExerciseSubmitResponse)
def api_submit_exercise(
    id: int,
    exercise_id: int,
    payload: ExerciseSubmitRequest,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if not user:
        user = db.query(User).first()
    result = validate_and_submit_exercise(
        db=db,
        user=user,
        lesson_id=id,
        exercise_id=exercise_id,
        attempt_id=payload.attempt_id,
        submitted_answer=payload.submitted_answer
    )
    return ExerciseSubmitResponse(**result)

@router.post("/{id}/complete", response_model=LessonCompleteResponse)
def api_complete_lesson(
    id: int,
    payload: LessonCompleteRequest,
    user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    if not user:
        user = db.query(User).first()
    result = complete_lesson(
        db=db,
        user=user,
        lesson_id=id,
        attempt_id=payload.attempt_id
    )
    return LessonCompleteResponse(**result)
