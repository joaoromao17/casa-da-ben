
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
  const pageSize = 20;

  const fetchMembers = async (page: number, search: string = "") => {
    try {
      setLoading(true);
      const response = await api.get(`/users/public/membros`, {
        params: {
          page,
          size: pageSize,
          search: search.trim(),
        },
      });
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
    const delayDebounce = setTimeout(() => {
      fetchMembers(currentPage, searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
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
          
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar membros..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
        
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar membros..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {searchTerm.length > 1 && (
            <p className="text-sm text-gray-600 mt-2">
              Exibindo resultados para: "{searchTerm}"
            </p>
          )}
        </div>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-church-700 mb-4">
            {searchTerm.length > 1 
              ? "Nenhum membro encontrado com esse nome."
              : "Nenhum membro cadastrado ainda."
            }
          </p>
        </div>
      ) : (
        <>
          {/* Grid de membros - 2 colunas no mobile, 4 no desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-8">
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
