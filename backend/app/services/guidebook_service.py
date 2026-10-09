"""
Guidebook content service for Duolingo Clone units.
Provides rich key phrases, grammar explanations, and pronunciation tips.
"""

from typing import Dict, Any, List

UNIT_GUIDEBOOKS: Dict[int, Dict[str, Any]] = {
    1: {
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
    2: {
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
    3: {
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
    }
}

def get_unit_guidebook(unit_number: int) -> Dict[str, Any]:
    if unit_number in UNIT_GUIDEBOOKS:
        return UNIT_GUIDEBOOKS[unit_number]
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
                "examples": [
                    {"es": "El español es divertido.", "en": "Spanish is fun."}
                ]
            }
        ]
    }
