from auth.auth_utils import verificar_token
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate, UsuarioOut, UsuarioUpdate, SenhaUpdate
import bcrypt

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.post("/", response_model=UsuarioOut)
def criar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    if len(usuario.senha) < 8:
        raise HTTPException(
            status_code=422, detail="Senha deve ter no mínimo 8 caracteres"
        )

    existing = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email já cadastrado")

    hashed_password = bcrypt.hashpw(usuario.senha.encode(), bcrypt.gensalt()).decode()
    novo = Usuario(nome=usuario.nome, email=usuario.email, senha=hashed_password)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo


@router.patch("/me")
def atualizar_usuario(
    dados: UsuarioUpdate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
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

    return {
        "msg": "Usuário atualizado com sucesso",
        "usuario": UsuarioOut.model_validate(usuario),
    }


@router.patch("/me/senha")
def alterar_senha(
    dados: SenhaUpdate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if not bcrypt.checkpw(dados.senha_atual.encode(), usuario.senha.encode()):
        raise HTTPException(status_code=401, detail="Senha atual incorreta")

    if len(dados.nova_senha) < 8:
        raise HTTPException(
            status_code=422, detail="Nova senha deve ter no mínimo 8 caracteres"
        )

    usuario.senha = bcrypt.hashpw(dados.nova_senha.encode(), bcrypt.gensalt()).decode()
    db.commit()

    return {"msg": "Senha alterada com sucesso"}


@router.delete("/me")
def excluir_usuario(
    db: Session = Depends(get_db), usuario_id: int = Depends(verificar_token)
):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    db.delete(usuario)
    db.commit()

    return {"msg": "Usuário excluído com sucesso"}
