
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';

import Home from "./pages/Home";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Cultos from "./pages/Cultos";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import TermosUso from "./pages/TermosUso";
import ApoiarDesenvolvedor from "./pages/ApoiarDesenvolvedor";
import PrimeiraVisita from "./pages/PrimeiraVisita";
import QuemEJesus from "./pages/QuemEJesus";
import NoQueCremos from "./pages/NoQueCremos";
import Lideranca from "./pages/Lideranca";
import MinisteriosPage from "./pages/MinisteriosPage";
import ComoChegar from "./pages/ComoChegar";
import NotFound from "./pages/NotFound";

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
          <Route path="/cultos" element={<Cultos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/primeira-visita" element={<PrimeiraVisita />} />
          <Route path="/quem-e-jesus" element={<QuemEJesus />} />
          <Route path="/no-que-cremos" element={<NoQueCremos />} />
          <Route path="/lideranca" element={<Lideranca />} />
          <Route path="/ministerios" element={<MinisteriosPage />} />
          <Route path="/como-chegar" element={<ComoChegar />} />
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosUso />} />
          <Route path="/apoiar-desenvolvedor" element={<ApoiarDesenvolvedor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
