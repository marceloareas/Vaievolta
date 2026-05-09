import { User } from "../contexts/UserContext";
import api from "./api";

// src/services/userService.ts
export const updateUser = async (dados: Partial<User>) => {
  const res = await api.patch("/usuarios/me", dados);
  return res.data; // { msg: "...", usuario: {...} }
};

export const createUser = async (
  nome: string,
  email: string,
  senha: string,
) => {
  const response = await api.post("/usuarios/", { nome, email, senha });
  return response.data;
};

export const uploadUserPhoto = async (formData: FormData) => {
  const response = await api.post("/upload/imagem", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteUser = async () => {
  const response = await api.delete("/usuarios/me");
  return response.data; // { msg: "Usuário excluído com sucesso" }
};

export const changePassword = async (
  senha_atual: string,
  nova_senha: string,
) => {
  const response = await api.patch("/usuarios/me/senha", {
    senha_atual,
    nova_senha,
  });
  return response.data;
};
