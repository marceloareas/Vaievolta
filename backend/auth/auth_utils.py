from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from auth.jwt import SECRET_KEY, ALGORITHM
from utils import get_modo
from database import get_db
from models.usuario import Usuario
from sqlalchemy.orm import Session

# 1️⃣  auto_error=False impede que o schema dispare 401 sozinho
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
    auto_error=False
)

def verificar_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Se o sistema estiver em modo offline, ignora a autenticação
    if get_modo() == "offline":
        usuario = db.query(Usuario).first()
        print(usuario)
        if not usuario:
            raise HTTPException(status_code=404, detail="Nenhum usuário encontrado no modo offline")
        return usuario.id
    
    # A partir daqui estamos em modo online👇
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token ausente",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id = int(payload.get("sub"))
        return usuario_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )