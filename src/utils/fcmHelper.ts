import api from "@/services/api";
import { Capacitor } from '@capacitor/core';

export const sendFCMTokenToBackend = async (): Promise<void> => {
  console.log("🚀 Chamou sendFCMTokenToBackend");
  console.log("🌐 Plataforma:", Capacitor.getPlatform());
  console.log("📱 É nativo?", Capacitor.isNativePlatform());

  if (!Capacitor.isNativePlatform()) {
    console.log("⚠️ FirebaseMessaging não disponível - ambiente web");
    return;
  }

  try {
    console.log("🧩 Buscando FirebaseMessaging via window.Capacitor.Plugins");

    // ✅ Solução correta e segura para runtime
    const FirebaseMessaging = (window as any).Capacitor?.Plugins?.FirebaseMessaging;

    if (!FirebaseMessaging) {
      console.warn("❌ FirebaseMessaging não disponível no Capacitor.Plugins");
      return;
    }

    const permission = await FirebaseMessaging.requestPermissions();
    console.log("🔐 Permissão de notificação:", permission);

    const { token: fcmToken } = await FirebaseMessaging.getToken();

    if (!fcmToken) {
      console.warn("⚠️ Token FCM veio vazio");
      return;
    }

    console.log("✅ Token FCM obtido:", fcmToken);

    const response = await api.put("/users/fcm-token", { fcmToken });

    console.log("🎉 Token FCM enviado com sucesso para o backend");
    console.log("📡 PUT /users/fcm-token status:", response.status);
    console.log("📝 PUT /users/fcm-token response data:", response.data);

  } catch (error) {
    console.error("🔥 Erro ao configurar FCM:", error);
  }
};
