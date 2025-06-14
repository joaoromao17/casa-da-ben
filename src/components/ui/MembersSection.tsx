
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import UserCard from "@/components/ui/UserCard";
import PaginationControls from "@/components/ui/PaginationControls";
import api from "@/services/api";

interface User {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string;
  biography?: string;
  phone?: string;
}

const ITEMS_PER_PAGE = 20; // 5 linhas x 4 colunas

const MembersSection = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get("/users/public/members");
        console.log("Membros carregados:", response.data);
        
        if (Array.isArray(response.data)) {
          // Ordenar membros por nome em ordem alfabética
          const sortedMembers = response.data.sort((a: User, b: User) => 
            a.name.localeCompare(b.name, 'pt-BR')
          );
          setMembers(sortedMembers);
          setFilteredMembers(sortedMembers);
        }
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, members]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-church-900 mb-4 flex items-center justify-center gap-3">
          <Users className="h-8 w-8" />
          Nossos Membros
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Conheça os membros da nossa comunidade de fé
        </p>
        
        {/* Campo de Pesquisa */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Pesquisar membros..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Contador de membros */}
        <p className="text-sm text-gray-500 mb-8">
          {filteredMembers.length} {filteredMembers.length === 1 ? 'membro encontrado' : 'membros encontrados'}
          {searchTerm && ` para "${searchTerm}"`}
        </p>
      </div>

      {currentMembers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-church-700 mb-4">
            {searchTerm ? "Nenhum membro encontrado para sua pesquisa." : "Nenhum membro cadastrado ainda."}
          </p>
        </div>
      ) : (
        <>
          {/* Grid de membros - 4 colunas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentMembers.map((member) => (
              <UserCard
                key={member.id}
                user={member}
                onClick={() => navigate(`/membros/${member.id}`)}
              />
            ))}
          </div>

          {/* Controles de paginação */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default MembersSection;
