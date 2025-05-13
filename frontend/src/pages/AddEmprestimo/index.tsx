import React, { useEffect, useState } from "react";

interface Pessoa {
  id: number;
  nome: string;
}

const AdicionarEmprestimo = () => {
  const [nome, setNome] = useState("");
  const [item, setItem] = useState("");
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [tomador, setTomador] = useState("");
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/pessoas") // ajuste a URL conforme sua rota
      .then((res) => res.json())
      .then((data) => setPessoas(data))
      .catch((err) => console.error("Erro ao buscar pessoas:", err));
  }, []);


  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados, por exemplo, para um servidor
    console.log({
      nome,
      item,
      tomador,
      dataDevolucao,
      descricao,
      foto,
    });
  };

  return (
    <div className="min-h-screen bg-[#2c64dd] p-6 flex flex-col justify-center items-center">
      <h2 className="text-3xl text-white font-bold mb-6">Adicionar empréstimo</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg space-y-4 overflow-y-auto max-h-screen"
      >
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-2 p-2 border rounded-lg border-gray-300"
            placeholder="Nome do empréstimo"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700">Item</label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="mt-2 p-2 border rounded-lg border-gray-300"
            placeholder="Item emprestado"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700">Tomador</label>
          <select
            value={tomador}
            onChange={(e) => setTomador(e.target.value)}
            required
            className="mt-2 p-2 border rounded-lg border-gray-300 max-h-32 overflow-y-auto"
          >
            <option value="" disabled>Selecione um tomador</option>
            {pessoas.map((pessoa) => (
              <option key={pessoa.id} value={pessoa.id}>
                {pessoa.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700">Data devolução</label>
          <input
            type="date"
            value={dataDevolucao}
            onChange={(e) => setDataDevolucao(e.target.value)}
            className="mt-2 p-2 border rounded-lg border-gray-300"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="mt-2 p-2 border rounded-lg border-gray-300"
            placeholder="Descrição do item"
            rows={4}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700">Upload da foto</label>
          <input
            type="file"
            onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
            className="mt-2 p-2 border rounded-lg border-gray-300"
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-[#133E87] text-white py-2 rounded-lg font-semibold"
        >
          Adicionar
        </button>
      </form>
    </div>
  );
};

export default AdicionarEmprestimo;
