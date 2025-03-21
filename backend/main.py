from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse  # Importar FileResponse
from fastapi.responses import Response
from gtts import gTTS
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):  # Recibir el objeto BaseModel
    message = request.message  # Acceder al campo message

@app.get("/favicon.ico")
async def favicon():
    return Response(status_code=204)  # Respuesta vacía (No Content)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permitir solicitudes desde el frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

@app.post("/chat")
async def chat(message: str):
    # Generar una respuesta (puedes usar IA o lógica personalizada)
    response_text = f"Recibí tu mensaje: {message}"

    # Convertir la respuesta a audio
    tts = gTTS(response_text, lang="es")
    audio_file = "response.mp3"
    tts.save(audio_file)

    # Devolver la respuesta y la URL del archivo de audio
    return {
        "message": response_text,
        "audio_url": f"http://127.0.0.1:8000/{audio_file}",
    }

@app.get("/{filename}")
async def get_audio(filename: str):
    return FileResponse(filename)