
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.icb610.app',
  appName: 'Igreja Casa da Benção 610',
  webDir: 'dist',
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  // Configurações específicas para Android para resolver MIME types
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    // Configurações adicionais para WebView
    appendUserAgent: 'CapacitorWebView',
    overrideUserAgent: null,
    backgroundColor: '#ffffffff',
    // Força o WebView a usar configurações modernas
    webContentsDebuggingEnabled: true,
  },
  // Configurações específicas para iOS
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  }
};

export default config;
