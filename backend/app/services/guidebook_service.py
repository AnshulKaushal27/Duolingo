"""
Guidebook content service for Duolingo Clone units.
Provides rich key phrases, grammar explanations, and pronunciation tips for Spanish and Japanese courses.
"""

from typing import Dict, Any, Tuple

# Key format: (course_code, unit_number)
GUIDEBOOKS: Dict[Tuple[str, int], Dict[str, Any]] = {
    # ==================== SPANISH GUIDEBOOKS ====================
    ("es", 1): {
        "unit_number": 1,
        "title": "Unit 1: Get started in Spanish",
        "description": "Form basic sentences, greet people, and introduce yourself.",
        "color_hex": "#58cc02",
        "key_phrases": [
            {
                "phrase": "¡Hola! ¿Cómo estás?",
                "translation": "Hello! How are you?",
                "pronunciation": "OH-lah, KOH-moh es-TAHS"
            },
            {
                "phrase": "Buenos días, mucho gusto.",
                "translation": "Good morning, nice to meet you.",
                "pronunciation": "BWEH-nohs DEE-ahs, MOO-choh GOOS-toh"
            },
            {
                "phrase": "Yo soy de España.",
                "translation": "I am from Spain.",
                "pronunciation": "Yoh soy deh es-PAH-nyah"
            },
            {
                "phrase": "Por favor y muchas gracias.",
                "translation": "Please and thank you very much.",
                "pronunciation": "Por fah-VOR ee MOO-chahs GRAH-syahs"
            },
            {
                "phrase": "¿Hablas inglés o español?",
                "translation": "Do you speak English or Spanish?",
                "pronunciation": "AH-blahs een-GLEHS oh es-pah-NYOL"
            }
        ],
        "grammar_tips": [
            {
                "title": "Tú vs. Usted: Informal and Formal",
                "explanation": "Spanish has two ways to say 'you'. Use 'tú' when speaking with friends, family, children, or pets. Use 'usted' for strangers, elders, or professional settings to show respect.",
                "examples": [
                    {"es": "¿Cómo te llamas tú?", "en": "What is your name? (informal)"},
                    {"es": "¿Cómo se llama usted?", "en": "What is your name? (formal)"}
                ]
            },
            {
                "title": "Inverted Punctuation (¿ and ¡)",
                "explanation": "In Spanish, all questions and exclamations open with an upside-down mark (¿ or ¡) and close with the standard mark (? or !). This tells the reader the tone of the sentence immediately!",
                "examples": [
                    {"es": "¡Buenos días!", "en": "Good morning!"},
                    {"es": "¿De dónde eres?", "en": "Where are you from?"}
                ]
            },
            {
                "title": "Gender of Nouns: El and La",
                "explanation": "Every Spanish noun is either masculine or feminine. Words ending in -o are typically masculine and take 'el' (el niño, el libro). Words ending in -a are usually feminine and take 'la' (la niña, la manzana).",
                "examples": [
                    {"es": "El hombre come pan.", "en": "The man eats bread."},
                    {"es": "La mujer bebe agua.", "en": "The woman drinks water."}
                ]
            }
        ]
    },
    ("es", 2): {
        "unit_number": 2,
        "title": "Unit 2: Food & Café",
        "description": "Order food and drinks in restaurants, ask for the bill, and express preferences.",
        "color_hex": "#1cb0f6",
        "key_phrases": [
            {
                "phrase": "Una mesa para dos personas, por favor.",
                "translation": "A table for two people, please.",
                "pronunciation": "OO-nah MEH-sah PAH-rah dohs per-SOH-nahs"
            },
            {
                "phrase": "Yo quiero un café con leche y azúcar.",
                "translation": "I want a coffee with milk and sugar.",
                "pronunciation": "Yoh KYEH-roh oon kah-FEH kohn LEH-cheh"
            },
            {
                "phrase": "¿Cuánto cuesta esta comida?",
                "translation": "How much does this food cost?",
                "pronunciation": "KWAHN-toh KWEHS-tah EHS-tah koh-MEE-dah"
            },
            {
                "phrase": "La cuenta, por favor.",
                "translation": "The check / bill, please.",
                "pronunciation": "Lah KWEHN-tah, por fah-VOR"
            },
            {
                "phrase": "¿Tienes opciones vegetarianas?",
                "translation": "Do you have vegetarian options?",
                "pronunciation": "TYEH-nehs op-SYOH-nehs veh-heh-tah-RYAH-nahs"
            }
        ],
        "grammar_tips": [
            {
                "title": "Expressing Desires: Querer",
                "explanation": "To ask for things at a restaurant or shop, conjugate the verb 'querer': 'Yo quiero' (I want), 'Tú quieres' (You want), 'Nosotros queremos' (We want). For extra politeness, you can say 'Me gustaría' (I would like).",
                "examples": [
                    {"es": "Yo quiero una ensalada fresca.", "en": "I want a fresh salad."},
                    {"es": "¿Quieres un vaso de agua?", "en": "Do you want a glass of water?"}
                ]
            },
            {
                "title": "Adjective Agreement and Word Order",
                "explanation": "In Spanish, adjectives usually come AFTER the noun they describe, and match gender and number: 'el café caliente' (the hot coffee), 'las manzanas rojas' (the red apples).",
                "examples": [
                    {"es": "Un restaurante elegante", "en": "An elegant restaurant"},
                    {"es": "Dos pizzas deliciosas", "en": "Two delicious pizzas"}
                ]
            }
        ]
    },
    ("es", 3): {
        "unit_number": 3,
        "title": "Unit 3: Everyday Routines",
        "description": "Talk about daily habits, work, school, and leisure activities.",
        "color_hex": "#ce82ff",
        "key_phrases": [
            {
                "phrase": "¿A qué hora te levantas por la mañana?",
                "translation": "What time do you get up in the morning?",
                "pronunciation": "Ah keh OH-rah teh leh-VAHN-tahs"
            },
            {
                "phrase": "Yo trabajo en la oficina de lunes a viernes.",
                "translation": "I work in the office from Monday to Friday.",
                "pronunciation": "Yoh trah-BAH-hoh ehn lah oh-fee-SEE-nah"
            },
            {
                "phrase": "Ella siempre estudia español por la noche.",
                "translation": "She always studies Spanish at night.",
                "pronunciation": "EH-yah SYEHM-preh ehs-TOO-dyah"
            },
            {
                "phrase": "Los fines de semana salgo con amigos.",
                "translation": "On weekends I go out with friends.",
                "pronunciation": "Lohs FEE-nehs deh seh-MAH-nah"
            }
        ],
        "grammar_tips": [
            {
                "title": "Regular -AR Verbs in the Present Tense",
                "explanation": "Drop the -ar and add endings: Yo habl-o, Tú habl-as, Él/Ella habl-a, Nosotros habl-amos, Ellos habl-an.",
                "examples": [
                    {"es": "Yo estudio todos los días.", "en": "I study every day."},
                    {"es": "Ellos trabajan mucho.", "en": "They work hard."}
                ]
            },
            {
                "title": "Frequency Words",
                "explanation": "Place words like 'siempre' (always), 'a veces' (sometimes), and 'nunca' (never) to describe how often you do an activity.",
                "examples": [
                    {"es": "Nunca llego tarde a clase.", "en": "I never arrive late to class."},
                    {"es": "A veces cocino en casa.", "en": "Sometimes I cook at home."}
                ]
            }
        ]
    },
    ("es", 4): {
        "unit_number": 4,
        "title": "Unit 4: Travel & Getting Around",
        "description": "Ask for directions, navigate airports, hotels, and train stations.",
        "color_hex": "#ff9600",
        "key_phrases": [
            {
                "phrase": "¿Dónde está la estación de tren?",
                "translation": "Where is the train station?",
                "pronunciation": "DOHN-deh ehs-TAH lah ehs-tah-SYOHN deh trehn"
            },
            {
                "phrase": "Tengo una reserva en este hotel.",
                "translation": "I have a reservation at this hotel.",
                "pronunciation": "TEHN-goh OO-nah reh-SEHR-bah ehn EHS-teh oh-TEHL"
            },
            {
                "phrase": "Gire a la derecha en la próxima esquina.",
                "translation": "Turn right at the next corner.",
                "pronunciation": "HEE-reh ah lah deh-REH-chah"
            },
            {
                "phrase": "¿Cuánto cuesta el boleto a Madrid?",
                "translation": "How much is the ticket to Madrid?",
                "pronunciation": "KWAHN-toh KWEHS-tah ehl boh-LEH-toh"
            }
        ],
        "grammar_tips": [
            {
                "title": "Ser vs. Estar: Location and States",
                "explanation": "Use 'estar' to describe where things are located or temporary conditions (¿Dónde está el hotel? El café está caliente). Use 'ser' for identity, origin, and permanent characteristics.",
                "examples": [
                    {"es": "El museo está cerca.", "en": "The museum is nearby."},
                    {"es": "Madrid es una ciudad hermosa.", "en": "Madrid is a beautiful city."}
                ]
            }
        ]
    },
    ("es", 5): {
        "unit_number": 5,
        "title": "Unit 5: Shopping & Clothing",
        "description": "Shop for clothes, ask about sizes, and inquire about discounts.",
        "color_hex": "#ff4b4b",
        "key_phrases": [
            {
                "phrase": "¿Tiene esta camisa en otra talla?",
                "translation": "Do you have this shirt in another size?",
                "pronunciation": "TYEH-neh EHS-tah kah-MEE-sah ehn OH-trah TAH-yah"
            },
            {
                "phrase": "Me gusta este vestido rojo.",
                "translation": "I like this red dress.",
                "pronunciation": "Meh GOOS-tah EHS-teh behs-TEE-doh ROH-hoh"
            },
            {
                "phrase": "¿Aceptan tarjeta de crédito?",
                "translation": "Do you accept credit cards?",
                "pronunciation": "Ah-SEHP-tahn tar-HEH-tah deh KREH-dee-toh"
            }
        ],
        "grammar_tips": [
            {
                "title": "Demonstrative Pronouns: Este, Ese, Aquel",
                "explanation": "Use 'este' for items close to you (this), 'ese' for items close to the listener (that), and 'aquel' for items far from both.",
                "examples": [
                    {"es": "Este abrigo es muy cómodo.", "en": "This coat is very comfortable."},
                    {"es": "Esa falda es elegante.", "en": "That skirt is elegant."}
                ]
            }
        ]
    },
    ("es", 6): {
        "unit_number": 6,
        "title": "Unit 6: Dining Out & Tapas",
        "description": "Reserve tables, ask recommendations, and sample traditional dishes.",
        "color_hex": "#00cd9c",
        "key_phrases": [
            {
                "phrase": "¿Qué nos recomienda para cenar?",
                "translation": "What do you recommend for dinner?",
                "pronunciation": "Keh nohs reh-koh-MYEHN-dah PAH-rah seh-NAR"
            },
            {
                "phrase": "Queremos unas tapas variadas y agua.",
                "translation": "We want assorted tapas and water.",
                "pronunciation": "Keh-REH-mohs OO-nahs TAH-pahs bah-RYAH-dahs"
            },
            {
                "phrase": "¡Todo estuvo riquísimo, gracias!",
                "translation": "Everything was delicious, thank you!",
                "pronunciation": "TOH-doh ehs-TOO-boh ree-KEE-see-moh"
            }
        ],
        "grammar_tips": [
            {
                "title": "Superlative Suffix -ísimo",
                "explanation": "Attach -ísimo/-ísima to adjectives to mean 'extremely' or 'super' (rico -> riquísimo, bueno -> buenísimo, grande -> grandísimo).",
                "examples": [
                    {"es": "La sopa está calientísima.", "en": "The soup is extremely hot."},
                    {"es": "El postre es riquísimo.", "en": "The dessert is delicious."}
                ]
            }
        ]
    },

    # ==================== JAPANESE GUIDEBOOKS ====================
    ("ja", 1): {
        "unit_number": 1,
        "title": "Unit 1: Hiragana Basics & Greetings",
        "description": "Master essential Japanese vowel sounds, daily greetings, and polite manners.",
        "color_hex": "#ff4b4b",
        "key_phrases": [
            {
                "phrase": "おはようございます",
                "translation": "Good morning (polite)",
                "pronunciation": "Ohayō gozaimasu"
            },
            {
                "phrase": "こんにちは",
                "translation": "Hello / Good afternoon",
                "pronunciation": "Konnichiwa"
            },
            {
                "phrase": "ありがとうございます",
                "translation": "Thank you very much (polite)",
                "pronunciation": "Arigatō gozaimasu"
            },
            {
                "phrase": "すみません",
                "translation": "Excuse me / I'm sorry",
                "pronunciation": "Sumimasen"
            },
            {
                "phrase": "はじめまして、よろしくおねがいします",
                "translation": "Nice to meet you, please treat me well.",
                "pronunciation": "Hajimemashite, yoroshiku onegaishimasu"
            }
        ],
        "grammar_tips": [
            {
                "title": "The Japanese Sound System & Hiragana",
                "explanation": "Hiragana (ひらがな) is the phonetic foundation of Japanese. Every character represents one syllable. The 5 pure vowels are: あ (a), い (i), う (u), え (e), お (o). Pronounce vowels clearly and evenly!",
                "examples": [
                    {"ja": "はい / いいえ", "en": "Yes / No"},
                    {"ja": "ありがとう", "en": "Thank you"}
                ]
            },
            {
                "title": "The Magic Word: すみません (Sumimasen)",
                "explanation": "Sumimasen is one of the most versatile words in Japanese. You can use it to say 'Excuse me' to catch a waiter's attention, 'I'm sorry' for minor mishaps, or 'Thank you' when someone goes out of their way to help you.",
                "examples": [
                    {"ja": "すみません、おちゃをください。", "en": "Excuse me, green tea please."},
                    {"ja": "すみません、えきはどこですか？", "en": "Excuse me, where is the station?"}
                ]
            },
            {
                "title": "The Topic Marker Particle: は (Wa)",
                "explanation": "The particle は is written with the hiragana 'ha' (は), but pronounced as 'wa'. It marks the topic of the sentence: 'As for X...'.",
                "examples": [
                    {"ja": "わたしは がくせいです。", "en": "As for me, I am a student."}
                ]
            }
        ]
    },
    ("ja", 2): {
        "unit_number": 2,
        "title": "Unit 2: Food & Ordering at a Restaurant",
        "description": "Order dishes, ask for drinks, and say polite phrases before and after meals.",
        "color_hex": "#ff9600",
        "key_phrases": [
            {
                "phrase": "おちゃをください",
                "translation": "Green tea, please.",
                "pronunciation": "Ocha o kudasai"
            },
            {
                "phrase": "これを おねがいします",
                "translation": "This one, please.",
                "pronunciation": "Kore o onegaishimasu"
            },
            {
                "phrase": "いただきます",
                "translation": "Bon appétit / Let's eat (before meal)",
                "pronunciation": "Itadakimasu"
            },
            {
                "phrase": "ごちそうさまでした",
                "translation": "Thank you for the meal (after eating)",
                "pronunciation": "Gochisōsama deshita"
            },
            {
                "phrase": "すしが とても おいしいです",
                "translation": "The sushi is very delicious.",
                "pronunciation": "Sushi ga totemo oishii desu"
            }
        ],
        "grammar_tips": [
            {
                "title": "Asking for Things: を ください (o kudasai)",
                "explanation": "To politely ask for an item in Japanese, say the item name followed by the object particle を (pronounced 'o') and ください (kudasai).",
                "examples": [
                    {"ja": "みずを ください。", "en": "Water, please."},
                    {"ja": "メニューを ください。", "en": "The menu, please."}
                ]
            },
            {
                "title": "Demonstratives: これ (Kore), それ (Sore), あれ (Are)",
                "explanation": "Use これ (kore) for things near you, それ (sore) for things near the listener, and あれ (are) for things far from both of you.",
                "examples": [
                    {"ja": "これは なんですか？", "en": "What is this?"},
                    {"ja": "あれを ください。", "en": "Please give me that one over there."}
                ]
            }
        ]
    },
    ("ja", 3): {
        "unit_number": 3,
        "title": "Unit 3: People, Occupations & Nationalities",
        "description": "Introduce yourself, talk about your nationality, profession, and family.",
        "color_hex": "#58cc02",
        "key_phrases": [
            {
                "phrase": "わたしは アメリカじんです",
                "translation": "I am American.",
                "pronunciation": "Watashi wa Amerikajin desu"
            },
            {
                "phrase": "たなかさんは せんせいです",
                "translation": "Mr./Ms. Tanaka is a teacher.",
                "pronunciation": "Tanaka-san wa sensei desu"
            },
            {
                "phrase": "にほんごを はなしますか？",
                "translation": "Do you speak Japanese?",
                "pronunciation": "Nihongo o hanashimasu ka?"
            },
            {
                "phrase": "はい、すこし はなします",
                "translation": "Yes, I speak a little.",
                "pronunciation": "Hai, sukoshi hanashimasu"
            }
        ],
        "grammar_tips": [
            {
                "title": "Nationalities: Country + じん (jin)",
                "explanation": "To state nationality in Japanese, take any country name and append じん (person/citizen): にほん (Japan) -> にほんじん (Japanese person), アメリカ (America) -> アメリカじん (American).",
                "examples": [
                    {"ja": "かのじょは にほんじんです。", "en": "She is Japanese."},
                    {"ja": "わたしは イギリスじんです。", "en": "I am British."}
                ]
            },
            {
                "title": "Polite Suffix: さん (San)",
                "explanation": "Always attach さん (san) to other people's names as a mark of respect (e.g. たなかさん, ケンさん). Never use さん on your own name!",
                "examples": [
                    {"ja": "さくらさんは がくせいです。", "en": "Sakura is a student."}
                ]
            }
        ]
    },
    ("ja", 4): {
        "unit_number": 4,
        "title": "Unit 4: Numbers, Time & Shopping",
        "description": "Count from 1 to 10, ask prices in yen, tell the time, and pay for purchases.",
        "color_hex": "#1cb0f6",
        "key_phrases": [
            {
                "phrase": "これは いくらですか？",
                "translation": "How much is this?",
                "pronunciation": "Kore wa ikura desu ka?"
            },
            {
                "phrase": "ごひゃくえんです",
                "translation": "It is 500 yen.",
                "pronunciation": "Gohyaku-en desu"
            },
            {
                "phrase": "いま なんじですか？",
                "translation": "What time is it now?",
                "pronunciation": "Ima nanji desu ka?"
            },
            {
                "phrase": "さんじはんです",
                "translation": "It is 3:30 (half past three).",
                "pronunciation": "Sanji han desu"
            }
        ],
        "grammar_tips": [
            {
                "title": "Counting in Japanese (1 to 10)",
                "explanation": "いち (1), に (2), さん (3), よん/し (4), ご (5), ろく (6), なな/しち (7), はち (8), きゅう/く (9), じゅう (10). For currency, add えん (yen): ひゃくえん (100 yen), せんえん (1,000 yen).",
                "examples": [
                    {"ja": "せんえん です。", "en": "It is 1,000 yen."},
                    {"ja": "りんごを みっつ ください。", "en": "Three apples, please."}
                ]
            },
            {
                "title": "Telling Time: Number + じ (Ji)",
                "explanation": "Attach じ (o'clock) to numbers: いちじ (1:00), にじ (2:00), さんじ (3:00). Add はん (han) for 'half past' (e.g. よじはん = 4:30).",
                "examples": [
                    {"ja": "いま ろくじです。", "en": "It is 6:00 now."}
                ]
            }
        ]
    },
    ("ja", 5): {
        "unit_number": 5,
        "title": "Unit 5: Getting Around & Places",
        "description": "Navigate train stations, ask where buildings are, and understand directions.",
        "color_hex": "#ce82ff",
        "key_phrases": [
            {
                "phrase": "えきは どこですか？",
                "translation": "Where is the station?",
                "pronunciation": "Eki wa doko desu ka?"
            },
            {
                "phrase": "トイレは あそこです",
                "translation": "The restroom is over there.",
                "pronunciation": "Toire wa asoko desu"
            },
            {
                "phrase": "とうきょうに いきます",
                "translation": "I am going to Tokyo.",
                "pronunciation": "Tōkyō ni ikimasu"
            },
            {
                "phrase": "でんしゃで いきます",
                "translation": "I am going by train.",
                "pronunciation": "Densha de ikimasu"
            }
        ],
        "grammar_tips": [
            {
                "title": "Direction Particle: に (Ni) and Destination",
                "explanation": "Use に (ni) to indicate the destination or direction of travel with motion verbs like いきます (to go), きます (to come), and かえります (to return).",
                "examples": [
                    {"ja": "ホテルに いきます。", "en": "I go to the hotel."},
                    {"ja": "うちに かえります。", "en": "I return home."}
                ]
            },
            {
                "title": "Means of Transport: で (De)",
                "explanation": "Use で (de) to indicate the method or tool used: でんしゃで (by train), バスで (by bus), タクシーで (by taxi).",
                "examples": [
                    {"ja": "しんかんせんで いきます。", "en": "I go by bullet train."}
                ]
            }
        ]
    },
    ("ja", 6): {
        "unit_number": 6,
        "title": "Unit 6: Daily Life & Hobbies",
        "description": "Describe daily routines, entertainment, reading, anime, and weekend plans.",
        "color_hex": "#00cd9c",
        "key_phrases": [
            {
                "phrase": "まいあさ しちじに おきます",
                "translation": "I wake up at 7:00 every morning.",
                "pronunciation": "Maiasa shichiji ni okimasu"
            },
            {
                "phrase": "アニメを みます",
                "translation": "I watch anime.",
                "pronunciation": "Anime o mimasu"
            },
            {
                "phrase": "にほんごの ほんを よみます",
                "translation": "I read Japanese books.",
                "pronunciation": "Nihongo no hon o yomimasu"
            },
            {
                "phrase": "おんがくを きくのが すきです",
                "translation": "I like listening to music.",
                "pronunciation": "Ongaku o kiku no ga suki desu"
            }
        ],
        "grammar_tips": [
            {
                "title": "The Present Polite Verb Form: ます (Masu)",
                "explanation": "Japanese verbs in polite speech end in ます (masu) in affirmative, and ません (masen) in negative. Example: たべます (eat) / たべません (do not eat).",
                "examples": [
                    {"ja": "まいあさ コーヒーを のみます。", "en": "I drink coffee every morning."},
                    {"ja": "テレビを みません。", "en": "I do not watch TV."}
                ]
            },
            {
                "title": "Expressing Preferences: が すきです (ga suki desu)",
                "explanation": "In Japanese, to say you like something, mark the object with particle が (ga) followed by すきです (suki desu).",
                "examples": [
                    {"ja": "すしが すきです。", "en": "I like sushi."},
                    {"ja": "ゲームが だいすきです。", "en": "I love video games."}
                ]
            }
        ]
    }
}

