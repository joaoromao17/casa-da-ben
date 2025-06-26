
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfill para compatibilidade com Chrome mobile mais antigo
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function(callback) {
    return setTimeout(callback, 1);
  };
}

// Tratamento de erro global para Chrome mobile
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// Função para renderizar a aplicação com tratamento de erro
function renderApp() {
  try {
    const container = document.getElementById("root");
    
    if (!container) {
      throw new Error('Root element not found');
    }

    // Verifica se o container já foi renderizado (hot reload)
    if (container.innerHTML !== '') {
      container.innerHTML = '';
    }

    const root = createRoot(container);
    root.render(<App />);
  } catch (error) {
    console.error('Error rendering app:', error);
    
    // Fallback para mostrar erro em vez de tela branca
    const container = document.getElementById("root");
    if (container) {
      container.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
          text-align: center;
          background: #f8f9fa;
        ">
          <h1 style="color: #dc3545; margin-bottom: 16px;">Erro ao carregar a aplicação</h1>
          <p style="color: #6c757d; margin-bottom: 24px;">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: #007bff;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
            "
          >
            Recarregar Página
          </button>
        </div>
      `;
    }
  }
}

// Aguarda o DOM estar pronto antes de renderizar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
