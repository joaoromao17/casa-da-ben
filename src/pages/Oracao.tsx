
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import OracaoCard from "@/components/ui/OracaoCard";
import TestimonyFormModal from "@/components/ui/TestimonyFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Plus, Heart, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
  approved: boolean;
  isAnonymous: boolean;
  category: string;
  usuario: Usuario;
}

const Oracao = () => {
  const { toast } = useToast();
  const { currentUser, isAuthenticated } = useAuth();
  const [oracoes, setOracoes] = useState<Oracao[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showMyPrayers, setShowMyPrayers] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTestimonyModalOpen, setIsTestimonyModalOpen] = useState(false);
  const [editingOracao, setEditingOracao] = useState<Oracao | null>(null);
  const [selectedOracaoForTestimony, setSelectedOracaoForTestimony] = useState<Oracao | null>(null);
  const [newOracao, setNewOracao] = useState({
    message: "",
    isAnonymous: false,
    category: ""
  });

  useEffect(() => {
    fetchOracoes();
  }, [showMyPrayers]);

  const fetchOracoes = async () => {
    try {
      let response;
      if (showMyPrayers && isAuthenticated) {
        // Buscar todas as orações do usuário
        response = await api.get("/oracoes");
        const userOracoes = response.data.filter((o: Oracao) => 
          o.usuario && o.usuario.id === currentUser?.id
        );
        setOracoes(userOracoes);
      } else {
        // Buscar orações públicas aprovadas
        response = await api.get("/oracoes/public");
        setOracoes(response.data);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar orações",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const filteredOracoes = [...oracoes]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((oracao) => {
      const message = oracao.message ?? "";
      const name = oracao.isAnonymous ? "Anônimo" : (oracao.name ?? "");

      const matchesSearch =
        message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || selectedCategory === "todos" || oracao.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOracao(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewOracao(prev => ({ ...prev, isAnonymous: checked }));
  };

  const handleCategorySelect = (value: string) => {
    setNewOracao(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para enviar uma oração.",
        variant: "destructive"
      });
      return;
    }

    if (!newOracao.message.trim()) {
      toast({
        title: "Erro",
        description: "A mensagem da oração não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload = {
        message: newOracao.message,
        category: newOracao.category || "geral",
        isAnonymous: newOracao.isAnonymous
      };

      if (editingOracao) {
        await api.put(`/oracoes/${editingOracao.id}`, payload);
        toast({
          title: "Oração atualizada",
          description: "Sua oração foi atualizada com sucesso!"
        });
      } else {
        await api.post("/oracoes", payload);
        toast({
          title: "Oração enviada",
          description: "Sua oração foi enviada com sucesso!"
        });
      }

      fetchOracoes();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setNewOracao({
      message: "",
      isAnonymous: false,
      category: ""
    });
    setEditingOracao(null);
  };

  const handleEdit = (id: number) => {
    const oracao = oracoes.find(o => o.id === id);
    if (oracao) {
      setEditingOracao(oracao);
      setNewOracao({
        message: oracao.message,
        isAnonymous: oracao.isAnonymous,
        category: oracao.category
      });
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/oracoes/${id}`);
      toast({
        title: "Oração excluída",
        description: "Sua oração foi excluída com sucesso."
      });
      fetchOracoes();
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
      await api.delete(`/oracoes/${id}`);
      toast({
        title: "Oração concluída",
        description: "Que alegria saber que Deus respondeu sua oração!"
      });
      fetchOracoes();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const handleCreateTestimony = (id: number) => {
    const oracao = oracoes.find(o => o.id === id);
    if (oracao) {
      setSelectedOracaoForTestimony(oracao);
      setIsTestimonyModalOpen(true);
    }
  };

  const handleTestimonySubmit = async (testimony: {
    message: string;
    category: string;
    isAnonymous: boolean;
  }) => {
    try {
      await api.post("/testemunhos", testimony);
      
      // Marcar oração como respondida/excluir
      if (selectedOracaoForTestimony) {
        await api.delete(`/oracoes/${selectedOracaoForTestimony.id}`);
      }
      
      toast({
        title: "Testemunho compartilhado",
        description: "Seu testemunho foi compartilhado e sua oração foi concluída!"
      });
      
      fetchOracoes();
      setSelectedOracaoForTestimony(null);
    } catch (error) {
      toast({
        title: "Erro ao compartilhar testemunho",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const openNewPrayerDialog = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para compartilhar uma oração.",
        variant: "destructive"
      });
      return;
    }
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container-church py-12">
        <div className="flex flex-col items-center text-center mb-10">
          <h1 className="text-4xl font-bold text-church-900 mb-4">Orações</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Compartilhe o seu pedido de oração para que a igreja te ajude nessa batalha.
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
            {isAuthenticated && (
              <Button
                variant={showMyPrayers ? "default" : "outline"}
                onClick={() => setShowMyPrayers(!showMyPrayers)}
                className={showMyPrayers ? "bg-church-700 hover:bg-church-800" : ""}
              >
                <User size={18} className="mr-2" />
                Meus pedidos
              </Button>
            )}
            
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

            <Button className="bg-church-700 hover:bg-church-800" onClick={openNewPrayerDialog}>
              <Plus size={18} className="mr-2" /> Compartilhar
            </Button>
          </div>
        </div>

        {/* Orações */}
        {filteredOracoes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOracoes.map((oracao) => (
              <OracaoCard
                key={oracao.id}
                id={oracao.id}
                name={oracao.name}
                date={new Date(oracao.date)}
                message={oracao.message}
                isAnonymous={oracao.isAnonymous}
                category={oracao.category}
                usuario={oracao.usuario}
                approved={oracao.approved}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMarkAnswered={handleMarkAnswered}
                onCreateTestimony={handleCreateTestimony}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {showMyPrayers ? "Você ainda não tem pedidos de oração." : "Nenhuma oração encontrada."}
            </p>
            <Button
              className="mt-4 bg-church-700 hover:bg-church-800"
              onClick={openNewPrayerDialog}
            >
              {showMyPrayers ? "Compartilhar primeira oração" : "Seja o primeiro a compartilhar"}
            </Button>
          </div>
        )}

        {/* Seção inspiradora */}
        <div className="mt-16 bg-church-50 p-8 rounded-xl text-center">
          <Heart size={48} className="mx-auto text-church-700 mb-4" />
          <h2 className="text-2xl font-bold text-church-900 mb-3">Deus ouve as orações do seu povo</h2>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            "Orai uns pelos outros, para que sareis. A oração feita por um justo pode muito em seus efeitos."
            <br />
            <span className="font-medium">Tiago 5:16b</span>
          </p>
          <Button
            className="bg-church-700 hover:bg-church-800"
            onClick={openNewPrayerDialog}
          >
            Compartilhe sua Oração
          </Button>
        </div>
      </div>

      {/* Dialog para adicionar/editar oração */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingOracao ? "Editar Oração" : "Compartilhe sua Oração"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select
              value={newOracao.category}
              onValueChange={handleCategorySelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria da oração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cura">Cura</SelectItem>
                <SelectItem value="família">Família</SelectItem>
                <SelectItem value="provisão">Provisão</SelectItem>
                <SelectItem value="libertação">Libertação</SelectItem>
                <SelectItem value="milagre">Milagre</SelectItem>
                <SelectItem value="geral">Geral</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              name="message"
              placeholder="Compartilhe seu pedido de oração..."
              className="h-32"
              value={newOracao.message}
              onChange={handleInputChange}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAnonymous"
                checked={newOracao.isAnonymous}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="isAnonymous"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Compartilhar anonimamente
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-church-700 hover:bg-church-800"
              onClick={handleSubmit}
            >
              {editingOracao ? "Atualizar" : "Compartilhar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de testemunho */}
      <TestimonyFormModal
        isOpen={isTestimonyModalOpen}
        onClose={() => {
          setIsTestimonyModalOpen(false);
          setSelectedOracaoForTestimony(null);
        }}
        onSubmit={handleTestimonySubmit}
        oracaoMessage={selectedOracaoForTestimony?.message}
      />
    </Layout>
  );
};

export default Oracao;
