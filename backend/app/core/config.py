"""Application configuration and dependency helpers."""

from functools import lru_cache
from typing import Literal

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    project_name: str = "Chaoshan Yingge API"
    env: Literal["local", "dev", "staging", "prod"] = "local"
    debug: bool = True
    api_prefix: str = "/api/v1"
    docs_url: str | None = "/docs"
    openapi_url: str | None = "/openapi.json"
    cors_origins: list[str] = ["*"]

    db_url: str = "mysql+aiomysql://yingge:yingge@localhost:3306/yingge_db"
    redis_url: str | None = None

    jwt_secret: str = "please-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24

    cos_secret_id: str | None = None
    cos_secret_key: str | None = None
    cos_region: str | None = None
    cos_bucket: str | None = None
    cos_public_domain: str | None = None

    log_level: str = "INFO"
    sentry_dsn: AnyHttpUrl | None = None

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @field_validator("sentry_dsn", mode="before")
    @classmethod
    def _empty_to_none(cls, value: str | None) -> str | None:
        if isinstance(value, str) and not value.strip():
            return None
        return value


@lru_cache
def get_settings() -> Settings:
    """Return cached Settings instance to avoid repeated file I/O."""
    return Settings()


settings = get_settings()
