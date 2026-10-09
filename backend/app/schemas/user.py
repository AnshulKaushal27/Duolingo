from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class UserBase(BaseModel):
    username: str
    display_name: str
    email: str
    avatar_url: str

class UserProfile(UserBase):
    id: int
    streak: int
    hearts: int
    max_hearts: int
    gems: int
    total_xp: int
    streak_freezes: Optional[int] = 0
    daily_goal_xp: Optional[int] = 30
    last_active_date: date
    created_at: datetime
    next_heart_in_seconds: Optional[int] = 0
    current_course_id: Optional[int] = None
    current_course_code: Optional[str] = "es"

    class Config:
        from_attributes = True

class SwitchCourseRequest(BaseModel):
    course_code: str

class RefillHeartsResponse(BaseModel):
    success: bool
    hearts: int
    gems: int
    message: str
    next_heart_in_seconds: Optional[int] = 0

class StreakFreezeResponse(BaseModel):
    success: bool
    streak_freezes: int
    gems: int
    message: str

class DailyGoalUpdateRequest(BaseModel):
    daily_goal_xp: int

class SimulateDayRequest(BaseModel):
    days_ago: Optional[int] = 1

class SimulateDayResponse(BaseModel):
    success: bool
    simulated_last_active_date: date
    streak: int
    streak_freezes: int
    message: str

class WagerResponse(BaseModel):
    success: bool
    gems: int
    message: str

class BuyOutfitRequest(BaseModel):
    outfit_id: str
    price: int
    name: str

class BuyOutfitResponse(BaseModel):
    success: bool
    gems: int
    outfit_id: str
    message: str

class BuyGemsRequest(BaseModel):
    amount: int
    package_name: str

class BuyGemsResponse(BaseModel):
    success: bool
    gems: int
    message: str

class GemModifyRequest(BaseModel):
    amount: int
    action: str  # "add" | "spend"
    reason: Optional[str] = None

class GemModifyResponse(BaseModel):
    success: bool
    gems: int
    message: str

