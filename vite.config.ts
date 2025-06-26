
import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";

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
