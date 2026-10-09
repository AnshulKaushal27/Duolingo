from datetime import datetime, date
from sqlalchemy.orm import Session
from ..core.security import hash_password
from ..models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    UserProgress,
    LeaderboardEntry,
    Achievement,
    UserAchievement,
    DailyQuest,
    ActivityLog,
)
from .spanish_curriculum import get_spanish_units_data
from .japanese_curriculum import get_japanese_units_data

def upsert_course(db: Session, course_code: str, title: str, flag: str, desc: str, units_data: list) -> Course:
    course = db.query(Course).filter(Course.code == course_code).first()
    if not course:
        course = Course(code=course_code, title=title, flag_icon=flag, description=desc)
        db.add(course)
        db.flush()
    else:
        course.title = title
        course.flag_icon = flag
        course.description = desc
        db.flush()

    for u_data in units_data:
        unit = db.query(Unit).filter(Unit.course_id == course.id, Unit.unit_number == u_data["unit_number"]).first()
        if not unit:
            unit = Unit(
                course_id=course.id,
                unit_number=u_data["unit_number"],
                title=u_data["title"],
                description=u_data["description"],
                color_hex=u_data["color_hex"]
            )
            db.add(unit)
            db.flush()
        else:
            unit.title = u_data["title"]
            unit.description = u_data["description"]
            unit.color_hex = u_data["color_hex"]
            db.flush()

        for s_data in u_data.get("skills", []):
            skill = db.query(Skill).filter(Skill.unit_id == unit.id, Skill.order_index == s_data["order_index"]).first()
            if not skill:
                skill = Skill(
                    unit_id=unit.id,
                    order_index=s_data["order_index"],
                    title=s_data["title"],
                    icon_name=s_data.get("icon_name", "star"),
                    total_crowns=s_data.get("total_crowns", 3)
                )
                db.add(skill)
                db.flush()
            else:
                skill.title = s_data["title"]
                skill.icon_name = s_data.get("icon_name", "star")
                db.flush()

            for l_data in s_data.get("lessons", []):
                lesson = db.query(Lesson).filter(Lesson.skill_id == skill.id, Lesson.order_index == l_data["order_index"]).first()
                if not lesson:
                    lesson = Lesson(
                        skill_id=skill.id,
                        order_index=l_data["order_index"],
                        title=l_data["title"],
                        xp_reward=l_data.get("xp_reward", 15)
                    )
                    db.add(lesson)
                    db.flush()
                else:
                    lesson.title = l_data["title"]
                    db.flush()

                for ex_data in l_data.get("exercises", []):
                    ex = db.query(Exercise).filter(Exercise.lesson_id == lesson.id, Exercise.order_index == ex_data["order_index"]).first()
                    if not ex:
                        ex = Exercise(
                            lesson_id=lesson.id,
                            order_index=ex_data["order_index"],
                            type=ex_data["type"],
                            prompt=ex_data["prompt"],
                            question_text=ex_data["question_text"],
                            audio_text=ex_data.get("audio_text"),
                            client_payload=ex_data["client_payload"],
                            solution_payload=ex_data["solution_payload"]
                        )
                        db.add(ex)
                    else:
                        ex.type = ex_data["type"]
                        ex.prompt = ex_data["prompt"]
                        ex.question_text = ex_data["question_text"]
                        ex.audio_text = ex_data.get("audio_text")
                        ex.client_payload = ex_data["client_payload"]
                        ex.solution_payload = ex_data["solution_payload"]

    db.commit()
    return course

