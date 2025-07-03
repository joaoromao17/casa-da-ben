
/// <reference types="vite/client" />

// Capacitor global types
declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform(): boolean;
      getPlatform?(): string;
    };
  }
}

// This export is needed to make this file a module
export {};
