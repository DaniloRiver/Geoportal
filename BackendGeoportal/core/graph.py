from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from services.catalog_service import obtener_capas
from services.geoserver_service import construir_wms_url
from dotenv import load_dotenv
import os

from db.database import async_session  # Ajusta la ruta según tu estructura de proyecto

# Cargar variables de entorno
load_dotenv()

llm = ChatOpenAI(
    model="gpt-4o",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

class ChatState(dict):
    pass

def inicio(state: ChatState):
    print("⏳ Nodo: inicio ejecutado")
    return {
        "response": (
            "¡Hola! Soy GeoBot 🤖. Te puedo ayudar a encontrar capas de uso de suelo. "
            "¿De qué departamento te interesan?"
        ),
        "next": "esperar_departamento"
    }

def esperar_departamento(state: ChatState):
    print("⏳ Nodo: esperar_departamento ejecutado con estado:", state)
    message = state.get("message", "").strip().title()

    if not message:
        return {
            "response": "Por favor indícame un departamento válido.",
            "next": "esperar_departamento"
        }

    return {
        "departamento": message,
        "response": f"Departamento **{message}** guardado. ¿De qué año te interesan las capas?",
        "next": "esperar_año"
    }

def esperar_año(state: ChatState):
    print("⏳ Nodo: esperar_año ejecutado con estado:", state)
    message = state.get("message", "").strip()

    try:
        año = int(message)
        return {
            "año": año,
            "response": "Gracias, estoy buscando las capas disponibles...",
            "next": "buscar_y_responder"
        }
    except ValueError:
        return {
            "response": "Por favor indícame un año válido (por ejemplo, 2021).",
            "next": "esperar_año"
        }

async def buscar_y_responder(state: ChatState):
    try:
        print("⏳ Nodo: buscar_y_responder ejecutado con estado:", state)

        departamento = state.get("departamento")
        año = state.get("año")

        async with async_session() as db:
            print(f"🔍 Consultando capas para {departamento} y {año}...")
            capas = await obtener_capas(db, departamento, año)
            print(f"✅ Capas encontradas: {capas}")

        if not capas:
            return {
                "response": f"No se encontraron capas para **{departamento}** en **{año}**.",
                "next": "preguntar_reinicio"
            }

        urls = [construir_wms_url(capa) for capa in capas]

        prompt = (
            f"El usuario pidió capas de uso de suelo en {departamento} para {año}. "
            f"Las capas disponibles son: {', '.join(capas)}. "
            "Devuélvele una respuesta clara e invítalo a verlas en el mapa."
        )

        print("📤 Enviando prompt a LLM...")
        respuesta_llm = await llm.ainvoke(prompt)
        print("🤖 Respuesta LLM:", respuesta_llm)

        return {
            "response": respuesta_llm.content,
            "wms_urls": urls,
            "next": "preguntar_reinicio"
        }

    except Exception as e:
        print("❌ Error en buscar_y_responder:", str(e))
        return {
            "response": f"Ocurrió un error al procesar tu solicitud: {str(e)}",
            "next": "preguntar_reinicio"
        }

def preguntar_reinicio(state: ChatState):
    print("⏳ Nodo: preguntar_reinicio ejecutado")
    return {
        "response": "¿Deseas hacer otra búsqueda? (sí/no)",
        "next": "esperar_confirmacion_reinicio"
    }

def esperar_confirmacion_reinicio(state: ChatState):
    print("⏳ Nodo: esperar_confirmacion_reinicio ejecutado con estado:", state)
    mensaje = state.get("message", "").strip().lower()

    afirmativos = {"si", "sí", "s", "claro", "ok", "dale"}
    negativos = {"no", "n"}

    if mensaje in afirmativos:
        return {
            "response": "Perfecto, ¿de qué departamento te interesan las capas?",
            "next": "esperar_departamento"
        }
    elif mensaje in negativos:
        return {
            "response": "¡Gracias por usar GeoBot! Hasta pronto 👋",
            "next": END
        }
    else:
        return {
            "response": "Por favor responde con 'sí' o 'no'. ¿Quieres hacer otra búsqueda?",
            "next": "esperar_confirmacion_reinicio"
        }

# Diccionario de nodos para ejecución manual
NODOS = {
    "inicio": inicio,
    "esperar_departamento": esperar_departamento,
    "esperar_año": esperar_año,
    "buscar_y_responder": buscar_y_responder,
    "preguntar_reinicio": preguntar_reinicio,
    "esperar_confirmacion_reinicio": esperar_confirmacion_reinicio,
}

# Implementación personalizada de ainvoke (emulación del grafo)
class ChatbotManual:
    def __init__(self):
        self.nodos = NODOS

    async def ainvoke(self, state: ChatState):
        next_node = state.get("next", "inicio")

        print(f"⏳ Ejecutando nodo: {next_node}")

        nodo_fn = self.nodos.get(next_node)
        if not nodo_fn:
            raise ValueError(f"Nodo '{next_node}' no está definido.")

        # Detecta si la función es async o no para llamarla correctamente
        import inspect
        if inspect.iscoroutinefunction(nodo_fn):
            resultado = await nodo_fn(state)
        else:
            resultado = nodo_fn(state)

        new_state = {**state, **resultado}

        return {
            **resultado,
            "state": new_state
        }

def crear_chatbot():
    return ChatbotManual()
