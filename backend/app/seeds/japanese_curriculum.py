"""
Comprehensive Japanese curriculum for Duolingo Clone.
Provides 6 authentic units with full skills, lessons, and exercises covering all 5 exercise types.
Supports Japanese Kana, Kanji, Romaji, and Web Speech TTS audio.
"""

from typing import List, Dict, Any

def get_japanese_units_data() -> List[Dict[str, Any]]:
    return [
        {
            "unit_number": 1,
            "title": "Unit 1: Hiragana Basics & Greetings",
            "description": "Master essential vowel sounds, common greetings, and polite manners.",
            "color_hex": "#ff4b4b",
            "skills": [
                {
                    "order_index": 1,
                    "title": "Vowels & Basics",
                    "icon_name": "star",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Basic Sounds",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'yes' in Japanese?",
                                    "question_text": "yes",
                                    "audio_text": "はい",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "はい (hai)", "image": "👍"},
                                            {"id": "opt_2", "text": "いいえ (iie)", "image": "👎"},
                                            {"id": "opt_3", "text": "みず (mizu)", "image": "💧"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "はい (hai)"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this word into Japanese:",
                                    "question_text": "No",
                                    "audio_text": "いいえ",
                                    "client_payload": {
                                        "prompt_sentence": "No",
                                        "tokens": ["いいえ", "はい", "みず", "いぬ", "ねこ"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["いいえ"],
                                        "acceptable_token_sequences": [
                                            ["いいえ"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Match Japanese words with English",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["はい", "いいえ", "みず", "おちゃ"],
                                        "right_words": ["water", "yes", "green tea", "no"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "はい": "yes",
                                            "いいえ": "no",
                                            "みず": "water",
                                            "おちゃ": "green tea"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the answer:",
                                    "question_text": "___、そうです。(Yes, that's right.)",
                                    "audio_text": "はい、そうです。",
                                    "client_payload": {
                                        "sentence_parts": ["", "、そうです。"],
                                        "options": ["はい", "いいえ", "みず"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "はい"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'yes':",
                                    "question_text": "yes",
                                    "audio_text": "はい",
                                    "client_payload": {
                                        "prompt": "Translate: 'yes'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "はい",
                                        "acceptable_answers": ["はい", "hai", "Hai"]
                                    }
                                }
                            ]
                        },
                        {
                            "order_index": 2,
                            "title": "Lesson 2: First Words",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'dog'?",
                                    "question_text": "dog",
                                    "audio_text": "いぬ",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "いぬ (inu)", "image": "🐕"},
                                            {"id": "opt_2", "text": "ねこ (neko)", "image": "🐈"},
                                            {"id": "opt_3", "text": "とり (tori)", "image": "🐦"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "いぬ (inu)"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "A cat and a dog",
                                    "audio_text": "ねこといぬ",
                                    "client_payload": {
                                        "prompt_sentence": "A cat and a dog",
                                        "tokens": ["ねこ", "と", "いぬ", "みず", "さかな"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["ねこ", "と", "いぬ"],
                                        "acceptable_token_sequences": [
                                            ["ねこ", "と", "いぬ"],
                                            ["いぬ", "と", "ねこ"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Match animals and objects",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["いぬ", "ねこ", "さかな", "みず"],
                                        "right_words": ["cat", "dog", "water", "fish"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "いぬ": "dog",
                                            "ねこ": "cat",
                                            "さかな": "fish",
                                            "みず": "water"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the word:",
                                    "question_text": "かわいい ___ (Cute cat)",
                                    "audio_text": "かわいい ねこ",
                                    "client_payload": {
                                        "sentence_parts": ["かわいい ", ""],
                                        "options": ["ねこ", "みず", "おちゃ"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "ねこ"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'cat':",
                                    "question_text": "cat",
                                    "audio_text": "ねこ",
                                    "client_payload": {
                                        "prompt": "Translate: 'cat'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "ねこ",
                                        "acceptable_answers": ["ねこ", "neko", "Neko", "猫"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "order_index": 2,
                    "title": "Essential Greetings",
                    "icon_name": "chat",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Hello & Goodbye",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'Hello / Good afternoon'?",
                                    "question_text": "Hello",
                                    "audio_text": "こんにちは",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "こんにちは (Konnichiwa)", "image": "👋"},
                                            {"id": "opt_2", "text": "さようなら (Sayōnara)", "image": "🚶"},
                                            {"id": "opt_3", "text": "おはよう (Ohayō)", "image": "🌅"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "こんにちは (Konnichiwa)"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this greeting:",
                                    "question_text": "Good morning",
                                    "audio_text": "おはようございます",
                                    "client_payload": {
                                        "prompt_sentence": "Good morning",
                                        "tokens": ["おはよう", "ございます", "こんにちは", "さようなら"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["おはよう", "ございます"],
                                        "acceptable_token_sequences": [
                                            ["おはよう", "ございます"],
                                            ["おはよう"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Match Japanese greetings",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["こんにちは", "おはよう", "さようなら", "じゃあね"],
                                        "right_words": ["Goodbye", "See you", "Hello", "Good morning"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "こんにちは": "Hello",
                                            "おはよう": "Good morning",
                                            "さようなら": "Goodbye",
                                            "じゃあね": "See you"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the morning greeting:",
                                    "question_text": "おはよう ___。",
                                    "audio_text": "おはようございます。",
                                    "client_payload": {
                                        "sentence_parts": ["おはよう ", "。"],
                                        "options": ["ございます", "こんにちは", "です"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "ございます"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese greeting for 'Hello':",
                                    "question_text": "Hello",
                                    "audio_text": "こんにちは",
                                    "client_payload": {
                                        "prompt": "Translate: 'Hello'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "こんにちは",
                                        "acceptable_answers": ["こんにちは", "konnichiwa", "Konnichiwa", "こんにちわ"]
                                    }
                                }
                            ]
                        },
                        {
                            "order_index": 2,
                            "title": "Lesson 2: Thank You & Excuses",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'Thank you' in Japanese?",
                                    "question_text": "Thank you",
                                    "audio_text": "ありがとう",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "ありがとう (Arigatō)", "image": "🙏"},
                                            {"id": "opt_2", "text": "すみません (Sumimasen)", "image": "🙇"},
                                            {"id": "opt_3", "text": "どうぞ (Dōzo)", "image": "🤲"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "ありがとう (Arigatō)"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this polite expression:",
                                    "question_text": "Excuse me, thank you very much.",
                                    "audio_text": "すみません、ありがとうございます。",
                                    "client_payload": {
                                        "prompt_sentence": "Excuse me, thank you very much.",
                                        "tokens": ["すみません", "ありがとうございます", "どうぞ", "はい"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["すみません", "ありがとうございます"],
                                        "acceptable_token_sequences": [
                                            ["すみません", "ありがとうございます"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Polite expressions",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["ありがとう", "すみません", "どうぞ", "どうも"],
                                        "right_words": ["Please / Go ahead", "Thank you", "Excuse me", "Thanks (casual)"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "ありがとう": "Thank you",
                                            "すみません": "Excuse me",
                                            "どうぞ": "Please / Go ahead",
                                            "どうも": "Thanks (casual)"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the polite phrase:",
                                    "question_text": "どうも ___ ございます。",
                                    "audio_text": "どうも ありがとう ございます。",
                                    "client_payload": {
                                        "sentence_parts": ["どうも ", " ございます。"],
                                        "options": ["ありがとう", "すみません", "はい"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "ありがとう"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'Excuse me':",
                                    "question_text": "Excuse me",
                                    "audio_text": "すみません",
                                    "client_payload": {
                                        "prompt": "Translate: 'Excuse me'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "すみません",
                                        "acceptable_answers": ["すみません", "sumimasen", "Sumimasen"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "unit_number": 2,
            "title": "Unit 2: Food & Ordering at a Restaurant",
            "description": "Order green tea, sushi, ramen, and say 'please' at restaurants.",
            "color_hex": "#ff9600",
            "skills": [
                {
                    "order_index": 3,
                    "title": "Café Staples",
                    "icon_name": "cup",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Drinks & Ordering",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'green tea'?",
                                    "question_text": "green tea",
                                    "audio_text": "おちゃ",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "おちゃ (Ocha)", "image": "🍵"},
                                            {"id": "opt_2", "text": "コーヒー (Kōhī)", "image": "☕"},
                                            {"id": "opt_3", "text": "みず (Mizu)", "image": "💧"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "おちゃ (Ocha)"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this order:",
                                    "question_text": "Green tea, please.",
                                    "audio_text": "おちゃをください",
                                    "client_payload": {
                                        "prompt_sentence": "Green tea, please.",
                                        "tokens": ["おちゃ", "を", "ください", "みず", "コーヒー"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["おちゃ", "を", "ください"],
                                        "acceptable_token_sequences": [
                                            ["おちゃ", "を", "ください"],
                                            ["おちゃ", "ください"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Drinks and café words",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["おちゃ", "みず", "コーヒー", "ください"],
                                        "right_words": ["coffee", "please", "green tea", "water"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "おちゃ": "green tea",
                                            "みず": "water",
                                            "コーヒー": "coffee",
                                            "ください": "please"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the request:",
                                    "question_text": "みず ___ ください。",
                                    "audio_text": "みずをください。",
                                    "client_payload": {
                                        "sentence_parts": ["みず ", " ください。"],
                                        "options": ["を", "は", "が"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "を"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'water':",
                                    "question_text": "water",
                                    "audio_text": "みず",
                                    "client_payload": {
                                        "prompt": "Translate: 'water'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "みず",
                                        "acceptable_answers": ["みず", "mizu", "Mizu", "お水", "水"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "order_index": 4,
                    "title": "Japanese Dining",
                    "icon_name": "bowl",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Rice & Sushi",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'sushi'?",
                                    "question_text": "sushi",
                                    "audio_text": "すし",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "すし (Sushi)", "image": "🍣"},
                                            {"id": "opt_2", "text": "ごはん (Gohan)", "image": "🍚"},
                                            {"id": "opt_3", "text": "ラーメン (Rāmen)", "image": "🍜"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "すし (Sushi)"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "I eat sushi.",
                                    "audio_text": "すしをたべます",
                                    "client_payload": {
                                        "prompt_sentence": "I eat sushi.",
                                        "tokens": ["すし", "を", "たべます", "のみます", "ごはん"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["すし", "を", "たべます"],
                                        "acceptable_token_sequences": [
                                            ["すし", "を", "たべます"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Food and dining actions",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["すし", "ごはん", "たべます", "のみます"],
                                        "right_words": ["eat", "drink", "rice", "sushi"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "すし": "sushi",
                                            "ごはん": "rice",
                                            "たべます": "eat",
                                            "のみます": "drink"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the meal phrase:",
                                    "question_text": "すしが とても ___ です。(The sushi is very delicious.)",
                                    "audio_text": "すしが とても おいしい です。",
                                    "client_payload": {
                                        "sentence_parts": ["すしが とても ", " です。"],
                                        "options": ["おいしい", "みず", "おちゃ"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "おいしい"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'delicious':",
                                    "question_text": "delicious",
                                    "audio_text": "おいしい",
                                    "client_payload": {
                                        "prompt": "Translate: 'delicious'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "おいしい",
                                        "acceptable_answers": ["おいしい", "oishii", "Oishii", "美味しい"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "unit_number": 3,
            "title": "Unit 3: People, Occupations & Nationalities",
            "description": "Introduce yourself, talk about your nationality and professions.",
            "color_hex": "#58cc02",
            "skills": [
                {
                    "order_index": 5,
                    "title": "Self Introductions",
                    "icon_name": "person",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Nice to Meet You",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'I' or 'me' in Japanese?",
                                    "question_text": "I / me",
                                    "audio_text": "わたし",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "わたし (Watashi)", "image": "👤"},
                                            {"id": "opt_2", "text": "あなた (Anata)", "image": "👉"},
                                            {"id": "opt_3", "text": "かれ (Kare)", "image": "🚶"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "わたし (Watashi)"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "I am a student.",
                                    "audio_text": "わたしはがくせいです",
                                    "client_payload": {
                                        "prompt_sentence": "I am a student.",
                                        "tokens": ["わたし", "は", "がくせい", "です", "せんせい", "にほんじん"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["わたし", "は", "がくせい", "です"],
                                        "acceptable_token_sequences": [
                                            ["わたし", "は", "がくせい", "です"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "People and roles",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["わたし", "がくせい", "せんせい", "ともだち"],
                                        "right_words": ["friend", "student", "teacher", "I / me"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "わたし": "I / me",
                                            "がくせい": "student",
                                            "せんせい": "teacher",
                                            "ともだち": "friend"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the self-introduction:",
                                    "question_text": "たなかさんは ___ です。(Mr. Tanaka is a teacher.)",
                                    "audio_text": "たなかさんは せんせい です。",
                                    "client_payload": {
                                        "sentence_parts": ["たなかさんは ", " です。"],
                                        "options": ["せんせい", "みず", "おちゃ"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "せんせい"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'student':",
                                    "question_text": "student",
                                    "audio_text": "がくせい",
                                    "client_payload": {
                                        "prompt": "Translate: 'student'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "がくせい",
                                        "acceptable_answers": ["がくせい", "gakusei", "Gakusei", "学生"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "order_index": 6,
                    "title": "Nationalities",
                    "icon_name": "globe",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Japan & America",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'Japanese person'?",
                                    "question_text": "Japanese person",
                                    "audio_text": "にほんじん",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "にほんじん (Nihonjin)", "image": "🇯🇵"},
                                            {"id": "opt_2", "text": "アメリカじん (Amerikajin)", "image": "🇺🇸"},
                                            {"id": "opt_3", "text": "イギリスじん (Igirisujin)", "image": "🇬🇧"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "にほんじん (Nihonjin)"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "I am Japanese.",
                                    "audio_text": "わたしはにほんじんです",
                                    "client_payload": {
                                        "prompt_sentence": "I am Japanese.",
                                        "tokens": ["わたし", "は", "にほんじん", "です", "アメリカじん", "がくせい"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["わたし", "は", "にほんじん", "です"],
                                        "acceptable_token_sequences": [
                                            ["わたし", "は", "にほんじん", "です"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Countries and languages",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["にほん", "にほんご", "えいご", "アメリカ"],
                                        "right_words": ["English language", "America", "Japanese language", "Japan"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "にほん": "Japan",
                                            "にほんご": "Japanese language",
                                            "えいご": "English language",
                                            "アメリカ": "America"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the language question:",
                                    "question_text": "にほんご ___ はなしますか？ (Do you speak Japanese?)",
                                    "audio_text": "にほんごを はなしますか？",
                                    "client_payload": {
                                        "sentence_parts": ["にほんご", " はなしますか？"],
                                        "options": ["を", "は", "です"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "を"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'Japan':",
                                    "question_text": "Japan",
                                    "audio_text": "にほん",
                                    "client_payload": {
                                        "prompt": "Translate: 'Japan'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "にほん",
                                        "acceptable_answers": ["にほん", "nihon", "nippon", "Nihon", "Nippon", "日本"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "unit_number": 4,
            "title": "Unit 4: Numbers, Time & Shopping",
            "description": "Count 1 to 10, ask prices in yen, tell the time, and pay for items.",
            "color_hex": "#1cb0f6",
            "skills": [
                {
                    "order_index": 7,
                    "title": "Numbers 1 to 10",
                    "icon_name": "star",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Counting to 5",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is the number '1'?",
                                    "question_text": "one (1)",
                                    "audio_text": "いち",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "いち (Ichi) - 1", "image": "1️⃣"},
                                            {"id": "opt_2", "text": "に (Ni) - 2", "image": "2️⃣"},
                                            {"id": "opt_3", "text": "さん (San) - 3", "image": "3️⃣"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "いち (Ichi) - 1"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sequence:",
                                    "question_text": "1, 2, 3",
                                    "audio_text": "いち、に、さん",
                                    "client_payload": {
                                        "prompt_sentence": "1, 2, 3",
                                        "tokens": ["いち", "に", "さん", "よん", "ご"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["いち", "に", "さん"],
                                        "acceptable_token_sequences": [
                                            ["いち", "に", "さん"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Match numbers",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["いち", "に", "さん", "よん"],
                                        "right_words": ["3", "1", "4", "2"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "いち": "1",
                                            "に": "2",
                                            "さん": "3",
                                            "よん": "4"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the count: 1, 2, 3, 4, ___",
                                    "question_text": "いち、に、さん、よん、___",
                                    "audio_text": "いち、に、さん、よん、ご",
                                    "client_payload": {
                                        "sentence_parts": ["いち、に、さん、よん、", ""],
                                        "options": ["ご", "ろく", "はち"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "ご"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'three' (3):",
                                    "question_text": "three (3)",
                                    "audio_text": "さん",
                                    "client_payload": {
                                        "prompt": "Translate: 'three (3)'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "さん",
                                        "acceptable_answers": ["さん", "san", "San", "三"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "order_index": 8,
                    "title": "Shopping & Prices",
                    "icon_name": "tag",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: How Much is It?",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you ask 'How much is this?'",
                                    "question_text": "How much is this?",
                                    "audio_text": "これはいくらですか？",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "これはいくらですか？", "image": "🏷️"},
                                            {"id": "opt_2", "text": "これはなんですか？", "image": "❓"},
                                            {"id": "opt_3", "text": "えきはどこですか？", "image": "🚉"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "これはいくらですか？"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this price statement:",
                                    "question_text": "It is 100 yen.",
                                    "audio_text": "ひゃくえんです",
                                    "client_payload": {
                                        "prompt_sentence": "It is 100 yen.",
                                        "tokens": ["ひゃく", "えん", "です", "せん", "いくら"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["ひゃく", "えん", "です"],
                                        "acceptable_token_sequences": [
                                            ["ひゃく", "えん", "です"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Money and shopping words",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["いくら", "えん", "ひゃく", "せん"],
                                        "right_words": ["thousand (1,000)", "hundred (100)", "how much", "yen (¥)"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "いくら": "how much",
                                            "えん": "yen (¥)",
                                            "ひゃく": "hundred (100)",
                                            "せん": "thousand (1,000)"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the purchase:",
                                    "question_text": "これ ___ ください。(Please give me this one.)",
                                    "audio_text": "これをください。",
                                    "client_payload": {
                                        "sentence_parts": ["これ", " ください。"],
                                        "options": ["を", "は", "が"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "を"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'yen' (currency):",
                                    "question_text": "yen",
                                    "audio_text": "えん",
                                    "client_payload": {
                                        "prompt": "Translate: 'yen'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "えん",
                                        "acceptable_answers": ["えん", "en", "yen", "En", "Yen", "円"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "unit_number": 5,
            "title": "Unit 5: Getting Around & Places",
            "description": "Find stations, ask where places are, and use travel verbs.",
            "color_hex": "#ce82ff",
            "skills": [
                {
                    "order_index": 9,
                    "title": "Key Locations",
                    "icon_name": "building",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Station & Town",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'the station'?",
                                    "question_text": "the station",
                                    "audio_text": "えき",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "えき (Eki)", "image": "🚉"},
                                            {"id": "opt_2", "text": "ホテル (Hoteru)", "image": "🏨"},
                                            {"id": "opt_3", "text": "トイレ (Toire)", "image": "🚻"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "えき (Eki)"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this question:",
                                    "question_text": "Where is the station?",
                                    "audio_text": "えきはどこですか？",
                                    "client_payload": {
                                        "prompt_sentence": "Where is the station?",
                                        "tokens": ["えき", "は", "どこ", "ですか", "ここ", "トイレ"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["えき", "は", "どこ", "ですか"],
                                        "acceptable_token_sequences": [
                                            ["えき", "は", "どこ", "ですか"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Locations and positions",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["えき", "どこ", "ここ", "あそこ"],
                                        "right_words": ["over there", "here", "station", "where"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "えき": "station",
                                            "どこ": "where",
                                            "ここ": "here",
                                            "あそこ": "over there"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the location sentence:",
                                    "question_text": "トイレは ___ です。(The restroom is over there.)",
                                    "audio_text": "トイレは あそこ です。",
                                    "client_payload": {
                                        "sentence_parts": ["トイレは ", " です。"],
                                        "options": ["あそこ", "えき", "みず"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "あそこ"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'station':",
                                    "question_text": "station",
                                    "audio_text": "えき",
                                    "client_payload": {
                                        "prompt": "Translate: 'station'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "えき",
                                        "acceptable_answers": ["えき", "eki", "Eki", "駅"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "unit_number": 6,
            "title": "Unit 6: Daily Life & Hobbies",
            "description": "Talk about routines, reading, anime, music, and weekend fun.",
            "color_hex": "#00cd9c",
            "skills": [
                {
                    "order_index": 10,
                    "title": "Anime & Hobbies",
                    "icon_name": "smile",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Free Time & Media",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'anime'?",
                                    "question_text": "anime",
                                    "audio_text": "アニメ",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "アニメ (Anime)", "image": "📺"},
                                            {"id": "opt_2", "text": "おんがく (Ongaku)", "image": "🎵"},
                                            {"id": "opt_3", "text": "ゲーム (Gēmu)", "image": "🎮"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "アニメ (Anime)"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "I watch anime.",
                                    "audio_text": "アニメをみます",
                                    "client_payload": {
                                        "prompt_sentence": "I watch anime.",
                                        "tokens": ["アニメ", "を", "みます", "ききます", "ほん"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["アニメ", "を", "みます"],
                                        "acceptable_token_sequences": [
                                            ["アニメ", "を", "みます"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Hobbies and verbs",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["アニメ", "おんがく", "みます", "よみます"],
                                        "right_words": ["read", "watch / see", "music", "anime"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "アニメ": "anime",
                                            "おんがく": "music",
                                            "みます": "watch / see",
                                            "よみます": "read"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the preference:",
                                    "question_text": "アニメが ___ です。(I like anime.)",
                                    "audio_text": "アニメが すき です。",
                                    "client_payload": {
                                        "sentence_parts": ["アニメが ", " です。"],
                                        "options": ["すき", "えき", "みず"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "すき"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the Japanese word for 'music':",
                                    "question_text": "music",
                                    "audio_text": "おんがく",
                                    "client_payload": {
                                        "prompt": "Translate: 'music'",
                                        "target_language": "ja"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "おんがく",
                                        "acceptable_answers": ["おんがく", "ongaku", "Ongaku", "音楽"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
