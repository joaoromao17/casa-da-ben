import axios from 'axios';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Detecta se está rodando no Capacitor nativo
const isNativeApp =
  window.Capacitor &&
  (window.Capacitor.isNativePlatform?.() || window.Capacitor.getPlatform?.() === 'android');

if (isNativeApp) {
  API_BASE_URL = "https://casadabencao-api.onrender.com";
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Interceptador para adicionar o token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { API_BASE_URL };
export default api;
