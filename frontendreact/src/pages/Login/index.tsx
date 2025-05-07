import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline, IoRefreshOutline  } from "react-icons/io5";
import { FiMail, FiLock, FiRefreshCcw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface Props {
  onShowRegister: () => void;
  onShowForgotPassword: () => void;
}

const Login = ({ onShowRegister, onShowForgotPassword }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#2c64dd' }}>
      <div className="w-full max-w-xs flex flex-col items-center">
        {/* Logo e título */}
        <h1 className="text-white text-4xl font-bold mb-6 flex items-center gap-2">
          Vai & Volta <FiRefreshCcw size={28} />
        </h1>
        <img src="/logo.png" alt="Logo" className="h-35 mb-8" />

        {/* Campo de email */}
        <div className="w-full relative mb-4">
          <FiMail className="absolute top-3 left-3 text-white" />
          <input
            type="email"
            placeholder="Insira o seu email"
            className="w-full pl-10 pr-4 py-2 rounded-md border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Campo de senha */}
        <div className="w-full relative mb-2">
          <FiLock className="absolute top-3 left-3 text-white" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Insira a sua senha"
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

        {/* Esqueci a senha */}
        <div className="w-full text-right mb-6">
          <button onClick={onShowForgotPassword} className="text-sm text-white/70 hover:underline cursor-pointer">
            Esqueceu a senha?
          </button>
        </div>

        {/* Botão de login */}
        <button onClick={() => navigate('/home')} className="w-full bg-white text-blue-600 font-bold py-2 rounded-xl hover:bg-gray-100 transition cursor-pointer">
          Acessar
        </button>

        {/* Cadastro */}
        <p className="text-sm text-white mt-6">
          Não possui uma conta?{" "}
          <button
            onClick={onShowRegister}
            className="text-white hover:underline cursor-pointer font-semibold"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

