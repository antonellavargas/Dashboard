from fastapi import APIRouter
from app.services.laptops_service import obtener_laptops

router = APIRouter()

@router.get("/laptops")
def listar_laptops():

    return obtener_laptops()