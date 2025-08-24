# app/services/chat_service.py
from core.graph import crear_chatbot, ChatState

chatbot = crear_chatbot()

async def procesar_mensaje_chat(message: str, state: dict):
    state = state or {}
    if "next" not in state:
        state["next"] = "inicio"
    state["message"] = message.strip()

    try:
        result = await chatbot.ainvoke(ChatState(state))
    except Exception as e:
        return {"error": str(e), "state": state}

    if result is None or "response" not in result:
        return {"error": "El chatbot no pudo generar una respuesta válida.", "state": state}

    return {
        "response": result["response"],
        "state": result["state"],
        "urls": result.get("wms_urls", [])
    }
