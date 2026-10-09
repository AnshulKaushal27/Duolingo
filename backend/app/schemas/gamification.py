from typing import List
from pydantic import BaseModel

class LeaderboardUserOut(BaseModel):
    id: int
    rank: int
    display_name: str
    username: str
    avatar_url: str
    weekly_xp: int
    is_current_user: bool

class LeaderboardResponse(BaseModel):
    league: str
    time_remaining: str
    entries: List[LeaderboardUserOut]

class AchievementOut(BaseModel):
    id: int
    code: str
    title: str
    description: str
    icon: str
    target_value: int
    current_value: int
    unlocked: bool

class QuestOut(BaseModel):
    id: int
    title: str
    current_progress: int
    target_progress: int
    reward_gems: int
    completed: bool
