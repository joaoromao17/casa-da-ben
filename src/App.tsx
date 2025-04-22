import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Páginas principais
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Estudos from "./pages/Estudos";
import Eventos from "./pages/Eventos";
import Contribuicoes from "./pages/Contribuicoes";
import Testemunhos from "./pages/Testemunhos";
import Contato from "./pages/Contato";
import Cultos from "./pages/Cultos";
import NotFound from "./pages/NotFound";

// Páginas de ministérios
import Ministerios from "./pages/Ministerios";
import Ministerio from "./pages/ministerios/Ministerio";
import MinisterioDetail from "@/pages/ministerios/MinisterioDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/estudos" element={<Estudos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/contribuicoes" element={<Contribuicoes />} />
          <Route path="/testemunhos" element={<Testemunhos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/cultos" element={<Cultos />} />
          <Route path="/ministerios" element={<Ministerios />} />
          <Route path="/ministerios/:slug" element={<MinisterioDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
