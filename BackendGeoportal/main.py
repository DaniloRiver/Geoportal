
# app/main.py
from fastapi import FastAPI
from api import chat, catalog
from core.config import configure_cors

app = FastAPI(title="Geoportal API")

configure_cors(app)

app.include_router(chat.router, prefix="/chat")
app.include_router(catalog.router, prefix="/capas")

@app.get("/")
async def root():
    return {"message": "Bienvenido al Geoportal"}
