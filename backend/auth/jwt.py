from datetime import datetime, timedelta
from jose import jwt
from models.usuario import Usuario
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is required")
ALGORITHM = "HS256"
EXPIRA_MINUTOS = 30


def criar_token(usuario: Usuario):
    expiracao = datetime.now().astimezone() + timedelta(minutes=EXPIRA_MINUTOS)
    payload = {"sub": str(usuario.id), "exp": expiracao}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
