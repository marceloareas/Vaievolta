import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline, IoRefreshOutline  } from "react-icons/io5";
import { FiMail, FiLock, FiRefreshCcw } from "react-icons/fi";

interface Props {
    onBack: () => void;
}

const ForgotPassword = ({ onBack }: Props) => {

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#2c64dd' }}>
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo e título */}
        <h1 className="text-white text-4xl font-bold mb-6 flex items-center gap-2">
          Vai & Volta <FiRefreshCcw size={28} />
        </h1>
        <img src="/logo.png" alt="Logo" className="h-35 mb-8" />

        <h4 className="text-white text-sm mb-4">
            Digite o seu endereço de e-mail para recuperar a senha:
        </h4>

        {/* Campo de email */}
        <div className="w-full relative mb-12">
          <FiMail className="absolute top-3 left-3 text-white" />
          <input
            type="email"
            placeholder="Insira o seu email"
            className="w-full pl-10 pr-4 py-2 rounded-md border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Botão de recuperar senha */}
        <button className="w-full mb-3 bg-white text-blue-600 font-bold py-2 rounded-xl hover:bg-gray-100 transition cursor-pointer">
          Recuperar senha
        </button>

        {/* Voltar */}
        <button
            onClick={onBack}
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-xl hover:bg-blue-600 transition cursor-pointer mt-2"
        >
            Voltar
        </button>


      </div>
    </div>
  );
};

export default ForgotPassword;

