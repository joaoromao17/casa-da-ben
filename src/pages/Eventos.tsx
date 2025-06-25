
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import EventCard from "@/components/ui/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import EventCreateForm from "@/components/events/EventCreateForm";

const categories = ["Todos", "Culto", "Oração", "Ação Social", "Retiro"];

interface Event {
  id: number;
  title: string;
  description: string;
  date: Date; // convertida depois
  time: string;
  location: string;
  imageUrl: string;
  category: string;
}

const Eventos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useCurrentUser();

  // Check if user is admin
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN") || false;

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await api.get("/eventos");

        const parsedEvents = response.data.map((event: any) => {
          const [year, month, day] = event.date.split("-").map(Number);
          return {
            ...event,
            date: new Date(year, month - 1, day),
          };
        });

        setEvents(parsedEvents);
      } catch (err) {
        setError("Erro ao carregar eventos.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);


  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Por enquanto, categoria não existe nos dados. Se quiser usar, precisará ser adicionada no backend.
    const matchesCategory = selectedCategory === "Todos" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort events by date (closest first)
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );


  return (
    <Layout>
      <div className="container-church py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-church-900 mb-4">Eventos</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Confira nossa agenda de eventos e participe das atividades da igreja.
                Todos são bem-vindos para crescer na fé e em comunhão.
              </p>
            </div>
            {isAdmin && (
              <div className="flex-shrink-0 mt-4 lg:mt-0 lg:ml-4">
                <EventCreateForm>
                  <Button className="bg-church-600 hover:bg-church-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Evento
                  </Button>
                </EventCreateForm>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-church-100 p-4 md:p-6 rounded-lg">
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pesquisar eventos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full overflow-x-auto">
              <Tabs defaultValue="Todos" onValueChange={setSelectedCategory}>
                <TabsList className="bg-white w-full min-w-max">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="text-xs sm:text-sm whitespace-nowrap px-3 py-2">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">Filtros rápidos:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-xs"
                onClick={() => setSearchTerm("culto")}
              >
                Cultos
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-xs"
                onClick={() => setSearchTerm("jovens")}
              >
                Jovens
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-xs"
                onClick={() => setSearchTerm("casais")}
              >
                Casais
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-church-900 mb-6 flex items-center">
            <CalendarDays className="mr-2" /> Próximos Eventos
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <p>Carregando eventos...</p>
            </div>
          ) : error ? (
            <ErrorAlert
              title="Erro ao carregar eventos"
              message="Tente novamente mais tarde."
              onRetry={() => window.location.reload()}
            />
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEvents.map((event) => (
                <EventCard key={event.id} {...event} id={String(event.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Nenhum evento encontrado para sua pesquisa.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Todos");
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-church-900 text-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h2 className="text-2xl font-bold mb-2">Sugerir um Evento</h2>
              <p className="text-gray-300">
                Tem uma ideia para um evento na igreja? Compartilhe conosco e ajude a enriquecer nossa programação.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link to="/contato">
                <Button className="bg-white text-church-900 hover:bg-gray-200">
                  Enviar Sugestão
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Eventos;
