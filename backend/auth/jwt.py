from datetime import datetime, timedelta
from jose import jwt
from models.usuario import Usuario

SECRET_KEY = "chave_vai_e_volta"
ALGORITHM = "HS256"
EXPIRA_MINUTOS = 30

def criar_token(usuario: Usuario):
    expiracao = datetime.now().astimezone() + timedelta(minutes=EXPIRA_MINUTOS)
    payload = {
        "sub": str(usuario.id),
        "nome": usuario.nome,
        "exp": expiracao
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)