
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, MessageCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onCopy: (text: string) => Promise<boolean>;
  onOpenWhatsApp: (message: string) => void;
}

export const WhatsAppMessageModal: React.FC<WhatsAppMessageModalProps> = ({
  isOpen,
  onClose,
  message,
  onCopy,
  onOpenWhatsApp
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
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: "Erro",
        description: "Erro ao copiar mensagem",
        variant: "destructive"
      });
    }
  };

  const handleWhatsApp = () => {
    onOpenWhatsApp(message);
    toast({
      title: "WhatsApp",
      description: "Abrindo WhatsApp com a mensagem pronta!"
    });
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
              variant="outline"
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
              onClick={handleWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Abrir WhatsApp
            </Button>
          </div>

          <div className="text-center">
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-500"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
