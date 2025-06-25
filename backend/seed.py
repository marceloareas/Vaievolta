from models.emprestimo import Emprestimo
from models.pessoa import Pessoa
from models.usuario import Usuario
from database import get_db
from datetime import date

def populate_usuarios():
    db = next(get_db())
    if db.query(Usuario).count() == 0:
        usuario = Usuario(
            nome="Administrador",
            email="admin@example.com",
            senha="senha123",  # Em produção, criptografe!
            endereco="Rua Exemplo, 123",
            telefone="(00) 00000-0000"
        )
        db.add(usuario)
        db.commit()
        print("✅ Usuário administrador criado.")
    else:
        print("ℹ️ Usuários já cadastrados.")

def populate_pessoas():
    db = next(get_db())
    admin = db.query(Usuario).first()
    if not admin:
        print("⚠️ Crie um usuário antes de cadastrar pessoas.")
        return

    if db.query(Pessoa).count() == 0:
        pessoas = [
            Pessoa(nome="Maria Silva", email="maria@example.com", telefone="(11) 91234-5678", observacao="Cliente recorrente", usuario_id=admin.id),
            Pessoa(nome="João Souza", email="joao@example.com", telefone="(21) 98765-4321", observacao="Pagou com atraso", usuario_id=admin.id),
            Pessoa(nome="Ana Lima", email="ana@example.com", telefone="(31) 99876-5432", observacao="Prefere contato por WhatsApp", usuario_id=admin.id),
            Pessoa(nome="Carlos Mendes", email="carlos@example.com", telefone="(41) 95555-1234", observacao="Novo cliente", usuario_id=admin.id),
        ]
        db.add_all(pessoas)
        db.commit()
        print("✅ Pessoas inseridas com sucesso.")
    else:
        print("ℹ️ Pessoas já cadastradas.")

def populate_emprestimos():
    db = next(get_db())
    if db.query(Emprestimo).count() > 0:
        print("ℹ️ Empréstimos já cadastrados.")
        return

    admin = db.query(Usuario).first()
    if not admin:
        print("⚠️ Usuário administrador não encontrado.")
        return

    pessoas = db.query(Pessoa).all()
    pessoas_dict = {p.nome: p.id for p in pessoas}

    exemplos = [
        ("Emprestimo #001", "Notebook Dell", "Emprestado para trabalho remoto", "2025-12-13", "Maria Silva"),
        ("Emprestimo #002", "Projetor Epson", "Uso em apresentação de TCC", "2026-01-05", "João Souza"),
        ("Emprestimo #003", "Caixa de Som JBL", "Uso em evento social", "2026-06-07", "Carlos Mendes"),
        ("Emprestimo #004", "Tablet Samsung", "Leitura de documentos técnicos", "2026-10-01", "Ana Lima"),
    ]

    for nome, item, descricao, data_devolucao_esperada, nome_tomador in exemplos:
        pessoa_id = pessoas_dict.get(nome_tomador)
        if not pessoa_id:
            print(f"⚠️ Pessoa '{nome_tomador}' não encontrada.")
            continue

        emprestimo = Emprestimo(
            nome=nome,
            item=item,
            descricao=descricao,
            data_emprestimo=date.today(),
            data_devolucao_esperada=date.fromisoformat(data_devolucao_esperada),
            data_devolucao_real=None,
            status="Pendente",
            foto_url=None,
            pessoa_id=pessoa_id,
            usuario_id=admin.id
        )
        db.add(emprestimo)

    db.commit()
    print("✅ Empréstimos populados com sucesso.")
