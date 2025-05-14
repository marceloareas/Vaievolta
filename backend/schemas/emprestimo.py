from pydantic import BaseModel
from datetime import date
from typing import Optional

class EmprestimoBase(BaseModel):
    nome: str
    item: str
    descricao: str
    data_emprestimo: date
    data_devolucao_esperada: date
    data_devolucao_real: Optional[date] = None
    status: str
    foto_url: Optional[str] = None
    tomador: str

class EmprestimoCreate(EmprestimoBase):
    pass

class EmprestimoDelete(BaseModel):
    id: int

class EmprestimoOut(EmprestimoBase):
    id: int
    class Config:
        from_attributes = True
