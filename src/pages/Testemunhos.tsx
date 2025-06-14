import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import TestimonyCard from "@/components/ui/TestimonyCard";
import TestimonyFormModal from "@/components/ui/TestimonyFormModal";
import LoginRequiredNotice from "@/components/ui/LoginRequiredNotice";
import PaginationControls from "@/components/ui/PaginationControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";

interface Usuario {
  id: number;
  name: string;
  email: string;
}

interface OracaoOriginal {
  id: number;
  name: string;
  message: string;
  date: string;
  category: string;
}

interface Testemunho {
  id: number;
  name: string;
  message: string;
  date: string;
  category: string;
  isAnonymous: boolean;
  responded: boolean;
  usuario: Usuario;
  oracaoOriginal?: OracaoOriginal;
}

interface PageResponse {
  content: Testemunho[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const Testemunhos = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [testimonies, setTestimonies] = useState<Testemunho[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isTestimonyModalOpen, setIsTestimonyModalOpen] = useState(false);
  const [editingTestimony, setEditingTestimony] = useState<Testemunho | null>(null);
  const [showMyTestimonies, setShowMyTestimonies] = useState(false);
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const pageSize = 20;

  const fetchTestimonies = async (page: number, search: string = "", category: string = "") => {
    try {
      setLoading(true);
      const endpoint = showMyTestimonies ? "/testemunhos/minhas" : "/testemunhos";
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const categoryParam = category && category !== "todos" ? `&category=${encodeURIComponent(category)}` : "";
      const response = await api.get(`${endpoint}?page=${page - 1}&size=${pageSize}${searchParam}${categoryParam}`);
      
      // Se a API não retorna dados paginados, simular paginação
      if (Array.isArray(response.data)) {
        const allData = response.data;
        
        // Ordenar por data (mais recentes primeiro)
        allData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = allData.slice(startIndex, endIndex);
        
        setTestimonies(paginatedData);
        setTotalPages(Math.ceil(allData.length / pageSize));
        setCurrentPage(page);
      } else {
        // API já retorna dados paginados
        const data: PageResponse = response.data;
        setTestimonies(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(data.number + 1);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar testemunhos",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonies(1, searchTerm, selectedCategory);
  }, [showMyTestimonies]);

  useEffect(() => {
    fetchTestimonies(1, searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory]);

  const handlePageChange = (page: number) => {
    fetchTestimonies(page, searchTerm, selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTestimonySubmit = async (testimony: {
    message: string;
    category: string;
    isAnonymous: boolean;
  }, oracaoId?: number) => {
    try {
      const payload: any = {
        message: testimony.message,
        category: testimony.category,
      };

      if (testimony.isAnonymous) {
        payload.name = "Anônimo";
      }

      if (editingTestimony) {
        // Edição - fazer PUT em vez de POST
        await api.put(`/testemunhos/${editingTestimony.id}`, payload);
        toast({
          title: "Testemunho atualizado",
          description: "Seu testemunho foi atualizado com sucesso!"
        });
      } else {
        // Criação nova
        await api.post("/testemunhos", payload);
        toast({
          title: "Testemunho compartilhado",
          description: "Seu testemunho foi compartilhado com sucesso!"
        });
      }

      fetchTestimonies(1, searchTerm, selectedCategory);
      setEditingTestimony(null);
    } catch (error) {
      toast({
        title: editingTestimony ? "Erro ao atualizar testemunho" : "Erro ao compartilhar testemunho",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (id: number) => {
    const testimony = testimonies.find(t => t.id === id);
    if (testimony) {
      setEditingTestimony(testimony);
      setIsTestimonyModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/testemunhos/${id}`);
      toast({
        title: "Testemunho excluído",
        description: "Seu testemunho foi excluído com sucesso."
      });
      fetchTestimonies(currentPage, searchTerm, selectedCategory);
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const openNewTestimonyModal = () => {
    if (!isAuthenticated) {
      setShowLoginNotice(true);
      return;
    }
    setEditingTestimony(null);
    setIsTestimonyModalOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-church py-12">
          <div className="flex flex-col items-center text-center mb-10">
            <h1 className="text-4xl font-bold text-church-900 mb-4">Testemunhos</h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Compartilhe como Deus tem agido em sua vida e inspire outros com seu testemunho.
            </p>
          </div>

          {/* Filtros e Pesquisa */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Pesquisar testemunhos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="w-full md:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter size={18} />
                      <SelectValue placeholder="Filtrar por" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="cura">Cura</SelectItem>
                    <SelectItem value="família">Família</SelectItem>
                    <SelectItem value="provisão">Provisão</SelectItem>
                    <SelectItem value="libertação">Libertação</SelectItem>
                    <SelectItem value="milagre">Milagre</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isAuthenticated && (
                <Button
                  variant={showMyTestimonies ? "default" : "outline"}
                  className={showMyTestimonies ? "bg-church-700 hover:bg-church-800" : ""}
                  onClick={() => setShowMyTestimonies(!showMyTestimonies)}
                >
                  {showMyTestimonies ? "Todos os Testemunhos" : "Meus Testemunhos"}
                </Button>
              )}

              <Button className="bg-church-700 hover:bg-church-800" onClick={openNewTestimonyModal}>
                <Plus size={18} className="mr-2" /> Compartilhar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-church py-12">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-4xl font-bold text-church-900 mb-4">Testemunhos</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Compartilhe como Deus tem agido em sua vida e inspire outros com seu testemunho.
          </p>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Pesquisar testemunhos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={18} />
                    <SelectValue placeholder="Filtrar por" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="cura">Cura</SelectItem>
                  <SelectItem value="família">Família</SelectItem>
                  <SelectItem value="provisão">Provisão</SelectItem>
                  <SelectItem value="libertação">Libertação</SelectItem>
                  <SelectItem value="milagre">Milagre</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isAuthenticated && (
              <Button
                variant={showMyTestimonies ? "default" : "outline"}
                className={showMyTestimonies ? "bg-church-700 hover:bg-church-800" : ""}
                onClick={() => setShowMyTestimonies(!showMyTestimonies)}
              >
                {showMyTestimonies ? "Todos os Testemunhos" : "Meus Testemunhos"}
              </Button>
            )}

            <Button className="bg-church-700 hover:bg-church-800" onClick={openNewTestimonyModal}>
              <Plus size={18} className="mr-2" /> Compartilhar
            </Button>
          </div>
        </div>

        {/* Testemunhos */}
        {testimonies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {testimonies.map((testimony) => (
                <TestimonyCard
                  key={testimony.id}
                  id={testimony.id}
                  name={testimony.name}
                  date={new Date(testimony.date)}
                  message={testimony.message}
                  isAnonymous={testimony.isAnonymous}
                  category={testimony.category}
                  usuario={testimony.usuario}
                  responded={testimony.responded}
                  oracaoOriginal={testimony.oracaoOriginal}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Nenhum testemunho encontrado.
            </p>
          </div>
        )}

        {/* Seção inspiradora */}
        <div className="mt-16 bg-church-50 p-8 rounded-xl text-center">
          <Heart size={48} className="mx-auto text-church-700 mb-4" />
          <h2 className="text-2xl font-bold text-church-900 mb-3">Compartilhe o que Deus tem feito</h2>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            "Grandes coisas fez o Senhor por nós, e por isso estamos alegres."
            <br />
            <span className="font-medium">Salmos 126:3</span>
          </p>
          <Button
            className="bg-church-700 hover:bg-church-800"
            onClick={openNewTestimonyModal}
          >
            Compartilhe seu Testemunho
          </Button>
        </div>
      </div>

      {/* Modal de testemunho */}
      <TestimonyFormModal
        isOpen={isTestimonyModalOpen}
        onClose={() => {
          setIsTestimonyModalOpen(false);
          setEditingTestimony(null);
        }}
        onSubmit={handleTestimonySubmit}
        oracaoMessage={editingTestimony?.message}
        oracaoCategory={editingTestimony?.category}
        oracaoIsAnonymous={editingTestimony?.isAnonymous}
        isFromPrayer={!!editingTestimony?.oracaoOriginal} // detecta se veio de oração
      />

      {/* Aviso de login necessário */}
      {showLoginNotice && (
        <LoginRequiredNotice
          message="Vous precisa estar logado para compartilhar um testemunho."
          onClose={() => setShowLoginNotice(false)}
        />
      )}
    </Layout>
  );
};

export default Testemunhos;
