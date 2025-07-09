from auth.auth_utils import verificar_token
from models.pessoa import Pessoa
from schemas.pessoa import PessoaOut
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioOut
from schemas.pessoa import PessoaCreate, PessoaOut
from database import get_db

router = APIRouter(prefix="/pessoas", tags=["pessoas"])

@router.get("/", response_model=list[PessoaOut])
def listar_pessoas(db: Session = Depends(get_db), usuario_id: int = Depends(verificar_token)):
    # return db.query(Pessoa).all()
    return db.query(Pessoa).filter(Pessoa.usuario_id == usuario_id).all()

@router.post("/create", response_model=PessoaOut)
def criar_pessoa(pessoa: PessoaCreate, db: Session = Depends(get_db), usuario_id: int = Depends(verificar_token)):
    nova_pessoa = Pessoa(usuario_id=usuario_id, **pessoa.model_dump())
    db.add(nova_pessoa)
    db.commit()
    db.refresh(nova_pessoa)
    return nova_pessoa