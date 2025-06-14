
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import OracaoActionsMenu from "./OracaoActionsMenu";

interface Usuario {
  id: number;
  name: string;
  email: string;
}

interface OracaoCardProps {
  id: number;
  name: string;
  date: Date;
  message: string;
  isAnonymous?: boolean;
  category: string;
  usuario?: Usuario;
  responded?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onMarkAnswered?: (id: number) => void;
  onCreateTestimony?: (id: number) => void;
}

const OracaoCard = ({ 
  id,
  name, 
  date, 
  message, 
  isAnonymous = false, 
  category,
  usuario,
  responded = false,
  onEdit,
  onDelete,
  onMarkAnswered,
  onCreateTestimony
}: OracaoCardProps) => {
const { currentUser } = useAuth();

const displayName = isAnonymous ? "Anônimo" : name;
const isOwnPrayer = currentUser && usuario && currentUser.id === usuario.id;

const shareOnWhatsApp = () => {
  const text = `Oração de ${displayName}: "${message}" - Compartilhado da Igreja Casa da Benção`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

// Corrige o fuso horário para evitar voltar um dia
const adjustedDate = new Date(date);
adjustedDate.setMinutes(adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset());

const formattedDate = format(adjustedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });


  return (
    <Card className="card-church overflow-hidden h-full flex flex-col">
      <CardHeader className="bg-church-50 border-b border-church-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-church-800">{displayName}</h3>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2">
            {responded && (
              <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                Deus respondeu
              </div>
            )}
            <div className="text-xs px-2 py-1 rounded-full bg-church-100 text-church-700">
              {category}
            </div>
            {isOwnPrayer && onEdit && onDelete && onMarkAnswered && onCreateTestimony && (
              <OracaoActionsMenu
                oracaoId={id}
                responded={responded}
                onEdit={() => onEdit(id)}
                onDelete={() => onDelete(id)}
                onMarkAnswered={() => onMarkAnswered(id)}
                onCreateTestimony={() => onCreateTestimony(id)}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4 flex-grow">
        <p className="text-gray-700">{message}</p>
      </CardContent>
      <CardFooter className="border-t border-church-100 pt-3">
        <Button 
          variant="ghost" 
          className="text-church-600 hover:text-church-800 hover:bg-church-50 ml-auto flex items-center gap-2"
          onClick={shareOnWhatsApp}
        >
          <Share2 size={18} />
          Compartilhar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OracaoCard;
