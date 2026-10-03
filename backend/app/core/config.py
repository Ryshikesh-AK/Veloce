from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIRECTORY = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "DriveXCars Motors API"
    api_prefix: str = "/api/v1"
    environment: str = "development"
    database_url: str = "postgresql+psycopg://DriveXCars:DriveXCars@localhost:5432/DriveXCars"
    auto_create_tables: bool = False
    upload_directory: Path = BACKEND_DIRECTORY / "uploads"
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
        ]
    )
    jwt_secret_key: str = "development-only-secret-change-before-production-32"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60
    admin_email: str = "admin@example.com"
    admin_password: str = "DriveXCars-admin"
    cloudinary_cloud_name: str | None = None
    cloudinary_api_key: str | None = None
    cloudinary_api_secret: str | None = None

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIRECTORY / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("upload_directory", mode="before")
    @classmethod
    def resolve_upload_directory(cls, value: Path | str) -> Path:
        path = Path(value)
        return path if path.is_absolute() else BACKEND_DIRECTORY / path

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @property
    def cloudinary_enabled(self) -> bool:
        return all((self.cloudinary_cloud_name, self.cloudinary_api_key, self.cloudinary_api_secret))

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        cloudinary_credentials = (
            self.cloudinary_cloud_name,
            self.cloudinary_api_key,
            self.cloudinary_api_secret,
        )
        if any(cloudinary_credentials) and not all(cloudinary_credentials):
            raise ValueError("CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be set together")
        if self.is_production:
            if len(self.jwt_secret_key) < 32 or self.jwt_secret_key.startswith("development-only"):
                raise ValueError("JWT_SECRET_KEY must be a unique 32+ character production secret")
            if self.admin_password in {"DriveXCars-admin", "change-me"}:
                raise ValueError("ADMIN_PASSWORD must be changed in production")
            if not self.cloudinary_enabled:
                raise ValueError("Cloudinary credentials are required in production for persistent image storage")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()