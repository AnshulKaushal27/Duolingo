import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

# Canonical absolute path to backend directory
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_DB_PATH = BACKEND_DIR / "duolingo.db"

def normalize_database_url(url: str) -> str:
    """Render and legacy providers supply postgres:// instead of postgresql://."""
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url

class Settings(BaseSettings):
    PROJECT_NAME: str = "Duolingo Clone API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "duo_default_session_signing_secret_key_change_in_production")
    
    DATABASE_URL: str = normalize_database_url(
        os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH.as_posix()}")
    )

    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

    def get_cors_origins(self) -> List[str]:
        raw = os.getenv("CORS_ORIGINS")
        if raw:
            # Comma-separated or single string
            origins = [o.strip() for o in raw.split(",") if o.strip()]
            return origins if origins else self.CORS_ORIGINS
        return self.CORS_ORIGINS

settings = Settings()
