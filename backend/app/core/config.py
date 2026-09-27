from functools import lru_cache
from pathlib import Path

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Veloce Motors API"
    api_prefix: str = "/api/v1"
    environment: str = "development"
    database_url: str = "postgresql+psycopg://veloce:veloce@localhost:5432/veloce"
    auto_create_tables: bool = False
    upload_directory: Path = Path("./uploads")
    cors_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173", "http://localhost:3000"]
    )
    jwt_secret_key: str = "development-only-secret-change-before-production-32"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60
    admin_email: str = "admin@example.com"
    admin_password: str = "veloce-admin"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        if self.is_production:
            if len(self.jwt_secret_key) < 32 or self.jwt_secret_key.startswith("development-only"):
                raise ValueError("JWT_SECRET_KEY must be a unique 32+ character production secret")
            if self.admin_password in {"veloce-admin", "change-me"}:
                raise ValueError("ADMIN_PASSWORD must be changed in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()