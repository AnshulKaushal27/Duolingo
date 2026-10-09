"""
Comprehensive Seed Script for Duolingo Clone.
Seeds full Spanish and Japanese curricula, ensures users and gamification data are intact.
"""

import sys
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models import Course, Unit, Skill, Lesson, Exercise, User, UserProgress
from app.seeds.spanish_curriculum import get_spanish_units_data
from app.seeds.japanese_curriculum import get_japanese_units_data
from datetime import datetime

def seed_course_from_data(db, course_code: str, title: str, flag: str, desc: str, units_data: list):
    course = db.query(Course).filter(Course.code == course_code).first()
    if not course:
        course = Course(code=course_code, title=title, flag_icon=flag, description=desc)
        db.add(course)
        db.flush()
        print(f"Created course: {title} ({course_code})")
    else:
        course.title = title
        course.flag_icon = flag
        course.description = desc
        db.flush()
        print(f"Updating course: {title} ({course_code})")

    total_exercises = 0
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
                    total_exercises += 1

    db.commit()
    print(f"  ✓ {title}: {len(units_data)} units, {total_exercises} exercises seeded successfully!")
    return course

def main():
    print("=== Duolingo Curriculum Seeding Starting ===")
    db = SessionLocal()
    try:
        # 1. Seed Spanish Curriculum
        spanish = seed_course_from_data(
            db,
            course_code="es",
            title="Spanish",
            flag="🇪🇸",
            desc="Learn Spanish, one of the most widely spoken languages in the world.",
            units_data=get_spanish_units_data()
        )

        # 2. Seed Japanese Curriculum
        japanese = seed_course_from_data(
            db,
            course_code="ja",
            title="Japanese",
            flag="🇯🇵",
            desc="Master Hiragana, Katakana, and essential conversational Japanese.",
            units_data=get_japanese_units_data()
        )

        # 3. Check Alex Ramos user
        alex = db.query(User).filter(User.username == "alexramos").first()
        if alex and not alex.current_course_id:
            alex.current_course_id = spanish.id
            db.commit()

        print("=== Seeding Finished Successfully! ===")
    finally:
        db.close()

if __name__ == "__main__":
    main()
