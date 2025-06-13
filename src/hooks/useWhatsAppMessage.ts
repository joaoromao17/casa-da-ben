
import { useState } from 'react';

interface Aviso {
  id?: number;
  titulo: string;
  mensagem: string;
  arquivoUrl?: string;
  tipo: 'GERAL' | 'MINISTERIAL';
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

    const avisoUrl = aviso.id ? `https://www.icb610.com.br/avisos/${aviso.id}` : 'www.icb610.com.br';
    mensagem += `\n\nPara mais detalhes, acesse ${avisoUrl}`;

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
