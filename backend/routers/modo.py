from fastapi import APIRouter
from utils import set_modo

router = APIRouter()

@router.post("/trocar-modo")
def trocar_modo(data: dict):
    modo = data.get("modo", "online")
    set_modo(modo)
    return {"status": "ok", "modo": modo}
