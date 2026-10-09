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

def seed_database_if_empty(db: Session):
    existing_course = db.query(Course).first()
    if existing_course:
        return  # Already seeded

    print("Seeding database with initial Duolingo course content...")

    # 1. Course: Spanish
    course = Course(
        code="es",
        title="Spanish",
        flag_icon="🇪🇸",
        description="Learn Spanish, one of the most widely spoken languages in the world."
    )
    db.add(course)
    db.flush()

    # 2. Units
    unit1 = Unit(
        course_id=course.id,
        unit_number=1,
        title="Unit 1: Get started in Spanish",
        description="Greet people, introduce yourself, and order basic items.",
        color_hex="#58cc02"
    )
    unit2 = Unit(
        course_id=course.id,
        unit_number=2,
        title="Unit 2: Food & Café",
        description="Order in a restaurant, ask for drinks, and pay the bill.",
        color_hex="#1cb0f6"
    )
    unit3 = Unit(
        course_id=course.id,
        unit_number=3,
        title="Unit 3: Everyday Routines",
        description="Talk about family members, home, and daily habits.",
        color_hex="#ce82ff"
    )
    db.add_all([unit1, unit2, unit3])
    db.flush()

    # 3. Skills
    # Unit 1 Skills
    skill_basics = Skill(
        unit_id=unit1.id,
        order_index=1,
        title="Basics",
        icon_name="star",
        total_crowns=3
    )
    skill_greetings = Skill(
        unit_id=unit1.id,
        order_index=2,
        title="Greetings",
        icon_name="chat",
        total_crowns=3
    )

    # Unit 2 Skills
    skill_cafe = Skill(
        unit_id=unit2.id,
        order_index=3,
        title="Café",
        icon_name="cup",
        total_crowns=3
    )
    skill_food = Skill(
        unit_id=unit2.id,
        order_index=4,
        title="Dining",
        icon_name="burger",
        total_crowns=3
    )

    # Unit 3 Skills
    skill_family = Skill(
        unit_id=unit3.id,
        order_index=5,
        title="Family",
        icon_name="heart",
        total_crowns=3
    )
    skill_routines = Skill(
        unit_id=unit3.id,
        order_index=6,
        title="Routines",
        icon_name="calendar",
        total_crowns=3
    )

    db.add_all([skill_basics, skill_greetings, skill_cafe, skill_food, skill_family, skill_routines])
    db.flush()

    # 4. Lessons & Exercises for Skill 1: Basics
    lesson1 = Lesson(skill_id=skill_basics.id, order_index=1, title="Lesson 1: Common Words", xp_reward=15)
    lesson2 = Lesson(skill_id=skill_basics.id, order_index=2, title="Lesson 2: Eating & Drinking", xp_reward=15)
    db.add_all([lesson1, lesson2])
    db.flush()

    # Exercises for Lesson 1 (All 5 types represented!)
    ex1_1 = Exercise(
        lesson_id=lesson1.id,
        order_index=1,
        type="multiple_choice",
        prompt="Which of these is 'the apple'?",
        question_text="the apple",
        audio_text="la manzana",
        client_payload={
            "options": [
                {"id": "opt_1", "text": "la manzana", "image": "🍎"},
                {"id": "opt_2", "text": "el pan", "image": "🍞"},
                {"id": "opt_3", "text": "el agua", "image": "💧"}
            ]
        },
        solution_payload={
            "correct_option_id": "opt_1",
            "correct_text": "la manzana"
        }
    )

    ex1_2 = Exercise(
        lesson_id=lesson1.id,
        order_index=2,
        type="translate_word_bank",
        prompt="Translate this sentence into Spanish:",
        question_text="The woman eats an apple.",
        audio_text="La mujer come una manzana.",
        client_payload={
            "prompt_sentence": "The woman eats an apple.",
            "tokens": ["manzanas", "come", "La", "ella", "manzana", "mujer", "agua", "una"]
        },
        solution_payload={
            "canonical_tokens": ["La", "mujer", "come", "una", "manzana"],
            "acceptable_token_sequences": [
                ["La", "mujer", "come", "una", "manzana"]
            ]
        }
    )

    ex1_3 = Exercise(
        lesson_id=lesson1.id,
        order_index=3,
        type="match_pairs",
        prompt="Tap the matching pairs:",
        question_text="Match the words with their meanings",
        audio_text=None,
        client_payload={
            "left_words": ["manzana", "leche", "mujer", "hombre"],
            "right_words": ["woman", "man", "apple", "milk"]
        },
        solution_payload={
            "pairs": {
                "manzana": "apple",
                "leche": "milk",
                "mujer": "woman",
                "hombre": "man"
            }
        }
    )

    ex1_4 = Exercise(
        lesson_id=lesson1.id,
        order_index=4,
        type="fill_in_the_blank",
        prompt="Fill in the blank with the correct form:",
        question_text="Yo ___ una manzana.",
        audio_text="Yo como una manzana.",
        client_payload={
            "sentence_parts": ["Yo ", " una manzana."],
            "options": ["como", "comes", "comen"]
        },
        solution_payload={
            "correct_option": "como"
        }
    )

    ex1_5 = Exercise(
        lesson_id=lesson1.id,
        order_index=5,
        type="type_the_answer",
        prompt="Type the translation in Spanish:",
        question_text="The man",
        audio_text="El hombre",
        client_payload={
            "prompt": "Translate: 'The man'",
            "target_language": "es"
        },
        solution_payload={
            "canonical_answer": "El hombre",
            "acceptable_answers": ["el hombre", "El hombre"]
        }
    )
    db.add_all([ex1_1, ex1_2, ex1_3, ex1_4, ex1_5])

    # Exercises for Lesson 2: Eating & Drinking
    ex2_1 = Exercise(
        lesson_id=lesson2.id,
        order_index=1,
        type="multiple_choice",
        prompt="Which of these is 'the milk'?",
        question_text="the milk",
        audio_text="la leche",
        client_payload={
            "options": [
                {"id": "opt_1", "text": "el café", "image": "☕"},
                {"id": "opt_2", "text": "la leche", "image": "🥛"},
                {"id": "opt_3", "text": "el agua", "image": "💧"}
            ]
        },
        solution_payload={
            "correct_option_id": "opt_2",
            "correct_text": "la leche"
        }
    )

    ex2_2 = Exercise(
        lesson_id=lesson2.id,
        order_index=2,
        type="translate_word_bank",
        prompt="Translate this sentence into Spanish:",
        question_text="The boy drinks water.",
        audio_text="El niño bebe agua.",
        client_payload={
            "prompt_sentence": "The boy drinks water.",
            "tokens": ["agua", "El", "niño", "bebe", "pan", "ella", "como"]
        },
        solution_payload={
            "canonical_tokens": ["El", "niño", "bebe", "agua"],
            "acceptable_token_sequences": [
                ["El", "niño", "bebe", "agua"]
            ]
        }
    )

    ex2_3 = Exercise(
        lesson_id=lesson2.id,
        order_index=3,
        type="match_pairs",
        prompt="Tap the matching pairs:",
        question_text="Match the words with their meanings",
        audio_text=None,
        client_payload={
            "left_words": ["bebe", "come", "niño", "niña"],
            "right_words": ["drinks", "girl", "boy", "eats"]
        },
        solution_payload={
            "pairs": {
                "bebe": "drinks",
                "come": "eats",
                "niño": "boy",
                "niña": "girl"
            }
        }
    )

    ex2_4 = Exercise(
        lesson_id=lesson2.id,
        order_index=4,
        type="fill_in_the_blank",
        prompt="Complete the sentence:",
        question_text="El niño ___ agua.",
        audio_text="El niño bebe agua.",
        client_payload={
            "sentence_parts": ["El niño ", " agua."],
            "options": ["bebe", "bebes", "bebo"]
        },
        solution_payload={
            "correct_option": "bebe"
        }
    )

    ex2_5 = Exercise(
        lesson_id=lesson2.id,
        order_index=5,
        type="type_the_answer",
        prompt="Type the translation in Spanish:",
        question_text="The girl",
        audio_text="La niña",
        client_payload={
            "prompt": "Translate: 'The girl'",
            "target_language": "es"
        },
        solution_payload={
            "canonical_answer": "La niña",
            "acceptable_answers": ["la niña", "La niña", "la nina", "La nina"]
        }
    )
    db.add_all([ex2_1, ex2_2, ex2_3, ex2_4, ex2_5])

    # 5. Lessons & Exercises for Skill 2: Greetings
    lesson3 = Lesson(skill_id=skill_greetings.id, order_index=1, title="Lesson 1: Hello & Goodbye", xp_reward=15)
    lesson4 = Lesson(skill_id=skill_greetings.id, order_index=2, title="Lesson 2: Polite Phrases", xp_reward=15)
    db.add_all([lesson3, lesson4])
    db.flush()

    ex3_1 = Exercise(
        lesson_id=lesson3.id,
        order_index=1,
        type="multiple_choice",
        prompt="How do you say 'Hello'?",
        question_text="Hello",
        audio_text="Hola",
        client_payload={
            "options": [
                {"id": "opt_1", "text": "Hola", "image": "👋"},
                {"id": "opt_2", "text": "Adiós", "image": "🚶"},
                {"id": "opt_3", "text": "Por favor", "image": "🙏"}
            ]
        },
        solution_payload={
            "correct_option_id": "opt_1",
            "correct_text": "Hola"
        }
    )

    ex3_2 = Exercise(
        lesson_id=lesson3.id,
        order_index=2,
        type="translate_word_bank",
        prompt="Translate this greeting:",
        question_text="Good morning, how are you?",
        audio_text="Buenos días, ¿cómo estás?",
        client_payload={
            "prompt_sentence": "Good morning, how are you?",
            "tokens": ["días", "noches", "estás", "¿cómo", "gracias", "Buenos"]
        },
        solution_payload={
            "canonical_tokens": ["Buenos", "días", "¿cómo", "estás"],
            "acceptable_token_sequences": [
                ["Buenos", "días", "¿cómo", "estás"],
                ["Buenos", "días", "cómo", "estás"]
            ]
        }
    )

    ex3_3 = Exercise(
        lesson_id=lesson3.id,
        order_index=3,
        type="match_pairs",
        prompt="Tap the matching pairs:",
        question_text="Match Spanish greetings to English",
        audio_text=None,
        client_payload={
            "left_words": ["Hola", "Adiós", "Gracias", "Por favor"],
            "right_words": ["Please", "Hello", "Thank you", "Goodbye"]
        },
        solution_payload={
            "pairs": {
                "Hola": "Hello",
                "Adiós": "Goodbye",
                "Gracias": "Thank you",
                "Por favor": "Please"
            }
        }
    )

    ex3_4 = Exercise(
        lesson_id=lesson3.id,
        order_index=4,
        type="fill_in_the_blank",
        prompt="Complete the greeting:",
        question_text="Mucho ___, Juan.",
        audio_text="Mucho gusto, Juan.",
        client_payload={
            "sentence_parts": ["Mucho ", ", Juan."],
            "options": ["gusto", "gracias", "hola"]
        },
        solution_payload={
            "correct_option": "gusto"
        }
    )

    ex3_5 = Exercise(
        lesson_id=lesson3.id,
        order_index=5,
        type="type_the_answer",
        prompt="Type the translation in Spanish:",
        question_text="Thank you",
        audio_text="Gracias",
        client_payload={
            "prompt": "Translate: 'Thank you'",
            "target_language": "es"
        },
        solution_payload={
            "canonical_answer": "Gracias",
            "acceptable_answers": ["gracias", "Gracias"]
        }
    )
    db.add_all([ex3_1, ex3_2, ex3_3, ex3_4, ex3_5])

    # Lesson 4: Polite Phrases
    ex4_1 = Exercise(
        lesson_id=lesson4.id,
        order_index=1,
        type="multiple_choice",
        prompt="How do you say 'Goodbye'?",
        question_text="Goodbye",
        audio_text="Adiós",
        client_payload={
            "options": [
                {"id": "opt_1", "text": "Adiós", "image": "👋"},
                {"id": "opt_2", "text": "Hola", "image": "🙋"},
                {"id": "opt_3", "text": "Sí", "image": "👍"}
            ]
        },
        solution_payload={
            "correct_option_id": "opt_1",
            "correct_text": "Adiós"
        }
    )

    ex4_2 = Exercise(
        lesson_id=lesson4.id,
        order_index=2,
        type="translate_word_bank",
        prompt="Translate this sentence:",
        question_text="Yes, thank you very much.",
        audio_text="Sí, muchas gracias.",
        client_payload={
            "prompt_sentence": "Yes, thank you very much.",
            "tokens": ["muchas", "gracias", "Sí", "no", "por", "favor"]
        },
        solution_payload={
            "canonical_tokens": ["Sí", "muchas", "gracias"],
            "acceptable_token_sequences": [
                ["Sí", "muchas", "gracias"]
            ]
        }
    )

    ex4_3 = Exercise(
        lesson_id=lesson4.id,
        order_index=3,
        type="match_pairs",
        prompt="Tap the matching pairs:",
        question_text="Match the polite phrases",
        audio_text=None,
        client_payload={
            "left_words": ["Sí", "No", "De nada", "Hasta luego"],
            "right_words": ["See you later", "No", "You are welcome", "Yes"]
        },
        solution_payload={
            "pairs": {
                "Sí": "Yes",
                "No": "No",
                "De nada": "You are welcome",
                "Hasta luego": "See you later"
            }
        }
    )

    ex4_4 = Exercise(
        lesson_id=lesson4.id,
        order_index=4,
        type="fill_in_the_blank",
        prompt="Complete the sentence:",
        question_text="Buenas ___, señora Perez.",
        audio_text="Buenas tardes, señora Perez.",
        client_payload={
            "sentence_parts": ["Buenas ", ", señora Perez."],
            "options": ["tardes", "gracias", "hola"]
        },
        solution_payload={
            "correct_option": "tardes"
        }
    )

    ex4_5 = Exercise(
        lesson_id=lesson4.id,
        order_index=5,
        type="type_the_answer",
        prompt="Type the translation in Spanish:",
        question_text="Please",
        audio_text="Por favor",
        client_payload={
            "prompt": "Translate: 'Please'",
            "target_language": "es"
        },
        solution_payload={
            "canonical_answer": "Por favor",
            "acceptable_answers": ["por favor", "Por favor"]
        }
    )
    db.add_all([ex4_1, ex4_2, ex4_3, ex4_4, ex4_5])

    # Lessons for Unit 2 & Unit 3 skills to make the course tree rich
    lesson_cafe1 = Lesson(skill_id=skill_cafe.id, order_index=1, title="Lesson 1: Coffee & Tea", xp_reward=15)
    lesson_cafe2 = Lesson(skill_id=skill_cafe.id, order_index=2, title="Lesson 2: Breakfast Items", xp_reward=15)
    lesson_food1 = Lesson(skill_id=skill_food.id, order_index=1, title="Lesson 1: Main Dishes", xp_reward=15)
    lesson_fam1 = Lesson(skill_id=skill_family.id, order_index=1, title="Lesson 1: Parents & Siblings", xp_reward=15)
    lesson_rout1 = Lesson(skill_id=skill_routines.id, order_index=1, title="Lesson 1: Daily Habits", xp_reward=15)
    db.add_all([lesson_cafe1, lesson_cafe2, lesson_food1, lesson_fam1, lesson_rout1])
    db.flush()

    # Exercises for Cafe Lesson 1
    ex_c1 = Exercise(
        lesson_id=lesson_cafe1.id,
        order_index=1,
        type="multiple_choice",
        prompt="Which of these is 'a coffee with milk'?",
        question_text="a coffee with milk",
        audio_text="un café con leche",
        client_payload={
            "options": [
                {"id": "opt_1", "text": "un café con leche", "image": "☕"},
                {"id": "opt_2", "text": "un té verde", "image": "🍵"},
                {"id": "opt_3", "text": "un jugo de naranja", "image": "🧃"}
            ]
        },
        solution_payload={
            "correct_option_id": "opt_1",
            "correct_text": "un café con leche"
        }
    )
    ex_c2 = Exercise(
        lesson_id=lesson_cafe1.id,
        order_index=2,
        type="translate_word_bank",
        prompt="Translate this order:",
        question_text="I want a coffee, please.",
        audio_text="Quiero un café, por favor.",
        client_payload={
            "prompt_sentence": "I want a coffee, please.",
            "tokens": ["café", "un", "Quiero", "leche", "por", "favor", "té"]
        },
        solution_payload={
            "canonical_tokens": ["Quiero", "un", "café", "por", "favor"],
            "acceptable_token_sequences": [
                ["Quiero", "un", "café", "por", "favor"]
            ]
        }
    )
    ex_c3 = Exercise(
        lesson_id=lesson_cafe1.id,
        order_index=3,
        type="match_pairs",
        prompt="Tap the matching pairs:",
        question_text="Café vocabulary",
        audio_text=None,
        client_payload={
            "left_words": ["café", "té", "azúcar", "cuenta"],
            "right_words": ["sugar", "bill", "coffee", "tea"]
        },
        solution_payload={
            "pairs": {
                "café": "coffee",
                "té": "tea",
                "azúcar": "sugar",
                "cuenta": "bill"
            }
        }
    )
    ex_c4 = Exercise(
        lesson_id=lesson_cafe1.id,
        order_index=4,
        type="fill_in_the_blank",
        prompt="Complete the sentence:",
        question_text="¿Cuánto ___ el café?",
        audio_text="¿Cuánto cuesta el café?",
        client_payload={
            "sentence_parts": ["¿Cuánto ", " el café?"],
            "options": ["cuesta", "es", "vale"]
        },
        solution_payload={
            "correct_option": "cuesta"
        }
    )
    ex_c5 = Exercise(
        lesson_id=lesson_cafe1.id,
        order_index=5,
        type="type_the_answer",
        prompt="Type the translation in Spanish:",
        question_text="The bill, please",
        audio_text="La cuenta, por favor",
        client_payload={
            "prompt": "Translate: 'The bill, please'",
            "target_language": "es"
        },
        solution_payload={
            "canonical_answer": "La cuenta, por favor",
            "acceptable_answers": ["la cuenta, por favor", "La cuenta, por favor", "la cuenta por favor", "La cuenta por favor"]
        }
    )
    db.add_all([ex_c1, ex_c2, ex_c3, ex_c4, ex_c5])

    # 6. Default Learner: Alex Ramos
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
        current_course_id=course.id,
        created_at=datetime.utcnow()
    )
    db.add(user)
    db.flush()

    # Pre-seed progress for Alex: completed Lesson 1 and Lesson 2 (Basics skill finished!)
    # This leaves Skill 1 as "completed", Skill 2 as "available", and subsequent skills as "locked".
    prog1 = UserProgress(
        user_id=user.id,
        lesson_id=lesson1.id,
        skill_id=skill_basics.id,
        completed=True,
        mistakes_count=0,
        xp_earned=15,
        completed_at=datetime.utcnow()
    )
    prog2 = UserProgress(
        user_id=user.id,
        lesson_id=lesson2.id,
        skill_id=skill_basics.id,
        completed=True,
        mistakes_count=1,
        xp_earned=15,
        completed_at=datetime.utcnow()
    )
    db.add_all([prog1, prog2])

    # Pre-seed ActivityLog for streak history
    activity = ActivityLog(
        user_id=user.id,
        activity_date=date.today(),
        xp_earned=30,
        lessons_completed=2
    )
    db.add(activity)

    # 7. Seeded Leaderboard (Ruby League) with Alex and 9 realistic peers
    leaderboard_data = [
        ("sofia_lingo", "Sofia Chen", 520, "/mascot/avatar-1.svg"),
        ("marco_v", "Marco Rossi", 475, "/mascot/avatar-2.svg"),
        ("charlotte_b", "Charlotte Dubois", 390, "/mascot/avatar-3.svg"),
        ("alexramos", "Alex Ramos (You)", 345, "/mascot/duo-happy.svg"),  # Alex in 4th place!
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

    # 8. Seeded Achievements
    achievements = [
        Achievement(
            code="wildfire",
            title="Wildfire",
            description="Reach a 7-day streak",
            icon="flame",
            target_value=7
        ),
        Achievement(
            code="sage",
            title="Sage",
            description="Earn 500 total XP",
            icon="book",
            target_value=500
        ),
        Achievement(
            code="sharpshooter",
            title="Sharpshooter",
            description="Complete a lesson with 100% accuracy",
            icon="target",
            target_value=1
        ),
        Achievement(
            code="champion",
            title="Champion",
            description="Finish in the top 3 of your leaderboard league",
            icon="trophy",
            target_value=3
        ),
    ]
    db.add_all(achievements)
    db.flush()

    # Link user achievements
    db.add_all([
        UserAchievement(user_id=user.id, achievement_id=achievements[0].id, current_value=7, unlocked=True, unlocked_at=datetime.utcnow()),
        UserAchievement(user_id=user.id, achievement_id=achievements[1].id, current_value=345, unlocked=False),
        UserAchievement(user_id=user.id, achievement_id=achievements[2].id, current_value=1, unlocked=True, unlocked_at=datetime.utcnow()),
        UserAchievement(user_id=user.id, achievement_id=achievements[3].id, current_value=4, unlocked=False),
    ])

    # 9. Seeded Daily Quests
    quests = [
        DailyQuest(user_id=user.id, title="Earn 30 XP today", current_progress=15, target_progress=30, reward_gems=10, completed=False),
        DailyQuest(user_id=user.id, title="Complete 2 lessons", current_progress=1, target_progress=2, reward_gems=15, completed=False),
        DailyQuest(user_id=user.id, title="Score 90%+ in 1 lesson", current_progress=1, target_progress=1, reward_gems=20, completed=True),
    ]
    db.add_all(quests)

    db.commit()
    print("Database seeding completed successfully!")
