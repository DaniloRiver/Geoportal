# app/core/config.py
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_URL: str
    ALLOWED_ORIGINS: list[str] = ["http://localhost:4200"]

    openai_api_key: str
    geoserver_url: str
    geoserver_user: str
    geoserver_pass: str
    geoserver_bbox: str

    class Config:
        env_file = ".env"

# Instancia global de settings
settings = Settings()

# Variable para que otros módulos puedan seguir usando DB_URL directamente si prefieren
DB_URL = settings.DB_URL
print("DB_URL cargado:", settings.DB_URL)


def configure_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

