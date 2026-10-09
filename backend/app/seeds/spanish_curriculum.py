"""
Comprehensive Spanish curriculum for Duolingo Clone.
Provides 6 authentic units with full skills, lessons, and exercises covering all 5 exercise types.
"""

from typing import List, Dict, Any

def get_spanish_units_data() -> List[Dict[str, Any]]:
    return [
        {
            "unit_number": 1,
            "title": "Unit 1: Get started in Spanish",
            "description": "Greet people, introduce yourself, and order basic items.",
            "color_hex": "#58cc02",
            "skills": [
                {
                    "order_index": 1,
                    "title": "Basics",
                    "icon_name": "star",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Common Words",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'the apple'?",
                                    "question_text": "the apple",
                                    "audio_text": "la manzana",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "la manzana", "image": "🍎"},
                                            {"id": "opt_2", "text": "el pan", "image": "🍞"},
                                            {"id": "opt_3", "text": "el agua", "image": "💧"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "la manzana"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence into Spanish:",
                                    "question_text": "The woman eats an apple.",
                                    "audio_text": "La mujer come una manzana.",
                                    "client_payload": {
                                        "prompt_sentence": "The woman eats an apple.",
                                        "tokens": ["manzanas", "come", "La", "ella", "manzana", "mujer", "agua", "una"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["La", "mujer", "come", "una", "manzana"],
                                        "acceptable_token_sequences": [
                                            ["La", "mujer", "come", "una", "manzana"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Match the words with their meanings",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["manzana", "leche", "mujer", "hombre"],
                                        "right_words": ["woman", "man", "apple", "milk"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "manzana": "apple",
                                            "leche": "milk",
                                            "mujer": "woman",
                                            "hombre": "man"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Fill in the blank with the correct form:",
                                    "question_text": "Yo ___ una manzana.",
                                    "audio_text": "Yo como una manzana.",
                                    "client_payload": {
                                        "sentence_parts": ["Yo ", " una manzana."],
                                        "options": ["como", "comes", "comen"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "como"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "The man",
                                    "audio_text": "El hombre",
                                    "client_payload": {
                                        "prompt": "Translate: 'The man'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "El hombre",
                                        "acceptable_answers": ["el hombre", "El hombre"]
                                    }
                                }
                            ]
                        },
                        {
                            "order_index": 2,
                            "title": "Lesson 2: Eating & Drinking",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'the milk'?",
                                    "question_text": "the milk",
                                    "audio_text": "la leche",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "el café", "image": "☕"},
                                            {"id": "opt_2", "text": "la leche", "image": "🥛"},
                                            {"id": "opt_3", "text": "el agua", "image": "💧"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_2",
                                        "correct_text": "la leche"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence into Spanish:",
                                    "question_text": "The boy drinks water.",
                                    "audio_text": "El niño bebe agua.",
                                    "client_payload": {
                                        "prompt_sentence": "The boy drinks water.",
                                        "tokens": ["agua", "El", "niño", "bebe", "pan", "ella", "como"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["El", "niño", "bebe", "agua"],
                                        "acceptable_token_sequences": [
                                            ["El", "niño", "bebe", "agua"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Match the words with their meanings",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["bebe", "come", "niño", "niña"],
                                        "right_words": ["drinks", "girl", "boy", "eats"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "bebe": "drinks",
                                            "come": "eats",
                                            "niño": "boy",
                                            "niña": "girl"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the sentence:",
                                    "question_text": "El niño ___ agua.",
                                    "audio_text": "El niño bebe agua.",
                                    "client_payload": {
                                        "sentence_parts": ["El niño ", " agua."],
                                        "options": ["bebe", "bebes", "bebo"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "bebe"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "The girl",
                                    "audio_text": "La niña",
                                    "client_payload": {
                                        "prompt": "Translate: 'The girl'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "La niña",
                                        "acceptable_answers": ["la niña", "La niña", "la nina", "La nina"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "order_index": 2,
                    "title": "Greetings",
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
                                    "prompt": "How do you say 'Hello'?",
                                    "question_text": "Hello",
                                    "audio_text": "Hola",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "Hola", "image": "👋"},
                                            {"id": "opt_2", "text": "Adiós", "image": "🚶"},
                                            {"id": "opt_3", "text": "Por favor", "image": "🙏"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "Hola"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this greeting:",
                                    "question_text": "Good morning, how are you?",
                                    "audio_text": "Buenos días, ¿cómo estás?",
                                    "client_payload": {
                                        "prompt_sentence": "Good morning, how are you?",
                                        "tokens": ["días", "noches", "estás", "¿cómo", "gracias", "Buenos"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Buenos", "días", "¿cómo", "estás"],
                                        "acceptable_token_sequences": [
                                            ["Buenos", "días", "¿cómo", "estás"],
                                            ["Buenos", "días", "cómo", "estás"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Match Spanish greetings to English",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["Hola", "Adiós", "Gracias", "Por favor"],
                                        "right_words": ["Please", "Hello", "Thank you", "Goodbye"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "Hola": "Hello",
                                            "Adiós": "Goodbye",
                                            "Gracias": "Thank you",
                                            "Por favor": "Please"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the greeting:",
                                    "question_text": "Mucho ___, Juan.",
                                    "audio_text": "Mucho gusto, Juan.",
                                    "client_payload": {
                                        "sentence_parts": ["Mucho ", ", Juan."],
                                        "options": ["gusto", "gracias", "hola"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "gusto"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "Thank you",
                                    "audio_text": "Gracias",
                                    "client_payload": {
                                        "prompt": "Translate: 'Thank you'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "Gracias",
                                        "acceptable_answers": ["gracias", "Gracias"]
                                    }
                                }
                            ]
                        },
                        {
                            "order_index": 2,
                            "title": "Lesson 2: Polite Phrases",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'Goodbye'?",
                                    "question_text": "Goodbye",
                                    "audio_text": "Adiós",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "Adiós", "image": "👋"},
                                            {"id": "opt_2", "text": "Hola", "image": "🙋"},
                                            {"id": "opt_3", "text": "Sí", "image": "👍"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "Adiós"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "Yes, thank you very much.",
                                    "audio_text": "Sí, muchas gracias.",
                                    "client_payload": {
                                        "prompt_sentence": "Yes, thank you very much.",
                                        "tokens": ["muchas", "gracias", "Sí", "no", "por", "favor"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Sí", "muchas", "gracias"],
                                        "acceptable_token_sequences": [
                                            ["Sí", "muchas", "gracias"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Match the polite phrases",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["Sí", "No", "De nada", "Hasta luego"],
                                        "right_words": ["See you later", "No", "You are welcome", "Yes"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "Sí": "Yes",
                                            "No": "No",
                                            "De nada": "You are welcome",
                                            "Hasta luego": "See you later"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the sentence:",
                                    "question_text": "Buenas ___, señora Perez.",
                                    "audio_text": "Buenas tardes, señora Perez.",
                                    "client_payload": {
                                        "sentence_parts": ["Buenas ", ", señora Perez."],
                                        "options": ["tardes", "gracias", "hola"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "tardes"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "Please",
                                    "audio_text": "Por favor",
                                    "client_payload": {
                                        "prompt": "Translate: 'Please'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "Por favor",
                                        "acceptable_answers": ["por favor", "Por favor"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "order_index": 3,
                    "title": "Introductions",
                    "icon_name": "heart",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: My Name & Origin",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'My name is Carlos'?",
                                    "question_text": "My name is Carlos",
                                    "audio_text": "Me llamo Carlos",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "Me llamo Carlos", "image": "👤"},
                                            {"id": "opt_2", "text": "Soy de México", "image": "🇲🇽"},
                                            {"id": "opt_3", "text": "Tengo hambre", "image": "🍽️"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "Me llamo Carlos"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "I am from Spain.",
                                    "audio_text": "Yo soy de España.",
                                    "client_payload": {
                                        "prompt_sentence": "I am from Spain.",
                                        "tokens": ["soy", "Yo", "de", "España", "en", "Francia", "es"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Yo", "soy", "de", "España"],
                                        "acceptable_token_sequences": [
                                            ["Yo", "soy", "de", "España"],
                                            ["Soy", "de", "España"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Match origin phrases",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["soy", "eres", "de dónde", "España"],
                                        "right_words": ["where from", "you are", "Spain", "I am"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "soy": "I am",
                                            "eres": "you are",
                                            "de dónde": "where from",
                                            "España": "Spain"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the question:",
                                    "question_text": "¿De dónde ___ tú?",
                                    "audio_text": "¿De dónde eres tú?",
                                    "client_payload": {
                                        "sentence_parts": ["¿De dónde ", " tú?"],
                                        "options": ["eres", "soy", "es"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "eres"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "I am Carlos",
                                    "audio_text": "Yo soy Carlos",
                                    "client_payload": {
                                        "prompt": "Translate: 'I am Carlos'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "Yo soy Carlos",
                                        "acceptable_answers": ["yo soy Carlos", "Yo soy Carlos", "Soy Carlos", "soy Carlos"]
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
            "title": "Unit 2: Food & Café",
            "description": "Order drinks, sample tapas, and ask for the restaurant bill.",
            "color_hex": "#1cb0f6",
            "skills": [
                {
                    "order_index": 4,
                    "title": "Café",
                    "icon_name": "cup",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Coffee & Tea",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'a coffee with milk'?",
                                    "question_text": "a coffee with milk",
                                    "audio_text": "un café con leche",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "un café con leche", "image": "☕"},
                                            {"id": "opt_2", "text": "un té verde", "image": "🍵"},
                                            {"id": "opt_3", "text": "un jugo de naranja", "image": "🧃"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "un café con leche"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this order:",
                                    "question_text": "I want a coffee, please.",
                                    "audio_text": "Quiero un café, por favor.",
                                    "client_payload": {
                                        "prompt_sentence": "I want a coffee, please.",
                                        "tokens": ["café", "un", "Quiero", "leche", "por", "favor", "té"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Quiero", "un", "café", "por", "favor"],
                                        "acceptable_token_sequences": [
                                            ["Quiero", "un", "café", "por", "favor"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Café vocabulary",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["café", "té", "azúcar", "cuenta"],
                                        "right_words": ["sugar", "bill", "coffee", "tea"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "café": "coffee",
                                            "té": "tea",
                                            "azúcar": "sugar",
                                            "cuenta": "bill"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the sentence:",
                                    "question_text": "¿Cuánto ___ el café?",
                                    "audio_text": "¿Cuánto cuesta el café?",
                                    "client_payload": {
                                        "sentence_parts": ["¿Cuánto ", " el café?"],
                                        "options": ["cuesta", "es", "vale"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "cuesta"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "The bill, please",
                                    "audio_text": "La cuenta, por favor",
                                    "client_payload": {
                                        "prompt": "Translate: 'The bill, please'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "La cuenta, por favor",
                                        "acceptable_answers": ["la cuenta, por favor", "La cuenta, por favor", "la cuenta por favor", "La cuenta por favor"]
                                    }
                                }
                            ]
                        },
                        {
                            "order_index": 2,
                            "title": "Lesson 2: Breakfast Items",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'orange juice'?",
                                    "question_text": "orange juice",
                                    "audio_text": "jugo de naranja",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "jugo de naranja", "image": "🍊"},
                                            {"id": "opt_2", "text": "pan tostado", "image": "🍞"},
                                            {"id": "opt_3", "text": "chocolate", "image": "🍫"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "jugo de naranja"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "I eat toasted bread.",
                                    "audio_text": "Yo como pan tostado.",
                                    "client_payload": {
                                        "prompt_sentence": "I eat toasted bread.",
                                        "tokens": ["tostado", "como", "Yo", "pan", "con", "mantequilla"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Yo", "como", "pan", "tostado"],
                                        "acceptable_token_sequences": [
                                            ["Yo", "como", "pan", "tostado"],
                                            ["Como", "pan", "tostado"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Breakfast vocabulary",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["jugo", "pan", "huevo", "queso"],
                                        "right_words": ["egg", "cheese", "bread", "juice"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "jugo": "juice",
                                            "pan": "bread",
                                            "huevo": "egg",
                                            "queso": "cheese"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the breakfast order:",
                                    "question_text": "Quiero dos huevos con ___ fresco.",
                                    "audio_text": "Quiero dos huevos con pan fresco.",
                                    "client_payload": {
                                        "sentence_parts": ["Quiero dos huevos con ", " fresco."],
                                        "options": ["pan", "agua", "café"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "pan"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "A hot tea",
                                    "audio_text": "Un té caliente",
                                    "client_payload": {
                                        "prompt": "Translate: 'A hot tea'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "Un té caliente",
                                        "acceptable_answers": ["un té caliente", "Un té caliente", "un te caliente", "Un te caliente"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "order_index": 5,
                    "title": "Dining Out",
                    "icon_name": "burger",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Main Dishes",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'a table for two'?",
                                    "question_text": "a table for two",
                                    "audio_text": "una mesa para dos",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "una mesa para dos", "image": "🍽️"},
                                            {"id": "opt_2", "text": "un menú en inglés", "image": "📋"},
                                            {"id": "opt_3", "text": "la cuenta", "image": "🧾"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "una mesa para dos"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "A table for two persons, please.",
                                    "audio_text": "Una mesa para dos personas, por favor.",
                                    "client_payload": {
                                        "prompt_sentence": "A table for two persons, please.",
                                        "tokens": ["mesa", "Una", "para", "dos", "personas", "por", "favor", "tres"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Una", "mesa", "para", "dos", "personas", "por", "favor"],
                                        "acceptable_token_sequences": [
                                            ["Una", "mesa", "para", "dos", "personas", "por", "favor"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Restaurant vocabulary",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["mesa", "camarero", "menú", "cena"],
                                        "right_words": ["waiter", "menu", "table", "dinner"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "mesa": "table",
                                            "camarero": "waiter",
                                            "menú": "menu",
                                            "cena": "dinner"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the request:",
                                    "question_text": "¿Tiene opciones ___?",
                                    "audio_text": "¿Tiene opciones vegetarianas?",
                                    "client_payload": {
                                        "sentence_parts": ["¿Tiene opciones ", "?"],
                                        "options": ["vegetarianas", "pan", "mesa"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "vegetarianas"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "A fresh salad",
                                    "audio_text": "Una ensalada fresca",
                                    "client_payload": {
                                        "prompt": "Translate: 'A fresh salad'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "Una ensalada fresca",
                                        "acceptable_answers": ["una ensalada fresca", "Una ensalada fresca"]
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
            "title": "Unit 3: Everyday Routines",
            "description": "Talk about family members, home, and daily schedules.",
            "color_hex": "#ce82ff",
            "skills": [
                {
                    "order_index": 6,
                    "title": "Family",
                    "icon_name": "heart",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Parents & Siblings",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'my mother'?",
                                    "question_text": "my mother",
                                    "audio_text": "mi madre",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "mi madre", "image": "👩"},
                                            {"id": "opt_2", "text": "mi padre", "image": "👨"},
                                            {"id": "opt_3", "text": "mi hermano", "image": "👦"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "mi madre"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "My brother lives in Madrid.",
                                    "audio_text": "Mi hermano vive en Madrid.",
                                    "client_payload": {
                                        "prompt_sentence": "My brother lives in Madrid.",
                                        "tokens": ["hermano", "Mi", "vive", "en", "Madrid", "padre", "con"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Mi", "hermano", "vive", "en", "Madrid"],
                                        "acceptable_token_sequences": [
                                            ["Mi", "hermano", "vive", "en", "Madrid"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Family vocabulary",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["madre", "padre", "hermano", "hermana"],
                                        "right_words": ["sister", "brother", "mother", "father"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "madre": "mother",
                                            "padre": "father",
                                            "hermano": "brother",
                                            "hermana": "sister"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the family sentence:",
                                    "question_text": "Tengo una familia ___.",
                                    "audio_text": "Tengo una familia grande.",
                                    "client_payload": {
                                        "sentence_parts": ["Tengo una familia ", "."],
                                        "options": ["grande", "hermano", "padre"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "grande"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "My father",
                                    "audio_text": "Mi padre",
                                    "client_payload": {
                                        "prompt": "Translate: 'My father'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "Mi padre",
                                        "acceptable_answers": ["mi padre", "Mi padre"]
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "order_index": 7,
                    "title": "Routines",
                    "icon_name": "calendar",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Daily Habits",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "How do you say 'I study Spanish'?",
                                    "question_text": "I study Spanish",
                                    "audio_text": "Yo estudio español",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "Yo estudio español", "image": "📚"},
                                            {"id": "opt_2", "text": "Yo trabajo hoy", "image": "💼"},
                                            {"id": "opt_3", "text": "Yo cocino bien", "image": "🍳"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "Yo estudio español"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this routine:",
                                    "question_text": "I work every day.",
                                    "audio_text": "Yo trabajo todos los días.",
                                    "client_payload": {
                                        "prompt_sentence": "I work every day.",
                                        "tokens": ["trabajo", "Yo", "todos", "los", "días", "noches", "estudio"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Yo", "trabajo", "todos", "los", "días"],
                                        "acceptable_token_sequences": [
                                            ["Yo", "trabajo", "todos", "los", "días"],
                                            ["Trabajo", "todos", "los", "días"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Routine verbs",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["estudio", "trabajo", "cocino", "duermo"],
                                        "right_words": ["I sleep", "I study", "I work", "I cook"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "estudio": "I study",
                                            "trabajo": "I work",
                                            "cocino": "I cook",
                                            "duermo": "I sleep"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the routine:",
                                    "question_text": "Ella ___ en una oficina.",
                                    "audio_text": "Ella trabaja en una oficina.",
                                    "client_payload": {
                                        "sentence_parts": ["Ella ", " en una oficina."],
                                        "options": ["trabaja", "trabajo", "trabajas"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "trabaja"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "Every day",
                                    "audio_text": "Todos los días",
                                    "client_payload": {
                                        "prompt": "Translate: 'Every day'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "Todos los días",
                                        "acceptable_answers": ["todos los días", "Todos los días", "todos los dias", "Todos los dias"]
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
            "title": "Unit 4: Travel & Getting Around",
            "description": "Find train stations, book hotel rooms, and ask directions.",
            "color_hex": "#ff9600",
            "skills": [
                {
                    "order_index": 8,
                    "title": "Directions",
                    "icon_name": "compass",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: In the City",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Where is the train station?",
                                    "question_text": "Where is the train station?",
                                    "audio_text": "¿Dónde está la estación de tren?",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "¿Dónde está la estación de tren?", "image": "🚉"},
                                            {"id": "opt_2", "text": "¿Dónde está el hotel?", "image": "🏨"},
                                            {"id": "opt_3", "text": "¿Dónde está el baño?", "image": "🚻"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "¿Dónde está la estación de tren?"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this phrase:",
                                    "question_text": "Turn right at the corner.",
                                    "audio_text": "Gire a la derecha en la esquina.",
                                    "client_payload": {
                                        "prompt_sentence": "Turn right at the corner.",
                                        "tokens": ["Gire", "a", "la", "derecha", "en", "esquina", "izquierda"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Gire", "a", "la", "derecha", "en", "la", "esquina"],
                                        "acceptable_token_sequences": [
                                            ["Gire", "a", "la", "derecha", "en", "esquina"],
                                            ["Gire", "a", "la", "derecha"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Directions vocabulary",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["derecha", "izquierda", "cerca", "lejos"],
                                        "right_words": ["far", "near", "left", "right"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "derecha": "right",
                                            "izquierda": "left",
                                            "cerca": "near",
                                            "lejos": "far"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the question:",
                                    "question_text": "¿El hotel está ___ o lejos?",
                                    "audio_text": "¿El hotel está cerca o lejos?",
                                    "client_payload": {
                                        "sentence_parts": ["¿El hotel está ", " o lejos?"],
                                        "options": ["cerca", "derecha", "tren"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "cerca"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "The hotel",
                                    "audio_text": "El hotel",
                                    "client_payload": {
                                        "prompt": "Translate: 'The hotel'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "El hotel",
                                        "acceptable_answers": ["el hotel", "El hotel"]
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
            "title": "Unit 5: Shopping & Clothing",
            "description": "Buy clothes, ask about sizes, and negotiate prices.",
            "color_hex": "#ff4b4b",
            "skills": [
                {
                    "order_index": 9,
                    "title": "Clothing",
                    "icon_name": "shirt",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Clothes & Colors",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these is 'the red shirt'?",
                                    "question_text": "the red shirt",
                                    "audio_text": "la camisa roja",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "la camisa roja", "image": "👕"},
                                            {"id": "opt_2", "text": "los pantalones", "image": "👖"},
                                            {"id": "opt_3", "text": "los zapatos", "image": "👟"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "la camisa roja"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "This jacket is very comfortable.",
                                    "audio_text": "Esta chaqueta es muy cómoda.",
                                    "client_payload": {
                                        "prompt_sentence": "This jacket is very comfortable.",
                                        "tokens": ["chaqueta", "Esta", "es", "muy", "cómoda", "cara", "azul"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Esta", "chaqueta", "es", "muy", "cómoda"],
                                        "acceptable_token_sequences": [
                                            ["Esta", "chaqueta", "es", "muy", "cómoda"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Clothing words",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["camisa", "zapatos", "vestido", "falda"],
                                        "right_words": ["skirt", "shirt", "shoes", "dress"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "camisa": "shirt",
                                            "zapatos": "shoes",
                                            "vestido": "dress",
                                            "falda": "skirt"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the price question:",
                                    "question_text": "¿Cuánto ___ estos zapatos?",
                                    "audio_text": "¿Cuánto cuestan estos zapatos?",
                                    "client_payload": {
                                        "sentence_parts": ["¿Cuánto ", " estos zapatos?"],
                                        "options": ["cuestan", "cuesta", "es"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "cuestan"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "A blue dress",
                                    "audio_text": "Un vestido azul",
                                    "client_payload": {
                                        "prompt": "Translate: 'A blue dress'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "Un vestido azul",
                                        "acceptable_answers": ["un vestido azul", "Un vestido azul"]
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
            "title": "Unit 6: Dining Out & Tapas",
            "description": "Experience Spanish dining, tapas culture, and celebrating with friends.",
            "color_hex": "#00cd9c",
            "skills": [
                {
                    "order_index": 10,
                    "title": "Tapas & Flavors",
                    "icon_name": "plate",
                    "total_crowns": 3,
                    "lessons": [
                        {
                            "order_index": 1,
                            "title": "Lesson 1: Spanish Tapas",
                            "xp_reward": 15,
                            "exercises": [
                                {
                                    "order_index": 1,
                                    "type": "multiple_choice",
                                    "prompt": "Which of these means 'delicious tapas'?",
                                    "question_text": "delicious tapas",
                                    "audio_text": "tapas deliciosas",
                                    "client_payload": {
                                        "options": [
                                            {"id": "opt_1", "text": "tapas deliciosas", "image": "🧆"},
                                            {"id": "opt_2", "text": "agua mineral", "image": "💧"},
                                            {"id": "opt_3", "text": "café solo", "image": "☕"}
                                        ]
                                    },
                                    "solution_payload": {
                                        "correct_option_id": "opt_1",
                                        "correct_text": "tapas deliciosas"
                                    }
                                },
                                {
                                    "order_index": 2,
                                    "type": "translate_word_bank",
                                    "prompt": "Translate this sentence:",
                                    "question_text": "Everything was delicious, thank you!",
                                    "audio_text": "Todo estuvo delicioso, gracias.",
                                    "client_payload": {
                                        "prompt_sentence": "Everything was delicious, thank you!",
                                        "tokens": ["delicioso", "Todo", "estuvo", "gracias", "muy", "malo"]
                                    },
                                    "solution_payload": {
                                        "canonical_tokens": ["Todo", "estuvo", "delicioso", "gracias"],
                                        "acceptable_token_sequences": [
                                            ["Todo", "estuvo", "delicioso", "gracias"]
                                        ]
                                    }
                                },
                                {
                                    "order_index": 3,
                                    "type": "match_pairs",
                                    "prompt": "Tap the matching pairs:",
                                    "question_text": "Tapas vocabulary",
                                    "audio_text": None,
                                    "client_payload": {
                                        "left_words": ["rico", "caliente", "frío", "cuenta"],
                                        "right_words": ["bill", "cold", "hot", "delicious"]
                                    },
                                    "solution_payload": {
                                        "pairs": {
                                            "rico": "delicious",
                                            "caliente": "hot",
                                            "frío": "cold",
                                            "cuenta": "bill"
                                        }
                                    }
                                },
                                {
                                    "order_index": 4,
                                    "type": "fill_in_the_blank",
                                    "prompt": "Complete the dinner compliment:",
                                    "question_text": "La paella está ___.",
                                    "audio_text": "La paella está buenísima.",
                                    "client_payload": {
                                        "sentence_parts": ["La paella está ", "."],
                                        "options": ["buenísima", "camarero", "mesa"]
                                    },
                                    "solution_payload": {
                                        "correct_option": "buenísima"
                                    }
                                },
                                {
                                    "order_index": 5,
                                    "type": "type_the_answer",
                                    "prompt": "Type the translation in Spanish:",
                                    "question_text": "Delicious",
                                    "audio_text": "Delicioso",
                                    "client_payload": {
                                        "prompt": "Translate: 'Delicious'",
                                        "target_language": "es"
                                    },
                                    "solution_payload": {
                                        "canonical_answer": "Delicioso",
                                        "acceptable_answers": ["delicioso", "Delicioso", "rico", "Rico"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
