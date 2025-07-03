
import api from "@/services/api";

export const sendFCMTokenToBackend = async (): Promise<void> => {
  // Verifica se o FirebasePlugin está disponível (apenas em ambiente Capacitor)
  if (!(window as any).FirebasePlugin) {
    console.log("FirebasePlugin não disponível - ambiente web");
    return;
  }

  try {
    // Obtém o token FCM
    const plugin = (window as any).FirebasePlugin;
    
    plugin.getToken(
      async (fcmToken: string) => {
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
      },
      (error: any) => {
        console.error("Erro ao obter token FCM:", error);
      }
    );
  } catch (error) {
    console.error("Erro na função sendFCMTokenToBackend:", error);
  }
};
