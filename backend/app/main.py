import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.equipos import router as equipos_router
from app.services.excel_service import obtener_estado_fuente

load_dotenv()

app = FastAPI(title="API Inventario TI")

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(equipos_router)


@app.get("/")
def home():
    return {"mensaje": "API Inventario TI funcionando"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "data_source": os.getenv("DATA_SOURCE", "local"),
    }


@app.get("/fuente-datos")
def fuente_datos():
    return obtener_estado_fuente()
