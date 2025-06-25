
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

interface OracaoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (oracao: {
    message: string;
    category: string;
    isAnonymous: boolean;
  }) => void;
  editingOracao?: {
    id: number;
    message: string;
    category: string;
    isAnonymous: boolean;
  } | null;
}

const OracaoFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingOracao
}: OracaoFormModalProps) => {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("geral");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingOracao) {
        setMessage(editingOracao.message);
        setCategory(editingOracao.category);
        setIsAnonymous(editingOracao.isAnonymous);
      } else {
        setMessage("");
        setCategory("geral");
        setIsAnonymous(false);
      }
    }
  }, [isOpen, editingOracao]);

  const handleSubmit = () => {
    if (!message.trim()) {
      return;
    }

    onSubmit({
      message: message.trim(),
      category,
      isAnonymous
    });

    if (!editingOracao) {
      setMessage("");
      setCategory("geral");
      setIsAnonymous(false);
    }
    onClose();
  };

  const handleClose = () => {
    if (!editingOracao) {
      setMessage("");
      setCategory("geral");
      setIsAnonymous(false);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[95vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {editingOracao ? "Editar Pedido de Oração" : "Novo Pedido de Oração"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Categoria:
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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Mensagem da oração:
            </label>
            <TextareaWithCounter
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Compartilhe seu pedido de oração..."
              className="h-24 sm:h-32 text-sm"
              maxLength={500}
            />
          </div>

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
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button
            className="bg-church-700 hover:bg-church-800 w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!message.trim()}
          >
            {editingOracao ? "Salvar Alterações" : "Compartilhar Oração"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OracaoFormModal;
