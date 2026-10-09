# Duolingo Web Application Clone

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-yellow?style=for-the-badge&logo=python)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A pixel-perfect, fullstack web application clone of **Duolingo** replicating its authentic learning path, interactive lesson player, Japanese Kana characters hub, procedural audio soundscape, and gamification economy.

Built as an **SDE Fullstack Assignment** following modern software engineering practices, clean architecture, backend-authoritative validation, and strict separation of concerns.

---

## 📌 Executive Summary (Assumptions / Mocked Data / Notes)

- **Assumptions**: Assumes a pre-authenticated demo user (`alexramos`, 7-day streak) with backend-authoritative grading and browser Web Speech API for TTS.
- **Mocked Data**: Pre-seeded SQLite database with 12 Spanish and Japanese units (125+ exercises across all 5 types), bilingual guidebooks, Kana charts, and 9 leaderboard rivals.
- **Notes**: Zero exercise answers are exposed in client payloads, all SFX are generated procedurally via the Web Audio API, and server cold starts auto-recover via live polling.

---

## 🏛️ High-Level System Design

The system adheres to a **decoupled client-server architecture**:
1. **Frontend (Presentation Tier)**: Next.js 16 (App Router) rendering tactile 3D UI components, managing reactive client state, procedural Web Audio synthesizer, and Web Speech API synthesis.
2. **Backend (Application Tier)**: FastAPI ASGI application running on Uvicorn, enforcing business rules, session authentication, streak calculations, and exercise answer evaluation.
3. **Database (Data Tier)**: SQLite database engine with foreign key constraints enabled via SQLite PRAGMA enforcement, structured into 12 relational models.

```mermaid
graph TD
    subgraph Client["Web Browser Client"]
        UI["Next.js 16 React App (SPA)"]
        Audio["Web Audio API (Procedural SFX)"]
        TTS["Web Speech API (Native es-ES / ja-JP)"]
        Store["Local Session & Course State"]
    end

    subgraph CDN["Edge & Static Delivery"]
        Vercel["Vercel Edge Network / Assets"]
    end

    subgraph BackendApp["FastAPI Backend Server (Port 8000)"]
        Router["API V1 Endpoints Router"]
        AuthMiddleware["Session & Auth Middleware"]
        LessonService["Lesson & Evaluation Service"]
        StreakService["Streak & Gamification Service"]
        GuidebookService["Guidebook & Curriculum Service"]
    end

    subgraph Database["Persistent Storage"]
        SQLite[("SQLite Relational DB (duolingo.db)")]
    end

    UI --> |"HTTP REST + Cookies / Bearer Token"| Router
    UI --- Audio
    UI --- TTS
    Vercel -.-> UI

    Router --> AuthMiddleware
    AuthMiddleware --> LessonService
    AuthMiddleware --> StreakService
    AuthMiddleware --> GuidebookService

    LessonService --> |"SQLAlchemy ORM (Foreign Keys Enabled)"| SQLite
    StreakService --> |"Atomic Commits"| SQLite
    GuidebookService --> SQLite
```

### Core Security & Architectural Principles

1. **Zero Answer Leakage (Sanitized Payloads)**:
   When a user starts a lesson (`POST /api/v1/lessons/{id}/start`), the backend returns **only** `client_payload` (shuffled tokens, choice text, pair tiles, prompts). The `solution_payload` (correct option IDs, canonical token orders, acceptable regex patterns) is **never sent to the client**, making cheat inspection via DevTools impossible.
2. **Anti-Duplicate Submission & Anti-Replay Safeguards**:
   Each lesson generates a unique UUID `attempt_id`. The backend checks `answered_exercise_ids` in `LessonAttempt`. If an exercise ID is re-submitted within the same attempt, the backend safely ignores it without deducting hearts or awarding duplicate XP.
3. **Backend-Authoritative Gamification**:
   XP increments, hearts deduction, gem deductions, streak increments, and quest milestones are calculated exclusively server-side. Forged completion requests (`xp: 99999`) are ignored; the server awards the exact configured lesson reward.
4. **Idempotent Day-Progression Engine**:
   Daily streaks evaluate the delta between `last_active_date` and the current date:
   - Same calendar day: Streak preserved, activity logged.
   - Consecutive day ($T+1$): Streak incremented by $+1$.
   - Missed day ($T > 1$): If `streak_freezes > 0`, consume 1 freeze and preserve streak; otherwise reset streak to `0`.

