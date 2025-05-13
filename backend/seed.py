from database import SessionLocal
from models.pessoa import Pessoa

def populate_pessoas():
    db = SessionLocal()
    try:
        if db.query(Pessoa).count() == 0:
            pessoas = [
                Pessoa(nome="Maria Silva", email="maria@example.com", telefone="(11) 91234-5678", observacao="Cliente recorrente"),
                Pessoa(nome="João Souza", email="joao@example.com", telefone="(21) 98765-4321", observacao="Pagou com atraso"),
                Pessoa(nome="Ana Lima", email="ana@example.com", telefone="(31) 99876-5432", observacao="Prefere contato por WhatsApp"),
                Pessoa(nome="Carlos Mendes", email="carlos@example.com", telefone="(41) 95555-1234", observacao="Novo cliente"),
            ]
            db.add_all(pessoas)
            db.commit()
            print("Pessoas inseridas com sucesso.")
        else:
            print("Pessoas já cadastradas.")
    finally:
        db.close()