from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from auth.jwt import SECRET_KEY, ALGORITHM
from utils import get_modo

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def verificar_token(token: str = Depends(oauth2_scheme)):
    # Se o sistema estiver em modo offline, ignora a autenticação
    if get_modo() == "offline":
        return 1  # ou algum ID genérico como 0, se preferir

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