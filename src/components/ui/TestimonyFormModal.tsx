
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextareaWithCounter } from "@/components/ui/TextareaWithCounter";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
  isFromPrayer?: boolean; // Nova prop para detectar se vem de uma oração
}

const TestimonyFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  oracaoMessage = "",
  oracaoCategory = "geral",
  oracaoIsAnonymous = false,
  oracaoId,
  isFromPrayer = false
}: TestimonyFormModalProps) => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("geral");
  const [isAnonymous, setIsAnonymous] = useState(false);

useEffect(() => {
  if (isOpen) {
    if (isFromPrayer && oracaoMessage) {
      // Vindo de uma oração
      setMessage(oracaoMessage);
      setCategory(oracaoCategory);
      setIsAnonymous(oracaoIsAnonymous);
    } else if (!isFromPrayer && oracaoMessage) {
      // Edição de testemunho existente
      setMessage(oracaoMessage);
      setCategory(oracaoCategory);
      setIsAnonymous(oracaoIsAnonymous);
    } else {
      // Novo testemunho
      setMessage("");
      setCategory("geral");
      setIsAnonymous(false);
    }
  }
}, [isOpen, isFromPrayer, oracaoMessage, oracaoCategory, oracaoIsAnonymous]);

  const handleSubmit = () => {
    if (!message.trim()) {
      return;
    }

    onSubmit({
      message: message.trim(),
      category: isFromPrayer ? oracaoCategory : category,
      isAnonymous: isFromPrayer ? oracaoIsAnonymous : isAnonymous
    }, oracaoId);

    if (!isFromPrayer) {
      setMessage("");
      setCategory("geral");
      setIsAnonymous(false);
    }
    onClose();
  };

  const handleClose = () => {
    if (!isFromPrayer) {
      setMessage("");
      setCategory("geral");
      setIsAnonymous(false);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isFromPrayer ? "Compartilhe seu testemunho" : "Novo Testemunho"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isFromPrayer && (
            <div className="p-3 bg-church-50 rounded-lg border">
              <p className="text-sm font-medium text-church-700 mb-1">
                Sua oração:
              </p>
              <p className="text-sm text-gray-600">
                {oracaoMessage}
              </p>
            </div>
          )}

          {!isFromPrayer && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Categoria do testemunho:
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cura">Cura</SelectItem>
                  <SelectItem value="família">Família</SelectItem>
                  <SelectItem value="provisão">Provisão</SelectItem>
                  <SelectItem value="libertação">Libertação</SelectItem>
                  <SelectItem value="milagre">Milagre</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {isFromPrayer ? "Edite sua mensagem de testemunho:" : "Sua mensagem de testemunho:"}
            </label>
            <TextareaWithCounter
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isFromPrayer ? "Edite como quiser compartilhar seu testemunho..." : "Compartilhe como Deus tem agido em sua vida..."}
              className="h-32"
              maxLength={500}
            />
          </div>

          {!isFromPrayer && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                Compartilhar anonimamente
              </label>
            </div>
          )}

          {isFromPrayer && (
            <div className="text-xs text-gray-500">
              {oracaoIsAnonymous ? 
                "Este testemunho será compartilhado anonimamente" : 
                "Este testemunho será compartilhado com seu nome"
              }
            </div>
          )}
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
