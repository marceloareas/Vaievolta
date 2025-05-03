from sqlalchemy import Column, Integer, String, Date, ForeignKey
from database import Base

class Emprestimo(Base):
    __tablename__ = 'emprestimos'

    id = Column(Integer, primary_key=True, index=True)
    item = Column(String)
    descricao = Column(String)
    data_emprestimo = Column(Date)
    data_devolucao_esperada = Column(Date)
    data_devolucao_real = Column(Date, nullable=True)
    status = Column(String)
    foto_url = Column(String)
    tomador = Column(String)
