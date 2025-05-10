import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline, IoRefreshOutline  } from "react-icons/io5";
import { FiMail, FiLock, FiRefreshCcw, FiSearch } from "react-icons/fi";
import { HiOutlineQrcode } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";

import Footer from "../Footer/index"; // Importando o Footer
import Menu from "../../components/Menu";

import ModalEmprestimo from "../../components/Modal/ModalCreateEmprestimo";
import ModalViewEmprestimo from "../../components/Modal/ModalViewEmprestimo";
import Emprestimo from "../../types/index"; // Importando o tipo Emprestimo

const Home = () => {

    const [abrirModal, setAbrirModal] = useState(false);

    const [viewEmprestimoAberto, setViewEmprestimoAberto] = useState(false);
    const [emprestimoSelecionado, setEmprestimoSelecionado] = useState<Emprestimo | null>(null);

    const emprestimos = [
      {
        nome: "Emprestimo #001",
        item: "Notebook Dell",
        tomador: "João Silva",
        dataDevolucao: "2025-12-13",
        descricao: "Emprestado para trabalho remoto",
        foto: null,
      },
      {
        nome: "Emprestimo #002",
        item: "Projetor Epson",
        tomador: "Maria Souza",
        dataDevolucao: "2026-01-05",
        descricao: "Uso em apresentação de TCC",
        foto: null,
      },
      {
        nome: "Emprestimo #003",
        item: "Caixa de Som JBL",
        tomador: "Carlos Lima",
        dataDevolucao: "2026-06-07",
        descricao: "Uso em evento social",
        foto: null,
      },
      {
        nome: "Emprestimo #004",
        item: "Tablet Samsung",
        tomador: "Ana Beatriz",
        dataDevolucao: "2026-10-01",
        descricao: "Leitura de documentos técnicos",
        foto: null,
      },
      {
        nome: "Emprestimo #005",
        item: "Impressora HP",
        tomador: "Ricardo Alves",
        dataDevolucao: "2026-11-22",
        descricao: "Suporte para impressão de contratos",
        foto: null,
      },
      {
        nome: "Emprestimo #006",
        item: "Scanner Canon",
        tomador: "Laura Mendes",
        dataDevolucao: "2026-12-15",
        descricao: "Digitalização de arquivos físicos",
        foto: null,
      },
      {
        nome: "Emprestimo #007",
        item: "Câmera Nikon",
        tomador: "Fábio Torres",
        dataDevolucao: "2027-01-03",
        descricao: "Cobertura fotográfica de evento",
        foto: null,
      },
      {
        nome: "Emprestimo #008",
        item: "Monitor LG 27''",
        tomador: "Juliana Rocha",
        dataDevolucao: "2027-04-18",
        descricao: "Montagem de estação de trabalho",
        foto: null,
      },
      {
        nome: "Emprestimo #009",
        item: "Celular de teste",
        tomador: "Vinícius Duarte",
        dataDevolucao: "2027-09-09",
        descricao: "Testes de app interno",
        foto: null,
      },
      {
        nome: "Emprestimo #010",
        item: "Headset Logitech",
        tomador: "Patrícia Gomes",
        dataDevolucao: "2028-02-21",
        descricao: "Participação em reuniões remotas",
        foto: null,
      },
      {
        nome: "Emprestimo #011",
        item: "TV Samsung 50''",
        tomador: "Marcos Ribeiro",
        dataDevolucao: "2028-05-10",
        descricao: "Apresentação institucional",
        foto: null,
      },
      {
        nome: "Emprestimo #012",
        item: "Tripé profissional",
        tomador: "Fernanda Costa",
        dataDevolucao: "2028-07-19",
        descricao: "Filmagem de workshop",
        foto: null,
      },
    ];

    // Estado para armazenar a pesquisa
    const [searchTerm, setSearchTerm] = useState("");

    // Filtra os empréstimos com base no nome
    const filteredEmprestimos = emprestimos.filter((item) =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const abrirModalViewEmprestimos = (emprestimo : Emprestimo) => {
      setEmprestimoSelecionado(emprestimo);
      setViewEmprestimoAberto(true);
    };

    return (
        <div className="min-h-screen bg-[#2c64dd] text-white px-4 pt-28 pb-6 flex flex-col">
          
          {/* Header */}
          <header className="w-full flex items-center justify-center px-6 py-3 fixed top-1 left- bg-[#2c64dd] z-40">

            {/* Navegação lateral */}
            <Menu />

            <h2 className="text-white text-2xl font-bold flex items-center gap-2 ml-5">
              Bem-vindo, Fulano
            </h2>
            <img src="/logo.png" alt="Logo" className="h-10 ml-4" />

          </header>
    
          {/* Campo de busca */}
          <div className="mb-4">
            <div className="flex items-center bg-white rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Buscar por empréstimo"
                className="flex-1 text-sm text-blue-600 placeholder-blue-600 outline-none font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado com o valor da busca
              />
              <FiSearch className="text-blue-600 ml-2 font-bold" />
            </div>
          </div>
    
          {/* Título */}
          <h2 className="text-lg font-semibold mb-3 mt-4">Meus empréstimos</h2>
    
          {/* Lista de empréstimos */}
          <div className="space-y-3 max-h-[54vh] overflow-y-auto pb-18">
            {filteredEmprestimos.length > 0 ? (
              filteredEmprestimos.map((item, index) => (
                <div
                  key={index}
                  className="bg-white text-blue-600 rounded-lg p-3 flex justify-between items-center"
                  onClick={() => abrirModalViewEmprestimos(item)} // Abre o modal ao clicar no item
                >
                  <div>
                    <p className="font-bold">{item.nome}</p>
                    <p className="text-sm">Devolução prevista: {new Date(item.dataDevolucao).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <HiOutlineQrcode size={24} />
                </div>
              ))
            ) : (
              <p className="text-white">Nenhum empréstimo encontrado</p> // Caso nenhum empréstimo seja encontrado
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setAbrirModal(true)}
              className="bg-[#2c64dd] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#0f326f] transition mt-4"
              title="Clique para adicionar um empréstimo"
            >
              <IoMdAddCircleOutline size={40} />
            </button>
          </div>
            
          {/* Modal de criação */}
          {abrirModal && (
            <ModalEmprestimo aberto={abrirModal} onFechar={() => setAbrirModal(false)} />
          )}

          {/* Modal de visualização + edição */}
          {emprestimoSelecionado && (
            <ModalViewEmprestimo
              aberto={viewEmprestimoAberto}
              onFechar={() => setViewEmprestimoAberto(false)}
              emprestimo={emprestimoSelecionado}
            />
          )}
        </div>
      );
    };

export default Home;

