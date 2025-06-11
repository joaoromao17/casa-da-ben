
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UserCard from "./UserCard";
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
  const pageSize = 12;

  const fetchMembers = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/users/public/membros?page=${page}&size=${pageSize}`);
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
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-church-900 mb-4">Nossos Membros</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça os membros da nossa comunidade
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
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
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-church-900 mb-4">Nossos Membros</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Conheça os membros da nossa comunidade
        </p>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Nenhum membro encontrado</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {members.map((member) => (
              <UserCard usuario={member} key={member.id} />
            ))}
          </div>

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
