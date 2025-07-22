
// src/components/ui/MinistryCard.tsx
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

interface MinistryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
}

const MinistryCard = ({ title, description, imageUrl, slug }: MinistryCardProps) => {
  const fullImageUrl = imageUrl && imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl || ''}`;
  return (
    <Card className="card-church overflow-hidden h-full flex flex-col">
      <Link to={`/ministerios/${slug}`} className="block">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={fullImageUrl}
            alt={`Imagem do ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-church-800">{title}</CardTitle>
      </CardHeader>
      <CardFooter className="pt-0">
        <Link to={`/ministerios/${slug}`} className="w-full">
          <Button className="w-full flex justify-between items-center btn-outline">
            <span>Saiba Mais</span>
            <ChevronRight size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MinistryCard;
