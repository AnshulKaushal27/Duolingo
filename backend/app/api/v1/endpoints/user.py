from datetime import date, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ....core.database import get_db
from ....core.deps import get_current_user
from ....models import User, Course
from ....schemas import (
    UserProfile,
    RefillHeartsResponse,
    StreakFreezeResponse,
    DailyGoalUpdateRequest,
    SimulateDayRequest,
    SimulateDayResponse,
    SwitchCourseRequest,
)
from ....services.user_service import (
    refill_hearts_with_gems,
    practice_regain_heart,
    check_and_regenerate_hearts,
    buy_streak_freeze,
    set_daily_goal,
    simulate_day_progression,
)

router = APIRouter()

@router.get("/profile", response_model=UserProfile)
def get_profile(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    next_seconds = check_and_regenerate_hearts(db, user)
    user.next_heart_in_seconds = next_seconds
    
    # Check streak expiry if user missed more than 1 day without freeze
    if user.last_active_date:
        days_diff = (date.today() - user.last_active_date).days
        if days_diff > 1 and user.streak > 0:
            if days_diff == 2 and (getattr(user, "streak_freezes", 0) or 0) > 0:
                pass  # Protected by freeze until today's lesson resolves it
            else:
                user.streak = 0
                db.commit()

    # Determine current course code
    course_code = "es"
    if user.current_course_id:
        c = db.query(Course).filter(Course.id == user.current_course_id).first()
        if c:
            course_code = c.code
    user.current_course_code = course_code

    return user

@router.post("/course/switch")
def switch_course(
    payload: SwitchCourseRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target = payload.course_code.strip().lower()
    course = db.query(Course).filter(Course.code == target).first()
    if not course:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Course '{payload.course_code}' not found")
    user.current_course_id = course.id
    db.commit()
    return {
        "success": True,
        "current_course_id": course.id,
        "course_code": course.code,
        "course_title": course.title
    }

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

@router.post("/shop/streak-freeze", response_model=StreakFreezeResponse)
def purchase_streak_freeze(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    success, message = buy_streak_freeze(db, user, cost=200)
    return StreakFreezeResponse(
        success=success,
        streak_freezes=getattr(user, "streak_freezes", 0) or 0,
        gems=user.gems,
        message=message
    )

@router.put("/daily-goal")
def update_daily_goal(
    payload: DailyGoalUpdateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    set_daily_goal(db, user, payload.daily_goal_xp)
    return {"success": True, "daily_goal_xp": user.daily_goal_xp}

@router.post("/debug/simulate-day", response_model=SimulateDayResponse)
def simulate_day(
    days_ago: int = Query(1, description="Simulate that user's last activity was N days ago (1 = yesterday, 2 = 2 days ago)"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sim_date, streak, freezes, msg = simulate_day_progression(db, user, days_ago)
    return SimulateDayResponse(
        success=True,
        simulated_last_active_date=sim_date,
        streak=streak,
        streak_freezes=freezes,
        message=msg
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
