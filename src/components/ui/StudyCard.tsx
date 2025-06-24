
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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

const handleReadStudy = () => {
  // Verificar se o usuário está logado
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (!token) {
    setShowLoginNotice(true);
    return;
  }

  if (pdfUrl) {
    // Forçar visualização inline no navegador
    const visualUrl = pdfUrl.replace("/raw/upload/", "/raw/upload/fl_inline/");
    window.open(visualUrl, "_blank");
  }
};


  return (
    <>
      <Card className="card-church overflow-hidden h-full flex flex-col">
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
          <p className="text-gray-600 line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 border-t border-gray-100">
          {pdfUrl && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleReadStudy}
            >
              <FileText size={18} />
              Ler Estudo
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {showLoginNotice && (
        <LoginRequiredNotice
          message="Você precisa estar logado para ler os estudos bíblicos."
          onClose={() => setShowLoginNotice(false)}
        />
      )}
    </>
  );
};

export default StudyCard;
