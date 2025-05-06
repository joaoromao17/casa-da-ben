import axios from 'axios';

// Criação do cliente axios separado para a API da Bíblia Digital
const bibleApi = axios.create({
  baseURL: 'http://localhost:3333',
});

// Função para obter o token do localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Interceptador para incluir o token no cabeçalho Authorization
bibleApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log("Token adicionado ao header:", token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default bibleApi;
