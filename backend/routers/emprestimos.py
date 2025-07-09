import json
import os
import shutil
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from auth.auth_utils import verificar_token
from models.usuario import Usuario
from models.pessoa import Pessoa
from database import get_db
from schemas.emprestimo import EmprestimoCreate, EmprestimoOut, EmprestimoDelete, EmprestimoUpdate
from models.emprestimo import Emprestimo
import datetime
# from datetime import datetime

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/emprestimos", tags=["emprestimos"])

@router.post("/", response_model=EmprestimoOut)
def criar_emprestimo(
    emprestimo: EmprestimoCreate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token)
):
    try:
        novo = Emprestimo(
            **emprestimo.model_dump(),
            usuario_id=usuario_id
        )
        db.add(novo)
        db.commit()
        db.refresh(novo)
        return novo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao criar empréstimo: {str(e)}")

@router.delete("/{emprestimo_id}", response_model=EmprestimoOut)
def deletar_emprestimo(emprestimo: EmprestimoDelete, db: Session = Depends(get_db)):
    emprestimo = db.query(Emprestimo).filter(Emprestimo.id == emprestimo.id).first()
    try:
        db.delete(emprestimo)
        db.commit()
        return emprestimo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao deletar empréstimo: {str(e)}")

@router.put("/devolver/{emprestimo_id}", response_model=EmprestimoOut)
def registrar_devolucao(emprestimo: EmprestimoUpdate, db: Session = Depends(get_db)):
    emprestimo = db.query(Emprestimo).filter(Emprestimo.id == emprestimo.id).first()
    try:
        emprestimo.data_devolucao_real = datetime.date.today()
        emprestimo.status = 'Devolvido'
        db.commit()
        db.refresh(emprestimo)
        return emprestimo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao registrar devolução: {str(e)}")

@router.get("/", response_model=list[EmprestimoOut])
def listar_emprestimos(
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token)
):
    emprestimos = (
        db.query(Emprestimo)
        .filter(Emprestimo.usuario_id == usuario_id)
        .filter(Emprestimo.status != "Devolvido")
        .order_by(Emprestimo.data_devolucao_esperada.asc())
        .all()
    )
    # Adiciona o nome da pessoa vinculada ao empréstimo
    for emp in emprestimos:
        pessoa = db.query(Pessoa).filter(Pessoa.id == emp.pessoa_id).first()
        emp.nome_pessoa = pessoa.nome if pessoa else None
    print(f"Listando {len(emprestimos)} empréstimos para o usuário {usuario_id}")
    return emprestimos

@router.patch("/editarEmprestimo/{emprestimo_id}", response_model=EmprestimoOut)
def atualizar_emprestimo(
    emprestimo_id: int,
    emprestimo: EmprestimoUpdate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(verificar_token)
):
    emprestimo_existente = db.query(Emprestimo).filter(Emprestimo.id == emprestimo_id).first()
    if not emprestimo_existente:
        raise HTTPException(status_code=404, detail="Empréstimo não encontrado")

    try:
        for key, value in emprestimo.model_dump(exclude_unset=True).items():
            setattr(emprestimo_existente, key, value)

        db.commit()
        db.refresh(emprestimo_existente)
        return emprestimo_existente
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar empréstimo: {str(e)}")
    
@router.post("/imagemEmprestimo/{emprestimo_id}")
async def upload_imagem_emprestimo(
    emprestimo_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        # Salva arquivo fisicamente
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Atualiza foto_url do usuário
        emprestimo = db.query(Emprestimo).filter(Emprestimo.id == emprestimo_id).first()
        if not emprestimo:
            raise HTTPException(status_code=404, detail="Empréstimo não encontrado")

        emprestimo.foto_url = f"/{file_path}"

        db.commit()
        db.refresh(emprestimo)

        return {"url": f"/{file_path}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar imagem: {e}")

@router.get("/exportar")
def exportar_dados(db: Session = Depends(get_db), usuario_id: int = Depends(verificar_token)):
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
            "senha": usuario.senha,
            "endereco": usuario.endereco,
            "telefone": usuario.telefone,
            "foto_perfil": usuario.foto_perfil,
        }
    }

    path = "dados_exportados.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)

    return FileResponse(path, filename="dados_exportados.json", media_type="application/json")


def parse_date_safe(data: dict, field: str):
    if field in data and isinstance(data[field], str):
        data[field] = datetime.datetime.strptime(data[field], "%Y-%m-%d").date()

@router.post("/importar-dados")
async def importar_dados(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    data = json.loads(content.decode("utf-8"))

    # aceita ambos singular e plural
    pessoas = data.get("pessoas") or data.get("pessoa") or []
    emprestimos = data.get("emprestimos") or data.get("emprestimo") or []
    usuario = data.get("usuario")

    if usuario:
        from models.usuario import Usuario

        db.add(Usuario(**usuario))
        db.commit()

    for p in pessoas:
        db.add(Pessoa(**p))

    db.commit()

    for e in emprestimos:
        parse_date_safe(e, "data_emprestimo")
        parse_date_safe(e, "data_devolucao_esperada")
        parse_date_safe(e, "data_devolucao_real")
        db.add(Emprestimo(**e))

    db.commit()

    return {"msg": "Importação concluída com sucesso"}