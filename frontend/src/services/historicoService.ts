import api from "./api";

export const fetchHistorico = async () => {
    const response = await api.get("/historico");
    return response.data;
};