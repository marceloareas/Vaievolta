from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.emprestimo import EmprestimoCreate, EmprestimoOut
from models.emprestimo import Emprestimo

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

@router.get("/", response_model=list[EmprestimoOut])
def listar_emprestimos(db: Session = Depends(get_db)):
    return db.query(Emprestimo).all()