from sqlalchemy import Column, ForeignKey, Table, Integer
from database import Base

# Usuario cadastra Pessoa
usuario_cadastra_pessoa = Table(
    'usuario_cadastra_pessoa',
    Base.metadata,
    Column('usuario_id', Integer, ForeignKey('usuarios.id'), primary_key=True),
    Column('pessoa_id', Integer, ForeignKey('pessoas.id'), primary_key=True),
)

# Usuario realiza Emprestimo
usuario_realiza_emprestimo = Table(
    'usuario_realiza_emprestimo',
    Base.metadata,
    Column('usuario_id', Integer, ForeignKey('usuarios.id'), primary_key=True),
    Column('emprestimo_id', Integer, ForeignKey('emprestimos.id'), primary_key=True),
)

# Pessoa possui Emprestimo
pessoa_possui_emprestimo = Table(
    'pessoa_possui_emprestimo',
    Base.metadata,
    Column('pessoa_id', Integer, ForeignKey('pessoas.id'), primary_key=True),
    Column('emprestimo_id', Integer, ForeignKey('emprestimos.id'), primary_key=True),
)
