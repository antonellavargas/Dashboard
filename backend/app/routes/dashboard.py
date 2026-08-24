from fastapi import APIRouter
from app.services.dashboard_service import obtener_kpis

router = APIRouter()

@router.get("/kpis")
def kpis():

    return obtener_kpis()