import api from "@/services/api";

export const sendFCMTokenToBackend = async (): Promise<void> => {
  // Verifica se está rodando nativamente (Capacitor)
  if (typeof window === 'undefined' || !window.Capacitor?.isNativePlatform?.()) {
    console.log("⚠️ FirebaseMessaging não disponível - ambiente web");
    return;
  }

  try {
    const { FirebaseMessaging } = await import('@capacitor-firebase/messaging');
    console.log("📲 FirebaseMessaging carregado");

    const permission = await FirebaseMessaging.requestPermissions();
    console.log("🔐 Permissão de notificação:", permission);

    const result = await FirebaseMessaging.getToken();
    const fcmToken = result.token;

    if (!fcmToken) {
      console.warn("⚠️ Token FCM veio vazio");
      return;
    }

    console.log("✅ Token FCM obtido:", fcmToken);

    try {
      await api.put("/users/fcm-token", {
        fcmToken: fcmToken
      });

      console.log("🎉 Token FCM enviado com sucesso para o backend");
    } catch (error) {
      console.error("❌ Erro ao enviar token FCM para o backend:", error);
    }

  } catch (error) {
    console.error("🔥 Erro ao obter token FCM:", error);
  }
};