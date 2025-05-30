import api from "./api";

export const fetchEmprestimos = async () => {
  const res = await api.get("/emprestimos/");
  return res.data;
};

export const createEmprestimo = async (emprestimo: any) => {
  const res = await api.post("/emprestimos/", emprestimo);
  return res.data;
};

export const updateEmprestimo = async (id: number, emprestimo: any) => {
  const res = await api.patch(`/emprestimos/editarEmprestimo/${id}`, emprestimo);
  return res.data;
};

export const uploadImagemEmprestimo = async (id: number, formData: FormData) => {
  return await api.post(`/emprestimos/imagemEmprestimo/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const devolverEmprestimo = async (id: number) => {
  return await api.put(`/emprestimos/devolver/${id}`, { id });
};

export const createPessoa = async (novaPessoa: {
  nome: string;
  email: string;
  telefone: string;
  descricao: string;
}) => {
  const response = await api.post("/pessoas/create", {
    nome: novaPessoa.nome,
    email: novaPessoa.email,
    telefone: novaPessoa.telefone,
    observacao: novaPessoa.descricao,
  });
  return response.data;
};
