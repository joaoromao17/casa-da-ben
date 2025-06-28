
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
      
      // Construir parâmetros da query
      const params: any = {
        page: page - 1,
        size: pageSize
      };
      
      if (search.trim()) {
        params.search = search.trim();
      }
      
      if (category !== "Todos") {
        params.category = category;
      }

      console.log("Buscando estudos com parâmetros:", params);
      
      const response = await api.get('/estudos', { params });
      
      // Se a API não retorna dados paginados, simular paginação
      if (Array.isArray(response.data)) {
        let allData = response.data;
        
        // Aplicar filtros manualmente se necessário
        if (search.trim()) {
          allData = allData.filter(study => 
            study.title.toLowerCase().includes(search.toLowerCase()) ||
            study.description.toLowerCase().includes(search.toLowerCase()) ||
            study.author.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        if (category !== "Todos") {
          allData = allData.filter(study => study.category === category);
        }
        
        // Ordenar por data mais recente primeiro (mudança principal aqui)
        allData = allData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = allData.slice(startIndex, endIndex);
        
        setStudies(paginatedData);
        setTotalPages(Math.ceil(allData.length / pageSize));
        setCurrentPage(page);
      } else {
        // API já retorna dados paginados
        const data: PageResponse = response.data;
        
        // Ordenar por data mais recente primeiro (mudança principal aqui)
        const sortedStudies = data.content.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setStudies(sortedStudies);
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

  // Aplicar debounce para pesquisa
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudies(1, searchTerm, selectedCategory);
    }, 300);

    return () => clearTimeout(delayDebounce);
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

          <div className="mb-8 bg-church-100 p-4 md:p-6 rounded-lg">
            <div className="flex flex-col gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Pesquisar estudos..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="w-full overflow-x-auto">
                <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
                  <TabsList className="bg-white w-full min-w-max">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category} className="text-xs sm:text-sm whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2">{category}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600">Tópicos populares:</p>
              <div className="flex flex-wrap gap-2">
                {["Oração", "Salvação", "Santidade", "Adoração", "Discipulado"].map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    className="bg-white text-xs"
                    onClick={() => setSearchTerm(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
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
          <h1 className="text-3xl md:text-4xl font-bold text-church-900 mb-4">Escola Bíblica</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore nossa coleção de estudos bíblicos, materiais de ensino e recursos para aprofundar sua fé e conhecimento das escrituras.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-church-100 p-4 md:p-6 rounded-lg">
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pesquisar estudos..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="w-full overflow-x-auto">
              <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
                <TabsList className="bg-white w-full min-w-max">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="text-xs sm:text-sm whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2">{category}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">Tópicos populares:</p>
            <div className="flex flex-wrap gap-2">
              {["Oração", "Salvação", "Santidade", "Adoração", "Discipulado"].map((topic) => (
                <Button
                  key={topic}
                  variant="outline"
                  size="sm"
                  className="bg-white text-xs"
                  onClick={() => setSearchTerm(topic)}
                >
                  {topic}
                </Button>
              ))}
            </div>
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
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== "Todos" 
                  ? "Nenhum estudo encontrado para sua pesquisa." 
                  : "Nenhum estudo disponível."
                }
              </p>
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
