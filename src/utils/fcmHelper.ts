
import api from "@/services/api";
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

export const sendFCMTokenToBackend = async (): Promise<void> => {
  // Verifica se estamos em ambiente Capacitor
  if (typeof window === 'undefined' || !window.Capacitor || !window.Capacitor.isNativePlatform()) {
    console.log("FirebaseMessaging não disponível - ambiente web");
    return;
  }

  try {
    // Solicita permissão para notificações
    await FirebaseMessaging.requestPermissions();
    
    // Obtém o token FCM
    const result = await FirebaseMessaging.getToken();
    const fcmToken = result.token;
    
    console.log("Token FCM obtido:", fcmToken);
    
    try {
      // Envia o token para o backend
      await api.put("/users/fcm-token", {
        fcmToken: fcmToken
      });
      
      console.log("Token FCM enviado com sucesso para o backend");
    } catch (error) {
      console.error("Erro ao enviar token FCM para o backend:", error);
    }
  } catch (error) {
    console.error("Erro ao obter token FCM:", error);
  }
};
