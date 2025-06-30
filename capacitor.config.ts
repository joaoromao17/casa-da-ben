import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.icb610.app',
  appName: 'Igreja Casa da Benção 610',
  webDir: 'dist',
  server: {
    url: 'https://casa-da-ben.vercel.app', // substitua pelo seu domínio real
    cleartext: true
  }
};

export default config;
