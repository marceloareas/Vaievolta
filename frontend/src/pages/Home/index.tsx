import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline, IoRefreshOutline  } from "react-icons/io5";
import { FiMail, FiLock, FiRefreshCcw, FiSearch } from "react-icons/fi";
import { HiOutlineQrcode } from "react-icons/hi";

const Home = () => {

    const emprestimos = [
        { nome: "Nome_Emp #001", data: "13/12/2025" },
        { nome: "Nome_Emp #002", data: "05/01/2026" },
        { nome: "Nome_Emp #003", data: "07/06/2026" },
        { nome: "Nome_Emp #004", data: "01/10/2026" },
    ];

    return (
        <div className="min-h-screen bg-[#2c64dd] text-white px-4 pt-28 pb-6">
            
                {/* Header */}
                <header className="w-full flex items-center justify-center gap-4 py-4 px-6 fixed top-0 bg-[#2c64dd] z-50">
                    <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                    Bem-vindo, Fulano
                    </h2>
                    <img src="/logo.png" alt="Logo" className="h-10" />
                </header>

                {/* Campo de busca */}
                <div className="mb-6">
                    <div className="flex items-center bg-white rounded-lg px-3 py-2">
                    <input
                        type="text"
                        placeholder="Buscar por empréstimo"
                        className="flex-1 text-sm text-black placeholder-blue-600 outline-none"
                    />
                    <FiSearch className="text-blue-600 ml-2 font-bold" />
                    </div>
                </div>

                {/* Título */}
                <h2 className="text-lg font-semibold mb-3">Meus empréstimos</h2>

                {/* Lista de empréstimos */}
                <div className="space-y-3">
                    {emprestimos.map((item, index) => (
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
                    ))}
                </div>
            
        </div>
      );
};

export default Home;

