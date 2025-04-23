
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import StudyCard from "@/components/ui/StudyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for studies
const mockStudies = [
  {
    id: "1",
    title: "Nome do Estudo",
    description: "Descrição do Estudo",
    author: "Professor do Estudo",
    date: new Date("2025-03-15"),
    category: "Doutrina",
    pdfUrl: "#"
  }
];

const categories = ["Todos", "Bíblia", "Doutrina", "Família", "Evangelismo", "Vida Cristã", "Finanças"];

const Estudos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  const filteredStudies = mockStudies.filter(study => {
    // Filter by search term
    const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         study.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === "Todos" || study.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container-church py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-church-900 mb-4">Estudos Bíblicos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore nossa coleção de estudos bíblicos, materiais de ensino e recursos para aprofundar sua fé e conhecimento das escrituras.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-church-100 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pesquisar estudos..."
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
            <p className="text-sm text-gray-600 mr-2 mt-1">Tópicos populares:</p>
            {["Oração", "Salvação", "Santidade", "Adoração", "Discipulado"].map((topic) => (
              <Button 
                key={topic} 
                variant="outline" 
                size="sm"
                className="bg-white"
                onClick={() => setSearchTerm(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-church-900 mb-6 flex items-center">
            <BookOpen className="mr-2" /> Materiais de Estudo
          </h2>
          
          {filteredStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudies.map((study) => (
                <StudyCard key={study.id} {...study} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Nenhum estudo encontrado para sua pesquisa.</p>
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
        <div className="bg-church-900 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Escola Bíblica</h2>
          <p className="mb-6">Participe de nossa Escola Bíblica todas as quartas-feiras às 20h e aprofunde seu conhecimento da Palavra.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/cultos">
            <Button className="bg-white text-church-900 hover:bg-gray-200">
              Ver Horários
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Estudos;
