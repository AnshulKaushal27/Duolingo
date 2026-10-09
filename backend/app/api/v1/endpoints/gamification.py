from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....core.deps import get_current_user
from ....models import User
from ....schemas import LeaderboardResponse, QuestOut, AchievementOut
from ....services.gamification_service import (
    get_league_leaderboard,
    get_user_quests,
    get_user_achievements,
)

router = APIRouter()

@router.get("/leaderboard", response_model=LeaderboardResponse)
def get_leaderboard(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = get_league_leaderboard(db, user)
    return LeaderboardResponse(**data)

@router.get("/quests", response_model=List[QuestOut])
def get_quests(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quests = get_user_quests(db, user)
    return quests

@router.get("/achievements", response_model=List[AchievementOut])
def get_achievements(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    achievements = get_user_achievements(db, user)
    return achievements