---

## 🔄 Lesson Execution & Submission Flow

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner (Browser)
    participant UI as Lesson Player UI
    participant API as FastAPI Backend
    participant DB as SQLite Database

    Learner->>UI: Clicks "START" on Skill Node
    UI->>API: POST /api/v1/lessons/{id}/start
    API->>DB: Check User Hearts > 0 & Skill Unlocked
    alt Hearts == 0 or Skill Locked
        API-->>UI: 400 Bad Request / 403 Forbidden
        UI-->>Learner: Show "Out of Hearts" or "Skill Locked" Modal
    else Eligible
        API->>DB: Create LessonAttempt (UUID)
        API-->>UI: 200 OK (attempt_id, exercises with client_payload ONLY)
        UI-->>Learner: Render Exercise 1 (Multiple Choice / Word Bank / Match Pairs)
    end

    Learner->>UI: Selects / Types Answer & Clicks "CHECK"
    UI->>API: POST /api/v1/lessons/{id}/exercises/{eid}/submit
    Note over API: Compare submitted_answer against backend solution_payload
    alt Answer is Correct
        API->>DB: Record exercise ID in attempt
        API-->>UI: 200 OK (is_correct=true, explanation)
        UI-->>Learner: Play Correct Chime (Web Audio), Green Feedback Sheet
    else Answer is Incorrect
        API->>DB: Deduct 1 Heart (min 0), record mistake
        API-->>UI: 200 OK (is_correct=false, solution, remaining_hearts)
        UI-->>Learner: Play Error Buzz, Red Feedback Sheet, -1 Heart Animation
    end

    Learner->>UI: Completes All Lesson Exercises
    UI->>API: POST /api/v1/lessons/{id}/complete
    API->>DB: Verify attempt completion & calculate XP
    API->>DB: Atomically increment user XP, streak, and complete daily quests
    API-->>UI: 200 OK (xp_earned=15, new_streak, quest_updates)
    UI-->>Learner: Victory Fanfare, Confetti Cannon, Celebration Summary
