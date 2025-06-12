# from sqlalchemy import Column, Integer, String, Date, ForeignKey
# from database import Base

# class Emprestimo(Base):
#     __tablename__ = 'emprestimos'

#     id = Column(Integer, primary_key=True, index=True)
#     nome = Column(String, nullable=False)
#     item = Column(String)
#     descricao = Column(String)
#     data_emprestimo = Column(Date)
#     data_devolucao_esperada = Column(Date)
#     data_devolucao_real = Column(Date, nullable=True)
#     status = Column(String)
#     foto_url = Column(String)
#     # tomador = Column(String)

from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Emprestimo(Base):
    __tablename__ = 'emprestimo'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    item = Column(String)
    descricao = Column(String)
    data_emprestimo = Column(Date)
    data_devolucao_esperada = Column(Date)
    data_devolucao_real = Column(Date, nullable=True)
    status = Column(String)
    foto_url = Column(String)

    pessoa_id = Column(Integer, ForeignKey('pessoa.id'))     # Tomador do empréstimo
    usuario_id = Column(Integer, ForeignKey('usuario.id', ondelete="CASCADE"))   # Quem realizou o empréstimo

    usuario = relationship("Usuario", back_populates="emprestimos")