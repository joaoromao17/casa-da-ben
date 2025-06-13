import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useWhatsAppMessage } from '@/hooks/useWhatsAppMessage';
import { WhatsAppMessageModal } from './WhatsAppMessageModal';

interface Ministry {
  id: number;
  name: string;
}

interface AvisoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  ministryId?: string;
}

export const AvisoForm: React.FC<AvisoFormProps> = ({ onSuccess, onCancel, ministryId }) => {
  // Define o tipo baseado no contexto: se tem ministryId é MINISTERIAL, senão é GERAL
  const avisoType = ministryId ? 'MINISTERIAL' : 'GERAL';

  const [formData, setFormData] = useState({
    titulo: '',
    mensagem: '',
    tipo: avisoType,
    ministerioId: ministryId || '',
    dataExpiracao: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const { toast } = useToast();
  
  const {
    isOpen: isWhatsAppModalOpen,
    currentAviso,
    showModal: showWhatsAppModal,
    closeModal: closeWhatsAppModal,
    formatMessage,
    copyToClipboard
  } = useWhatsAppMessage();

  useEffect(() => {
    if (formData.tipo === 'MINISTERIAL' && !ministryId) {
      // Buscar ministérios disponíveis
      api.get('/ministerios')
        .then(response => setMinistries(response.data))
        .catch(error => console.error('Erro ao buscar ministérios:', error));
    }
  }, [formData.tipo, ministryId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Erro",
          description: "Apenas imagens (JPEG, PNG) ou PDFs são permitidos",
          variant: "destructive"
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let arquivoUrl = '';

      // Upload do arquivo se existir
      if (file) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const uploadResponse = await api.post('/avisos/arquivos', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        arquivoUrl = uploadResponse.data;
        setUploading(false);
      }

      // Criar aviso
      const avisoData = {
        titulo: formData.titulo,
        mensagem: formData.mensagem,
        tipo: avisoType,
        arquivoUrl,
        dataExpiracao: formData.dataExpiracao || null,
        ministerioId: avisoType === 'MINISTERIAL' ? (ministryId || formData.ministerioId) : null
      };

      const response = await api.post('/avisos', avisoData);
      const avisoSalvo = response.data;

      toast({
        title: "Sucesso",
        description: `${avisoType === 'GERAL' ? 'Aviso geral' : 'Aviso ministerial'} criado com sucesso!`
      });

      // Mostrar modal do WhatsApp com o ID do aviso salvo
      showWhatsAppModal({
        id: avisoSalvo.id,
        titulo: formData.titulo,
        mensagem: formData.mensagem,
        arquivoUrl,
        tipo: avisoType
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao criar aviso",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {avisoType === 'GERAL' ? 'Criar Aviso Geral' : 'Criar Aviso Ministerial'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="mensagem">Mensagem *</Label>
              <Textarea
                id="mensagem"
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                rows={4}
                required
              />
            </div>

            {/* Mostrar informação sobre o tipo de aviso */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tipo:</strong> {avisoType === 'GERAL' ? 'Aviso Geral da Igreja' : 'Aviso Ministerial'}
              </p>
            </div>

            {avisoType === 'MINISTERIAL' && !ministryId && (
              <div>
                <Label htmlFor="ministerio">Ministério *</Label>
                <Select
                  value={formData.ministerioId}
                  onValueChange={(value) => setFormData({ ...formData, ministerioId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ministério" />
                  </SelectTrigger>
                  <SelectContent>
                    {ministries.map((ministry) => (
                      <SelectItem key={ministry.id} value={ministry.id.toString()}>
                        {ministry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="dataExpiracao">Data de Expiração</Label>
              <Input
                id="dataExpiracao"
                type="datetime-local"
                value={formData.dataExpiracao}
                onChange={(e) => setFormData({ ...formData, dataExpiracao: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="arquivo">Arquivo (PDF ou Imagem)</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="arquivo"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="arquivo"
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                >
                  {file ? (
                    <div className="text-center">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                        className="mt-2"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Clique para selecionar um arquivo
                      </p>
                      <p className="text-xs text-gray-400">PDF, JPG, PNG (máx. 10MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={submitting || uploading}
                className="flex-1"
              >
                {uploading ? 'Enviando arquivo...' : submitting ? 'Criando...' : `Criar ${avisoType === 'GERAL' ? 'Aviso Geral' : 'Aviso Ministerial'}`}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitting || uploading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal do WhatsApp */}
      {currentAviso && (
        <WhatsAppMessageModal
          isOpen={isWhatsAppModalOpen}
          onClose={closeWhatsAppModal}
          message={formatMessage(currentAviso)}
          onCopy={copyToClipboard}
        />
      )}
    </>
  );
};
