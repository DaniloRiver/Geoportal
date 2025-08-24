# app/services/catalog_service.py
from typing import List, Optional
from fastapi import HTTPException, logger
from core.config import DB_URL
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import logging

from db.models.models import MapLayer, UsoSuelo
from schemas.catalog_schemas import MapLayerCreate, MapLayerUpdate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def obtener_capas_por_depto_y_año(db: AsyncSession, departamento: str, año: int, tag: str) -> List[str]:
    if not departamento or año < 1900 or año > 2100:
        logger.warning(f"Entrada inválida: departamento={departamento}, año={año}")
        return []

    try:
        query = select(UsoSuelo.nombre_capa).where(
            UsoSuelo.departamento == departamento,
            UsoSuelo.año == año,
            UsoSuelo.tag == tag
        )

        result = await db.execute(query)
        nombres = result.scalars().all()

        return nombres if nombres else []

    except Exception as e:
        logger.error(f"Error al obtener capas por departamento y año: {e}")
        return []


async def obtener_capas(db: AsyncSession, departamento: str, año: int, tag: str) -> List[str]:
    if not departamento or año < 1900 or año > 2100:
        logger.warning(f"Entrada inválida: departamento={departamento}, año={año}")
        return []

    try:
        stmt = select(UsoSuelo.nombre_capa).where(
            UsoSuelo.departamento == departamento,
            UsoSuelo.año == año,
            UsoSuelo.tag == tag
        )

        logger.info(f"Ejecutando consulta para departamento={departamento}, año={año}")
        result = await db.execute(stmt)
        rows = result.scalars().all()

        if not rows:
            logger.info("No se encontraron capas.")
            return []

        capas = list(rows)
        logger.info(f"Capas encontradas: {capas}")
        return capas

    except Exception as e:
        logger.error(f"Error al obtener capas: {e}")
        return []



async def get_layers(db: AsyncSession):
    result = await db.execute(select(MapLayer))
    return result.scalars().all()


async def create_layer(db: AsyncSession, layer_data: MapLayerCreate):
    layer = MapLayer(**layer_data.dict())  # <--- aquí está la clave
    db.add(layer)
    await db.commit()
    await db.refresh(layer)
    return layer

async def get_layer_by_id(db: AsyncSession, layer_id: int) -> Optional[MapLayer]:
    result = await db.execute(select(MapLayer).where(MapLayer.id == layer_id))
    return result.scalars().first()

async def get_layers_by_category(db: AsyncSession, category: str) -> List[MapLayer]:
    result = await db.execute(select(MapLayer).where(MapLayer.category == category))
    return result.scalars().all()

async def update_layer(db: AsyncSession, layer_id: int, layer_data: MapLayerCreate) -> Optional[MapLayer]:
    # Obtener la capa existente
    layer = await get_layer_by_id(db, layer_id)
    if not layer:
        return None
    
    # Actualizar atributos
    for key, value in layer_data.dict(exclude_unset=True).items():
        setattr(layer, key, value)
    
    db.add(layer)
    await db.commit()
    await db.refresh(layer)
    return layer

async def update_layer_patch(db: AsyncSession, layer_id: int, layer_data: MapLayerUpdate):
    layer = await db.get(MapLayer, layer_id)
    if not layer:
        raise HTTPException(status_code=404, detail="Capa no encontrada")

    update_data = layer_data.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(layer, key, value)

    await db.commit()
    await db.refresh(layer)
    return layer


async def delete_layer(db: AsyncSession, layer_id: int) -> bool:
    layer = await get_layer_by_id(db, layer_id)
    if not layer:
        return False
    
    await db.delete(layer)
    await db.commit()
    return True


