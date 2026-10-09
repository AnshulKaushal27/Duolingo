import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

# Canonical absolute path to backend directory
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_DB_PATH = BACKEND_DIR / "duolingo.db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "Duolingo Clone API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH.as_posix()}")
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    class Config:
        env_file = ".env"

settings = Settings()
