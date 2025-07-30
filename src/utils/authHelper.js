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

export function saveRefreshToken(token, rememberMe) {
  if (rememberMe) {
    localStorage.setItem("refreshToken", token);
  } else {
    sessionStorage.setItem("refreshToken", token);
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
  const REFRESH_INTERVAL = 55 * 60 * 1000; // 55 minutos

  setTimeout(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
        refreshToken,
      });

      // Determine se deve usar localStorage (se já há refresh token lá) ou sessionStorage
      const isUsingLocalStorage = !!localStorage.getItem("refreshToken");
      saveAccessToken(response.data.accessToken, isUsingLocalStorage);
      scheduleTokenRefresh(); // agendar a próxima
    } catch (err) {
      console.warn("Erro ao renovar token automaticamente:", err);
      await clearAuthData();
      window.location.href = "/login";
    }
  }, REFRESH_INTERVAL);
}