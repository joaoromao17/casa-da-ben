
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
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    appendUserAgent: 'CapacitorWebView',
    // ❌ Linha removida: overrideUserAgent: null
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
  }
};

export default config;