def seed_database_if_empty(db: Session):
    # 1. Upsert both Spanish and Japanese courses
    es_course = upsert_course(
        db,
        course_code="es",
        title="Spanish",
        flag="🇪🇸",
        desc="Learn Spanish, one of the most widely spoken languages in the world.",
        units_data=get_spanish_units_data()
    )

    ja_course = upsert_course(
        db,
        course_code="ja",
        title="Japanese",
        flag="🇯🇵",
        desc="Master Hiragana, Katakana, and essential conversational Japanese.",
        units_data=get_japanese_units_data()
    )

    # 2. Check if default user exists
    user = db.query(User).filter(User.username == "alexramos").first()
    if not user:
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
            streak_freezes=1,
            daily_goal_xp=30,
            current_course_id=es_course.id,
            created_at=datetime.utcnow()
        )
        db.add(user)
        db.flush()

        # Find first two lessons in Spanish basics
        first_skill = es_course.units[0].skills[0] if es_course.units and es_course.units[0].skills else None
        if first_skill and len(first_skill.lessons) >= 2:
            prog1 = UserProgress(
                user_id=user.id,
                lesson_id=first_skill.lessons[0].id,
                skill_id=first_skill.id,
                completed=True,
                mistakes_count=0,
                xp_earned=15,
                completed_at=datetime.utcnow()
            )
            prog2 = UserProgress(
                user_id=user.id,
                lesson_id=first_skill.lessons[1].id,
                skill_id=first_skill.id,
                completed=True,
                mistakes_count=1,
                xp_earned=15,
                completed_at=datetime.utcnow()
            )
            db.add_all([prog1, prog2])

        activity = ActivityLog(
            user_id=user.id,
            activity_date=date.today(),
            xp_earned=30,
            lessons_completed=2
        )
        db.add(activity)

    # 3. Leaderboard
    if db.query(LeaderboardEntry).count() == 0:
        leaderboard_data = [
            ("sofia_lingo", "Sofia Chen", 520, "/mascot/avatar-1.svg"),
            ("marco_v", "Marco Rossi", 475, "/mascot/avatar-2.svg"),
            ("charlotte_b", "Charlotte Dubois", 390, "/mascot/avatar-3.svg"),
            ("alexramos", "Alex Ramos (You)", 345, "/mascot/duo-happy.svg"),
            ("liam_k", "Liam Knight", 310, "/mascot/avatar-4.svg"),
            ("emma_w", "Emma Watson", 280, "/mascot/avatar-5.svg"),
            ("mateo_s", "Mateo Silva", 220, "/mascot/avatar-6.svg"),
            ("yuki_t", "Yuki Tanaka", 195, "/mascot/avatar-7.svg"),
            ("zain_m", "Zain Malik", 150, "/mascot/avatar-8.svg"),
            ("elena_r", "Elena Rostova", 90, "/mascot/avatar-9.svg"),
        ]
        for uname, dname, wxp, av in leaderboard_data:
            is_me = (uname == "alexramos")
            entry = LeaderboardEntry(
                user_id=user.id if is_me else None,
                league="Ruby",
                username=uname,
                display_name=dname,
                avatar_url=av,
                weekly_xp=wxp,
                is_current_user=is_me
            )
            db.add(entry)

    # 4. Achievements
    if db.query(Achievement).count() == 0:
        achievements = [
            Achievement(code="wildfire", title="Wildfire", description="Reach a 7-day streak", icon="flame", target_value=7),
            Achievement(code="sage", title="Sage", description="Earn 500 total XP", icon="book", target_value=500),
            Achievement(code="sharpshooter", title="Sharpshooter", description="Complete a lesson with 100% accuracy", icon="target", target_value=1),
            Achievement(code="champion", title="Champion", description="Finish in the top 3 of your leaderboard league", icon="trophy", target_value=3),
        ]
        db.add_all(achievements)
        db.flush()

        db.add_all([
            UserAchievement(user_id=user.id, achievement_id=achievements[0].id, current_value=7, unlocked=True, unlocked_at=datetime.utcnow()),
            UserAchievement(user_id=user.id, achievement_id=achievements[1].id, current_value=345, unlocked=False),
            UserAchievement(user_id=user.id, achievement_id=achievements[2].id, current_value=1, unlocked=True, unlocked_at=datetime.utcnow()),
            UserAchievement(user_id=user.id, achievement_id=achievements[3].id, current_value=4, unlocked=False),
        ])

    # 5. Quests
    if db.query(DailyQuest).count() == 0:
        quests = [
            DailyQuest(user_id=user.id, title="Earn 30 XP today", current_progress=15, target_progress=30, reward_gems=10, completed=False),
            DailyQuest(user_id=user.id, title="Complete 2 lessons", current_progress=1, target_progress=2, reward_gems=15, completed=False),
            DailyQuest(user_id=user.id, title="Score 90%+ in 1 lesson", current_progress=1, target_progress=1, reward_gems=20, completed=True),
        ]
        db.add_all(quests)

    db.commit()
    print("Database seeding and curriculum verification complete!")
