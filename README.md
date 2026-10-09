# Duolingo Web Application Clone

A fullstack web application clone of Duolingo replicating its design, user experience, core lesson player, and gamification workflows.

Built as an SDE Fullstack Assignment following modern software engineering practices, clean architecture, and strict separation of concerns.

---

## 🚀 Key Features

### 1. Authentic Duolingo Look & Feel
- **Tactile 3D Buttons**: Signature beveled borders with realistic press micro-interactions (`border-bottom` collapsing on click).
- **Duolingo Color System**: Faithful palette with brand greens (`#58cc02`), blues (`#1cb0f6`), reds (`#ff4b4b`), yellows (`#ffc800`), and dark mode tokens.
- **Duo Mascot & Celebratory Flourishes**: SVG illustrations of Duo the Owl in cheering, coaching, and crying states.
- **Web Audio Sound Effects**: Low-latency procedural sound synthesizer for button taps, correct chords, wrong buzzes, heart breaks, and victory fanfares.
- **Web Speech API Text-to-Speech**: Authentic pronunciation of vocabulary sentences in Spanish.
- **Celebratory Confetti**: Interactive confetti cannon on lesson completion.
- **Dark Mode**: Full toggleable dark mode respecting Duolingo's dark theme palette.

### 2. Learning Path / Skill Tree (`/learn`)
- **Serpentine Winding Path**: Mathematical curve offset placing skill circles along an authentic curved path.
- **Unit Cards & Guidebooks**: Unit titles, descriptions, and guidebook previews.
- **Skill States**: Visually distinct Completed (Gold with crown badge), Available (pulsing glow with Duo mascot cameo), and Locked states.
- **Milestone Treasure Chests**: Periodic reward chests along the trail.
- **Sticky Status Header / Sidebar**: Real-time streak counter (🔥), gems (💎), and hearts (❤️).

### 3. The Lesson Player (`/lesson/[id]`)
- **Distraction-Free Interface**: Clean header with exit confirmation modal, animated smooth progress bar, and active heart indicator.
- **All 5 Required Exercise Types**:
  1. **Multiple Choice**: Image and text option cards with keyboard number shortcuts (`1`, `2`, `3`) and TTS speaker button.
  2. **Translate (Word Bank)**: Sentence prompt with Duo speech bubble, answer slot tray, and interactive tappable word bank tokens.
  3. **Match Pairs**: 2 columns of vocabulary tiles with match flash and mismatch shake animations.
  4. **Fill in the Blank**: Sentence with inline blank slot and choice pills.
  5. **Type the Answer**: Text field with real-time Spanish accent buttons (`á`, `é`, `í`, `ó`, `ú`, `ñ`).
- **Signature Bottom Feedback Sheet**:
  - **Correct State**: Vibrant green bottom banner, "Nicely done!" message, and green "CONTINUE" button.
  - **Incorrect State**: Vibrant red bottom banner, "Correct solution:" display, and red "CONTINUE" button.
- **Heart Loss & Out of Hearts Flow**: Mistakes decrement hearts in real time with audio cues. Reaching 0 hearts triggers the "Out of Hearts" dialog with options to refill with gems or return to practice.
- **Celebration Screen**: Lesson summary featuring XP gained, accuracy percentage, streak extension, and confetti.

### 4. Gamification & Progress Persistence
- **Daily Streak Engine**: Tracks daily activity dates, increments streaks, and logs XP into user activity logs.
- **Hearts System**: 5-heart cap, real-time deduction on errors, gems refill (350 gems), and practice-to-earn-hearts mode.
- **Tiered League Leaderboards (`/leaderboard`)**: Weekly Ruby League table featuring user ranking dynamically adjusting against 9 seeded competitors.
- **Daily Quests (`/quests`)**: Progress bars for daily XP goals and lesson milestones with gem rewards.
- **Learner Profile (`/profile`)**: Total XP, streak record, current league, and achievements showcase (Wildfire, Sage, Sharpshooter, Champion).
- **Power-Ups Shop (`/shop`)**: Heart refills, Streak Freezes, Double-or-Nothing wagers, and Super Duolingo preview.

