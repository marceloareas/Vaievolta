from pydantic import BaseModel
from datetime import date
from typing import Optional

class EmprestimoBase(BaseModel):
    nome: str
    item: str
    descricao: str
    data_emprestimo: date
    data_devolucao_esperada: date
    status: str
    foto_url: Optional[str] = None
    pessoa_id: int

class EmprestimoCreate(EmprestimoBase):
    pass

class EmprestimoDelete(BaseModel):
    id: int

class EmprestimoUpdate(BaseModel):
    nome: Optional[str] = None
    item: Optional[str] = None
    descricao: Optional[str] = None
    data_emprestimo: Optional[date] = None
    data_devolucao_esperada: Optional[date] = None
    status: Optional[str] = None
    foto_url: Optional[str] = None
    pessoa_id: Optional[int] = None

class EmprestimoOut(EmprestimoBase):
    id: int
    nome_pessoa: Optional[str] = None
    data_devolucao_real: Optional[date] = None

    class Config:
        from_attributes = True
