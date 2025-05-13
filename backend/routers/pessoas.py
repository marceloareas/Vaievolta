from models.pessoa import Pessoa
from schemas.pessoa import PessoaOut
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioOut

router = APIRouter(prefix="/pessoas", tags=["pessoas"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[PessoaOut])
def listar_pessoas(db: Session = Depends(get_db)):
    return db.query(Pessoa).all()