---

## 🛠️ Architecture & Tech Stack

```
Duolingo Clone
├── frontend/ (Next.js 14 App Router, TypeScript, Vanilla CSS Modules)
│   ├── src/app/
│   │   ├── learn/page.tsx         # Learning path serpentine home
│   │   ├── lesson/[id]/page.tsx   # Interactive core lesson player
│   │   ├── leaderboard/page.tsx   # League standings
│   │   ├── quests/page.tsx        # Daily goals and quests
│   │   ├── profile/page.tsx       # User stats and achievements
│   │   └── shop/page.tsx          # Gems shop and powerups
│   ├── src/components/
│   │   ├── layout/                # Sidebar, RightSidebar, HeartsModal
│   │   ├── path/                  # LearningPath, UnitSection, SkillNode
│   │   └── lesson/                # 5 Exercise renderers, FeedbackBar, Modals
│   └── src/lib/                   # API client, Web Audio SFX, Web Speech TTS
│
└── backend/ (Python 3.11+, FastAPI, SQLAlchemy, SQLite)
    ├── app/
    │   ├── core/                  # Database engine, config, session
    │   ├── models/                # Normalized SQLAlchemy models
    │   ├── schemas/               # Pydantic v2 validation contracts
    │   ├── services/              # Authoritative answer validation, streak logic
    │   ├── api/v1/endpoints/      # REST API routers (courses, lessons, user, lb)
    │   └── seeds/seed_data.py     # Pre-seeded Spanish curriculum & learner
    └── tests/test_api.py          # End-to-end automated test suite
```

### Backend-Authoritative Validation & Security
1. **Sanitized Exercise Payloads**: The frontend receives only `client_payload` (options text/image, shuffled tokens, pair words). Solutions (`correct_option_id`, `canonical_tokens`, `acceptable_answers`) are retained strictly on the backend.
2. **Anti-Duplicate Submission Protection**: Each lesson session creates a unique `attempt_id`. The backend rejects or safely ignores duplicate submissions of the same exercise within an attempt, preventing race conditions or exploit-driven XP duplication.
3. **Idempotent Gamification Calculations**: XP, streaks, hearts, and achievements are computed and committed atomically on the backend.

---

## 📊 Database Schema (SQLite)

```mermaid
erDiagram
    USERS ||--o{ USER_PROGRESS : tracks
    USERS ||--o{ USER_ACHIEVEMENTS : earns
    USERS ||--o{ ACTIVITY_LOGS : records
    COURSES ||--o{ UNITS : contains
    UNITS ||--o{ SKILLS : contains
    SKILLS ||--o{ LESSONS : contains
    LESSONS ||--o{ EXERCISES : contains
    LESSONS ||--o{ USER_PROGRESS : completes
    LESSONS ||--o{ LESSON_ATTEMPTS : logs
    ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : unlocks

    USERS {
        int id PK
        string username
        string display_name
        int streak
        date last_active_date
        int hearts
        int gems
        int total_xp
    }

    COURSES {
        int id PK
        string code
        string title
        string flag_icon
    }

    UNITS {
        int id PK
        int course_id FK
        int unit_number
        string title
        string color_hex
    }

    SKILLS {
        int id PK
        int unit_id FK
        string title
        string icon_name
        int total_crowns
    }

    LESSONS {
        int id PK
        int skill_id FK
        string title
        int xp_reward
    }

    EXERCISES {
        int id PK
        int lesson_id FK
        string type
        string prompt
        json client_payload
        json solution_payload
    }

    LESSON_ATTEMPTS {
        string id PK
        int user_id FK
        int lesson_id FK
        json answered_exercise_ids
        int mistakes_count
        boolean is_completed
    }
```

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)

