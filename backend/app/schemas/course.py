from typing import List, Optional
from pydantic import BaseModel

class SkillStatus(BaseModel):
    id: int
    unit_id: int
    order_index: int
    title: str
    icon_name: str
    total_crowns: int
    completed_lessons: int
    total_lessons: int
    status: str  # "locked", "available", "completed", "mastered"
    crowns_earned: int
    next_lesson_id: Optional[int] = None

class UnitWithSkills(BaseModel):
    id: int
    course_id: int
    unit_number: int
    title: str
    description: str
    color_hex: str
    skills: List[SkillStatus]

class CourseBase(BaseModel):
    id: int
    code: str
    title: str
    flag_icon: str
    description: str

class CourseWithTree(CourseBase):
    units: List[UnitWithSkills]

    class Config:
        from_attributes = True
