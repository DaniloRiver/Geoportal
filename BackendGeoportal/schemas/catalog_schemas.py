from tokenize import String
from pydantic import BaseModel
from typing import Optional
from datetime import date

from sqlalchemy import Column

class MapLayerBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    municipality: Optional[str] = None
    creation_date: Optional[date] = None
    data_year: Optional[int] = None  # <-- debe ser int para coincidir con la DB
    source: Optional[str] = None
    contact: Optional[str] = None
    update_frequency: Optional[str] = None
    geometry_type: Optional[str] = None
    formats: Optional[str] = None
    preview_image: Optional[str] = None
    geoserverurl: Optional[str] = None
    layername: Optional[str] = None
    workspace: Optional[str] = None
    bbox: Optional[str] = None
    bboxepsg: Optional[str] = None

class MapLayerCreate(MapLayerBase):
    pass

class MapLayerResponse(MapLayerBase):
    id: int

    class Config:
        orm_mode = True

class MapLayerUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    municipality: Optional[str] = None
    creation_date: Optional[date] = None
    data_year: Optional[int] = None
    source: Optional[str] = None
    contact: Optional[str] = None
    update_frequency: Optional[str] = None
    geometry_type: Optional[str] = None
    formats: Optional[str] = None
    preview_image: Optional[str] = None
    geoserverurl: Optional[str] = None
    layername: Optional[str] = None
    workspace: Optional[str] = None
    bbox: Optional[str] = None
    bboxepsg: Optional[str] = None

    class Config:
        orm_mode = True
