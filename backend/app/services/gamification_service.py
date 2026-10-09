from typing import List, Dict, Any
from sqlalchemy.orm import Session
from ..models import LeaderboardEntry, UserAchievement, Achievement, DailyQuest, User

def get_league_leaderboard(db: Session, current_user: User) -> Dict[str, Any]:
    # Ensure current user has a leaderboard entry
    entry = db.query(LeaderboardEntry).filter(LeaderboardEntry.user_id == current_user.id).first()
    if not entry:
        entry = LeaderboardEntry(
            user_id=current_user.id,
            league="Ruby",
            username=current_user.username,
            display_name=current_user.display_name,
            avatar_url=current_user.avatar_url,
            weekly_xp=current_user.total_xp,
            is_current_user=True
        )
        db.add(entry)
        db.commit()
    else:
        # Sync weekly XP with user total if lower
        if entry.weekly_xp < current_user.total_xp:
            entry.weekly_xp = current_user.total_xp
            db.commit()

    # Query all entries sorted by weekly_xp desc
    entries = db.query(LeaderboardEntry).order_by(LeaderboardEntry.weekly_xp.desc()).all()
    
    result = []
    for rank, e in enumerate(entries, start=1):
        is_me = (e.user_id == current_user.id)
        result.append({
            "id": e.id,
            "rank": rank,
            "display_name": e.display_name,
            "username": e.username,
            "avatar_url": e.avatar_url,
            "weekly_xp": e.weekly_xp,
            "is_current_user": is_me
        })

    return {
        "league": entry.league or "Ruby",
        "time_remaining": "3 days left",
        "entries": result
    }

def get_user_quests(db: Session, user: User) -> List[Dict[str, Any]]:
    quests = db.query(DailyQuest).filter(DailyQuest.user_id == user.id).all()
    return [
        {
            "id": q.id,
            "title": q.title,
            "current_progress": q.current_progress,
            "target_progress": q.target_progress,
            "reward_gems": q.reward_gems,
            "completed": q.completed
        }
        for q in quests
    ]

def get_user_achievements(db: Session, user: User) -> List[Dict[str, Any]]:
    user_achievements = db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    result = []
    for ua in user_achievements:
        result.append({
            "id": ua.achievement.id,
            "code": ua.achievement.code,
            "title": ua.achievement.title,
            "description": ua.achievement.description,
            "icon": ua.achievement.icon,
            "target_value": ua.achievement.target_value,
            "current_value": ua.current_value,
            "unlocked": ua.unlocked
        })
    return result
