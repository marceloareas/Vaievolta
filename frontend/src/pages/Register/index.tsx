import { useState } from "react";
import { IoArrowBack, IoEyeOutline, IoEyeOffOutline, IoRefreshOutline } from "react-icons/io5";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import Swal from "sweetalert2";

interface Props {
  onBack: () => void;
}

const Register = ({ onBack }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      await Swal.fire({
          title: "As senhas não coincidem!",
          text: "Por favor, verifique e tente novamente.",  
          icon: "error",
          width: "90%",
          backdrop: true,
          timer: 1500,
          timerProgressBar: true
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/usuarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: form.name,
          email: form.email,
          senha: form.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      const data = await response.json();
      console.log("Usuário cadastrado com sucesso:", data);
      await Swal.fire({
        title: "Usuário cadastrado com sucesso!",
        text: "Você pode fazer login agora.",
        icon: "success",
        width: "90%",
        backdrop: true,
        timer: 2000,
        timerProgressBar: true
      });

      onBack(); // volta para tela anterior, se desejar

    } catch (error) {
      console.error("Erro:", error);
      await Swal.fire({
          title: "Erro ao cadastrar usuário",
          text: "Por favor, verifique os dados e tente novamente.",
          icon: "error",
          width: "90%",
          backdrop: true,
          timer: 1500,
          timerProgressBar: true
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#2c64dd] flex flex-col items-center px-4 pt-6 pb-6">
      {/* Logo separado no topo */}
      <div className="mb-4">
        <img src="/logo.png" alt="Logo" className="h-20" />
      </div>

      {/* Bloco do formulário com fundo escuro */}
      {/* <div className="bg-[#2348a1] w-full max-w-md rounded-t-3xl p-6 flex flex-col gap-4 flex-grow"> */}
      <div className="bg-[#2348a1] w-full max-w-md rounded-t-3xl p-6 flex flex-col gap-4 flex-grow min-h-[calc(100vh-5.5rem)]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-center relative mb-8">
          <button onClick={onBack} className="absolute left-0 text-white text-2xl cursor-pointer">
            <IoArrowBack />
          </button>
          <h1 className="text-white text-xl font-bold flex items-center gap-1">
            Vai & Volta <IoRefreshOutline size={20} />
          </h1>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {/* Nome */}
          <div className="relative mb-4">
            <FiUser className="absolute top-3 left-3 text-blue-700" />
            <input
              name="name"
              type="text"
              placeholder="Nome"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-white bg-white text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* Email */}
          <div className="relative mb-4">
            <FiMail className="absolute top-3 left-3 text-blue-700" />
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-white bg-white text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* Senha */}
          <div className="relative mb-4">
            <FiLock className="absolute top-3 left-3 text-blue-700" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 rounded-md border border-white bg-white text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-blue-700 cursor-pointer"
            >
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          {/* Confirmar Senha */}
          <div className="relative mb-4">
            <FiLock className="absolute top-3 left-3 text-blue-700" />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 rounded-md border border-white bg-white text-blue-700 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-blue-700 cursor-pointer"
            >
              {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>
        </div>

        {/* Botão */}
        <button
          onClick={handleRegister}
          className="mt-4 bg-white text-blue-600 font-bold py-2 rounded-2xl text-center hover:bg-blue-50 transition cursor-pointer"
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
};

export default Register;
