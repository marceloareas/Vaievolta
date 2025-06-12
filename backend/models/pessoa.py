# from sqlalchemy import Column, Integer, String
# from database import Base

# class Pessoa(Base):
#     __tablename__ = 'pessoas'

#     id = Column(Integer, primary_key=True, index=True)
#     nome = Column(String)
#     email = Column(String)
#     telefone = Column(String)
#     observacao = Column(String)

from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Pessoa(Base):
    __tablename__ = 'pessoa'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    email = Column(String)
    telefone = Column(String)
    observacao = Column(String)
    usuario_id = Column(Integer, ForeignKey('usuario.id'))  # Quem cadastrou essa pessoa