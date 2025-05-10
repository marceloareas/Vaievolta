import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline, IoRefreshOutline  } from "react-icons/io5";
import { FiMail, FiLock, FiRefreshCcw } from "react-icons/fi";
import { Dialog } from '@headlessui/react';

interface Props {
    onBack: () => void;
}

const ForgotPassword = ({ onBack }: Props) => {
  const [email, setEmail] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [codigo, setCodigo] = useState(["", "", "", ""]);

  const navigate = useNavigate();

  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleCodigoChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const novoCodigo = [...codigo]; // copia o array atual (ex: ["", "", "", ""])
      novoCodigo[index] = value; // atualiza apenas o índice que foi digitado
      setCodigo(novoCodigo); // atualiza o estado com o novo array

      // Vai para o próximo campo automaticamente
      if (value && index < refs.length - 1) {
        refs[index + 1].current?.focus();
      }

    }
  };

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
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-white bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* Botão de recuperar senha */}
        <button className="w-full mb-3 bg-white text-blue-600 font-bold py-2 rounded-xl hover:bg-gray-100 transition cursor-pointer" onClick={() => setMostrarModal(true)}>
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

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
          <div className="bg-white rounded-2xl px-6 py-8 shadow-lg w-[90%] max-w-md relative">
            <button onClick={() => setMostrarModal(false)} className="absolute top-3 right-3 text-blue-600 font-bold text-lg">×</button>

            <h2 className="text-center text-sm text-gray-800 font-semibold mb-4">
              Confirme o seu e-mail e digite o código de verificação abaixo:
            </h2>

            <div className="flex justify-center gap-2 mb-6">
              {codigo.map((digit, index) => (
                <input
                  key={index}
                  ref={refs[index]}
                  value={digit}
                  onChange={(e) => handleCodigoChange(index, e.target.value)}
                  maxLength={1}
                  className="w-12 h-12 text-center border border-gray-400 rounded-md text-lg"
                />
              ))}
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-700 transition"
              onClick={() => {
                // Aqui você pode validar o código
                console.log("Código digitado:", codigo.join(""));
                setMostrarModal(false);

                // Navegar para a página de nova senha
                navigate('/nova_senha');

              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;

