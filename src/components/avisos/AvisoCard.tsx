
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Image, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const AvisoCard: React.FC<AvisoCardProps> = ({ aviso, showDelete = false, onDelete }) => {
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

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isPDF = (url: string) => {
    return /\.pdf$/i.test(url);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{aviso.titulo}</CardTitle>
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(aviso.dataCriacao)}
              </div>
              <span>por {aviso.nomeAutor}</span>
              {aviso.nomeMinisterio && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {aviso.nomeMinisterio}
                </span>
              )}
            </div>
          </div>
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
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 whitespace-pre-line">{aviso.mensagem}</p>

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
  );
};
