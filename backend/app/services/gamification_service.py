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
    if not quests:
        initial_quests = [
            DailyQuest(user_id=user.id, title="Earn 30 XP today", current_progress=0, target_progress=30, reward_gems=10, completed=False),
            DailyQuest(user_id=user.id, title="Complete 2 lessons", current_progress=0, target_progress=2, reward_gems=15, completed=False),
            DailyQuest(user_id=user.id, title="Score 90%+ in 1 lesson", current_progress=0, target_progress=1, reward_gems=20, completed=False),
        ]
        db.add_all(initial_quests)
        db.commit()
        quests = initial_quests

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
    all_achievements = db.query(Achievement).all()
    existing_records = db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    existing_map = {ua.achievement_id: ua for ua in existing_records}

    created_any = False
    for ach in all_achievements:
        if ach.id not in existing_map:
            # Check if user meets condition right away
            cur_val = 0
            if ach.code == "wildfire":
                cur_val = user.streak
            elif ach.code == "sage":
                cur_val = user.total_xp
            elif ach.code == "sharpshooter":
                cur_val = 0
            elif ach.code == "champion":
                cur_val = 0
            unlocked = cur_val >= ach.target_value

            new_ua = UserAchievement(
                user_id=user.id,
                achievement_id=ach.id,
                current_value=cur_val,
                unlocked=unlocked
            )
            db.add(new_ua)
            existing_map[ach.id] = new_ua
            created_any = True

    if created_any:
        db.commit()

    result = []
    for ua in existing_map.values():
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

