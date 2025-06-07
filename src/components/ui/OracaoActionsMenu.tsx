
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";

interface OracaoActionsMenuProps {
  oracaoId: number;
  onEdit: () => void;
  onDelete: () => void;
  onMarkAnswered: () => void;
  onCreateTestimony: () => void;
}

const OracaoActionsMenu = ({
  oracaoId,
  onEdit,
  onDelete,
  onMarkAnswered,
  onCreateTestimony
}: OracaoActionsMenuProps) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAnsweredDialog, setShowAnsweredDialog] = useState(false);

  const handleAnswered = () => {
    setShowAnsweredDialog(true);
  };

  const handleAnsweredWithTestimony = () => {
    setShowAnsweredDialog(false);
    onCreateTestimony();
  };

  const handleAnsweredWithoutTestimony = () => {
    setShowAnsweredDialog(false);
    onMarkAnswered();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAnswered}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Já fui respondido
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteAlert(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir oração</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta oração? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showAnsweredDialog} onOpenChange={setShowAnsweredDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deus respondeu sua oração!</DialogTitle>
            <DialogDescription>
              Que alegria saber que Deus respondeu sua oração! Você gostaria de compartilhar um testemunho sobre isso?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleAnsweredWithoutTestimony}>
              Concluir sem testemunho
            </Button>
            <Button onClick={handleAnsweredWithTestimony} className="bg-church-700 hover:bg-church-800">
              Contar testemunho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OracaoActionsMenu;
