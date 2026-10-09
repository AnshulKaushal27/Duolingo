from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class ExerciseClientOut(BaseModel):
    id: int
    lesson_id: int
    order_index: int
    type: str  # multiple_choice, translate_word_bank, match_pairs, fill_in_the_blank, type_the_answer
    prompt: str
    question_text: str
    audio_text: Optional[str] = None
    client_payload: Dict[str, Any]

    class Config:
        from_attributes = True

class LessonStartResponse(BaseModel):
    attempt_id: str
    lesson_id: int
    lesson_title: str
    skill_id: int
    skill_title: str
    xp_reward: int
    total_exercises: int
    exercises: List[ExerciseClientOut]

class ExerciseSubmitRequest(BaseModel):
    attempt_id: str
    submitted_answer: Any

class ExerciseSubmitResponse(BaseModel):
    exercise_id: int
    is_correct: bool
    correct_solution: str
    hearts_remaining: int
    hearts_deducted: int
    is_duplicate: bool
    explanation: Optional[str] = None

class LessonCompleteRequest(BaseModel):
    attempt_id: str

class LessonCompleteResponse(BaseModel):
    success: bool
    xp_earned: int
    total_xp: int
    streak: int
    streak_extended: bool
    hearts_remaining: int
    lesson_id: int
    skill_completed: bool
    next_skill_unlocked_id: Optional[int] = None
    accuracy_percentage: int
    gems: int
    gems_earned: Optional[int] = 10
