import React, { useEffect, useState } from "react";
import Emprestimo from "../../types/index";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Pessoa } from "./ModalCreateEmprestimo";
import { IoMdAddCircleOutline } from "react-icons/io";
import ModalPessoa from "./ModalAddPessoa";
import { updateEmprestimo } from "../../services/emprestimoService";

interface ModalViewEmprestimoProps {
  aberto: boolean;
  onFechar: () => void;
  emprestimo?: Emprestimo;
  carregarEmprestimos: () => void;
}

const ModalViewEmprestimo = ({ aberto, onFechar, emprestimo, carregarEmprestimos }: ModalViewEmprestimoProps) => {
  const [modoEdicao, setModoEdicao] = useState(false);

  const [nome, setNome] = useState("");
  const [id, setId] = useState<number>();
  const [item, setItem] = useState("");
  const [tomador, setTomador] = useState("");
  const [tomadorId, setTomadorId] = useState<number | null>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [dataDevolucao, setDataDevolucao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState('');
  const [abrirModalPessoa, setAbrirModalPessoa] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (emprestimo) {
      // console.log("Carregando empréstimo:", emprestimo);
      setId(emprestimo.id);
      setNome(emprestimo.nome);
      setItem(emprestimo.item);
      setTomador(emprestimo.nome_pessoa || "");
      setTomadorId(emprestimo.pessoa_id || null);
      setDataDevolucao(emprestimo.data_devolucao_esperada);
      setDescricao(emprestimo.descricao);
      setFoto(emprestimo.foto_url || '');
    }
    setModoEdicao(false); // volta ao modo visual sempre que abre

    // console.log(tomador)

    fetch("http://localhost:8000/pessoas/")
        .then((res) => res.json())
        .then((data) => setPessoas(data))
        .catch((err) => console.error("Erro ao buscar pessoas:", err));

  }, [emprestimo]);

  const handleSalvar = async () => {

    // try {
    //   const dadosAtualizados = {
    //     id: id,
    //     nome: nome,
    //     item: item,
    //     tomador: tomador,
    //     data_devolucao_esperada: dataDevolucao,
    //     descricao: descricao,
    //     foto_url: foto,
    //   };

    //   if (id === undefined) {
    //     throw new Error("ID do empréstimo não definido.");
    //   }

    //   const data = await updateEmprestimo(id, dadosAtualizados);
    //   console.log("Empréstimo atualizado:", data);

    //   await Swal.fire({
    //     title: "Alterações salvas!",
    //     icon: "success",
    //     confirmButtonText: "OK",
    //   });
    // } catch (error) {
    //   console.error("Erro ao salvar alterações:", error);
    //   await Swal.fire({
    //     title: "Erro ao salvar",
    //     text: "Verifique os dados e tente novamente.",
    //     icon: "error",
    //   });
    // }

    await Swal.fire({
      title: "Salvo!",
      text: "O empréstimo foi salvo com sucesso.",
      icon: "success",
      width: "90%",
      backdrop: true,
      showConfirmButton: true,
      confirmButtonText: "OK",
      timerProgressBar: true
    })

    setModoEdicao(false);

    onFechar();
    
  };

  const handleExcluir = (id: number) => {
    Swal.fire({
      title: "Excluir empréstimo ?",
      text: "Essa ação não poderá ser desfeita.",
      icon: "warning",
      width: "90%",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#808080",
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      backdrop: true,
  
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Excluído:", { nome, item, tomador, dataDevolucao, descricao, foto });
      }

      // TODO: Adicionar lógica de exclusão no backend
      try {
        const response = await fetch(`http://localhost:8000/emprestimos/${id}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,  
          }),
        });
        if (!response.ok) {
          throw new Error("Erro ao excluir o empréstimo");
        }
      }
      catch (error) {
        console.error("Erro ao excluir o empréstimo:", error);
        await Swal.fire({
          icon: "error",
          title: "Erro ao excluir o empréstimo",
          text: "Tente novamente mais tarde.",
        });
      }
      await Swal.fire({
        title: "Excluído!",
        text: "O empréstimo foi excluído.",
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      onFechar();
      carregarEmprestimos();
    });
  }

  const handleDevolvido = (id: number) => {
    Swal.fire({
      title: "Marcar como devolvido ?",
      text: "Essa ação não poderá ser desfeita.",
      icon: "warning",
      width: "90%",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, confirmar",
      cancelButtonText: "Cancelar",
      backdrop: true,
  
    }).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Devolvido:", { nome, item, tomador, dataDevolucao, descricao, foto });
      }
        
      try {
        const response = await fetch(`http://localhost:8000/emprestimos/devolver/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        });
        if (!response.ok) {
          throw new Error("Erro ao marcar como devolvido");
        }
        await Swal.fire({
        title: "Devolvido!",
        text: "O empréstimo foi marcado como devolvido.",
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      }
      catch (error) {
        console.error("Erro ao marcar como devolvido:", error);
        await Swal.fire({
          icon: "error",
          title: "Erro ao marcar como devolvido",
          text: "Tente novamente mais tarde.",
        });
      }
      
      onFechar();
      carregarEmprestimos();
    });
  };

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Cabeçalho fixo */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-[#2c64dd]">
            {modoEdicao ? "Editar empréstimo" : "Detalhes do empréstimo"}
          </h2>
          <button onClick={onFechar} className="text-xl text-[#2c64dd] font-bold">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 text-black">
          {modoEdicao ? (
            <>
              <div>
                <label className="text-sm font-bold text-[#2c64dd] font-medium">Nome:</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border-1 border-blue-600 rounded-lg text-[#2c64dd]" />
              </div>

              <div>
                <label className="text-sm font-bold text-[#2c64dd] font-medium">Item:</label>
                <input value={item} onChange={(e) => setItem(e.target.value)} className="w-full p-2 border-1 border-blue-600 rounded-lg text-[#2c64dd]" />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={tomadorId || ""}
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

              <div>
                <label className="text-sm font-bold text-[#2c64dd] font-medium">Data de devolução:</label>
                <input type="date" value={dataDevolucao} onChange={(e) => setDataDevolucao(e.target.value)} className="w-full p-2 border-1 border-blue-600 rounded-lg text-[#2c64dd]" />
              </div>

              <div>
                <label className="text-sm font-bold text-[#2c64dd] font-medium">Descrição:</label>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full p-2 border-1 border-blue-600 rounded-lg text-[#2c64dd]" />
              </div>

              <div>
                <button type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Dica!",
                      text: "Tire uma foto da pessoa com o objeto emprestado.",
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

            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-bold text-[#2c64dd] font-medium">Nome:</label>
                <input
                  type="text"
                  value={nome}
                  readOnly
                  className="w-full p-2 rounded-lg text-[#0068df] bg-[#8dc2ff]"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#2c64dd] font-medium">Item:</label>
                <input
                  type="text"
                  value={item}
                  readOnly
                  className="w-full p-2 rounded-lg text-[#0068df] bg-[#8dc2ff]"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#2c64dd] font-medium">Tomador:</label>
                <input
                  type="text"
                  value={tomador}
                  readOnly
                  className="w-full p-2 rounded-lg text-[#0068df] bg-[#8dc2ff]"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#2c64dd] font-medium">Data de devolução:</label>
                <input
                  type="text"
                  value={new Date(dataDevolucao).toLocaleDateString("pt-BR")}
                  readOnly
                  className="w-full p-2 rounded-lg text-[#0068df] bg-[#8dc2ff]"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#2c64dd] font-medium">Descrição:</label>
                <textarea
                  value={descricao}
                  readOnly
                  rows={3}
                  className="w-full p-2 rounded-lg text-[#0068df] bg-[#8dc2ff] resize-none"
                />
              </div>

              {/* Área de imagem */}
              {foto && typeof foto === "string" && (
                <div>
                  <label className="text-sm font-bold text-[#2c64dd] font-medium">Foto:</label>
                  <div className="mt-2 w-full rounded-lg overflow-hidden border border-[#8dc2ff]">
                    <img
                      src={foto}
                      alt="Foto do empréstimo"
                      className="w-full h-48 object-cover rounded"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t space-y-2 p-5">
          {!modoEdicao ? (
            <>
              {/* Linha 1: Editar e Devolvido lado a lado */}
              <div className="flex justify-between gap-2 mb-3">
                <button
                  onClick={() => setModoEdicao(true)}
                  className="w-full px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDevolvido(id!)}
                  className="w-full px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Devolvido
                </button>
              </div>

              {/* Linha 2: Excluir botão grande e vermelho */}
              <button
                onClick={() => handleExcluir(id!)}
                className="w-full px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                Excluir
              </button>
            </>
          ) : (
            <div className="flex justify-between gap-2">
              <button
                onClick={handleSalvar}
                className="w-full px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Salvar
              </button>
              <button
                onClick={() => setModoEdicao(false)}
                className="w-full px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalViewEmprestimo;
