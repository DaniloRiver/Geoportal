from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from geoalchemy2 import Geometry

Base = declarative_base()

class MapLayer(Base):
    __tablename__ = "map_layers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    category = Column(String)
    department = Column(String)
    municipality = Column(String)
    creation_date = Column(Date)
    data_year = Column(Integer)  # <-- Aquí debe ser Integer
    source = Column(String)
    contact = Column(String)
    update_frequency = Column(String)
    geometry_type = Column(String)
    formats = Column(String)
    preview_image = Column(String)
    geoserverurl = Column(String)
    layername = Column(String)
    workspace = Column(String)  
    bbox = Column(String)
    bboxepsg = Column(String)



class UsoSuelo(Base):
    __tablename__ = 'uso_suelo'

    id = Column(Integer, primary_key=True, index=True)
    nombre_capa = Column(String)
    departamento = Column(String)
    año = Column(Integer)
    tag = Column(String)
    geom = Column(Geometry('POLYGON'))  # Geometría real en PostGIS
