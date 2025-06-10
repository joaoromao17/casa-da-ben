
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TestimonyCardProps {
  name: string;
  date: Date;
  message: string;
  isAnonymous?: boolean;
  category: string;
  responded?: boolean;
}

const TestimonyCard = ({ 
  name, 
  date, 
  message, 
  isAnonymous = false, 
  category,
  responded = false
}: TestimonyCardProps) => {
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const displayName = isAnonymous ? "Anônimo" : name;

  const shareOnWhatsApp = () => {
    const text = `Testemunho de ${displayName}: "${message}" - Compartilhado da Igreja Casa da Benção`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

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
                Deus respondeu essa oração
              </div>
            )}
            <div className="text-xs px-2 py-1 rounded-full bg-church-100 text-church-700">
              {category}
            </div>
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

export default TestimonyCard;
