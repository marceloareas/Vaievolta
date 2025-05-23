import { User } from "../contexts/UserContext";

// src/services/userService.ts
export const updateUser = async (dados: Partial<User>) => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8000/usuarios/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });
  
    if (!response.ok) throw new Error("Erro ao atualizar usuário");
  
    return response.json(); // { msg: "...", usuario: {...} }
  };
  