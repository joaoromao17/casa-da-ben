
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import ContribuicaoCard from "@/components/ui/ContribuicaoCard";
import PaginationControls from "@/components/ui/PaginationControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import api from "@/services/api";

interface Contribuicao {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'ATIVA' | 'PAUSADA' | 'FINALIZADA';
  category: string;
  pixKey?: string;
}

interface PageResponse {
  content: Contribuicao[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const Contribuicoes = () => {
  const [contributions, setContributions] = useState<Contribuicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { currentUser } = useCurrentUser();
  const pageSize = 20;

  const fetchContributions = async (page: number, search: string = "", category: string = "", status: string = "") => {
    try {
      setLoading(true);
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const categoryParam = category && category !== "todos" ? `&category=${encodeURIComponent(category)}` : "";
      const statusParam = status && status !== "todos" ? `&status=${encodeURIComponent(status)}` : "";
      const response = await api.get(`/contribuicoes?page=${page - 1}&size=${pageSize}${searchParam}${categoryParam}${statusParam}`);
      
      // Se a API não retorna dados paginados, simular paginação
      if (Array.isArray(response.data)) {
        const allData = response.data;
        
        // Ordenar por data (mais recentes primeiro)
        allData.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
        
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = allData.slice(startIndex, endIndex);
        
        setContributions(paginatedData);
        setTotalPages(Math.ceil(allData.length / pageSize));
        setCurrentPage(page);
      } else {
        // API já retorna dados paginados
        const data: PageResponse = response.data;
        setContributions(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(data.number + 1);
      }
    } catch (error) {
      console.error("Erro ao buscar contribuições:", error);
      setContributions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions(1, searchTerm, selectedCategory, selectedStatus);
  }, []);

  useEffect(() => {
    fetchContributions(1, searchTerm, selectedCategory, selectedStatus);
  }, [searchTerm, selectedCategory, selectedStatus]);

  const handlePageChange = (page: number) => {
    fetchContributions(page, searchTerm, selectedCategory, selectedStatus);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if user has permission to manage contributions
  const canManageContributions = currentUser?.roles?.some(role => 
    ['ROLE_ADMIN', 'ROLE_PASTOR', 'ROLE_PASTORAUXILIAR', 'ROLE_LIDER'].includes(role)
  );

  if (loading) {
    return (
      <Layout>
        <div className="container-church py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-church-900 mb-4">Contribuições</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Participe das campanhas e projetos da nossa igreja. Sua contribuição faz a diferença no Reino de Deus.
            </p>
          </div>

          {/* Filtros e Pesquisa */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Pesquisar campanhas..."
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
                      <SelectValue placeholder="Categoria" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="construção">Construção</SelectItem>
                    <SelectItem value="missões">Missões</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-48">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter size={18} />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ATIVA">Ativa</SelectItem>
                    <SelectItem value="PAUSADA">Pausada</SelectItem>
                    <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {canManageContributions && (
                <Link to="/contribuicoes/gerenciar">
                  <Button className="bg-church-700 hover:bg-church-800 flex items-center gap-2">
                    <Settings size={18} />
                    Gerenciar
                  </Button>
                </Link>
              )}
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-church-900 mb-4">Contribuições</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Participe das campanhas e projetos da nossa igreja. Sua contribuição faz a diferença no Reino de Deus.
          </p>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Pesquisar campanhas..."
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
                    <SelectValue placeholder="Categoria" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="construção">Construção</SelectItem>
                  <SelectItem value="missões">Missões</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="equipamentos">Equipamentos</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-48">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={18} />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ATIVA">Ativa</SelectItem>
                  <SelectItem value="PAUSADA">Pausada</SelectItem>
                  <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {canManageContributions && (
              <Link to="/contribuicoes/gerenciar">
                <Button className="bg-church-700 hover:bg-church-800 flex items-center gap-2">
                  <Settings size={18} />
                  Gerenciar
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Lista de Contribuições */}
        {contributions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {contributions.map((contribution) => (
                <ContribuicaoCard
                  key={contribution.id}
                  contribuicao={contribution}
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
              Nenhuma campanha encontrada.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-church-50 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-church-900 mb-3">Contribua com o Reino</h2>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            "Cada um contribua segundo propôs no seu coração, não com tristeza ou por necessidade; porque Deus ama ao que dá com alegria."
            <br />
            <span className="font-medium">2 Coríntios 9:7</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contribuicoes;
