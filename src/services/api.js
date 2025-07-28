import axios from 'axios';
import { getAccessToken, getRefreshToken, saveAccessToken } from "@/utils/authHelper";

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const isNativeApp =
  window.Capacitor &&
  (window.Capacitor.isNativePlatform?.() || window.Capacitor.getPlatform?.() === 'android');

if (isNativeApp) {
  API_BASE_URL = "https://backend-casadabencao.onrender.com";
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Interceptor de requisição: adiciona o token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: renova token se necessário
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se a resposta for 401 e ainda não tentamos renovar
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken: getRefreshToken(),
        });

        const newAccessToken = refreshResponse.data;

        saveAccessToken(newAccessToken);

        // Atualiza o header e refaz a requisição original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Erro ao renovar token:", refreshError);
        // Opcional: redirecionar pro login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default api;