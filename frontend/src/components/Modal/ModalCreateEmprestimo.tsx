import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import Emprestimo from "../../types/index"; // Importando o tipo Emprestimo

import ModalPessoa from "../Modal/ModalAddPessoa"; // Importando o modal de criação de pessoa
import Swal from "sweetalert2";

interface Pessoa {
  id: number;
  nome: string;
}

interface ModalEmprestimoProps {
  aberto: boolean;
  onFechar: () => void;
  onAdicionar: (emprestimo: Emprestimo) => void; // função para adicionar o empréstimo
}

const ModalEmprestimo = ({ aberto, onFechar, onAdicionar}: ModalEmprestimoProps) => {
  const [nome, setNome] = useState("");
  const [item, setItem] = useState("");
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [tomador, setTomador] = useState("");
  const [data_devolucao_esperada, setDataDevolucao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [abrirModalPessoa, setAbrirModalPessoa] = useState(false);

  useEffect(() => {
      fetch("http://localhost:8000/pessoas/") // ajuste a URL conforme sua rota
        .then((res) => res.json())
        .then((data) => setPessoas(data))
        .catch((err) => console.error("Erro ao buscar pessoas:", err));
  }, []);

  if (!aberto) return null;

  const adicionarUmaSemana = () => {
    
    const dataBase = data_devolucao_esperada ? new Date(data_devolucao_esperada) : new Date();
    dataBase.setDate(dataBase.getDate() + 7);
    const novaData = dataBase.toISOString().split('T')[0];

    setDataDevolucao(novaData);
  };

  const adicionarUmMes = () => {
    
    const dataBase = data_devolucao_esperada ? new Date(data_devolucao_esperada) : new Date();
    dataBase.setMonth(dataBase.getMonth() + 1);
    const novaData = dataBase.toISOString().split('T')[0];

    setDataDevolucao(novaData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoEmprestimo = { 
      nome,
      item,
      tomador,
      data_devolucao_esperada,
      descricao,
      foto,
    };

    onAdicionar(novoEmprestimo); // chama a função de adicionar empréstimo
    onFechar(); // fecha modal após envio
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm max-h-[95vh] overflow-hidden flex flex-col">

            
            {/* Cabeçalho */}
            <div className="flex justify-between items-center pt-4 pr-4 pl-4 pb-1 border-b">
              <h2 className="text-xl font-bold text-[#2c64dd]">Adicionar empréstimo</h2>
              <button onClick={onFechar} className="text-xl text-[#2c64dd] font-bold">×</button>
            </div>

            {/* Conteúdo com scroll */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-2">
                <p className="text-sm text-gray-500">Nome:</p>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border rounded text-black placeholder-gray-500" />
                <p className="text-sm text-gray-500">Item:</p>
                <input type="text" value={item} onChange={(e) => setItem(e.target.value)} className="w-full p-2 border rounded text-black placeholder-gray-500" />
                <p className="text-sm text-gray-500">Selecione um tomador:</p>
                <div className="flex items-center gap-2">
                  <select
                    value={tomador}
                    onChange={(e) => setTomador(e.target.value)}
                    className="flex-1 p-2 border rounded text-black bg-white max-h-40 overflow-y-auto"
                  >
                    <option value="" disabled>Selecione...</option>
                    {pessoas.map((pessoa) => (
                      <option key={pessoa.id} value={pessoa.id}>
                        {pessoa.nome}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    type="button"
                    onClick={() => setAbrirModalPessoa(true)}
                    className="bg-[#2c64dd] text-white p-2 rounded-full font-semibold hover:bg-[#0f326f] transition"
                  >
                    <IoMdAddCircleOutline size={30} />
                  </button>

                </div>
                <p className="text-sm text-gray-500">Data de Devolução:</p>
                <input type="date" value={data_devolucao_esperada} onChange={(e) => setDataDevolucao(e.target.value)} className="w-full p-2 border rounded text-black placeholder-gray-500" />
                <div className="flex items-center gap-2">
                  <button type="button" onClick={adicionarUmaSemana} className="w-full bg-[#2c64dd] text-white py-2 rounded font-semibold hover:bg-[#0f326f] transition" >+1 Semana</button>
                  <button type="button" onClick={adicionarUmMes} className="w-full bg-[#2c64dd] text-white py-2 rounded font-semibold hover:bg-[#0f326f] transition">+1 Mês</button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Descrição:</p>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full p-2 border rounded text-black placeholder-gray-500" rows={3} />
                <p className="text-sm text-gray-500">Foto:</p>

                {previewUrl && (
                  <div className="mt-2">
                    <img
                      src={previewUrl}
                      alt="Pre-view da imagem"
                      className="w-full max-h-64 object-contain border rounded"
                    />
                  </div>
                )}
                <input type="file" ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFoto(file);

                    if (file) {
                      const url = URL.createObjectURL(file);
                      setPreviewUrl(url);
                    }
                  }}
                  className="hidden"/>

                <button type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Dica!",
                      text: "Se possível, tire uma foto da pessoa com o objeto emprestado.",
                      icon: "info",
                      confirmButtonText: "OK",
                    }).then((result) => {
                      if (result.isConfirmed && fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    });
                  }}
                  className="w-full bg-[#2c64dd] text-white py-2 rounded font-semibold hover:bg-[#0f326f] transition">
                  Selecionar imagem
                </button>

            </form>
            </div>

            {/* Rodapé com botão fixo */}
            <div className="p-4 border-t">
            <button type="submit" onClick={handleSubmit} className="w-full bg-[#133E87] text-white py-2 rounded font-semibold hover:bg-[#0f326f] transition">
                Adicionar
            </button>
            </div>
        </div>
      
        <ModalPessoa
          aberto={abrirModalPessoa}
          onFechar={() => setAbrirModalPessoa(false)}
          onCriar={async (novaPessoa) => {
            try {
              const response = await fetch("http://localhost:8000/pessoas/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  nome: novaPessoa.nome,
                  email: novaPessoa.email,
                  telefone: novaPessoa.telefone,
                  observacao: novaPessoa.descricao,
                }),
              });

              const pessoaCriada = await response.json();

              setPessoas((prev) => [...prev, pessoaCriada]); // Atualiza a lista de pessoas
              setTomador(pessoaCriada.id); // ir por padrao direto pro select

              await Swal.fire({
                icon: "success",
                title: "Pessoa criada com sucesso!",
                showConfirmButton: true,
                confirmButtonText: "OK",
                backdrop: true,
              });

            } catch (err) {
              await Swal.fire({
                title: "Erro ao criar pessoa",
                text: "Por favor, verifique os dados e tente novamente.",
                icon: "error",
                width: "90%",
                showConfirmButton: true,
                confirmButtonText: "OK",
                timerProgressBar: true
              });
            }
          }}
        />
      </div>
      

      

  );
};

export default ModalEmprestimo;
