from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.usuario import UsuarioLogin
from crud.usuario import autenticar_usuario
from auth.jwt import criar_token

router = APIRouter(prefix="/login", tags=["login"])

@router.post("/")
def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    usuario_autenticado = autenticar_usuario(db, usuario.email, usuario.senha)
    if not usuario_autenticado:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = criar_token(usuario_autenticado)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": usuario_autenticado.id,
            "nome": usuario_autenticado.nome,
            "email": usuario_autenticado.email
        }
    }
