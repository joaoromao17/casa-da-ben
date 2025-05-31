
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MinistryViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ministry: any;
}

const MinistryViewDialog = ({ isOpen, onClose, ministry }: MinistryViewDialogProps) => {
  if (!ministry) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Ministério</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nome</h3>
            <p className="mt-1 text-lg font-semibold">{ministry.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
            <p className="mt-1">{ministry.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Dia de Reunião</h3>
              <p className="mt-1">{ministry.meetingDay || "-"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Líder</h3>
              <p className="mt-1">{ministry.leader?.name || "-"}</p>
            </div>
          </div>

          {ministry.imageUrl && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Imagem</h3>
              <div className="mt-2 max-w-md">
                <img
                  src={ministry.imageUrl}
                  alt={ministry.name}
                  className="rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/300x200?text=Imagem+não+disponível";
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500">Atividades</h3>
            <p className="mt-1">{ministry.activities || "-"}</p>
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MinistryViewDialog;
