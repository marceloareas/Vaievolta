import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import api from "../../services/api";

const EscolherModo = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const escolherModo = (modo: "online" | "offline") => {
    if (modo === "offline") {
      fileInputRef.current?.click();
    } else {
      navigate("/auth");
    }
  };

  const importarJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      await api.post("/emprestimos/importar-dados", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/home");
    } catch (error) {
      alert(
        "Falha na importação: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
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
