
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TestimonyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testimony: {
    message: string;
    category: string;
    isAnonymous: boolean;
  }, oracaoId?: number) => void;
  oracaoMessage?: string;
  oracaoCategory?: string;
  oracaoIsAnonymous?: boolean;
  oracaoId?: number;
}

const TestimonyFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  oracaoMessage = "",
  oracaoCategory = "geral",
  oracaoIsAnonymous = false,
  oracaoId
}: TestimonyFormModalProps) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen && oracaoMessage) {
      setMessage(oracaoMessage);
    }
  }, [isOpen, oracaoMessage]);

  const handleSubmit = () => {
    if (!message.trim()) {
      return;
    }

    onSubmit({
      message: message.trim(),
      category: oracaoCategory,
      isAnonymous: oracaoIsAnonymous
    }, oracaoId);

    setMessage("");
    onClose();
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhe seu testemunho</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Sua mensagem de testemunho:
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Compartilhe como Deus respondeu sua oração..."
              className="h-32"
            />
          </div>
          <div className="text-xs text-gray-500">
            {oracaoIsAnonymous ? 
              "Este testemunho será compartilhado anonimamente" : 
              "Este testemunho será compartilhado com seu nome"
            }
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            className="bg-church-700 hover:bg-church-800"
            onClick={handleSubmit}
            disabled={!message.trim()}
          >
            Contar Testemunho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonyFormModal;
