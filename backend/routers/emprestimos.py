from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from database import get_db
from schemas.emprestimo import EmprestimoCreate, EmprestimoOut, EmprestimoDelete, EmprestimoUpdate
from models.emprestimo import Emprestimo
import datetime

router = APIRouter(prefix="/emprestimos", tags=["emprestimos"])

@router.post("/", response_model=EmprestimoOut)
def criar_emprestimo(emprestimo: EmprestimoCreate, db: Session = Depends(get_db)):
    try:
        novo = Emprestimo(**emprestimo.model_dump())  # Pydantic v2 (usa model_dump)
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
def listar_emprestimos(db: Session = Depends(get_db)):
    return (
        db.query(Emprestimo)
        .filter(Emprestimo.status != "Devolvido")
        .order_by(asc(Emprestimo.data_devolucao_esperada))
        .all()
    )