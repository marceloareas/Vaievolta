import { useState } from "react";

interface ModalPessoaProps {
  aberto: boolean;
  onFechar: () => void;
  onCriar: (novaPessoa: { nome: string, email: string, telefone: string, descricao: string }) => void;
}

const ModalPessoa = ({ aberto, onFechar, onCriar }: ModalPessoaProps) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim() === "") return;
    onCriar({ nome, email, telefone, descricao });
    setNome("");
    onFechar();
  };

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm">
        <h2 className="text-xl font-bold text-[#2c64dd] mb-4">Adicionar Pessoa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome da pessoa"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded text-black"
          />

          <input
            type="text"
            placeholder="Email da pessoa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded text-black"
          />

          <input
            type="text"
            placeholder="Telefone da pessoa"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full p-2 border rounded text-black"
          />

          <textarea
            placeholder="Descrição"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border rounded text-black"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onFechar} className="text-gray-500">Cancelar</button>
            <button type="submit" className="bg-[#2c64dd] text-white px-4 py-2 rounded">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPessoa;
