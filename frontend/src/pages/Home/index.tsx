import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline, IoRefreshOutline  } from "react-icons/io5";
import { FiMail, FiLock, FiRefreshCcw, FiSearch } from "react-icons/fi";
import { HiOutlineQrcode } from "react-icons/hi";
import Footer from "../Footer/index"; // Importando o Footer

const Home = () => {

    const emprestimos = [
        { nome: "Nome_Emp #001", data: "13/12/2025" },
        { nome: "Nome_Emp #002", data: "05/01/2026" },
        { nome: "Nome_Emp #003", data: "07/06/2026" },
        { nome: "Nome_Emp #004", data: "01/10/2026" },
        { nome: "Nome_Emp #005", data: "22/11/2026" },
        { nome: "Nome_Emp #006", data: "15/12/2026" },
        { nome: "Nome_Emp #007", data: "03/01/2027" },
        { nome: "Nome_Emp #008", data: "18/04/2027" },
        { nome: "Nome_Emp #009", data: "09/09/2027" },
        { nome: "Nome_Emp #010", data: "21/02/2028" },
      ];

    // Estado para armazenar a pesquisa
    const [searchTerm, setSearchTerm] = useState("");

    // Filtra os empréstimos com base no nome
    const filteredEmprestimos = emprestimos.filter((item) =>
        item.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#2c64dd] text-white px-4 pt-28 pb-6 flex flex-col">
          {/* Header */}
          <header className="w-full flex items-center justify-center gap-4 py-4 px-6 fixed top-0 bg-[#2c64dd] z-50">
            <h2 className="text-white text-2xl font-bold flex items-center gap-2">
              Bem-vindo, Fulano
            </h2>
            <img src="/logo.png" alt="Logo" className="h-10" />
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
          <h2 className="text-lg font-semibold mb-3">Meus empréstimos</h2>
    
          {/* Lista de empréstimos */}
          <div className="space-y-3 max-h-96 overflow-y-auto pb-18">
            {filteredEmprestimos.length > 0 ? (
              filteredEmprestimos.map((item, index) => (
                <div
                  key={index}
                  className="bg-white text-blue-600 rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold">{item.nome}</p>
                    <p className="text-sm">Devolução prevista: {item.data}</p>
                  </div>
                  <HiOutlineQrcode size={24} />
                </div>
              ))
            ) : (
              <p className="text-white">Nenhum empréstimo encontrado</p> // Caso nenhum empréstimo seja encontrado
            )}
          </div>
          {/* Footer */}
            <Footer />
        </div>
      );
    };

export default Home;

