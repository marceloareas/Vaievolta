import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline, IoRefreshOutline  } from "react-icons/io5";
import { FiMail, FiLock, FiRefreshCcw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#2c64dd' }}>
      <div className="w-full max-w-xs flex flex-col items-center">
        {/* Logo e título */}
        <h1 className="text-white text-4xl font-bold mb-6 flex items-center gap-2">
          Vai & Volta <FiRefreshCcw size={28} />
        </h1>
        <img src="/logo.png" alt="Logo" className="h-35 mb-8" />

        <p className="text-sm text-white mb-3 text-left w-full">
            Insira sua nova senha:
        </p>

        {/* Campo de senha */}
        <div className="w-full relative mb-5">
          <FiLock className="absolute top-3 left-3 text-white" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="*******"
            className="w-full pl-10 pr-10 py-2 rounded-md border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-3 right-3 text-white cursor-pointer"
          >
            {showPassword ? (
              <IoEyeOffOutline size={20} />
            ) : (
              <IoEyeOutline size={20} />
            )}
          </button>
        </div>

        <p className="text-sm text-white mb-3 text-left w-full">
          Confirme sua nova senha:
        </p>

        {/* Campo de confirmação de senha */}
        <div className="w-full relative mb-8">
            <FiLock className="absolute top-3 left-3 text-white" />
            <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="*******"
                className="w-full pl-10 pr-10 py-2 rounded-md border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-3 right-3 text-white cursor-pointer"
            >
                {showConfirmPassword ? (
                <IoEyeOffOutline size={20} />
                ) : (
                <IoEyeOutline size={20} />
                )}
            </button>
        </div>

        {/* Botão de login */}
        <button onClick={() => navigate('/home')} className="w-full bg-white text-blue-600 font-bold py-2 rounded-xl hover:bg-gray-100 transition cursor-pointer">
          Salvar
        </button>

        {/* Voltar */}
        <button
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-xl hover:bg-blue-600 transition cursor-pointer mt-2"
            onClick={() => navigate('/')}
        >
            Voltar
        </button>
      </div>
    </div>
  );
};

export default NewPassword;

