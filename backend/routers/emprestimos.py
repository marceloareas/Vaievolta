import io
import json
import os
import uuid
import aiofiles
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload
from auth.auth_utils import verificar_token
from models.usuario import Usuario
from models.pessoa import Pessoa  # noqa: F401 – used via Emprestimo.pessoa relationship
from database import get_db
from schemas.emprestimo import (
    EmprestimoCreate,
    EmprestimoOut,
    EmprestimoUpdate,
)
from models.emprestimo import Emprestimo
import datetime

UPLOAD_DIR = os.path.join("uploads", "emprestimo_pictures")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

router = APIRouter(prefix="/emprestimos", tags=["emprestimos"])


@router.post("/", response_model=EmprestimoOut)
def criar_emprestimo(
    emprestimo: EmprestimoCreate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    pessoa = (
        db.query(Pessoa)
        .filter(Pessoa.id == emprestimo.pessoa_id, Pessoa.usuario_id == usuario_id)
        .first()
    )
    if not pessoa:
        raise HTTPException(status_code=403, detail="Pessoa não pertence ao usuário")
    try:
        novo = Emprestimo(**emprestimo.model_dump(), usuario_id=usuario_id)
        db.add(novo)
        db.commit()
        db.refresh(novo)
        return novo
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Erro ao criar empréstimo: {str(e)}"
        )


@router.delete("/{emprestimo_id}", response_model=EmprestimoOut)
def deletar_emprestimo(
    emprestimo_id: int,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    emp = (
        db.query(Emprestimo)
        .filter(
            Emprestimo.id == emprestimo_id,
            Emprestimo.usuario_id == usuario_id,
        )
        .first()
    )
    if not emp:
        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")
    try:
        db.delete(emp)
        db.commit()
        return emp
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Erro ao deletar empréstimo: {str(e)}"
        )


@router.put("/devolver/{emprestimo_id}", response_model=EmprestimoOut)
def registrar_devolucao(
    emprestimo_id: int,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    emp = (
        db.query(Emprestimo)
        .filter(
            Emprestimo.id == emprestimo_id,
            Emprestimo.usuario_id == usuario_id,
        )
        .first()
    )
    if not emp:
        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")
    try:
        emp.data_devolucao_real = datetime.date.today()
        emp.status = "Devolvido"
        db.commit()
        db.refresh(emp)
        return emp
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Erro ao registrar devolução: {str(e)}"
        )


@router.get("/", response_model=list[EmprestimoOut])
def listar_emprestimos(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=200, ge=1, le=500),
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    emprestimos = (
        db.query(Emprestimo)
        .options(joinedload(Emprestimo.pessoa))
        .filter(Emprestimo.usuario_id == usuario_id)
        .filter(Emprestimo.status != "Devolvido")
        .order_by(Emprestimo.data_devolucao_esperada.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    for emp in emprestimos:
        emp.nome_pessoa = emp.pessoa.nome if emp.pessoa else None
    return emprestimos


@router.patch("/editarEmprestimo/{emprestimo_id}", response_model=EmprestimoOut)
def atualizar_emprestimo(
    emprestimo_id: int,
    emprestimo: EmprestimoUpdate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    emprestimo_existente = (
        db.query(Emprestimo)
        .filter(Emprestimo.id == emprestimo_id, Emprestimo.usuario_id == usuario_id)
        .first()
    )
    if not emprestimo_existente:
        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")

    update_data = emprestimo.model_dump(exclude_unset=True, exclude={"id"})

    if "pessoa_id" in update_data and update_data["pessoa_id"] is not None:
        pessoa = (
            db.query(Pessoa)
            .filter(Pessoa.id == update_data["pessoa_id"], Pessoa.usuario_id == usuario_id)
            .first()
        )
        if not pessoa:
            raise HTTPException(status_code=403, detail="Pessoa não pertence ao usuário")

    try:
        for key, value in update_data.items():
            setattr(emprestimo_existente, key, value)

        db.commit()
        db.refresh(emprestimo_existente)
        return emprestimo_existente
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Erro ao atualizar empréstimo: {str(e)}"
        )


@router.post("/imagemEmprestimo/{emprestimo_id}")
async def upload_imagem_emprestimo(
    emprestimo_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Tipo de arquivo não permitido")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Arquivo excede o limite de 5 MB")

    raw_ext = os.path.splitext(os.path.basename(file.filename or ""))[1].lower()
    ext = raw_ext if raw_ext in ALLOWED_EXTENSIONS else ".jpg"
    safe_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    async with aiofiles.open(file_path, "wb") as buffer:
        await buffer.write(contents)

    emprestimo = (
        db.query(Emprestimo)
        .filter(
            Emprestimo.id == emprestimo_id,
            Emprestimo.usuario_id == usuario_id,
        )
        .first()
    )
    if not emprestimo:
        os.remove(file_path)
        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")

    url = "/uploads/emprestimo_pictures/" + safe_name
    emprestimo.foto_url = url
    db.commit()
    db.refresh(emprestimo)

    return {"url": url}


@router.get("/exportar")
def exportar_dados(
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token),
):
    emprestimos = db.query(Emprestimo).filter(Emprestimo.usuario_id == usuario_id).all()
    pessoas = db.query(Pessoa).filter(Pessoa.usuario_id == usuario_id).all()
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()

    dados = {
        "emprestimo": [e.to_dict() for e in emprestimos],
        "pessoa": [p.to_dict() for p in pessoas],
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "endereco": usuario.endereco,
            "telefone": usuario.telefone,
            "foto_perfil": usuario.foto_perfil,
        },
    }

    content = json.dumps(dados, ensure_ascii=False, indent=2).encode("utf-8")
    return StreamingResponse(
        io.BytesIO(content),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=dados_exportados.json"},
    )