def get_unit_guidebook(unit_number: int, course_code: str = "es") -> Dict[str, Any]:
    key = (course_code.lower(), unit_number)
    if key in GUIDEBOOKS:
        return GUIDEBOOKS[key]

    # Fallback to course default
    if course_code.lower() == "ja":
        return {
            "unit_number": unit_number,
            "title": f"Unit {unit_number}: Japanese Practice",
            "description": "Essential Japanese phrases, kana, and polite grammar points.",
            "color_hex": "#ff4b4b",
            "key_phrases": [
                {"phrase": "こんにちは", "translation": "Hello", "pronunciation": "Konnichiwa"},
                {"phrase": "ありがとうございます", "translation": "Thank you very much", "pronunciation": "Arigatō gozaimasu"}
            ],
            "grammar_tips": [
                {
                    "title": "Consistency in Japanese",
                    "explanation": "Daily repetition of Hiragana and basic particles is the secret to Japanese fluency.",
                    "examples": [{"ja": "にほんごは たのしいです。", "en": "Japanese is fun."}]
                }
            ]
        }

    return {
        "unit_number": unit_number,
        "title": f"Unit {unit_number} Guidebook",
        "description": "Essential phrases and grammar tips for this unit.",
        "color_hex": "#58cc02",
        "key_phrases": [
            {"phrase": "¡Hola!", "translation": "Hello!", "pronunciation": "OH-lah"},
            {"phrase": "Mucho gusto", "translation": "Nice to meet you", "pronunciation": "MOO-choh GOOS-toh"}
        ],
        "grammar_tips": [
            {
                "title": "Practice Makes Perfect",
                "explanation": "Complete lessons daily to reinforce your vocabulary and speech fluency.",
                "examples": [{"es": "El español es divertido.", "en": "Spanish is fun."}]
            }
        ]
    }
