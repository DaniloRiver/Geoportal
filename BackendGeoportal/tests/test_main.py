import pytest
from httpx import AsyncClient, ASGITransport
import main  # Importar el módulo completo para poder parchear bien

@pytest.mark.asyncio
async def test_get_capas_valido(monkeypatch):
    class MockConnection:
        async def fetch(self, query, departamento, año):
            assert departamento == "Cortés"
            assert año == 2020
            return [{"nombre_capa": "Uso de suelo 2020"}]
        async def close(self):
            pass

    async def mock_connect(db_url):
        return MockConnection()

    monkeypatch.setattr("asyncpg.connect", mock_connect)

    transport = ASGITransport(app=main.app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/capas/", params={"departamento": "Cortés", "año": 2020})

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert "Uso de suelo 2020" in data

@pytest.mark.asyncio
async def test_get_capas_error(monkeypatch):
    async def mock_connect(db_url):
        raise Exception("Error conexión DB")

    monkeypatch.setattr("asyncpg.connect", mock_connect)

    transport = ASGITransport(app=main.app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/capas/", params={"departamento": "Cortés", "año": 2020})

    assert response.status_code == 500  # Ahora esperamos error 500

@pytest.mark.asyncio
async def test_chat_sin_mensaje(monkeypatch):
    class MockChatBot:
        async def ainvoke(self, state):
            return {"response": "¿De qué departamento te interesan las capas?", "next": "esperar_departamento"}

    monkeypatch.setattr(main, "chatbot", MockChatBot())

    transport = ASGITransport(app=main.app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/chat", json={"state": {}, "message": ""})

    assert response.status_code == 200
    data = response.json()
    assert "response" in data

@pytest.mark.asyncio
async def test_chat_con_departamento(monkeypatch):
    class MockChatBot:
        async def ainvoke(self, state):
            assert state["departamento"] == "Cortés"
            return {"response": "¿De qué año?", "next": "esperar_año"}

    monkeypatch.setattr(main, "chatbot", MockChatBot())

    transport = ASGITransport(app=main.app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/chat", json={"state": {}, "message": "Cortés"})

    assert response.status_code == 200
    data = response.json()
    assert data["response"] == "¿De qué año?"

@pytest.mark.asyncio
async def test_chat_con_año_invalido(monkeypatch):
    class MockChatBot:
        async def ainvoke(self, state):
            assert False, "ainvoke no debería llamarse con año inválido"

    monkeypatch.setattr(main, "chatbot", MockChatBot())

    transport = ASGITransport(app=main.app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/chat", json={"state": {"departamento": "Cortés"}, "message": "no es un número"})

    assert response.status_code == 200
    data = response.json()
    assert "Por favor escribe un año válido." in data["response"]
