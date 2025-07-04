
// Configuração específica para MIME types no servidor de desenvolvimento
export const mimeConfig = (server) => {
  // Middleware para definir MIME types corretos
  server.middlewares.use((req, res, next) => {
    const url = req.url;
    
    // Define MIME type correto para arquivos JavaScript
    if (url.endsWith('.js') || url.includes('.js?')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    // Define MIME type correto para módulos ES
    else if (url.endsWith('.mjs') || url.includes('.mjs?')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    // Define MIME type correto para arquivos CSS
    else if (url.endsWith('.css') || url.includes('.css?')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
    // Define MIME type correto para arquivos JSON
    else if (url.endsWith('.json') || url.includes('.json?')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    // Define MIME type correto para WebAssembly
    else if (url.endsWith('.wasm') || url.includes('.wasm?')) {
      res.setHeader('Content-Type', 'application/wasm');
    }
    
    // Headers adicionais para CORS e cache
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    
    next();
  });
};
