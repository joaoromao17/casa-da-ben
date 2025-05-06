import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin, Signpost, ClockAlert } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { API_BASE_URL } from "@/services/api";
import { isSameDay } from "date-fns";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  imageUrl: string;
  category: string;
}

const EventCard = ({
  id,
  title,
  description,
  date,
  time,
  location,
  imageUrl,
  category
}: EventCardProps) => {
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR
  });

  const fullImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${API_BASE_URL}${imageUrl}`;

    const isToday = isSameDay(date, new Date());

  return (
    <Card className="card-church overflow-hidden h-full flex flex-col">
      <div className="h-60 overflow-hidden">
        <img
          src={fullImageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-church-800">{title}</CardTitle>
        {isToday && (
          <div className="flex items-center text-red-600 text-sm font-semibold mt-1">
            <ClockAlert className="w-4 h-4 mr-1" />
            É HOJE, NÃO PERCA!
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-gray-600 line-clamp-3">{description}</p>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-4 w-4 text-church-600" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-church-600" />
            <span>{time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-church-600" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Signpost className="mr-2 h-4 w-4 text-church-600" />
            <span>{category}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to={`/eventos/${id}`}>
          <Button className="btn-primary">Ver Detalhes</Button>
        </Link>
        <Button variant="outline" className="hover:bg-church-50">
          Adicionar ao Calendário
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
