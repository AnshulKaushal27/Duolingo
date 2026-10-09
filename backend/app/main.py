from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine, Base, SessionLocal
from .api.v1.router import api_router
from .seeds.seed_data import seed_database_if_empty

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for Duolingo Clone — SDE Fullstack Assignment",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

from sqlalchemy import text

@app.on_event("startup")
def on_startup():
    # Ensure any new columns exist in sqlite if migrating
    with engine.connect() as conn:
        res = conn.execute(text("PRAGMA table_info(users)"))
        columns = [row[1] for row in res.fetchall()]
        if "password_hash" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)"))
        if "auth_provider" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'local'"))
        conn.commit()

    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()

@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs"
    }

@app.get("/health", tags=["Health Check"])
def health():
    return {"status": "ok"}

@app.get("/welcome", tags=["Welcome"])
@app.get(f"{settings.API_V1_STR}/welcome", tags=["Welcome"])
def welcome():
    return {
        "status": "ok",
        "message": "Hi there! I'm Duo!",
        "mascot": "duo",
        "theme": "dark",
        "bodyBg": "rgb(19, 31, 36)"
    }

