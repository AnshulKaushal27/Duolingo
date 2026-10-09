from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from ..models import User, ActivityLog


HEART_REGEN_INTERVAL_SECONDS = 3600  # 1 hour per heart regeneration

def check_and_regenerate_hearts(db: Session, user: User) -> int:
    """Checks if time-based heart regeneration has triggered and awards hearts.
    Returns seconds remaining until the next heart regenerates (or 0 if full).
    """
    if user.hearts >= user.max_hearts:
        if user.last_heart_regenerated_at is not None:
            user.last_heart_regenerated_at = None
            db.commit()
        return 0

    now = datetime.utcnow()
    if not user.last_heart_regenerated_at:
        user.last_heart_regenerated_at = now
        db.commit()
        return HEART_REGEN_INTERVAL_SECONDS

    elapsed = (now - user.last_heart_regenerated_at).total_seconds()
    hearts_to_add = int(elapsed // HEART_REGEN_INTERVAL_SECONDS)

    if hearts_to_add > 0:
        user.hearts = min(user.max_hearts, user.hearts + hearts_to_add)
        if user.hearts >= user.max_hearts:
            user.last_heart_regenerated_at = None
        else:
            user.last_heart_regenerated_at += timedelta(seconds=hearts_to_add * HEART_REGEN_INTERVAL_SECONDS)
        db.commit()
        db.refresh(user)

    if user.hearts >= user.max_hearts:
        return 0

    remaining = int(HEART_REGEN_INTERVAL_SECONDS - ((now - user.last_heart_regenerated_at).total_seconds() % HEART_REGEN_INTERVAL_SECONDS))
    return max(1, remaining)

def refill_hearts_with_gems(db: Session, user: User, cost: int = 350) -> tuple[bool, str]:
    """Refills hearts to maximum using gems."""
    if user.hearts >= user.max_hearts:
        return False, "Hearts are already full!"
    
    if user.gems < cost:
        return False, f"Not enough gems! Required: {cost}, you have: {user.gems}"
    
    user.gems -= cost
    user.hearts = user.max_hearts
    user.last_heart_regenerated_at = None
    db.commit()
    db.refresh(user)
    return True, "Hearts fully refilled!"

def practice_regain_heart(db: Session, user: User) -> tuple[bool, str]:
    """Regains 1 heart via practice."""
    if user.hearts >= user.max_hearts:
        return False, "Hearts are already full!"
    
    user.hearts = min(user.max_hearts, user.hearts + 1)
    if user.hearts >= user.max_hearts:
        user.last_heart_regenerated_at = None
    db.commit()
    db.refresh(user)
    return True, "+1 Heart earned from practice!"

def update_streak_and_activity(db: Session, user: User, xp_earned: int) -> bool:
    """Updates daily streak and logs activity."""
    today = date.today()
    streak_extended = False

    if user.last_active_date:
        days_diff = (today - user.last_active_date).days
        if days_diff == 1:
            user.streak += 1
            streak_extended = True
        elif days_diff == 2 and (getattr(user, "streak_freezes", 0) or 0) > 0:
            user.streak_freezes -= 1
            user.streak += 1
            streak_extended = True
        elif days_diff > 1:
            user.streak = 1
            streak_extended = True
    else:
        user.streak = 1
        streak_extended = True

    user.last_active_date = today

    # Log to ActivityLog
    log = db.query(ActivityLog).filter(
        ActivityLog.user_id == user.id,
        ActivityLog.activity_date == today
    ).first()

    if not log:
        log = ActivityLog(
            user_id=user.id,
            activity_date=today,
            xp_earned=xp_earned,
            lessons_completed=1
        )
        db.add(log)
    else:
        log.xp_earned += xp_earned
        log.lessons_completed += 1

    db.commit()
    return streak_extended

def buy_streak_freeze(db: Session, user: User, cost: int = 200) -> tuple[bool, str]:
    """Purchases a streak freeze with gems (capped at 2)."""
    current_freezes = getattr(user, "streak_freezes", 0) or 0
    if current_freezes >= 2:
        return False, "You already have the maximum number of Streak Freezes (2)."
    if user.gems < cost:
        return False, f"Not enough gems! Streak Freeze costs {cost} gems."
    user.gems -= cost
    user.streak_freezes = current_freezes + 1
    db.commit()
    db.refresh(user)
    return True, f"Streak Freeze equipped! ({user.streak_freezes}/2 held)"

def set_daily_goal(db: Session, user: User, target_xp: int) -> bool:
    """Updates user daily XP goal."""
    user.daily_goal_xp = target_xp
    db.commit()
    db.refresh(user)
    return True

def simulate_day_progression(db: Session, user: User, days_ago: int = 1) -> tuple[date, int, int, str]:
    """Debug helper to simulate days passing and test streak behavior."""
    simulated_date = date.today() - timedelta(days=days_ago)
    user.last_active_date = simulated_date
    msg = f"Last active date shifted to {simulated_date.isoformat()} ({days_ago} days ago)."
    
    if days_ago > 1:
        if (getattr(user, "streak_freezes", 0) or 0) > 0 and days_ago == 2:
            msg += " (Protected by 1 equipped Streak Freeze)."
        else:
            user.streak = 0
            msg += " Streak reset to 0 due to inactivity."

    db.commit()
    db.refresh(user)
    return simulated_date, user.streak, getattr(user, "streak_freezes", 0) or 0, msg
