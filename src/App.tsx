
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from '@vercel/analytics/react';

// Páginas principais
import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Membros from "./pages/Membros";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import MinhaConta from "./pages/MinhaConta";
import Estudos from "./pages/Estudos";
import EstudosGerenciar from "./pages/EstudosGerenciar";
import Eventos from "./pages/Eventos";
import Contribuicoes from "./pages/Contribuicoes";
import ContribuicoesGerenciar from "./pages/ContribuicoesGerenciar";
import ContribuicaoDetalhe from "./pages/ContribuicaoDetalhe";
import Testemunhos from "./pages/Testemunhos";
import Oracao from "./pages/Oracao";
import Contato from "./pages/Contato";
import Cultos from "./pages/Cultos";
import NotFound from "./pages/NotFound";
import Ministerios from "./pages/Ministerios";
import MinisterioDetail from "@/pages/MinisterioDetail";
import EventoDetail from "@/pages/EventoDetail";
import AdminDashboard from "./pages/AdminDashboard";
import PublicProfilePage from "./pages/PublicProfilePage";
import PorQueSeRegistrar from "./pages/PorQueSeRegistrar";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosUso from "./pages/TermosUso";
import RelatarBug from "./pages/RelatarBug";
import ApoiarDesenvolvedor from "./pages/ApoiarDesenvolvedor";
import Instalar from "./pages/Instalar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/membros" element={<Membros />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />
            <Route path="/reset-password" element={<NewPassword />} />
            <Route path="/minha-conta" element={<MinhaConta />} />
            <Route path="/estudos" element={<Estudos />} />
            <Route path="/estudos/gerenciar" element={<EstudosGerenciar />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/contribuicoes" element={<Contribuicoes />} />
            <Route path="/contribuicoes/gerenciar" element={<ContribuicoesGerenciar />} />
            <Route path="/contribuicoes/:id" element={<ContribuicaoDetalhe />} />
            <Route path="/testemunhos" element={<Testemunhos />} />
            <Route path="/oracao" element={<Oracao />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/cultos" element={<Cultos />} />
            <Route path="/ministerios" element={<Ministerios />} />
            <Route path="/ministerios/:id" element={<MinisterioDetail />} />
            <Route path="/profile-public/:id" element={<PublicProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/por-que-se-registrar" element={<PorQueSeRegistrar />} />
            <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/termos-de-uso" element={<TermosUso />} />
            <Route path="/relatar-bug" element={<RelatarBug />} />
            <Route path="/apoiar-desenvolvedor" element={<ApoiarDesenvolvedor />} />
            <Route path="/instalar" element={<Instalar />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/eventos/:id" element={<EventoDetail />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;