
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import StudyCard from "@/components/ui/StudyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search } from "lucide-react";

// Mock data for studies
const mockStudies = [
  {
    id: "1",
    title: "Fundamentos da Fé",
    description: "Estudo profundo sobre os fundamentos da fé cristã e como aplicá-los no dia a dia.",
    author: "Pr. João Silva",
    date: new Date("2025-03-15"),
    category: "Doutrina",
    pdfUrl: "#"
  },
  {
    id: "2",
    title: "O Livro de Romanos",
    description: "Análise detalhada do livro de Romanos e suas implicações para a vida cristã contemporânea.",
    author: "Pr. Maria Santos",
    date: new Date("2025-03-01"),
    category: "Bíblia",
    pdfUrl: "#"
  },
  {
    id: "3",
    title: "Vida em Família",
    description: "Como construir uma família baseada em princípios bíblicos e desenvolver relacionamentos saudáveis.",
    author: "Pr. Carlos Oliveira",
    date: new Date("2025-02-20"),
    category: "Família",
    pdfUrl: "#"
  },
  {
    id: "4",
    title: "Evangelismo Prático",
    description: "Métodos e estratégias para compartilhar o evangelho de forma eficaz no mundo contemporâneo.",
    author: "Pr. Ana Costa",
    date: new Date("2025-02-10"),
    category: "Evangelismo",
    pdfUrl: "#"
  },
  {
    id: "5",
    title: "Batalha Espiritual",
    description: "Compreendendo a batalha espiritual e como permanecer firme na fé diante das adversidades.",
    author: "Pr. Pedro Mendes",
    date: new Date("2025-01-25"),
    category: "Vida Cristã"
  },
  {
    id: "6",
    title: "Mordomia Cristã",
    description: "Princípios bíblicos sobre como administrar bem os recursos que Deus nos confiou.",
    author: "Pr. Juliana Pereira",
    date: new Date("2025-01-15"),
    category: "Finanças",
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
          <h2 className="text-2xl font-bold mb-4">Escola Bíblica Dominical</h2>
          <p className="mb-6">Participe de nossa Escola Bíblica Dominical todos os domingos às 9h e aprofunde seu conhecimento da Palavra.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-church-900 hover:bg-gray-200">
              Ver Horários
            </Button>
            <Button className="bg-white text-church-900 hover:bg-gray-200">
              Material da EBD
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Estudos;
