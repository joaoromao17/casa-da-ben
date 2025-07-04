import api from "@/services/api";
import { Capacitor } from '@capacitor/core';

export const sendFCMTokenToBackend = async (): Promise<void> => {
  console.log("🚀 Chamou sendFCMTokenToBackend");
console.log("🌐 Plataforma:", Capacitor.getPlatform());
console.log("📱 É nativo?", Capacitor.isNativePlatform());
  // ✅ Verifica se está rodando nativamente
  if (!Capacitor.isNativePlatform()) {
    console.log("⚠️ FirebaseMessaging não disponível - ambiente web");
    return;
  }

  try {
    const { FirebaseMessaging } = await import('@capacitor-firebase/messaging');
    console.log("📲 FirebaseMessaging carregado");

    const permission = await FirebaseMessaging.requestPermissions();
    console.log("🔐 Permissão de notificação:", permission);

    const { token: fcmToken } = await FirebaseMessaging.getToken();

    if (!fcmToken) {
      console.warn("⚠️ Token FCM veio vazio");
      return;
    }

    console.log("✅ Token FCM obtido:", fcmToken);

    // Envia o token para o backend
    const response = await api.put("/users/fcm-token", { fcmToken });

    console.log("🎉 Token FCM enviado com sucesso para o backend");
    console.log("📡 PUT /users/fcm-token status:", response.status);
    console.log("📝 PUT /users/fcm-token response data:", response.data);

  } catch (error) {
    console.error("🔥 Erro ao configurar FCM:", error);
  }
};
