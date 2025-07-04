
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.icb610.app',
  appName: 'Igreja Casa da Benção 610',
  webDir: 'dist',
  server: {
    // Configuração para desenvolvimento local com MIME types corretos
    url: 'https://3b331ef6-4013-442e-8d17-8bbe98cc4352.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    // Configurações específicas para resolver problemas de MIME type
    androidScheme: 'https',
    iosScheme: 'capacitor'
  },
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    // Configuração adicional para o servidor local
    CapacitorHttp: {
      enabled: true,
    },
  },
  // Configurações específicas para Android
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  // Configurações específicas para iOS
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  }
};

export default config;
