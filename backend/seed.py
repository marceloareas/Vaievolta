from models.emprestimo import Emprestimo
from database import SessionLocal
from models.pessoa import Pessoa
from datetime import date

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

def populate_emprestimos():
    db = SessionLocal()
    try:
        if db.query(Emprestimo).count() > 0:
            print("Empréstimos já cadastrados.")
            return

        exemplos = [
            ("Emprestimo #001", "Notebook Dell", "Emprestado para trabalho remoto", "2025-12-13", "João Silva"),
            ("Emprestimo #002", "Projetor Epson", "Uso em apresentação de TCC", "2026-01-05", "Maria Souza"),
            ("Emprestimo #003", "Caixa de Som JBL", "Uso em evento social", "2026-06-07", "Carlos Lima"),
            ("Emprestimo #004", "Tablet Samsung", "Leitura de documentos técnicos", "2026-10-01", "Ana Beatriz"),
            ("Emprestimo #005", "Impressora HP", "Suporte para impressão de contratos", "2026-11-22", "Ricardo Alves"),
            ("Emprestimo #006", "Scanner Canon", "Digitalização de arquivos físicos", "2026-12-15", "Laura Mendes"),
            ("Emprestimo #007", "Câmera Nikon", "Cobertura fotográfica de evento", "2027-01-03", "Fábio Torres"),
            ("Emprestimo #008", "Monitor LG 27''", "Montagem de estação de trabalho", "2027-04-18", "Juliana Rocha"),
            ("Emprestimo #009", "Celular de teste", "Testes de app interno", "2027-09-09", "Vinícius Duarte"),
            ("Emprestimo #010", "Headset Logitech", "Participação em reuniões remotas", "2028-02-21", "Patrícia Gomes"),
            ("Emprestimo #011", "TV Samsung 50''", "Apresentação institucional", "2028-05-10", "Marcos Ribeiro"),
            ("Emprestimo #012", "Tripé profissional", "Filmagem de workshop", "2028-07-19", "Fernanda Costa"),
        ]

        for nome, item, descricao, data_devolucao_esperada, tomador in exemplos:
            emprestimo = Emprestimo(
                nome=nome,
                item=item,
                descricao=descricao,
                data_emprestimo=date.today(),
                data_devolucao_esperada=date.fromisoformat(data_devolucao_esperada),
                data_devolucao_real=None,
                status="pendente",
                foto_url=None,
                tomador=tomador
            )
            db.add(emprestimo)

        db.commit()
        print("Empréstimos populados com sucesso.")
    finally:
        db.close()