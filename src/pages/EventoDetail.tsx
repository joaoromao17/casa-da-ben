
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EventoTemplate from "@/pages/EventoTemplate";
import { Loading } from "@/components/ui/loading";
import api from "@/services/api";

interface Evento {
  id: number;
  title: string;
  description: string;
  date: Date; // convertida depois
  time: string;
  location: string;
  imageUrl: string;
  category: string;
}

export default function EventoDetail() {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.get(`/eventos/${id}`)
        .then((response) => {
          const data = response.data;
  
          setEvento({
            id: data.id,
            title: data.title,
            description: data.description,
            date: data.date,
            time: data.time,
            location: data.location,
            imageUrl: data.imageUrl,
            category: data.category
          });
        })
        .catch((error) => {
          console.error("Erro ao buscar evento:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!evento) {
    return <div>Evento não encontrado.</div>;
  }

  return (
    <EventoTemplate
      id={evento.id}
      title={evento.title}
      description={evento.description}
      date={evento.date}
      time={evento.time}
      location={evento.location}
      imageUrl={evento.imageUrl}
      category={evento.category}
    />
  );
}