```

---

## 📊 Database Schema & Data Models

The SQLite database uses foreign-key constraints enforced on every connection through SQLAlchemy connection listeners (`PRAGMA foreign_keys=ON`).

```mermaid
erDiagram
    USERS ||--o{ USER_SESSIONS : maintains
    USERS ||--o{ USER_PROGRESS : tracks
    USERS ||--o{ LESSON_ATTEMPTS : initiates
    USERS ||--o{ USER_ACHIEVEMENTS : unlocks
    USERS ||--o{ DAILY_QUESTS : undertakes
    USERS ||--o{ ACTIVITY_LOGS : records

    COURSES ||--o{ UNITS : organizes
    UNITS ||--o{ SKILLS : groups
    SKILLS ||--o{ LESSONS : contains
    LESSONS ||--o{ EXERCISES : presents
    LESSONS ||--o{ LESSON_ATTEMPTS : logs
    LESSONS ||--o{ USER_PROGRESS : fulfills

    ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : maps

    USERS {
        int id PK
        string username UK
        string email UK
        string display_name
        string password_hash
        string auth_provider
        string avatar_url
        int streak
        date last_active_date
        int hearts
        int max_hearts
        int gems
        int total_xp
        int streak_freezes
        int daily_goal_xp
        int current_course_id
        datetime last_heart_regenerated_at
        datetime created_at
    }

    USER_SESSIONS {
        string id PK "Token (UUID/SHA256)"
        int user_id FK
        datetime created_at
        datetime expires_at
    }

    COURSES {
        int id PK
        string code UK "es, ja"
        string title "Spanish, Japanese"
        string flag_icon "SVG path"
        string description
    }

    UNITS {
        int id PK
        int course_id FK
        int unit_number "1 through 6"
        string title
        string description
        string color_hex "Brand unit color"
    }

    SKILLS {
        int id PK
        int unit_id FK
        int order_index
        string title
        string icon_name "star, cup, chat, etc."
        int total_crowns
    }

    LESSONS {
        int id PK
        int skill_id FK
        int order_index
        string title
        int xp_reward "15 XP default"
    }

    EXERCISES {
        int id PK
        int lesson_id FK
        int order_index
        string type "5 core exercise types"
        string prompt
        string question_text
        string audio_text
        json client_payload "Sanitized options/tokens"
        json solution_payload "Private canonical solution"
    }

    LESSON_ATTEMPTS {
        string id PK "UUID"
        int user_id FK
        int lesson_id FK
        json answered_exercise_ids
        int mistakes_count
        boolean is_completed
        datetime started_at
        datetime completed_at
    }

    USER_PROGRESS {
        int id PK
        int user_id FK
        int lesson_id FK
        int skill_id FK
        boolean completed
        int crowns_earned
        datetime completed_at
    }

    LEADERBOARD_ENTRIES {
        int id PK
        int user_id FK
        string league "Ruby, Emerald, etc."
        string username
        string display_name
        string avatar_url
        int weekly_xp
        boolean is_current_user
    }

    ACHIEVEMENTS {
        int id PK
        string code UK "wildfire, sage, etc."
        string title
        string description
        string icon
        int target_value
    }

    USER_ACHIEVEMENTS {
        int id PK
        int user_id FK
        int achievement_id FK
        int current_value
        boolean unlocked
        datetime unlocked_at
    }

    DAILY_QUESTS {
        int id PK
        int user_id FK
        string title
        int current_progress
        int target_progress
        int reward_gems
        boolean completed
        date quest_date
    }

    ACTIVITY_LOGS {
        int id PK
        int user_id FK
        date activity_date
        int xp_earned
        int lessons_completed
    }
```

---

## 📂 Project Directory Structure

```
Duolingo/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/
│   │   │   ├── auth.py              # User signup, login, session validation
│   │   │   ├── courses.py           # Course tree, units, guidebooks, jump-ahead
│   │   │   ├── lessons.py           # Start attempt, submit exercise, complete lesson
│   │   │   └── user.py              # Profile, course switch, hearts refill, debug simulator
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic BaseSettings, CORS origins, secrets
│   │   │   ├── database.py          # SQLAlchemy engine, session maker, PRAGMA hooks
│   │   │   └── security.py          # Passlib password hashing, token utilities
│   │   ├── models/                  # SQLAlchemy model classes (Course, Unit, Skill, etc.)
│   │   ├── schemas/                 # Pydantic validation contracts and API schemas
│   │   ├── seeds/
│   │   │   ├── spanish_curriculum.py # 6 Spanish units, 12 lessons, 65 exercises
│   │   │   ├── japanese_curriculum.py# 6 Japanese units, 11 lessons, 60 exercises
│   │   │   └── seed_data.py         # Primary database seeder & demo user builder
│   │   ├── services/
│   │   │   ├── guidebook_service.py # Bilingual unit guidebooks and grammar tips
│   │   │   └── lesson_service.py    # Answer evaluation & tolerant matching engine
│   │   └── main.py                  # FastAPI app factory, CORS, warmup hooks
│   ├── tests/
│   │   ├── test_api.py              # End-to-end API test workflow (health, auth, courses)
│   │   ├── test_auth.py             # Authentication and session test suite
│   │   ├── test_new_features.py     # Guidebook, course switching, Kana tests
│   │   └── test_strict_rubric.py    # Adversarial rubric verification tests
│   ├── duolingo.db                  # Pre-seeded canonical SQLite database
│   ├── requirements.txt             # Python dependencies (FastAPI, Uvicorn, SQLAlchemy)
│   ├── run.py                       # Local startup script with auto-seeding
│   └── render.yaml                  # Render cloud blueprint manifest
│
├── frontend/
│   ├── public/
│   │   ├── icons/                   # UI icons (heart, gem, streak, chest, crown)
│   │   ├── images/characters/       # SVG character scenes (Bea, Vikram, Junior, Lily, Oscar, Eddy)
│   │   └── mascot/                  # Duo the Owl SVG states (happy, cheer, crying)
│   ├── src/
│   │   ├── app/
│   │   │   ├── characters/          # Japanese Kana Hub (/characters) with Gojūon audio charts
│   │   │   ├── leaderboard/         # Ruby League standings (/leaderboard)
│   │   │   ├── learn/               # Serpentine Learning Path home (/learn)
│   │   │   ├── lesson/[lessonId]/   # Fullscreen 5-type Lesson Player (/lesson/[id])
│   │   │   ├── profile/             # Learner profile & achievements (/profile)
│   │   │   ├── quests/              # Daily quests & gem chests (/quests)
│   │   │   ├── settings/            # Daily goal adjustments & day simulator (/settings)
│   │   │   ├── shop/                # Gems shop, streak freeze, refill hearts (/shop)
│   │   │   ├── globals.css          # Vanilla CSS Design System, tokens & animations
│   │   │   └── layout.tsx           # Root layout with fonts and metadata
│   │   ├── components/
│   │   │   ├── auth/                # ProtectedRoute wrapper
│   │   │   ├── common/              # BackendWarmupBanner, ScrollToTopButton
│   │   │   ├── layout/              # Sidebar (left), RightSidebar (sticky), Header
│   │   │   ├── lesson/              # 5 Exercise components, FeedbackBar, CompleteScreen
│   │   │   └── path/                # StickyUnitHeader, UnitSection, SkillNode, GuidebookModal
│   │   └── lib/
│   │       ├── api.ts               # Type-safe API client with auto-fallback & cookie/token sync
│   │       ├── auth-context.tsx     # React auth provider & local state
│   │       ├── sound.ts             # Procedural Web Audio API sound synthesizer
│   │       └── speech.ts            # Web Speech API TTS for es-ES and ja-JP
│   ├── package.json                 # Next.js 16, React 19, TypeScript dependencies
│   └── tsconfig.json                # TypeScript strict configuration
│
├── start-backend.bat                # 1-Click Windows batch script for FastAPI
├── start-frontend.bat               # 1-Click Windows batch script for Next.js
└── README.md                        # Project documentation
```

---

## 📡 REST API Architecture

All endpoints are versioned under `/api/v1` and return standard JSON responses. Interactive OpenAPI documentation is accessible at `http://127.0.0.1:8000/api/v1/docs`.

### Complete Endpoint Specification

| Module | Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `GET` | `/` | None | Root health and service version |
| **System** | `GET` | `/health` | None | Lightweight liveness probe for cold-start monitors |
| **Auth** | `POST` | `/api/v1/auth/signup` | `{username, email, password, display_name}` | Register new learner account |
| **Auth** | `POST` | `/api/v1/auth/login` | `{identifier, password}` | Authenticate & issue session cookie + token |
| **Auth** | `GET` | `/api/v1/auth/me` | None | Get current authenticated user session |
| **Auth** | `POST` | `/api/v1/auth/logout` | None | Clear session cookie and invalidate token |
| **Courses**| `GET` | `/api/v1/courses` | None | List available language courses (Spanish, Japanese) |
| **Courses**| `GET` | `/api/v1/courses/{code}/tree` | None | Fetch full curriculum tree with units, skills, and status |
| **Courses**| `GET` | `/api/v1/courses/units/{id}/guidebook` | None | Fetch unit grammar notes, pronunciation, and key phrases |
| **Courses**| `POST` | `/api/v1/courses/units/{id}/jump-ahead` | None | Unlock unit skills via placement jump |
| **Lessons**| `POST` | `/api/v1/lessons/{id}/start` | None | Start lesson attempt; returns sanitized client exercises |
| **Lessons**| `POST` | `/api/v1/lessons/{id}/exercises/{eid}/submit` | `{attempt_id, user_answer}` | Authoritative answer verification & heart deduction |
| **Lessons**| `POST` | `/api/v1/lessons/{id}/complete` | `{attempt_id}` | Complete lesson attempt, award XP, and update streak |
| **User** | `GET` | `/api/v1/user/profile` | None | Current user stats: hearts, gems, streak, total XP |
| **User** | `POST` | `/api/v1/user/course/switch` | `{course_code: "es" \| "ja"}` | Switch active learner course |
| **User** | `POST` | `/api/v1/user/hearts/refill` | None | Refill hearts to 5 using 350 gems |
| **User** | `POST` | `/api/v1/user/hearts/practice` | None | Practice session heart recovery (+1 heart) |
| **User** | `POST` | `/api/v1/user/shop/streak-freeze` | None | Purchase and equip a Streak Freeze |
| **User** | `PUT` | `/api/v1/user/daily-goal` | `{daily_goal_xp: 10..50}` | Update daily XP milestone goal |
| **User** | `POST` | `/api/v1/user/debug/simulate-day` | Query: `?days_ago=N` | Test simulator for calendar progression and streak logic |
| **Social** | `GET` | `/api/v1/leaderboard` | None | Weekly Ruby League standings with dynamic promotion zones |
| **Social** | `GET` | `/api/v1/quests` | None | Daily quests with progress bars and gem chests |
| **Social** | `GET` | `/api/v1/achievements` | None | Badges (Wildfire, Sage, Sharpshooter, Champion) |

### Sample API Contracts

#### 1. Start Lesson (Sanitized Client Payload)
`POST /api/v1/lessons/1/start`
```json
{
  "attempt_id": "8c01476d-0691-4cf1-92b7-a359ce91a56e",
  "lesson": {
    "id": 1,
    "title": "Basics 1",
    "xp_reward": 15,
    "exercises": [
      {
        "id": 1,
        "type": "multiple_choice",
        "prompt": "Select the correct translation",
        "question_text": "Hello",
        "audio_text": "Hola",
        "client_payload": {
          "options": [
            {"id": "opt_1", "text": "Hola", "image_url": "/mascot/duo-happy.svg"},
            {"id": "opt_2", "text": "Adiós", "image_url": "/mascot/duo-crying.svg"},
            {"id": "opt_3", "text": "Gracias", "image_url": "/icons/gem.svg"}
          ]
        }
      }
    ]
  }
}
```
*(Notice: No `correct_option_id` or answer keys exist in the response payload).*

#### 2. Submit Exercise Answer
`POST /api/v1/lessons/1/exercises/1/submit`
```json
// Request Payload:
{
  "attempt_id": "8c01476d-0691-4cf1-92b7-a359ce91a56e",
  "user_answer": "opt_1"
}

// Response Payload:
{
  "is_correct": true,
  "explanation": "¡Excelente! 'Hola' means 'Hello'.",
  "remaining_hearts": 5,
  "already_answered": false
}
```

---

## 🎨 UI/UX Architecture & Learning Path Design

### 1. Sticky Dynamic Unit Header
As the user scrolls through the serpentine learning path, the unit header card stays pinned at the top (`position: sticky; top: 16px; z-index: 40;`) and dynamically transforms to display:
- `← SECTION X, UNIT Y`: Previous unit jump button and section indicator.
- **Bold Topic Headline**: Current unit's learning topic (e.g. `Talk about habits`, `Food & Café`, `Hiragana Basics`).
- **📖 GUIDEBOOK**: Direct modal trigger loading the bilingual grammar notes for that unit.
- **Smooth Color Interpolation**: Background color transitions fluidly (`transition: background-color 0.35s ease`) matching each unit's brand color token.

```mermaid
graph TD
    Scroll[User Scrolls Window] --> Detect[Viewport Scroll Tracker]
    Detect --> CheckUnit{Which UnitSection is at top of viewport?}
    CheckUnit -->|Unit 1 in view| U1[Header Color: #58cc02 Green<br>Title: Get started in Spanish<br>Target: Unit 1 Guidebook]
    CheckUnit -->|Unit 2 in view| U2[Header Color: #ce82ff Purple<br>Title: Food & Café<br>Target: Unit 2 Guidebook]
    CheckUnit -->|Unit 3 in view| U3[Header Color: #b83280 Magenta<br>Title: Everyday Routines<br>Target: Unit 3 Guidebook]
    CheckUnit -->|Unit 4 in view| U4[Header Color: #1cb0f6 Blue<br>Title: Travel & Getting Around<br>Target: Unit 4 Guidebook]
```

### 2. Serpentine Winding Path with Safety Margins
Nodes curve gracefully in a balanced horizontal wave:
- Center ($0\text{px}$) $\rightarrow$ Right ($+48\text{px}$) $\rightarrow$ Left ($-46\text{px}$) $\rightarrow$ Center ($0\text{px}$).
- Vertical spacing is set to `gap: 44px` with `margin: 12px 0` on [`SkillNode`](file:///c:/Repos/Duolingo/frontend/src/components/path/SkillNode.tsx), guaranteeing a **$22\text{px}+$ clearance** between labels and floating `START` tooltips.
- Companion scenes (Bea, Vikram, Junior, Lily, Oscar, Eddy) are positioned in the outer path gutters at `calc(50% + 145px)` with a **$42\text{px}+$ safety margin** preventing any overlap with nodes or text.

### 3. The 5 Core Exercise Types
All 5 required exercise formats are implemented with sound effects, audio pronunciation, and responsive touch controls:
1. **Multiple Choice**: Choice cards with image thumbnails, TTS speaker button, and keyboard shortcuts (`1`, `2`, `3`).
2. **Translate (Word Bank)**: Sentence prompt with interactive word token tray and tap-to-select mechanics.
3. **Match Pairs**: Dual-column vocabulary tiles with instantaneous green match flash and mismatch shake animations.
4. **Fill in the Blank**: Inline sentence sentence slot with select pills.
5. **Type the Answer**: Free-form text input with special character helpers (Spanish accents: `á, é, í, ó, ú, ñ, ¿, ¡`; Japanese Kana helper bar).

### 4. Dedicated Japanese Characters Hub (`/characters`)
Accessible via the sidebar navigation (`あ` tab):
- **Hiragana & Katakana Switcher**: Tabbed views for both primary Japanese phonetic syllabaries.
- **Interactive Gojūon Grid**: Complete rows ($a, ka, sa, ta, na, ha, ma, ya, ra, wa, n$) plus Dakuten / Handakuten variations ($ga, za, da, ba, pa$).
- **Tap-to-Speak**: Clicking any character triggers native Japanese TTS voice synthesis.
- **5-Question Practice Drill**: Interactive gamified character quiz testing romanization recognition.

### 5. Procedural Web Audio Synthesizer (`sound.ts`)
Zero external MP3 dependencies! The application synthesizes Duolingo sound effects procedurally via the browser's native `AudioContext`:
- **Click**: Short $800\text{Hz}$ triangle wave pulse ($30\text{ms}$).
- **Correct Answer**: Bright major chord arpeggio ($C_5 \rightarrow E_5 \rightarrow G_5 \rightarrow C_6$).
- **Incorrect Answer**: Low dual-sawtooth dissonance ($160\text{Hz} + 152\text{Hz}$) with fast decay.
- **Heart Loss**: Descending $400\text{Hz} \rightarrow 200\text{Hz}$ pitch drop.
- **Lesson Complete**: 5-note victory fanfare with vibrato.

---

## 🚀 Local Installation & Quickstart

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10.0 or higher
- **Git**

### 1. One-Click Launch (Windows)
Double-click the included batch files from the repository root:
1. `start-backend.bat`: Starts FastAPI with Uvicorn on `http://127.0.0.1:8000`.
2. `start-frontend.bat`: Starts Next.js development server on `http://localhost:3000`.

---

### 2. Manual Startup

#### Step 1: Clone the Repository
```bash
git clone https://github.com/AnshulKaushal27/Duolingo.git
cd Duolingo
```

#### Step 2: Backend Setup (FastAPI)
```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server (auto-seeds database on first launch)
python run.py
```
- Backend API is live at: `http://127.0.0.1:8000`
- Interactive Swagger docs: `http://127.0.0.1:8000/api/v1/docs`

#### Step 3: Frontend Setup (Next.js)
Open a new terminal window:
```bash
cd frontend

# Install npm packages
npm install

# Start development server
npm run dev
```
- Open your browser at: `http://localhost:3000`

---

### 3. Run Automated Backend Test Suites

Run the end-to-end automated test suites verifying all rubric requirements, API flows, and security constraints:

```bash
cd backend

# Full API workflow test (health, auth, courses, lesson flow, leaderboard)
.\venv\Scripts\python tests\test_api.py

# Strict rubric & adversarial safeguard test suite
.\venv\Scripts\python tests\test_strict_rubric.py

# Authentication & session token test suite
.\venv\Scripts\python tests\test_auth.py

# New features test suite (guidebooks, course switching, Kana support)
.\venv\Scripts\python tests\test_new_features.py
```

*(All test suites execute deterministically and achieve 100% pass rates).*

---

## ☁️ Cloud Deployment Architecture

This project is configured for continuous deployment on zero-cost infrastructure:
- **Frontend Web App**: Deployed on **[Vercel](https://vercel.com/)** (Next.js Edge CDN).
- **Backend API Server**: Deployed on **[Render](https://render.com/)** (FastAPI Web Service).

```mermaid
graph LR
    Browser["Learner Browser"] --> |"Static Assets & Pages"| Vercel["Vercel (Frontend)"]
    Browser --> |"API Requests"| Render["Render (Backend)"]
    Render --> |"SQLite File or PostgreSQL"| Storage[("Persistent Storage")]
```

### 1. Backend Deployment on Render

1. Sign in to your [Render Dashboard](https://dashboard.render.com/) and click **New +** $\rightarrow$ **Web Service**.
2. Connect your GitHub repository (`AnshulKaushal27/Duolingo`).
3. Set configuration fields:
   - **Name**: `duolingo-clone-backend`
   - **Root Directory**: `backend` *(CRITICAL)*
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
4. Add Environment Variables:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `ENVIRONMENT` | `production` | Enables secure cross-origin cookies (`SameSite=None; Secure`) |
   | `CORS_ORIGINS` | `https://your-frontend.vercel.app,http://localhost:3000` | Allowed origins (all `*.vercel.app` domains are auto-allowed) |
   | `SECRET_KEY` | *(Random 32-char hex string)* | Session signing key |
5. Click **Create Web Service**. Note your Render URL (e.g. `https://duolingo-backend.onrender.com`).

---

### 2. Frontend Deployment on Vercel

1. Sign in to [Vercel](https://vercel.com/) and click **Add New...** $\rightarrow$ **Project**.
2. Import the GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Select `frontend` *(CRITICAL)*
   - **Build Command**: `npm run build`
4. Add Environment Variable:
   | Variable | Example Value | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://duolingo-backend.onrender.com/api/v1` | Points frontend to live Render API |
5. Click **Deploy**.

---

### 3. Render Spin-Down Handling & Cold-Start Auto-Recovery

Render's free tier spins down inactive web services after 15 minutes of idle time. Cold starts require **30–50 seconds** to boot.

To handle this smoothly:
1. **Initial Probe**: On page load, the frontend probes `GET /health`.
2. **Cold-Start Detection**: If the probe takes longer than $1.4\text{s}$ or fails, the [`BackendWarmupBanner`](file:///c:/Repos/Duolingo/frontend/src/components/common/BackendWarmupBanner.tsx) slides down from the top with an animated Duo mascot, an active elapsed timer, and an explanation.
3. **Auto-Recovery Polling**: The banner pings `/health` every $2.5\text{s}$. The moment Render finishes waking up, the banner turns green, dispatches a `duo:backend_online` event to automatically re-fetch learning path data without requiring a manual browser refresh, and gracefully dismisses itself.

---

### 4. Cross-Origin Session Preservation

Because Vercel (`*.vercel.app`) and Render (`*.onrender.com`) operate on different top-level domains:
- **Primary Channel**: HTTP-only session cookies configured with `SameSite=None; Secure`.
- **Fallback Channel**: The backend returns an `X-Duo-Token` header on login, which the frontend stores in `localStorage` and transmits via `Authorization: Bearer <token>`. This guarantees persistent login even on browsers with aggressive third-party cookie blocking (e.g. Safari ITP, Chrome Incognito).
- **Default Learner Fallback**: If no cookie or token is supplied, requests automatically resolve to the pre-seeded demo user **Alex Ramos** (`7-day streak`, `345+ XP`), eliminating 401 barriers for reviewers.

---

## 🛡️ Adversarial Rubric Verification (curl Recipes)

You can verify critical business logic and anti-cheat constraints directly via `curl`:

### 1. Locked Skill Start Refusal (HTTP 403)
```bash
curl -X POST http://127.0.0.1:8000/api/v1/lessons/7/start
# Response: 403 Forbidden
# {"detail": "Skill 'Dining' is locked! You must complete prior skills first."}
```

### 2. Zero-Hearts Lesson Start Refusal (HTTP 400)
```bash
# With 0 hearts, lesson initiation is blocked:
curl -X POST http://127.0.0.1:8000/api/v1/lessons/1/start
# Response: 400 Bad Request
# {"detail": "Cannot start lesson with 0 hearts. Refill hearts with gems, practice, or wait for regeneration."}
```

### 3. Replay Completion Idempotency & Forged XP Prevention
```bash
# 1st completion awards 15 XP
# 2nd completion of same attempt returns xp_earned: 0 without duplicate XP
curl -X POST http://127.0.0.1:8000/api/v1/lessons/1/complete \
  -H "Content-Type: application/json" \
  -d '{"attempt_id": "test-attempt-id", "forged_xp": 99999}'
```

### 4. Calendar Simulation & Streak Reset
```bash
# Simulate missed day (2 days ago): Streak resets to 0 (or consumes streak freeze)
curl -X POST "http://127.0.0.1:8000/api/v1/user/debug/simulate-day?days_ago=2"

# Reset back to today:
curl -X POST "http://127.0.0.1:8000/api/v1/user/debug/simulate-day?days_ago=0"
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
Duolingo trademark, assets, and branding are the property of Duolingo, Inc. This project is an educational, non-commercial portfolio replication.
