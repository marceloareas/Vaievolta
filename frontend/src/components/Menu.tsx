import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaHome, FaUserAlt } from "react-icons/fa";
import { SiGooglesheets } from "react-icons/si";
import { MdOutlineAddBox } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import ModalEmprestimo from "./Modal/ModalCreateEmprestimo";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Menu = () => {
  const location = useLocation();
  const [abrirDrawer, setAbrirDrawer] = useState(false);

  const getIconColor = (path: string) => location.pathname === path ? "#133E87" : "#444";

  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Deseja mesmo sair da conta ?",
      icon: "warning",
      width: "90%",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#808080",
      confirmButtonText: "Sair",
      cancelButtonText: "Cancelar",
      backdrop: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await Swal.fire({
          title: "Logout efetuado!",
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      }
      localStorage.removeItem("token");
      navigate("/");
    });
    setAbrirDrawer(false);
  }

  return (
    <>
      {/* Botão flutuante fixo para abrir o drawer */}
      <button
        onClick={() => setAbrirDrawer(true)}
        className="fixed top-4 left-2 z-50 p-2 bg-[#3090FF] text-white rounded-full shadow-lg hover:bg-[#2479d6] transition"
      >
        <FaBars size={22} />
      </button>

      <AnimatePresence>
        {abrirDrawer && (
          <>
            {/* Fundo escuro */}
            <motion.div
              className="fixed inset-0 backdrop-blur-sm bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAbrirDrawer(false)}
            />

            {/* Drawer lateral */}
            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-6 flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#2c64dd]">Menu</h2>
                <button
                  onClick={() => setAbrirDrawer(false)}
                  className="text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Conteúdo principal do Drawer */}
              <div className="flex-1 flex flex-col justify-between">
                <nav className="flex flex-col gap-6">
                  <Link to="/home" className="flex items-center gap-3 text-md font-medium" onClick={() => setAbrirDrawer(false)}>
                    <FaHome size={20} color={getIconColor("/")} />
                    <span className="text-gray-500">Home</span>
                  </Link>
                  <Link to="/historico" className="flex items-center gap-3 text-md font-medium" onClick={() => setAbrirDrawer(false)}>
                    <SiGooglesheets size={20} color={getIconColor("/historico")} />
                    <span className="text-gray-500">Histórico</span>
                  </Link>
                  <Link to="/perfil" className="flex items-center gap-3 text-md font-medium" onClick={() => setAbrirDrawer(false)}>
                    <FaUserAlt size={20} color={getIconColor("/perfil")} />
                    <span className="text-gray-500">Perfil</span>
                  </Link>
                </nav>

                
                {/* Botão Sair no final */}
                <button
                  onClick={handleLogout}
                  className="mt-6 self-start text-red-600 font-semibold hover:text-red-700 transition flex items-center gap-2"
                >
                  <TbLogout2 size={20} />
                  Sair
                </button>
              
              </div>
            </motion.div>

          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Menu;
