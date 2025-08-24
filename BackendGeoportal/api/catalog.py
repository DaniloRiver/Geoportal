from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from db.database import get_db
from schemas.catalog_schemas import MapLayerCreate, MapLayerResponse, MapLayerUpdate
from services.catalog_service import (
    get_layers,
    create_layer,
    get_layer_by_id,
    update_layer,
    delete_layer,
    get_layers_by_category,
    obtener_capas_por_depto_y_año,
    update_layer_patch
)

router = APIRouter()


@router.get("/capas", summary="Buscar capas por departamento y año")
async def obtener_capas(
    departamento: str = Query(...),
    año: int = Query(...),
    tag: str = Query(""),
    db: AsyncSession = Depends(get_db)
):
    try:
        capas = await obtener_capas_por_depto_y_año(db, departamento, año, tag)
        return capas
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[MapLayerResponse], summary="Listar todas las capas")
async def listar_capas(db: AsyncSession = Depends(get_db)):
    return await get_layers(db)


@router.get("/{layer_id}", response_model=MapLayerResponse, summary="Obtener capa por ID")
async def obtener_capa_por_id(layer_id: int, db: AsyncSession = Depends(get_db)):
    layer = await get_layer_by_id(db, layer_id)
    if not layer:
        raise HTTPException(status_code=404, detail="Capa no encontrada")
    return layer


@router.get("/categoria/{category}", response_model=List[MapLayerResponse], summary="Buscar capas por categoría")
async def obtener_capas_por_categoria(category: str, db: AsyncSession = Depends(get_db)):
    capas = await get_layers_by_category(db, category)
    if not capas:
        raise HTTPException(status_code=404, detail="No se encontraron capas para esta categoría")
    return capas


@router.post("/", response_model=MapLayerResponse, status_code=status.HTTP_201_CREATED, summary="Crear una nueva capa")
async def nueva_capa(layer_data: MapLayerCreate, db: AsyncSession = Depends(get_db)):
    try:
        return await create_layer(db, layer_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear capa: {e}")


@router.put("/{layer_id}", response_model=MapLayerResponse, summary="Actualizar una capa por ID")
async def actualizar_capa(layer_id: int, layer_data: MapLayerCreate, db: AsyncSession = Depends(get_db)):
    layer = await update_layer(db, layer_id, layer_data)
    if not layer:
        raise HTTPException(status_code=404, detail="Capa no encontrada para actualizar")
    return layer


@router.patch("/actualizar/{layer_id}", response_model=MapLayerResponse, summary="Actualizar parcialmente una capa")
async def actualizar_capa(
    layer_id: int,
    layer_data: MapLayerUpdate,
    db: AsyncSession = Depends(get_db)
):
    try:
        capa_actualizada = await update_layer_patch(db, layer_id, layer_data)
        return capa_actualizada
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar capa: {e}")


@router.delete("/{layer_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Eliminar una capa por ID")
async def eliminar_capa(layer_id: int, db: AsyncSession = Depends(get_db)):
    success = await delete_layer(db, layer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Capa no encontrada para eliminar")
    return None
