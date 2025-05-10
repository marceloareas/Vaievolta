import React, { useState } from "react";

interface ModalEmprestimoProps {
  aberto: boolean;
  onFechar: () => void;
}

const ModalEmprestimo = ({ aberto, onFechar }: ModalEmprestimoProps) => {
  const [nome, setNome] = useState("");
  const [item, setItem] = useState("");
  const [tomador, setTomador] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  if (!aberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nome, item, tomador, dataDevolucao, descricao, foto });
    onFechar(); // fecha modal após envio
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm max-h-[90vh] overflow-hidden flex flex-col">

            
            {/* Cabeçalho */}
            <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold text-[#2c64dd]">Adicionar empréstimo</h2>
            <button onClick={onFechar} className="text-xl text-[#2c64dd] font-bold">×</button>
            </div>

            {/* Conteúdo com scroll */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border rounded text-black placeholder-gray-500" />
                <input type="text" placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} className="w-full p-2 border rounded text-black placeholder-gray-500" />
                <input type="text" placeholder="Tomador" value={tomador} onChange={(e) => setTomador(e.target.value)} className="w-full p-2 border rounded text-black placeholder-gray-500" />
                <input type="date" value={dataDevolucao} onChange={(e) => setDataDevolucao(e.target.value)} className="w-full p-2 border rounded text-black placeholder-gray-500" />
                <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full p-2 border rounded text-black placeholder-gray-500" rows={3} />
                <input type="file" onChange={(e) => setFoto(e.target.files?.[0] || null)} className="w-full p-2 border rounded text-black placeholder-gray-500" />
            </form>
            </div>

            {/* Rodapé com botão fixo */}
            <div className="p-4 border-t">
            <button type="submit" onClick={handleSubmit} className="w-full bg-[#133E87] text-white py-2 rounded font-semibold hover:bg-[#0f326f] transition">
                Adicionar
            </button>
            </div>
        </div>
        </div>

  );
};

export default ModalEmprestimo;
