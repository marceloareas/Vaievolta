from models.pessoa import Pessoa
from schemas.pessoa import PessoaOut
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioOut
from schemas.pessoa import PessoaCreate, PessoaOut

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

@router.post("/create", response_model=PessoaOut)
def criar_pessoa(pessoa: PessoaCreate, db: Session = Depends(get_db)):
    nova_pessoa = Pessoa(**pessoa.model_dump())
    db.add(nova_pessoa)
    db.commit()
    db.refresh(nova_pessoa)
    return nova_pessoa