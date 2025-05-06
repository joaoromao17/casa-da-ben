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

interface MinistryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MinistryCard = ({ title, description, imageUrl, slug }: MinistryCardProps) => {
  const fullImageUrl = imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`;
  return (
    <Card className="card-church overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={fullImageUrl}
          alt={`Imagem do ${title}`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-church-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter>
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
