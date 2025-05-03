from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioOut

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=UsuarioOut)
def criar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    novo = Usuario(**usuario.dict())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo
