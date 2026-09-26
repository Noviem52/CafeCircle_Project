import os
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

SERVER_DIR = Path(__file__).resolve().parents[2]
DATABASE_FILE = SERVER_DIR / "cafe_circle.db"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = f"sqlite:///{DATABASE_FILE}"
    UPLOAD_DIR: str = str(SERVER_DIR / "uploads")

    SECRET_KEY: str = "cafe-circle-local-development-secret"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # Comma-separated string, NOT a list: a list field makes pydantic-settings
    # try to JSON-decode the env var and crash on boot.
    CORS_ORIGINS: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "http://localhost:4173,"
        "http://127.0.0.1:4173,"
        "https://cafecircle.netlify.app"
    )

    ADMIN_EMAIL: str = "admin@cafecircle.com"
    ADMIN_PASSWORD: str = "Adm1n!Pass"
    ADMIN_NAME: str = "Café Circle Admin"
    DEMO_USER_EMAIL: str = "user@cafecircle.com"
    DEMO_USER_PASSWORD: str = "Us3r!Pass"
    DEMO_USER_NAME: str = "Sarah Jenkins"
    DEMO_OWNER_EMAIL: str = "owner@cafecircle.com"
    DEMO_OWNER_PASSWORD: str = "Own3r!Pass"
    DEMO_OWNER_NAME: str = "Daniel Osman"

    @field_validator("DATABASE_URL")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        # Render hands out postgres://... which SQLAlchemy 2.x refuses to parse.
        if value.startswith("postgres://"):
            value = value.replace("postgres://", "postgresql+psycopg2://", 1)
        elif value.startswith("postgresql://"):
            value = value.replace("postgresql://", "postgresql+psycopg2://", 1)
        return value

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_sqlite(self) -> bool:
        return self.DATABASE_URL.startswith("sqlite")


settings = Settings()

UPLOAD_DIR = Path(settings.UPLOAD_DIR)

try:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
except OSError:
    # Read-only filesystem (some hosts); uploads will fail loudly instead of
    # taking the whole app down at import time.
    pass
