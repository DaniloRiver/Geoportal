# db/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import AsyncGenerator
from core.config import settings

import logging

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print(f"DB URL: {settings.DB_URL}")


# Crear el motor de conexión asíncrono
engine = create_async_engine(
    settings.DB_URL,  # Usa la variable del archivo de configuración
    echo=True,       # Ponlo en True para ver las queries SQL
    future=True
)

# Crear la fábrica de sesiones
async_session = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base para tus modelos ORM
Base = declarative_base()

# Dependencia para inyectar sesiones en los endpoints

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

