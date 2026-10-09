from datetime import date, datetime
from sqlalchemy.orm import Session
from ..models import User, ActivityLog

def get_or_create_default_user(db: Session) -> User:
    """Returns the default learner (Alex Ramos), creating him if missing."""
    user = db.query(User).filter((User.username == "alexramos") | (User.username == "duofan_alex")).first()
    if not user:
        from ..core.security import hash_password
        user = User(
            username="alexramos",
            email="alex@example.com",
            display_name="Alex Ramos",
            password_hash=hash_password("development-only-password"),
            auth_provider="local",
            avatar_url="/mascot/duo-happy.svg",
            streak=7,
            last_active_date=date.today(),
            hearts=5,
            max_hearts=5,
            gems=780,
            total_xp=345,
            created_at=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def refill_hearts_with_gems(db: Session, user: User, cost: int = 350) -> tuple[bool, str]:
    """Refills hearts to maximum using gems."""
    if user.hearts >= user.max_hearts:
        return False, "Hearts are already full!"
    
    if user.gems < cost:
        return False, f"Not enough gems! Required: {cost}, you have: {user.gems}"
    
    user.gems -= cost
    user.hearts = user.max_hearts
    db.commit()
    db.refresh(user)
    return True, "Hearts fully refilled!"

def practice_regain_heart(db: Session, user: User) -> tuple[bool, str]:
    """Regains 1 heart via practice."""
    if user.hearts >= user.max_hearts:
        return False, "Hearts are already full!"
    
    user.hearts = min(user.max_hearts, user.hearts + 1)
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
