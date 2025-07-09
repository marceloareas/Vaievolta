import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline, IoRefreshOutline  } from "react-icons/io5";
import { FiMail, FiLock, FiRefreshCcw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useUser } from "../../contexts/UserContext";
import AnimatedContent from "../../components/AnimatedContent";
import FadeContent from "../../components/FadeContent";

interface Props {
  onShowRegister: () => void;
  onShowForgotPassword: () => void;
}

const Login = ({ onShowRegister, onShowForgotPassword }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  
  const { setUser } = useUser();

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        throw new Error("Email ou senha inválidos");
      }

      const data = await response.json();
      const { user, access_token } = data;
      setUser(user);
      
      localStorage.setItem("token", access_token); // ✅ salva o token JWT
      navigate("/home");

    } catch (error) {
      console.error("Erro no login:", error);
      await Swal.fire({
        title: "Erro no login",
        text: "Email ou senha inválidos",
        icon: "error",
        width: "90%",
        backdrop: true,
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <FadeContent blur={true} duration={600} easing="ease-out" initialOpacity={0}>
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#2c64dd' }}>
        <div className="w-full max-w-xs flex flex-col items-center">
    
          {/* Logo e título */}
          
            
          <h1 className="text-white text-4xl font-bold mb-6 flex items-center gap-2">
            Vai & Volta <FiRefreshCcw size={28} />
          </h1>
          <img src="/logo.png" alt="Logo" className="h-35 mb-8" />

          {/* <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={true}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            delay={0.3}
          > 
            <div className="flex flex-col items-center">
              <h1 className="text-white text-4xl font-bold mb-6 flex items-center gap-2">
                Vai & Volta <FiRefreshCcw size={28} />
              </h1>
              <img src="/logo.png" alt="Logo" className="h-35 mb-8" />
            </div>
          </AnimatedContent> */}
    
          {/* Formulário */}
          <form
            onSubmit={(e) => {
              e.preventDefault(); // evita reload da página
              handleLogin();
            }}
            className="w-full"
          >
            {/* Campo de email */}
            <div className="w-full relative mb-4">
              <FiMail className="absolute top-3 left-3 text-white" />
              <input
                type="email"
                placeholder="Insira o seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
    
            {/* Campo de senha */}
            <div className="w-full relative mb-2">
              <FiLock className="absolute top-3 left-3 text-white" />
              <input
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
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
              <button
                type="button"
                onClick={onShowForgotPassword}
                className="text-sm text-white/70 hover:underline cursor-pointer"
              >
                Esqueceu a senha?
              </button>
            </div>
    
            {/* Botão de login */}
            <button
              type="submit" // <-- agora é submit!
              className="w-full bg-white text-blue-600 font-bold py-2 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              Acessar
            </button>

            <button
              type="button"
              className="w-full mt-4 bg-blue-900 text-white font-bold py-2 rounded-xl hover:bg-blue-950 transition cursor-pointer"
              onClick={() => navigate("/")}
            >
              Escolha de modo
            </button>
            

          </form>
    
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
    </FadeContent>
  );
};

export default Login;

