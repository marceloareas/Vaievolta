import api from "./api";

export const login = async (email: string, senha: string) => {
    const response = await api.post("/login", { email, senha });
    return response.data;
};