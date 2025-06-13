
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TransmissionTutorial } from './TransmissionTutorial';

interface WhatsAppMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onCopy: (text: string) => Promise<boolean>;
  onFinish?: () => void;
}

export const WhatsAppMessageModal: React.FC<WhatsAppMessageModalProps> = ({
  isOpen,
  onClose,
  message,
  onCopy,
  onFinish
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    const success = await onCopy(message);
    if (success) {
      setCopied(true);
      toast({
        title: "Sucesso",
        description: "Mensagem copiada para a área de transferência!"
      });
      setTimeout(() => {
        setCopied(false);
        onClose();
        onFinish?.();
      }, 2000);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao copiar mensagem",
        variant: "destructive"
      });
    }
  };

  const handleConcluir = () => {
    onClose();
    onFinish?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Mensagem pronta para WhatsApp
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Como usar:</strong> Copie a mensagem abaixo e envie via WhatsApp para os membros.
            </p>
            <p className="text-sm text-blue-700 mb-2">
              💡 Para facilitar, crie uma <strong>Lista de Transmissão</strong> com os membros do ministério.
            </p>
            <TransmissionTutorial />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Mensagem formatada:
            </label>
            <Textarea
              value={message}
              readOnly
              rows={10}
              className="bg-gray-50 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCopy}
              className="flex-1"
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar mensagem
                </>
              )}
            </Button>

            <Button
              onClick={handleConcluir}
              variant="outline"
              className="flex-1"
            >
              Concluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
