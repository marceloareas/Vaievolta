import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const EscolherModo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const escolherModo = async (modo: "online" | "offline") => {
    await fetch("http://localhost:8000/trocar-modo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modo }),
    });

    if (modo === "offline") {
      // abre seleção do arquivo
      fileInputRef.current?.click();
    } else {
      navigate("/auth");
    }
  };

  const importarJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:8000/importar-dados", {
      method: "POST",
      body: formData,
    });

    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-600 text-white">
      <h1 className="text-3xl font-bold mb-8">Escolha o modo de uso</h1>

      <button
        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg mb-4"
        onClick={() => escolherModo("online")}
      >
        Modo Online (com login)
      </button>

      <button
        className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg"
        onClick={() => escolherModo("offline")}
      >
        Modo Offline (sem login)
      </button>

      {/* input escondido */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importarJSON}
        className="hidden"
      />
    </div>
  );
};

export default EscolherModo;
