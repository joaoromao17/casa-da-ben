
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import EventCard from "@/components/ui/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "Título do Evento",
    description: "Descrição do Evento",
    date: new Date("2025-05-15"),
    time: "Horário do Evento",
    location: "Localização do Evento",
    imageUrl: "/lovable-uploads/eventos.jpg",
    category: "Jovens"
  }
];

const categories = ["Todos", "Culto", "Jovens", "Casais", "Oração", "Ação Social", "Retiro"];

const Eventos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  const filteredEvents = mockEvents.filter(event => {
    // Filter by search term
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === "Todos" || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort events by date (closest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Layout>
      <div className="container-church py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-church-900 mb-4">Eventos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Confira nossa agenda de eventos e participe das atividades da igreja. 
            Todos são bem-vindos para crescer na fé e em comunhão.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-church-100 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pesquisar eventos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <Tabs defaultValue="Todos" onValueChange={setSelectedCategory}>
                <TabsList className="bg-white">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-gray-600 mr-2 mt-1">Filtros rápidos:</p>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white"
              onClick={() => setSearchTerm("culto")}
            >
              Cultos
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white"
              onClick={() => setSearchTerm("jovens")}
            >
              Jovens
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white"
              onClick={() => setSearchTerm("casais")}
            >
              Casais
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-church-900 mb-6 flex items-center">
            <CalendarDays className="mr-2" /> Próximos Eventos
          </h2>
          
          {sortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEvents.map((event) => (
                <EventCard key={event.id} {...event} />
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
        
        {/* Upcoming Special Events Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-church-900 mb-6">Eventos Especiais</h2>
          <div className="bg-gradient-to-r from-church-100 to-church-200 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-church-900 mb-3">Aniversário da Igreja</h3>
            <p className="text-gray-700 mb-4">
              Celebre conosco os 15 anos da ICB 610. Uma semana inteira de celebração com pregadores convidados, 
              apresentações especiais e muito mais.
            </p>
            <div className="flex items-center text-church-800 mb-4">
              <CalendarDays className="mr-2 h-5 w-5" />
              <span>15 a 22 de Junho, 2025</span>
            </div>
            <Button className="bg-church-800 hover:bg-church-900 text-white">
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Eventos;
