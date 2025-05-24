from http.client import HTTPException
from auth.auth_utils import verificar_token
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioUpdate
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

@router.patch("/me")
def atualizar_usuario(
    dados: UsuarioUpdate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token)
):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if dados.nome is not None:
        usuario.nome = dados.nome
    if dados.endereco is not None:
        usuario.endereco = dados.endereco
    if dados.telefone is not None:
        usuario.telefone = dados.telefone

    db.commit()
    db.refresh(usuario)

    return {"msg": "Usuário atualizado com sucesso", "usuario": usuario}

