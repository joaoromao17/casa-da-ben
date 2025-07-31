
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import LoginRequiredNotice from "@/components/ui/LoginRequiredNotice";

interface StudyCardProps {
  id: string;
  title: string;
  description: string;
  author: string;
  date: Date;
  pdfUrl?: string;
  category: string;
}

const StudyCard = ({ id, title, description, author, date, pdfUrl, category }: StudyCardProps) => {
  const formattedDate = format(date, "dd/MM/yyyy", { locale: ptBR });
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  const handleView = () => {
    // Verificar se o usuário está logado para visualizar
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      setShowLoginNotice(true);
      return;
    }

    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

const shareOnWhatsApp = () => {
  let message = `📖 *Estudo Bíblico: "${title}"*\n\n`;
  message += `✍️ *Por:* ${author}\n`;
  message += `📆 *Data:* ${formattedDate}\n\n`;
  message += `📝 *Resumo:* ${description}\n\n`;

  if (pdfUrl) {
    message += `🔗 *Link do estudo:* ${pdfUrl}\n\n`;
  }

  message += `📚 *Mais estudos:* https://casa-da-ben.vercel.app/estudos\n\n`;
  message += `🙏 *Compartilhado pela Igreja Casa da Benção*`;

  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};


  return (
    <>
      <Card className="card-church overflow-hidden flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-church-800">{title}</CardTitle>
              <CardDescription>Por {author} • {formattedDate}</CardDescription>
            </div>
            <div className="text-xs px-2 py-1 rounded-full bg-church-100 text-church-700">
              {category}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-600">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-2 pt-2 border-t border-gray-100">
          {pdfUrl && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleView}
            >
              <FileText size={18} />
              Ver Estudo
            </Button>
          )}
          <Button 
            variant="ghost" 
            className="text-church-600 hover:text-church-800 hover:bg-church-50 flex items-center gap-2"
            onClick={shareOnWhatsApp}
          >
            <Share2 size={18} />
            Compartilhar
          </Button>
        </CardFooter>
      </Card>
      
      {showLoginNotice && (
        <LoginRequiredNotice
          message="Você precisa estar logado para acessar os estudos bíblicos."
          onClose={() => setShowLoginNotice(false)}
        />
      )}
    </>
  );
};

export default StudyCard;