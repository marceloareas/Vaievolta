from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioOut
from passlib.context import CryptContext

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=UsuarioOut)
def criar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(usuario.senha)
    novo = Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha=hashed_password
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo
