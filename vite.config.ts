
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
        // Configuração para compatibilidade com Chrome mobile
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
          maximumFileSizeToCacheInBytes: 3000000,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
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
                  maxAgeSeconds: 60 * 60 * 24 * 365
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
      port: 8080,
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
      target: ['es2020', 'chrome80'], // Atualizado para melhor compatibilidade
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: true,
        },
      },
      assetsDir: 'assets',
      rollupOptions: {
        external: (id) => {
          return id.includes('@capacitor-firebase/messaging') && !id.includes('node_modules');
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@radix-ui/react-tabs', '@radix-ui/react-dialog'],
          },
          // Configuração específica para garantir MIME types corretos no Capacitor
          entryFileNames: (chunkInfo) => {
            return `assets/js/[name]-[hash].js`;
          },
          chunkFileNames: (chunkInfo) => {
            return `assets/js/[name]-[hash].js`;
          },
          assetFileNames: (assetInfo) => {            
            if (!assetInfo.name) {
              return `assets/[name]-[hash][extname]`;
            }
            
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext)) {
              return `assets/css/[name]-[hash][extname]`;
            }
            if (/js|mjs/i.test(ext)) {
              return `assets/js/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          }
        },
      },
      chunkSizeWarningLimit: 1000,
      // Configurações adicionais para Capacitor
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false, // Desabilita sourcemaps que podem causar problemas no Capacitor
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'lucide-react'
      ],
      exclude: ['@capacitor-firebase/messaging']
    },
    esbuild: {
      target: 'es2020', // Consistente com build.target
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
  };
});
