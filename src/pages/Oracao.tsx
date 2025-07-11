import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import OracaoCard from "@/components/ui/OracaoCard";
import OracaoFormModal from "@/components/ui/OracaoFormModal";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";

interface Usuario {
  id: number;
  name: string;
  email: string;
}

interface Oracao {
  id: number;
  name: string;
  message: string;
  date: string;
  category: string;
  isAnonymous: boolean;
  responded: boolean;
  usuario: Usuario;
}

interface PageResponse {
  content: Oracao[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const Oracao = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [prayers, setPrayers] = useState<Oracao[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [isOracaoModalOpen, setIsOracaoModalOpen] = useState(false);
  const [isTestimonyModalOpen, setIsTestimonyModalOpen] = useState(false);
  const [testimonyData, setTestimonyData] = useState<Oracao | null>(null);
  const [showMyPrayers, setShowMyPrayers] = useState(false);
  const [editingOracao, setEditingOracao] = useState<Oracao | null>(null);
  const [showAnsweredAlert, setShowAnsweredAlert] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<Oracao | null>(null);
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const pageSize = 20;

  const fetchPrayers = async (page: number, search: string = "", category: string = "") => {
    try {
      setLoading(true);
      const endpoint = showMyPrayers ? "/oracoes/minhas" : "/oracoes";
      
      const params: any = {
        page: page - 1,
        size: pageSize
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category && category !== "todos") {
        params.category = category;
      }

      const response = await api.get(endpoint, { params });
      
      // Se a API não retorna dados paginados, simular paginação
      if (Array.isArray(response.data)) {
        let allData = response.data;
        
        // Filtrar apenas orações não respondidas se não estiver vendo "minhas orações"
        if (!showMyPrayers) {
          allData = allData.filter(prayer => !prayer.responded);
        }
        
        // Ordenar por data (mais recentes primeiro)
        allData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = allData.slice(startIndex, endIndex);
        
        setPrayers(paginatedData);
        setTotalPages(Math.ceil(allData.length / pageSize));
        setCurrentPage(page);
      } else {
        // API já retorna dados paginados
        const data: PageResponse = response.data;
        setPrayers(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(data.number + 1);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar orações",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Debounce para pesquisa e filtros
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPrayers(1, searchTerm, selectedCategory);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedCategory, showMyPrayers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPrayers(page, searchTerm, selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOracaoSubmit = async (oracao: {
    message: string;
    category: string;
    isAnonymous: boolean;
  }) => {
    try {
      const payload: any = {
        message: oracao.message,
        category: oracao.category,
      };

      if (oracao.isAnonymous) {
        payload.name = "Anônimo";
      }

      if (editingOracao) {
        await api.put(`/oracoes/${editingOracao.id}`, payload);
        toast({
          title: "Oração atualizada",
          description: "Sua oração foi atualizada com sucesso!"
        });
      } else {
        await api.post("/oracoes", payload);
        toast({
          title: "Oração compartilhada",
          description: "Sua oração foi compartilhada com sucesso!"
        });
      }

      fetchPrayers(1, searchTerm, selectedCategory);
      setEditingOracao(null);
    } catch (error) {
      toast({
        title: "Erro ao salvar oração",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleTestimonySubmit = async (testimony: {
    message: string;
    category: string;
    isAnonymous: boolean;
  }, oracaoId?: number) => {
    try {
      if (oracaoId) {
        // Envia o testemunho
        await api.post(`/testemunhos/from-oracao/${oracaoId}`, {
          message: testimony.message
        });

        // Marca a oração como respondida
        await api.put(`/oracoes/${oracaoId}/responder`);

        toast({
          title: "Testemunho compartilhado",
          description: "Seu testemunho foi compartilhado e a oração foi marcada como respondida!"
        });

        fetchPrayers(currentPage, searchTerm, selectedCategory);
      }
    } catch (error) {
      toast({
        title: "Erro ao compartilhar testemunho",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const openOracaoModal = () => {
    if (!isAuthenticated) {
      setShowLoginNotice(true);
      return;
    }
    setEditingOracao(null);
    setIsOracaoModalOpen(true);
  };

  const openTestimonyModal = (prayer: Oracao) => {
    if (!isAuthenticated) {
      setShowLoginNotice(true);
      return;
    }
    setTestimonyData(prayer);
    setIsTestimonyModalOpen(true);
  };

  const handleEdit = (id: number) => {
    const prayer = prayers.find(p => p.id === id);
    if (prayer) {
      setEditingOracao(prayer);
      setIsOracaoModalOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/oracoes/${id}`);
      toast({
        title: "Oração excluída",
        description: "Sua oração foi excluída com sucesso."
      });
      fetchPrayers(currentPage, searchTerm, selectedCategory);
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleMarkAnswered = async (id: number) => {
    try {
      await api.put(`/oracoes/${id}/responder`);
      toast({
        title: "Oração marcada como respondida",
        description: "Glória a Deus! Sua oração foi marcada como respondida."
      });
      fetchPrayers(currentPage, searchTerm, selectedCategory);
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const openAnsweredAlert = (prayer: Oracao) => {
    setSelectedPrayer(prayer);
    setShowAnsweredAlert(true);
  };

  const handleAnsweredWithoutTestimony = () => {
    if (selectedPrayer) {
      handleMarkAnswered(selectedPrayer.id);
    }
    setShowAnsweredAlert(false);
    setSelectedPrayer(null);
  };

  const handleAnsweredWithTestimony = () => {
    if (selectedPrayer) {
      openTestimonyModal(selectedPrayer);
    }
    setShowAnsweredAlert(false);
    setSelectedPrayer(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-6 sm:mb-10 px-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-church-900 mb-2 sm:mb-4">Pedidos de Oração</h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl">
              Compartilhe sua necessidade e deixe que a Igreja interceda por você.
            </p>
          </div>

          {/* Filtros e Pesquisa */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Pesquisar orações..."
                className="pl-10 h-10 sm:h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 sm:max-w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-10 sm:h-11">
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
                  variant={showMyPrayers ? "default" : "outline"}
                  className={`h-10 sm:h-11 text-xs sm:text-sm whitespace-nowrap ${showMyPrayers ? "bg-church-700 hover:bg-church-800" : ""}`}
                  onClick={() => setShowMyPrayers(!showMyPrayers)}
                >
                  <span className="sm:hidden">
                    {showMyPrayers ? "Todas" : "Meus Pedidos"}
                  </span>
                  <span className="hidden sm:inline">
                    {showMyPrayers ? "Todas as Orações" : "Meus Pedidos"}
                  </span>
                </Button>
              )}

              <Button 
                className="bg-church-700 hover:bg-church-800 h-10 sm:h-11 text-xs sm:text-sm whitespace-nowrap" 
                onClick={openOracaoModal}
              >
                <Plus size={16} className="mr-1 sm:mr-2" /> Compartilhar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2">
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
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-6 sm:mb-10 px-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-church-900 mb-2 sm:mb-4">Pedidos de Oração</h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl">
            Compartilhe sua necessidade e deixe que a Igreja interceda por você.
          </p>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Pesquisar orações..."
              className="pl-10 h-10 sm:h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 sm:max-w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-10 sm:h-11">
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
                variant={showMyPrayers ? "default" : "outline"}
                className={`h-10 sm:h-11 text-xs sm:text-sm whitespace-nowrap ${showMyPrayers ? "bg-church-700 hover:bg-church-800" : ""}`}
                onClick={() => setShowMyPrayers(!showMyPrayers)}
              >
                <span className="sm:hidden">
                  {showMyPrayers ? "Todas" : "Meus Pedidos"}
                </span>
                <span className="hidden sm:inline">
                  {showMyPrayers ? "Todas as Orações" : "Meus Pedidos"}
                </span>
              </Button>
            )}

            <Button 
              className="bg-church-700 hover:bg-church-800 h-10 sm:h-11 text-xs sm:text-sm whitespace-nowrap" 
              onClick={openOracaoModal}
            >
              <Plus size={16} className="mr-1 sm:mr-2" /> Compartilhar
            </Button>
          </div>
        </div>

        {/* Feedback de pesquisa */}
        {searchTerm.length > 1 && (
          <div className="mb-4 text-sm text-gray-600 px-2">
            Exibindo resultados para: "<span className="font-medium">{searchTerm}</span>"
          </div>
        )}

        {/* Lista de Orações */}
        {prayers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 px-2">
              {prayers.map((prayer) => (
                <OracaoCard
                  key={prayer.id}
                  id={prayer.id}
                  name={prayer.name}
                  date={new Date(prayer.date)}
                  message={prayer.message}
                  isAnonymous={prayer.isAnonymous}
                  category={prayer.category}
                  usuario={prayer.usuario}
                  responded={prayer.responded}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMarkAnswered={() => openAnsweredAlert(prayer)}
                  onCreateTestimony={() => openTestimonyModal(prayer)}
                />
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="px-2">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 px-2">
            <p className="text-lg sm:text-xl text-gray-600">
              {searchTerm.length > 1 
                ? "Nenhuma oração encontrada com esse termo." 
                : "Nenhum pedido de oração encontrado."
              }
            </p>
          </div>
        )}

        {/* Seção inspiradora */}
        <div className="mt-12 sm:mt-16 bg-church-50 p-6 sm:p-8 rounded-xl text-center mx-2">
          <Heart size={40} className="mx-auto text-church-700 mb-3 sm:mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-church-900 mb-2 sm:mb-3">Compartilhe o seu pedido</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 max-w-3xl mx-auto">
            E tudo o que vocês pedirem em meu nome, isso farei, a fim de que o Pai seja glorificado no Filho.
            Se me pedirem alguma coisa em meu nome, eu o farei.
            <br />
            <span className="font-medium">João 14:13-14</span>
          </p>
          <Button
            className="bg-church-700 hover:bg-church-800 h-10 sm:h-11 text-xs sm:text-sm"
            onClick={openOracaoModal}
          >
            Compartilhe sua oração
          </Button>
        </div>

        {/* Modal de oração */}
        <OracaoFormModal
          isOpen={isOracaoModalOpen}
          onClose={() => {
            setIsOracaoModalOpen(false);
            setEditingOracao(null);
          }}
          onSubmit={handleOracaoSubmit}
          editingOracao={editingOracao}
        />

        {/* Modal de testemunho */}
        <TestimonyFormModal
          isOpen={isTestimonyModalOpen}
          onClose={() => {
            setIsTestimonyModalOpen(false);
            setTestimonyData(null);
          }}
          onSubmit={handleTestimonySubmit}
          oracaoMessage={testimonyData?.message}
          oracaoCategory={testimonyData?.category}
          oracaoIsAnonymous={testimonyData?.isAnonymous}
          oracaoId={testimonyData?.id}
          isFromPrayer={true}
        />

        {/* Alert de oração respondida */}
        <AlertDialog open={showAnsweredAlert} onOpenChange={setShowAnsweredAlert}>
          <AlertDialogContent className="mx-2 max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>✨ Que bênção!</AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Se Deus respondeu sua oração, isso pode fortalecer a fé de outras pessoas.
                Você pode apenas concluir ou compartilhar um testemunho contando o que Ele fez!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <AlertDialogCancel onClick={handleAnsweredWithoutTestimony} className="w-full sm:w-auto">
                ✅ Concluir
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleAnsweredWithTestimony} className="bg-church-700 hover:bg-church-800 w-full sm:w-auto">
                📝 Contar Testemunho
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Aviso de login necessário */}
        {showLoginNotice && (
          <LoginRequiredNotice
            message="Você precisa estar logado para compartilhar uma oração."
            onClose={() => setShowLoginNotice(false)}
          />
        )}
      </div>
    </Layout >
  );
};

export default Oracao;
