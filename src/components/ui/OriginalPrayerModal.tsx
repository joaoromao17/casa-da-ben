
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OracaoOriginal {
  id: number;
  name: string;
  message: string;
  date: string;
  category: string;
}

interface OriginalPrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayer: OracaoOriginal | null;
}

const OriginalPrayerModal = ({ isOpen, onClose, prayer }: OriginalPrayerModalProps) => {
  if (!prayer) return null;

  const formattedDate = format(new Date(prayer.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'cura': 'Cura',
      'família': 'Família',
      'provisão': 'Provisão',
      'libertação': 'Libertação',
      'milagre': 'Milagre',
      'geral': 'Geral'
    };
    return categories[category] || category;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-church-800">🙏 Pedido Original</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 bg-church-50 rounded-lg border border-church-100">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-church-700">Nome:</p>
                <p className="text-gray-700">{prayer.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-church-700">Categoria:</p>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-church-100 text-church-700">
                  {getCategoryLabel(prayer.category)}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-medium text-church-700">Data:</p>
                <p className="text-gray-700">{formattedDate}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-church-700">Mensagem:</p>
                <p className="text-gray-700 bg-white p-3 rounded border">
                  {prayer.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OriginalPrayerModal;
