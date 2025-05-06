import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Users, Clock, CalendarDays, MapPin, Signpost, ClockAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion"; // Adiciona animação

interface EventoTemplateProps {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  imageUrl: string;
  category: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const EventoTemplate = ({
  title,
  description,
  date,
  time,
  location,
  imageUrl,
  category,
}: EventoTemplateProps) => {
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith("http")
      ? imageUrl
      : `${API_BASE_URL}${imageUrl}`
    : "/lovable-uploads/eventos.jpg";

  const isToday = isSameDay(date, new Date());

  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <Layout>
      <section className="py-12 bg-white">
        <div className="container-church">
          {/* Cabeçalho */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-church-900 mb-2">{title}</h1>
            <p className="text-lg text-gray-600">Aqui estão os detalhes, confira!</p>
          </div>

          {/* Conteúdo principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Lado esquerdo: imagem + descrição + infos */}
            <div className="lg:col-span-2 space-y-10">
              <motion.img
                src={fullImageUrl}
                alt={`Imagem do ${title}`}
                className="w-full max-h-[600px] object-contain rounded-2xl shadow-lg transition-transform duration-500 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              />

              <section>
                <h2 className="text-2xl font-semibold text-church-900 mb-2">Descrição</h2>
                <p className="text-gray-700 leading-relaxed">{description}</p>
                {isToday && (
                  <div className="flex items-center text-red-600 text-sm font-semibold mt-1">
                    <ClockAlert className="w-4 h-4 mr-1" />
                    É HOJE, NÃO PERCA!
                  </div>
                )}
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-church-900 mb-4">Informações</h2>
                <div className="grid gap-3 text-gray-700">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5 text-church-600" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-church-600" />
                    <span>{time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-church-600" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center">
                    <Signpost className="mr-2 h-5 w-5 text-church-600" />
                    <span>{category}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Lado direito: ação */}
            <div className="space-y-6">
              <div className="p-6 border border-gray-200 rounded-xl shadow-sm bg-gray-50">
                <h3 className="text-xl font-medium text-church-800 mb-4">Quer participar?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Confirme sua presença e venha fazer parte desse momento especial conosco!
                </p>
                <Link to="/contato">
                  <Button className="w-full bg-church-700 hover:bg-church-800 text-white text-md">
                    <Users className="w-4 h-4 mr-2" />
                    Confirmar Presença
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventoTemplate;
