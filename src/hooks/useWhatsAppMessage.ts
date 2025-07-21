
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

  const stripHtmlTags = (html: string) => {
    // Remove HTML tags and convert to plain text
    const text = html
      .replace(/<p>/gi, '\n')
      .replace(/<\/p>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '*$1*')
      .replace(/<b>(.*?)<\/b>/gi, '*$1*')
      .replace(/<em>(.*?)<\/em>/gi, '_$1_')
      .replace(/<i>(.*?)<\/i>/gi, '_$1_')
      .replace(/<u>(.*?)<\/u>/gi, '$1')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '$2: $1')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
      .replace(/\n\s*\n/g, '\n\n');

    return text;
  };

  const formatMessage = (aviso: Aviso) => {
    const tipoHeader = aviso.tipo === 'MINISTERIAL' 
      ? `*AVISO DO MINISTÉRIO${aviso.nomeMinisterio ? ` ${aviso.nomeMinisterio.toUpperCase()}` : ''}*`
      : '*AVISO GERAL DA IGREJA*';

    const cleanMessage = stripHtmlTags(aviso.mensagem);
    let mensagem = `${tipoHeader}\n\n*${aviso.titulo}*\n\n${cleanMessage}`;

    if (aviso.arquivoUrl) {
      const fullUrl = aviso.arquivoUrl.startsWith('http')
        ? aviso.arquivoUrl
        : `${API_BASE_URL}${aviso.arquivoUrl}`;
      mensagem += `\n\n📎 Arquivo: ${fullUrl}`;
    }

    // Para avisos ministeriais, direciona para a página do ministério
    let detailsUrl = 'https://www.icb610.com.br';
    if (aviso.tipo === 'MINISTERIAL' && aviso.ministryId) {
      detailsUrl = `https://www.icb610.com.br/ministerios/${aviso.ministryId}`;
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
