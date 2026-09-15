from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="CAREERFLOW_",
        extra="ignore",
        frozen=True,
    )

    app_name: str = "Careerflow API"
    environment: Literal["development", "test", "production"] = "development"
