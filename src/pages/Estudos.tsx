
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import StudyCard from "@/components/ui/StudyCard";
import PaginationControls from "@/components/ui/PaginationControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const categories = ["Todos", "Bíblia", "Doutrina", "Família", "Evangelismo", "Vida Cristã", "Finanças"];

interface Study {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  pdfUrl?: string;
}

interface PageResponse {
  content: Study[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const Estudos = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { currentUser } = useCurrentUser();
  const pageSize = 20;

  const fetchStudies = async (page: number, search: string = "", category: string = "Todos") => {
    try {
      setLoading(true);
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const categoryParam = category !== "Todos" ? `&category=${encodeURIComponent(category)}` : "";
      const response = await api.get(`/estudos?page=${page - 1}&size=${pageSize}${searchParam}${categoryParam}`);
      
      // Se a API não retorna dados paginados, simular paginação
      if (Array.isArray(response.data)) {
        const allData = response.data;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = allData.slice(startIndex, endIndex);
        
        setStudies(paginatedData);
        setTotalPages(Math.ceil(allData.length / pageSize));
        setCurrentPage(page);
      } else {
        // API já retorna dados paginados
        const data: PageResponse = response.data;
        setStudies(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(data.number + 1);
      }
    } catch (error) {
      console.error("Erro ao buscar estudos:", error);
      setStudies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies(1, searchTerm, selectedCategory);
  }, []);

  useEffect(() => {
    fetchStudies(1, searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory]);

  const handlePageChange = (page: number) => {
    fetchStudies(page, searchTerm, selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Verificar se o usuário pode gerenciar estudos
  const canManageStudies = currentUser?.roles?.includes("ROLE_ADMIN") || currentUser?.roles?.includes("ROLE_PROFESSOR");

  if (loading) {
    return (
      <Layout>
        <div className="container-church py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-church-900 mb-4">Estudos Bíblicos</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore nossa coleção de estudos bíblicos, materiais de ensino e recursos para aprofundar sua fé e conhecimento das escrituras.
            </p>
          </div>

          <div className="mb-8 bg-church-100 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Pesquisar estudos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="flex-shrink-0">
                <Tabs defaultValue="Todos" onValueChange={handleCategoryChange}>
                  <TabsList className="bg-white overflow-x-auto">
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

          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-church-900 flex items-center">
                <BookOpen className="mr-2" /> Materiais de Estudo
              </h2>
              
              {canManageStudies && (
                <Link to="/estudos/gerenciar">
                  <Button className="bg-church-900 text-white hover:bg-church-700 flex items-center gap-2">
                    <Settings size={18} />
                    Ações Estudos
                  </Button>
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex-shrink-0">
              <Tabs defaultValue="Todos" onValueChange={handleCategoryChange}>
                <TabsList className="bg-white overflow-x-auto">
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-church-900 flex items-center">
              <BookOpen className="mr-2" /> Materiais de Estudo
            </h2>
            
            {/* Botão Ações Estudos - visível apenas para ADMIN e PROFESSOR */}
            {canManageStudies && (
              <Link to="/estudos/gerenciar">
                <Button className="bg-church-900 text-white hover:bg-church-700 flex items-center gap-2">
                  <Settings size={18} />
                  Ações Estudos
                </Button>
              </Link>
            )}
          </div>

          {studies.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {studies.map((study) => (
                  <StudyCard
                    key={study.id}
                    id={study.id}
                    title={study.title}
                    description={study.description}
                    author={study.author}
                    date={new Date(study.date)}
                    category={study.category}
                    pdfUrl={study.pdfUrl}
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
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
        </div>
      </div>
    </Layout>
  );
};

export default Estudos;
