import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from jose import JWTError, jwt

from auth.jwt import SECRET_KEY, ALGORITHM
from database import init_db, get_db
from models.usuario import Usuario
from models.emprestimo import Emprestimo
from sqlalchemy.orm import Session
from fastapi import Depends
from routers import usuarios, pessoas, auth, emprestimos, profile, historico


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/uploads/{subfolder}/{filename}")
def serve_upload(
    subfolder: str,
    filename: str,
    request: Request,
    db: Session = Depends(get_db),
):
    allowed_subfolders = {"pessoa_pictures", "emprestimo_pictures"}
    if subfolder not in allowed_subfolders:
        raise HTTPException(status_code=404, detail="Not found")

    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")
    token = auth_header[len("Bearer ") :]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        usuario_id = int(sub)
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario or not usuario.is_active:
        raise HTTPException(status_code=401, detail="Usuário inativo ou não encontrado")

    safe_filename = os.path.basename(filename)
    url_path = f"/uploads/{subfolder}/{safe_filename}"

    if subfolder == "pessoa_pictures":
        if usuario.foto_perfil != url_path:
            raise HTTPException(status_code=403, detail="Acesso negado")
    elif subfolder == "emprestimo_pictures":
        emp = (
            db.query(Emprestimo)
            .filter(
                Emprestimo.foto_url == url_path,
                Emprestimo.usuario_id == usuario_id,
            )
            .first()
        )
        if not emp:
            raise HTTPException(status_code=403, detail="Acesso negado")

    file_path = os.path.join("uploads", subfolder, safe_filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path)


app.include_router(usuarios.router)
app.include_router(pessoas.router)
app.include_router(auth.router)
app.include_router(emprestimos.router)
app.include_router(profile.router)
app.include_router(historico.router)


@app.get("/")
def read_root():
    return {"msg": "API do Vai e Volta"}
