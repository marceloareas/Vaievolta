from auth.auth_utils import verificar_token
from models.pessoa import Pessoa
from schemas.pessoa import PessoaOut
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from schemas.pessoa import PessoaCreate

router = APIRouter(prefix="/pessoas", tags=["pessoas"])


@router.get("/", response_model=list[PessoaOut])
def listar_pessoas(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=200, ge=1, le=500),
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    return (
        db.query(Pessoa)
        .filter(Pessoa.usuario_id == usuario_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("/create", response_model=PessoaOut)
def criar_pessoa(
    pessoa: PessoaCreate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    nova_pessoa = Pessoa(usuario_id=usuario_id, **pessoa.model_dump())
    db.add(nova_pessoa)
    db.commit()
    db.refresh(nova_pessoa)
    return nova_pessoa
