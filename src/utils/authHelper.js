import axios from "axios";
import { API_BASE_URL } from "@/services/api";

export function getAccessToken() {
  return localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
}

export function saveAccessToken(token) {
  if (localStorage.getItem("refreshToken")) {
    localStorage.setItem("accessToken", token);
  } else {
    sessionStorage.setItem("accessToken", token);
  }
}

export const clearAuthData = async () => {
  try {
    await axios.put(`${API_BASE_URL}/users/fcm-token`, { fcmToken: null });
  } catch (e) {
    console.error("Erro ao resetar FCM token:", e);
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
};

// 🕒 RENOVAÇÃO SILENCIOSA
export function scheduleTokenRefresh() {
  const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutos

  setTimeout(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      saveAccessToken(response.data); // ou response.data.access_token, se necessário

      scheduleTokenRefresh(); // agendar a próxima
    } catch (err) {
      console.warn("Erro ao renovar token automaticamente:", err);
      // Redirecionar, alertar ou nada — a depender da política do app
    }
  }, REFRESH_INTERVAL);
}