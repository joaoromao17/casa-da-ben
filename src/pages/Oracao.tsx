
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import OracaoCard from "@/components/ui/OracaoCard";
import OracaoFormModal from "@/components/ui/OracaoFormModal";
import TestimonyFormModal from "@/components/ui/TestimonyFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus, Heart } from "lucide-react";
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

const Oracao = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [prayers, setPrayers] = useState<Oracao[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isOracaoModalOpen, setIsOracaoModalOpen] = useState(false);
  const [isTestimonyModalOpen, setIsTestimonyModalOpen] = useState(false);
  const [testimonyData, setTestimonyData] = useState<Oracao | null>(null);
  const [showMyPrayers, setShowMyPrayers] = useState(false);
  const [editingOracao, setEditingOracao] = useState<Oracao | null>(null);
  const [showAnsweredAlert, setShowAnsweredAlert] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<Oracao | null>(null);

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
    .filter(prayer => showMyPrayers || !prayer.responded)
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

      fetchPrayers();
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

        fetchPrayers();
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
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para compartilhar uma oração.",
        variant: "destructive"
      });
      return;
    }
    setEditingOracao(null);
    setIsOracaoModalOpen(true);
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
      fetchPrayers();
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
      fetchPrayers();
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

            <Button className="bg-church-700 hover:bg-church-800" onClick={openOracaoModal}>
              <Plus size={18} className="mr-2" /> Compartilhar
            </Button>
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
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMarkAnswered={() => openAnsweredAlert(prayer)}
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

        {/* Seção inspiradora */}
        <div className="mt-16 bg-church-50 p-8 rounded-xl text-center">
          <Heart size={48} className="mx-auto text-church-700 mb-4" />
          <h2 className="text-2xl font-bold text-church-900 mb-3">Compartilhe o seu pedido</h2>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            E tudo o que vocês pedirem em meu nome, isso farei, a fim de que o Pai seja glorificado no Filho.
            Se me pedirem alguma coisa em meu nome, eu o farei.
            <br />
            <span className="font-medium">João 14:13-14</span>
          </p>
          <Button
            className="bg-church-700 hover:bg-church-800"
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>✨ Que bênção!</AlertDialogTitle>
              <AlertDialogDescription>
                Se Deus respondeu sua oração, isso pode fortalecer a fé de outras pessoas.
                Você pode apenas concluir ou compartilhar um testemunho contando o que Ele fez!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleAnsweredWithoutTestimony}>
                ✅ Concluir
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleAnsweredWithTestimony} className="bg-church-700 hover:bg-church-800">
                📝 Contar Testemunho
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout >
  );
};

export default Oracao;