### 1. One-Click Startup (Windows)
Double-click the included launcher batch scripts from the repository root:
- `start-backend.bat`: Launches FastAPI with Uvicorn on `http://127.0.0.1:8000`.
- `start-frontend.bat`: Launches Next.js on `http://localhost:3000`.

### 2. Manual Startup

#### Backend API (FastAPI)
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Run server (auto-seeds SQLite database if empty)
python run.py
```
- Backend API: `http://127.0.0.1:8000`
- Interactive Swagger OpenAPI Docs: `http://127.0.0.1:8000/api/v1/docs`

#### Frontend Web App (Next.js)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:3000`

### 3. Run Backend Automated Test Suite
Run the 3 automated test suites verifying API workflows, default learner auth fallback, and new gamification features:
```bash
cd backend
.\venv\Scripts\python tests\test_api.py
.\venv\Scripts\python tests\test_auth.py
.\venv\Scripts\python tests\test_new_features.py
```
*(All 3 test suites pass 100% with deterministic assertions).*

---

## 🧪 Evaluation & Demo Flow

### Direct Evaluator Route:
1. Open `http://localhost:3000/learn` directly in your browser.
2. The application automatically resolves the default pre-seeded learner **Alex Ramos** (`7-day streak`, `345+ XP`, `5 hearts`), completely eliminating 401 authentication barriers.
3. Observe **Unit 1**: "Basics" is marked Completed (👑 3/3 crowns), and "Greetings" is Available with the pulsing ring and Duo mascot cameo.
4. Click **Greetings** and click **START (+15 XP)** to enter the Lesson Player (`/lesson/3`).
5. Experience all **5 interactive exercise types**:
   - **Multiple Choice**: Audio pronunciation speaker + keyboard shortcuts (`1`, `2`, `3`).
   - **Word Bank (Translate)**: Duo speech bubble prompt, answer slot tray, and interactive tappable word bank tokens.
   - **Match Pairs**: 2-column vocabulary matching with instant green match highlight and shake animation.
   - **Fill in the Blank**: Inline sentence blank with choice pills.
   - **Type the Answer**: Free-form text input with Spanish special accent helper buttons (`á`, `é`, `í`, `ó`, `ú`, `ñ`, `¿`, `¡`).
6. Submit an incorrect answer to observe the signature red bottom feedback sheet, buzzer sound, and heart deduction (`5 -> 4`).
7. Complete all exercises to trigger the **victory fanfare**, **confetti blast**, and **XP celebration summary**.
8. Return to `/learn` to verify progress persistence in the SQLite database.

### Marketing Homepage Route:
- Visit `http://localhost:3000` to inspect the full Duolingo marketing landing page featuring the interactive Lottie Hero Globe, Language Carousel, and click **CONTINUE LEARNING** to enter the learning path.

### Responsive Design Testing (Mobile & Tablet):
- Open DevTools (F12) and toggle device emulation:
  - **Desktop (>= 1024px)**: Full 256px navigation sidebar on the left and 368px stats sidebar on the right.
  - **Tablet (768px - 1023px)**: Left sidebar persists; right sidebar transforms into a sticky compact top stats bar.
  - **Mobile (< 768px)**: Left sidebar transforms into an authentic **bottom tab navigation bar** (Learn, Practice, Leaderboard, Quests, Shop, Profile) and stats appear in a compact top bar with interactive modal triggers.

---

## ☁️ Cloud Deployment Guide

### Deploying the Backend (Render / Railway)
1. Push this repository to GitHub.
2. In [Render](https://render.com) or [Railway](https://railway.app), create a new **Web Service** connected to your repo.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Copy your deployed backend service URL (e.g. `https://duolingo-backend.onrender.com`).

### Deploying the Frontend (Vercel)
1. Import this repository in [Vercel](https://vercel.com).
2. Configure project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: Your deployed backend URL + `/api/v1` (e.g. `https://duolingo-backend.onrender.com/api/v1`)
3. Deploy! Both links can then be submitted for evaluation.
