import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', //  local
});

// Interceptador para enviar o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptador de resposta para capturar 401 (token expirado ou inválido)
api.interceptors.response.use(
  (response) => {
    // Se a resposta foi OK, retorna normal
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Se deu 401 → limpa token e redireciona para login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/'; // redireciona para login (ou sua rota inicial)
    }
    return Promise.reject(error);
  }
);

export default api;
