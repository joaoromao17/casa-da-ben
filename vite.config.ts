
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do arquivo `.env`
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react({
        // Adiciona configuração para compatibilidade com Chrome mobile
        jsxRuntime: 'automatic',
        babel: {
          plugins: [
            // Plugin para compatibilidade com Chrome mais antigo
            ['@babel/plugin-transform-runtime', {
              regenerator: true,
            }]
          ]
        }
      }),
      mode === 'development' && componentTagger(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Igreja Casa da Benção 610',
          short_name: 'ICB 610',
          description: 'Site oficial da Igreja Casa da Benção - Venha fazer parte desta família',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#4A5568',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          // Cache estratégico para melhor performance offline
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        }
      })
    ].filter(Boolean),
    server: {
      host: "::",
      port: 8080, // Porta corrigida conforme especificado
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      'process.env': env,
    },
    build: {
      // Configurações otimizadas para Chrome mobile
      target: ['es2015', 'chrome58'], // Compatibilidade com Chrome mobile mais antigo
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@radix-ui/react-tabs', '@radix-ui/react-dialog'],
          },
        },
      },
      // Reduz o tamanho dos chunks para melhor performance no mobile
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      // Força pre-bundling para dependências problemáticas
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'lucide-react'
      ],
    },
    esbuild: {
      // Configuração para compatibilidade com Chrome mobile
      target: 'es2015',
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
  };
});
