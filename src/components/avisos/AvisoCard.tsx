import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Trash2, FileText } from "lucide-react";
import { useWhatsAppMessage } from "@/hooks/useWhatsAppMessage";

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

export const AvisoCard = ({ aviso, showDelete = false, onDelete, ministryId }: AvisoCardProps) => {
  const { showModal } = useWhatsAppMessage();

  const handleShare = () => {
    showModal({
      ...aviso,
      ministryId: ministryId
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{aviso.titulo}</CardTitle>
          {aviso.tipo === 'MINISTERIAL' && (
            <Badge variant="secondary">{aviso.nomeMinisterio}</Badge>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Publicado em {formatDate(aviso.dataCriacao)} por {aviso.nomeAutor}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{aviso.mensagem}</p>
        {aviso.arquivoUrl && (
          <a href={aviso.arquivoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
            <FileText className="mr-2 h-4 w-4" />
            Ver Arquivo
          </a>
        )}
      </CardContent>
      <div className="flex justify-end space-x-2 p-3">
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
        {showDelete && (
          <Button variant="destructive" size="sm" onClick={() => onDelete?.(aviso.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        )}
      </div>
    </Card>
  );
};
