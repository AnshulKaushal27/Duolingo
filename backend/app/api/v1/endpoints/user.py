from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....core.deps import get_current_user
from ....models import User
from ....schemas import UserProfile, RefillHeartsResponse
from ....services.user_service import (
    refill_hearts_with_gems,
    practice_regain_heart,
    check_and_regenerate_hearts,
)

router = APIRouter()

@router.get("/profile", response_model=UserProfile)
def get_profile(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    next_seconds = check_and_regenerate_hearts(db, user)
    user.next_heart_in_seconds = next_seconds
    return user

@router.post("/hearts/refill", response_model=RefillHeartsResponse)
def refill_hearts(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success, message = refill_hearts_with_gems(db, user, cost=350)
    return RefillHeartsResponse(
        success=success,
        hearts=user.hearts,
        gems=user.gems,
        message=message,
        next_heart_in_seconds=0
    )

@router.post("/hearts/practice", response_model=RefillHeartsResponse)
def practice_heart(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success, message = practice_regain_heart(db, user)
    next_seconds = check_and_regenerate_hearts(db, user)
    return RefillHeartsResponse(
        success=success,
        hearts=user.hearts,
        gems=user.gems,
        message=message,
        next_heart_in_seconds=next_seconds
    )

@router.post("/chest/claim")
def claim_chest(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reward = 25
    user.gems += reward
    db.commit()
    return {"success": True, "gems": user.gems, "reward": reward}
