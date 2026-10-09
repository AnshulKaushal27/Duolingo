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
    last_active_date: date
    created_at: datetime
    next_heart_in_seconds: Optional[int] = 0

    class Config:
        from_attributes = True

class RefillHeartsResponse(BaseModel):
    success: bool
    hearts: int
    gems: int
    message: str
    next_heart_in_seconds: Optional[int] = 0
