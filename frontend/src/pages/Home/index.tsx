import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineQrcode } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";
import AnimatedList from "../../components/AnimatedList";
import SplitText from "../../components/SplitText";

import Menu from "../../components/Menu";
import ModalEmprestimo from "../../components/Modal/ModalCreateEmprestimo";
import ModalViewEmprestimo from "../../components/Modal/ModalViewEmprestimo";
import Emprestimo from "../../types/index";

import { fetchEmprestimos, createEmprestimo } from "../../services/emprestimoService";
import { getUserFirstName } from "../../services/utils";
import { useUser } from "../../contexts/UserContext";

const Home = () => {
  const [abrirModal, setAbrirModal] = useState(false);
  const [viewEmprestimoAberto, setViewEmprestimoAberto] = useState(false);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState<Emprestimo | null>(null);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholder, setPlaceholder] = useState("Buscar por empréstimo");

  const [nomeuser, setNomeuser] = useState("");

  const [showToast, setShowToast] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    carregarEmprestimos();
  }, []);

  useEffect(() => {
    setNomeuser(user?.nome || "Usuário");
  }, [user]);

  useEffect(() => {
    const hoje = new Date();
  
    const emprestimosVencendo = emprestimos.filter((e) => {
      const dataDevolucao = new Date(e.data_devolucao_esperada);
      const diffDias = Math.ceil((dataDevolucao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return diffDias >= 0 && diffDias <= 2;
    });
  
    if (emprestimosVencendo.length > 0) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  
  }, [emprestimos]);

  const carregarEmprestimos = async () => {
    try {
      const data = await fetchEmprestimos();
      setEmprestimos(data);
    } catch (error) {
      console.error("Erro ao carregar empréstimos:", error);
      await Swal.fire({
        icon: "error",
        title: "Erro ao carregar empréstimos",
        text: "Tente novamente mais tarde.",
      });
    }
  };

  const adicionarEmprestimo = async (novoEmprestimo: Emprestimo) => {
    try {
      await createEmprestimo({
        nome: novoEmprestimo.nome,
        item: novoEmprestimo.item,
        pessoa_id: parseInt(novoEmprestimo.tomador), // <- tomador contém o ID da pessoa
        data_emprestimo: new Date().toISOString().split("T")[0],
        data_devolucao_esperada: novoEmprestimo.data_devolucao_esperada,
        descricao: novoEmprestimo.descricao,
        foto_url: "",
        status: "Pendente"
      });

      await Swal.fire({
        icon: "success",
        title: "Empréstimo cadastrado!",
        showConfirmButton: true,
        confirmButtonText: "OK",
      });

      carregarEmprestimos();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Erro ao cadastrar",
        text: "Verifique os dados e tente novamente.",
      });
    }
  };
  
  const filteredEmprestimos = emprestimos.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const animatedEmprestimos = filteredEmprestimos.map((item, index) => (
    <div
      key={index}
      className="bg-white text-blue-600 rounded-lg p-3 flex justify-between items-center"
      onClick={() => abrirModalViewEmprestimos(item)}
    >
      <div>
        <p className="font-bold">{item.nome}</p>
        <p className="text-sm">
          Devolução prevista: {new Date(item.data_devolucao_esperada).toLocaleDateString("pt-BR")}
        </p>
      </div>
      {item.foto_url && (
        <img
          src={encodeURI(`http://localhost:8000${item.foto_url}`)}
          alt="Foto do empréstimo"
          className="w-10 h-10 object-cover rounded cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            Swal.fire({
              imageUrl: `http://localhost:8000${item.foto_url}`,
              imageAlt: "Foto do empréstimo",
              showConfirmButton: false,
              backdrop: true,
            });
          }}
        />
      )}
    </div>
  ));


  const abrirModalViewEmprestimos = (emprestimo: Emprestimo) => {
    setEmprestimoSelecionado(emprestimo);
    setViewEmprestimoAberto(true);
  };

  return (
    <div className="min-h-screen bg-[#2c64dd] text-white px-4 pt-28 pb-6 flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-center px-6 py-3 fixed top-1 left- bg-[#2c64dd] z-40">
        <Menu />

        <h2 className="text-white font-bold flex items-center gap-2 ml-5 text-2xl sm:text-xl md:text-2xl truncate max-w-[300px]">
          Bem-vindo, {getUserFirstName(nomeuser)}
        </h2>
        <img src="/logo.png" alt="Logo" className="h-10 ml-4" />
      </header>

      {/* Campo de busca */}
      <div className="mb-4">
        <div className="flex items-center bg-white rounded-lg px-3 py-2">
          <input
            type="text"
            placeholder={placeholder}
            className="flex-1 text-sm text-blue-600 placeholder-blue-600 outline-none font-bold"
            value={searchTerm}
            onFocus={() => setPlaceholder("")}
            onBlur={() => {
              if (searchTerm === "") setPlaceholder("Buscar por empréstimo");
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="text-blue-600 ml-2 font-bold" />
        </div>
      </div>

      {/* Lista de empréstimos */}
      <h2 className="text-lg font-semibold mb-3 mt-4">Meus empréstimos</h2>
      <div className="space-y-3 max-h-[54vh] overflow-y-auto pb-18">
        {filteredEmprestimos.length > 0 ? (
          filteredEmprestimos.map((item, index) => (
            <div
              key={index}
              className="bg-white text-blue-600 rounded-lg p-3 flex justify-between items-center"
              onClick={() => abrirModalViewEmprestimos(item)}
            >
              <div>
                <p className="font-bold">{item.nome}</p>
                <p className="text-sm">
                  Devolução prevista: {new Date(item.data_devolucao_esperada).toLocaleDateString("pt-BR")}
                </p>
              </div>
              {item.foto_url && (
                <img
                  src={encodeURI(`http://localhost:8000${item.foto_url}`)}
                  alt="Foto do empréstimo"
                  className="w-10 h-10 object-cover rounded cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    Swal.fire({
                      imageUrl: `http://localhost:8000${item.foto_url}`,
                      imageAlt: "Foto do empréstimo",
                      showConfirmButton: false,
                      backdrop: true,
                    });
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-white">Nenhum empréstimo encontrado</p>
        )}
      </div>

      {/* Botão adicionar */}
      <div className="flex justify-center">
        <button
          onClick={() => setAbrirModal(true)}
          className="bg-[#2c64dd] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#0f326f] transition mt-4"
          title="Clique para adicionar um empréstimo"
        >
          <IoMdAddCircleOutline size={40} />
        </button>
      </div>

      {/* Modal adicionar */}
      {abrirModal && (
        <ModalEmprestimo
          aberto={abrirModal}
          onFechar={() => setAbrirModal(false)}
          onAdicionar={adicionarEmprestimo}
        />
      )}

      {/* Modal visualizar */}
      {emprestimoSelecionado && (
        <ModalViewEmprestimo
          aberto={viewEmprestimoAberto}
          onFechar={() => setViewEmprestimoAberto(false)}
          emprestimo={emprestimoSelecionado}
          carregarEmprestimos={carregarEmprestimos}
        />
      )}

      {showToast && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-3 rounded-lg shadow-lg z-50 w-[90%] max-w-sm relative">
          {/* Botão de fechar (X) */}
          <button
            onClick={() => setShowToast(false)}
            className="absolute top-1 right-2 text-black font-bold text-lg hover:text-red-600"
          >
            ×
          </button>
          {/* Conteúdo do Toast */}
          ⚠️ Você tem empréstimos vencendo nos próximos dias!
        </div>
      )}

    </div>

      

  );
};

export default Home;
