import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from main import app
from db.database import get_db

# ⚠️ Solo si necesitas una base de datos de prueba, define un override aquí.
# Por ahora, usaremos el mismo `get_db`.

@pytest.mark.asyncio
async def test_root_endpoint():
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Bienvenido al Geoportal"}

@pytest.mark.asyncio
async def test_listar_capas_vacio():
    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        response = await ac.get("/capas/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_crear_y_listar_capa():
    nueva_capa = {
        "title": "Prueba de capa",
        "description": "Descripción de prueba",
        "category": "Uso del suelo",
        "department": "Atlántida",
        "municipality": "Tela",
        "creation_date": "2024-01-01",
        "data_year": 2024,
        "source": "IGN",
        "contact": "ign@correo.com",
        "update_frequency": "Anual",
        "geometry_type": "Polygon",
        "formats": "GeoJSON,Shapefile",
        "preview_image": "https://example.com/img.png",
        "lat": 15.775,
        "lon": -87.467
    }

    async with AsyncClient(app=app, base_url="http://testserver") as ac:
        # Crear capa
        response = await ac.post("/capas/", json=nueva_capa)
        assert response.status_code == 201
        json_response = response.json()
        assert json_response["title"] == nueva_capa["title"]
        assert "id" in json_response

        # Listar capas para comprobar que se insertó
        response_list = await ac.get("/capas/")
        assert response_list.status_code == 200
        assert any(capa["title"] == "Prueba de capa" for capa in response_list.json())
