import React, { useState } from "react";
import { FaHome, FaUserAlt } from "react-icons/fa";
import { SiGooglesheets } from "react-icons/si";
import { MdOutlineAddBox } from "react-icons/md";
import { Link, useLocation } from "react-router-dom"; // Importando useLocation para pegar a rota atual
import ModalEmprestimo from "../../components/Modal/ModalCreateEmprestimo";

const Footer = () => {
  const location = useLocation(); // Hook para pegar a localização (rota atual)

  // TODO: Adicionar lógica para verificar se o usuário está logado e redirecionar para a tela de login se não estiver.

  // TODO: Adicionar lógica para mudar a cor dos icones baseado na rota atual
  // Função para definir a cor do ícone baseado na rota
  const getIconColor = (path) => {
    return location.pathname === path ? "#133E87" : "white"; // Verifica se a rota corresponde ao ícone
  };

  const [abrirModal, setAbrirModal] = useState(false);

  return (
    <footer className="w-full bg-[#3090FF] py-4 fixed bottom-0 left-0 flex justify-around items-center z-50">
      <div className="flex justify-around w-full max-w-[480px] mx-auto">
        <div className="flex flex-col items-center">
          <Link to="/" className="flex flex-col items-center">
            <FaHome size={24} className="text-white" style={{ color: getIconColor("/") }} />
            <span className="text-white text-xs">Home</span>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={() => setAbrirModal(true)} className="flex flex-col items-center">
            <MdOutlineAddBox size={24} style={{ color: getIconColor("/adicionar") }} />
            <span className="text-white text-xs">Adicionar</span>
          </button>
        </div>
        <div className="flex flex-col items-center">
          <Link to="/relatorio" className="flex flex-col items-center">
            <SiGooglesheets size={24} className="text-white" style={{ color: getIconColor("/relatorio") }} />
            <span className="text-white text-xs">Relatório</span>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Link to="/perfil" className="flex flex-col items-center">
            <FaUserAlt size={24} className="text-white" style={{ color: getIconColor("/perfil") }} />
            <span className="text-white text-xs">Perfil</span>
          </Link>
        </div>
      </div>

      {abrirModal && (
        <ModalEmprestimo aberto={abrirModal} onFechar={() => setAbrirModal(false)} />
      )}

    </footer>
  );
};

export default Footer;
