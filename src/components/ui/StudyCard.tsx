import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const handleReadStudy = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", `${title}.pdf`);
      link.setAttribute("target", "_blank"); // Adiciona isso para garantir que não tente abrir na mesma aba
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  

  return (
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
      <CardFooter className="flex justify-between gap-2 pt-2 border-t border-gray-100">
        {pdfUrl && (
          <>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleReadStudy}
            >
              <FileText size={18} />
              Ler Estudo
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleDownloadPDF}
            >
              <Download size={18} />
              Download PDF
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudyCard;
