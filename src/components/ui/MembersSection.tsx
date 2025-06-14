
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { Skeleton } from "@/components/ui/skeleton";
import UserCard from "@/components/ui/UserCard";
import api from "@/services/api";

interface MembersSectionProps {
  className?: string;
}

interface PageResponse {
  content: any[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const MembersSection = ({ className }: MembersSectionProps) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 20; // 5 linhas x 4 colunas

  const fetchMembers = async (page: number, search: string = "") => {
    try {
      setLoading(true);
      // Por enquanto, vamos ignorar o parâmetro de busca até a API estar pronta
      const response = await api.get(`/users/public/membros?page=${page}&size=${pageSize}`);
      console.log("Membros carregados:", response.data);
      
      const data: PageResponse = response.data;
      setMembers(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(0);
  }, []);

  const handlePageChange = (page: number) => {
    fetchMembers(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Por enquanto, não fazemos busca real até a API estar implementada
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-church-900 mb-4 flex items-center justify-center gap-3">
            <Users className="h-8 w-8" />
            Nossos Membros
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Conheça os membros da nossa comunidade de fé
          </p>
          
          {/* Campo de Pesquisa - Temporariamente desabilitado */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar membros... (em breve)"
                className="pl-10 bg-gray-50"
                value={searchTerm}
                onChange={handleSearchChange}
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Funcionalidade de busca será implementada em breve</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-church-900 mb-4 flex items-center justify-center gap-3">
          <Users className="h-8 w-8" />
          Nossos Membros
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Conheça os membros da nossa comunidade de fé
        </p>
        
        {/* Campo de Pesquisa - Temporariamente desabilitado */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar membros... (em breve)"
              className="pl-10 bg-gray-50"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Funcionalidade de busca será implementada em breve</p>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-church-700 mb-4">
            Nenhum membro cadastrado ainda.
          </p>
        </div>
      ) : (
        <>
          {/* Grid de membros - 4 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {members.map((member) => (
              <UserCard
                key={member.id}
                usuario={member}
              />
            ))}
          </div>

          {/* Controles de paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <span className="text-gray-600">
                Página {currentPage + 1} de {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center gap-2"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MembersSection;
