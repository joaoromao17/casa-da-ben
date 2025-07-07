
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
    Keyboard: {
      resize: "body",
      style: "default",
      resizeOnFullScreen: true
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    appendUserAgent: 'CapacitorWebView',
    // Configurações específicas para WebView
    webViewExtra: {
      allowFileAccess: true,
      allowUniversalAccessFromFileURLs: true,
    }
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  }
};

export default config;
