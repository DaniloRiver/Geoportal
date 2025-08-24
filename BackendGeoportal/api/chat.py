# app/api/chat.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.chat_service import procesar_mensaje_chat

router = APIRouter()

class ChatPayload(BaseModel):
    message: str
    state: dict = {}

@router.post("/")
async def chat(payload: ChatPayload):
    result = await procesar_mensaje_chat(payload.message, payload.state)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@router.post("/test")
async def chat_test(payload: ChatPayload):
    # Puedes usar la misma función para test
    result = await procesar_mensaje_chat(payload.message, payload.state)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
