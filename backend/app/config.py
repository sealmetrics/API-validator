from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "Sealmetrics API Validator"
    app_version: str = "1.0.0"
    sealmetrics_api_base: str = "https://app.sealmetrics.com/api"
    cors_origins: list[str] = ["http://localhost:3000", "https://api-validator.sealmetrics.com"]

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
