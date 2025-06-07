
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useState } from "react";

interface TestimonyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testimony: {
    message: string;
    category: string;
    isAnonymous: boolean;
  }) => void;
  oracaoMessage?: string;
}

const TestimonyFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  oracaoMessage 
}: TestimonyFormModalProps) => {
  const [testimony, setTestimony] = useState({
    message: "",
    category: "",
    isAnonymous: false
  });

  const handleSubmit = () => {
    if (!testimony.message.trim()) return;
    
    onSubmit(testimony);
    setTestimony({
      message: "",
      category: "",
      isAnonymous: false
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhe seu Testemunho</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {oracaoMessage && (
            <div className="p-3 bg-church-50 rounded-lg border-l-4 border-church-700">
              <p className="text-sm text-gray-600 mb-1">Sua oração:</p>
              <p className="text-sm font-medium">{oracaoMessage}</p>
            </div>
          )}
          
          <Select
            value={testimony.category}
            onValueChange={(value) => setTestimony(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Categoria do testemunho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cura">Cura</SelectItem>
              <SelectItem value="milagre">Milagre</SelectItem>
              <SelectItem value="provisão">Provisão</SelectItem>
              <SelectItem value="libertação">Libertação</SelectItem>
              <SelectItem value="família">Família</SelectItem>
              <SelectItem value="geral">Geral</SelectItem>
            </SelectContent>
          </Select>
          
          <Textarea
            placeholder="Conte como Deus respondeu sua oração..."
            className="h-32"
            value={testimony.message}
            onChange={(e) => setTestimony(prev => ({ ...prev, message: e.target.value }))}
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAnonymous"
              checked={testimony.isAnonymous}
              onCheckedChange={(checked) => 
                setTestimony(prev => ({ ...prev, isAnonymous: !!checked }))
              }
            />
            <label
              htmlFor="isAnonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Compartilhar anonimamente
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-church-700 hover:bg-church-800"
            onClick={handleSubmit}
            disabled={!testimony.message.trim()}
          >
            Compartilhar Testemunho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonyFormModal;
