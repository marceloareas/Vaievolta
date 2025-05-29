import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../components/Menu";
import Swal from "sweetalert2";

interface Emprestimo {
  id: number;
  nome: string;
  item: string;
  descricao?: string;
  status: string;
  data_emprestimo: string;
  data_devolucao_esperada: string;
  data_devolucao_real?: string;
  foto_url?: string;
}

const Historico = () => {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/historico", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Erro ao carregar histórico");

        const data = await res.json();
        // console.log("Dados do historico:", data);
        setEmprestimos(data);

      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        Swal.fire({
          icon: "error",
          title: "Erro ao carregar histórico",
          text: "Tente novamente mais tarde.",
        });
      }
    };

    carregarHistorico();
  }, []);

  return (
    <div className="min-h-screen bg-[#2c64dd] text-white px-4 pt-24 pb-8 flex flex-col">
      <header className="w-full flex items-center justify-center px-6 py-3 fixed top-1 left- bg-[#2c64dd] z-40">
        <Menu />
        <h2 className="text-white text-2xl font-bold flex items-center gap-2 ml-5">
          Histórico
        </h2>
        <img src="/logo.png" alt="Logo" className="h-10 ml-4" />
      </header>

      <div className="space-y-3 max-h-[75vh] overflow-y-auto mt-2">
        {emprestimos.length > 0 ? (
          emprestimos.map((item) => (
            <div key={item.id} className="bg-white text-blue-600 rounded-lg p-3 shadow">
              <p className="font-bold">{item.nome}</p>
              <p className="text-sm">Item: {item.item}</p>
              <p className="text-sm">Status: {item.status}</p>
              <p className="text-sm">Empréstimo: {new Date(item.data_emprestimo).toLocaleDateString("pt-BR")}</p>
              <p className="text-sm">Devolução Esperada: {new Date(item.data_devolucao_esperada).toLocaleDateString("pt-BR")}</p>
              {item.data_devolucao_real && (
                <p className="text-sm">Devolvido em: {new Date(item.data_devolucao_real).toLocaleDateString("pt-BR")}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-white text-center mt-4">Nenhum empréstimo encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Historico;
