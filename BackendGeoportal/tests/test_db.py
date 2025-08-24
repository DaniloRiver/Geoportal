import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

DB_URL = "postgresql+asyncpg://gisuser:secret123@localhost:5432/gisdb"

async def test_connection():
    engine = create_async_engine(DB_URL, echo=True, future=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Usar sqlalchemy.text para la consulta SQL raw
        result = await session.execute(text("SELECT 1"))
        scalar_result = result.scalar()
        print(f"Resultado de la prueba de conexión: {scalar_result}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_connection())
