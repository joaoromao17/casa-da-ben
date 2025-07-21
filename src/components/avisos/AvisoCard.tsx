
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Image, Trash2, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { API_BASE_URL } from "@/services/api";
import { useWhatsAppMessage } from "@/hooks/useWhatsAppMessage";
import { WhatsAppMessageModal } from "./WhatsAppMessageModal";

interface Aviso {
  id: number;
  titulo: string;
  mensagem: string;
  arquivoUrl?: string;
  dataCriacao: string;
  tipo: 'GERAL' | 'MINISTERIAL';
  nomeMinisterio?: string;
  nomeAutor: string;
}

interface AvisoCardProps {
  aviso: Aviso;
  showDelete?: boolean;
  onDelete?: (id: number) => void;
  ministryId?: string;
}

export const AvisoCard: React.FC<AvisoCardProps> = ({ aviso, showDelete = false, onDelete, ministryId }) => {
  const { isOpen, currentAviso, showModal, closeModal, formatMessage, copyToClipboard, onFinish } = useWhatsAppMessage();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const handleFileClick = () => {
    if (aviso.arquivoUrl) {
      const fullUrl = aviso.arquivoUrl.startsWith('http')
        ? aviso.arquivoUrl
        : `${API_BASE_URL}${aviso.arquivoUrl}`;
      window.open(fullUrl, '_blank');
    }
  };

  const handleShare = () => {
    showModal({
      ...aviso,
      ministryId: ministryId
    });
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isPDF = (url: string) => {
    return /\.pdf$/i.test(url);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 break-words">{aviso.titulo}</CardTitle>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                  {formatDate(aviso.dataCriacao)}
                </div>
                <span className="break-words">por {aviso.nomeAutor}</span>
                {aviso.nomeMinisterio && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs inline-block w-fit">
                    {aviso.nomeMinisterio}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0 self-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-blue-600 hover:text-blue-800"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              {showDelete && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(aviso.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="text-gray-700 mb-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: aviso.mensagem }}
          />

          {aviso.arquivoUrl && (
            <div className="mt-4">
              {isImage(aviso.arquivoUrl) ? (
                <div className="flex justify-center cursor-pointer" onClick={handleFileClick}>
                  <img
                    src={aviso.arquivoUrl.startsWith('http') ? aviso.arquivoUrl : `${API_BASE_URL}${aviso.arquivoUrl}`}
                    alt="Anexo"
                    className="max-w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleFileClick}
                  className="flex items-center gap-2"
                >
                  {isPDF(aviso.arquivoUrl) ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <Image className="w-4 h-4" />
                  )}
                  {isPDF(aviso.arquivoUrl) ? 'Abrir PDF' : 'Ver Arquivo'}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Message Modal */}
      {currentAviso && (
        <WhatsAppMessageModal
          isOpen={isOpen}
          onClose={closeModal}
          message={formatMessage(currentAviso)}
          onCopy={copyToClipboard}
          onFinish={onFinish}
        />
      )}
    </>
  );
};
