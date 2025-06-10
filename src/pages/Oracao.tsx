import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import OracaoCard from "@/components/ui/OracaoCard";
import TestimonyFormModal from "@/components/ui/TestimonyFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
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

const Oracao = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [prayers, setPrayers] = useState<Oracao[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isTestimonyModalOpen, setIsTestimonyModalOpen] = useState(false);
  const [testimonyData, setTestimonyData] = useState<Oracao | null>(null);
  const [showMyPrayers, setShowMyPrayers] = useState(false);

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      const endpoint = showMyPrayers ? "/oracoes/minhas" : "/oracoes";
      const response = await api.get(endpoint);
      setPrayers(response.data);
    } catch (error) {
      toast({
        title: "Erro ao carregar orações",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, [showMyPrayers]);

  const filteredPrayers = [...prayers]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((prayer) => {
      const message = prayer.message ?? "";
      const name = prayer.isAnonymous ? "Anônimo" : (prayer.name ?? "");

      const matchesSearch =
        message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || selectedCategory === "todos" || prayer.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

  const handleTestimonySubmit = async (testimony: {
    message: string;
    category: string;
    isAnonymous: boolean;
  }, oracaoId?: number) => {
    try {
      if (oracaoId) {
        // Criar testemunho a partir de uma oração
        await api.post(`/testemunhos/from-oracao/${oracaoId}`, {
          message: testimony.message
        });

        // Atualizar a oração como respondida
        await api.put(`/oracoes/${oracaoId}/responded`);

        toast({
          title: "Testemunho compartilhado",
          description: "Seu testemunho foi compartilhado e a oração foi marcada como respondida!"
        });

        // Atualizar as listas
        fetchPrayers();
      } else {
        // Testemunho regular (não deveria acontecer na página de oração)
        await api.post("/testemunhos", {
          message: testimony.message,
          category: testimony.category,
          name: testimony.isAnonymous ? "Anônimo" : undefined
        });

        toast({
          title: "Testemunho compartilhado",
          description: "Seu testemunho foi compartilhado com sucesso!"
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao compartilhar testemunho",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const openTestimonyModal = (prayer: Oracao) => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para compartilhar um testemunho.",
        variant: "destructive"
      });
      return;
    }
    setTestimonyData(prayer);
    setIsTestimonyModalOpen(true);
  };

  return (
    <Layout>
      <div className="container-church py-12">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-4xl font-bold text-church-900 mb-4">Pedidos de Oração</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Compartilhe sua necessidade e deixe que a comunidade interceda por você.
          </p>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Pesquisar orações..."
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
                variant={showMyPrayers ? "default" : "outline"}
                className={showMyPrayers ? "bg-church-700 hover:bg-church-800" : ""}
                onClick={() => setShowMyPrayers(!showMyPrayers)}
              >
                {showMyPrayers ? "Todas as Orações" : "Meus Pedidos"}
              </Button>
            )}
          </div>
        </div>

        {/* Lista de Orações */}
        {filteredPrayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrayers.map((prayer) => (
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
                onCreateTestimony={() => openTestimonyModal(prayer)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Nenhum pedido de oração encontrado.
            </p>
          </div>
        )}

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
      </div>
    </Layout>
  );
};

export default Oracao;
