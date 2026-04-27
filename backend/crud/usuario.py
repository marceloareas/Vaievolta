import bcrypt
from sqlalchemy.orm import Session
from models.usuario import Usuario


def autenticar_usuario(db: Session, email: str, senha: str):
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        return None
    if not bcrypt.checkpw(senha.encode(), usuario.senha.encode()):
        return None
    return usuario
