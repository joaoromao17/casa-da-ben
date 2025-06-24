
import { useState } from 'react';

interface Aviso {
  id?: number;
  titulo: string;
  mensagem: string;
  arquivoUrl?: string;
  tipo: 'GERAL' | 'MINISTERIAL';
  nomeMinisterio?: string;
  ministryId?: string;
  onFinish?: () => void;
}

export const useWhatsAppMessage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAviso, setCurrentAviso] = useState<Aviso | null>(null);
  const [onFinish, setOnFinish] = useState<(() => void) | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const formatMessage = (aviso: Aviso) => {
    const tipoHeader = aviso.tipo === 'MINISTERIAL' 
      ? '*AVISO DO MINISTÉRIO*' 
      : '*AVISO GERAL DA IGREJA*';

    let mensagem = `${tipoHeader}\n\n*${aviso.titulo}*\n\n${aviso.mensagem}`;

    if (aviso.arquivoUrl) {
      const fullUrl = aviso.arquivoUrl.startsWith('http')
        ? aviso.arquivoUrl
        : `${API_BASE_URL}${aviso.arquivoUrl}`;
      mensagem += `\n\n📎 Arquivo: ${fullUrl}`;
    }

    // Para avisos ministeriais, direciona para a página do ministério
    let detailsUrl = 'https://casa-da-ben.vercel.app';
    if (aviso.tipo === 'MINISTERIAL' && aviso.ministryId) {
      detailsUrl = `https://casa-da-ben.vercel.app/ministerios/${aviso.ministryId}`;
    }
    
    mensagem += `\n\nPara mais detalhes, acesse ${detailsUrl}`;

    return mensagem;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Erro ao copiar:', err);
      return false;
    }
  };

  const showModal = (aviso: Aviso) => {
    setCurrentAviso(aviso);
    if (aviso.onFinish) {
      setOnFinish(() => aviso.onFinish);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentAviso(null);
    setOnFinish(null);
  };

  return {
    isOpen,
    currentAviso,
    showModal,
    closeModal,
    formatMessage,
    copyToClipboard,
    onFinish
  };
};
