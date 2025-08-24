import os
import httpx
from urllib.parse import urlencode

# Variables de entorno
GEOSERVER_URL = os.getenv("GEOSERVER_URL")
GEOSERVER_USER = os.getenv("GEOSERVER_USER")
GEOSERVER_PASS = os.getenv("GEOSERVER_PASS")
DEFAULT_BBOX = os.getenv("GEOSERVER_BBOX", "-90,12,-86,17")  # Honduras

def construir_wms_url(layer: str):
    """
    Construye una URL para una solicitud WMS GetMap.

    Args:
        layer (str): Nombre de la capa en GeoServer.

    Returns:
        str: URL para acceder a la imagen de la capa.
    """
    layer = layer.strip()
    if not layer:
        raise ValueError("El nombre de la capa no puede estar vacío.")

    params = {
        "service": "WMS",
        "version": "1.1.1",
        "request": "GetMap",
        "layers": layer,
        "bbox": DEFAULT_BBOX,
        "width": "800",
        "height": "600",
        "srs": "EPSG:4326",
        "format": "image/png"
    }
    return f"{GEOSERVER_URL}/wms?" + urlencode(params)

# Función opcional si en el futuro quieres consumir el GetCapabilities
async def obtener_capabilities():
    """
    Recupera el documento GetCapabilities del servidor WMS (opcional).
    """
    url = f"{GEOSERVER_URL}/wms?service=WMS&request=GetCapabilities"
    auth = (GEOSERVER_USER, GEOSERVER_PASS)

    async with httpx.AsyncClient() as client:
        response = await client.get(url, auth=auth)
        response.raise_for_status()
        return response.text
