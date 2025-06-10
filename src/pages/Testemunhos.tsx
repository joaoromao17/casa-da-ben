
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import TestimonyCard from "@/components/ui/TestimonyCard";
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
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";

interface Usuario {
  id: number;
  name: string;
  email: string;
}

interface Testimony {
  message: string;
  id: number;
  name: string;
  date: string;
  responded?: boolean;
  isAnonymous: boolean;
  category: string;
  usuario?: Usuario;
}

const Testemunhos = () => {
  const { toast } = useToast();
  const { isAuthenticated, currentUser } = useAuth();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showMyTestimonies, setShowMyTestimonies] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimony, setEditingTestimony] = useState<Testimony | null>(null);
  const [newTestimony, setNewTestimony] = useState({
    message: "",
    isAnonymous: false,
    category: ""
  });

  useEffect(() => {
    fetchTestimonies();
  }, [showMyTestimonies]);

  const fetchTestimonies = async () => {
    try {
      let response;
      if (showMyTestimonies && isAuthenticated) {
        response = await api.get("/testemunhos/minhas");
        setTestimonies(response.data);
      } else {
        response = await api.get("/testemunhos");
        setTestimonies(response.data);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar testemunhos",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const filteredTestimonies = [...testimonies]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((testimony) => {
      const message = testimony.message ?? "";
      const name = testimony.isAnonymous ? "Anônimo" : (testimony.name ?? "");

      const matchesSearch =
      message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "" || selectedCategory === "todos" || testimony.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimony(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewTestimony(prev => ({ ...prev, isAnonymous: checked }));
  };

  const handleCategorySelect = (value: string) => {
    setNewTestimony(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para compartilhar um testemunho.",
        variant: "destructive"
      });
      return;
    }

    if (!newTestimony.message.trim()) {
      toast({
        title: "Erro",
        description: "A mensagem do testemunho não pode estar vazia.",
        variant: "destructive"
      });
      return;
    }

    try {
      const payload = {
        message: newTestimony.message,
        category: newTestimony.category || "geral",
        name: newTestimony.isAnonymous ? "Anônimo" : undefined
      };

      if (editingTestimony) {
        await api.put(`/testemunhos/${editingTestimony.id}`, payload);
        toast({
          title: "Testemunho atualizado",
          description: "Seu testemunho foi atualizado com sucesso!"
        });
      } else {
        await api.post("/testemunhos", payload);
        toast({
          title: "Testemunho compartilhado",
          description: "Seu testemunho foi enviado com sucesso!"
        });
      }

      fetchTestimonies();
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
    setNewTestimony({
      message: "",
      isAnonymous: false,
      category: ""
    });
    setEditingTestimony(null);
  };

  const handleEdit = (id: number) => {
    const testimony = testimonies.find(t => t.id === id);
    if (testimony) {
      setEditingTestimony(testimony);
      setNewTestimony({
        message: testimony.message,
        isAnonymous: testimony.isAnonymous,
        category: testimony.category
      });
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/testemunhos/${id}`);
      toast({
        title: "Testemunho excluído",
        description: "Seu testemunho foi excluído com sucesso."
      });
      fetchTestimonies();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  const openDialog = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para compartilhar um testemunho.",
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
          <h1 className="text-4xl font-bold text-church-900 mb-4">Testemunhos</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Compartilhe as maravilhas que Deus tem feito em sua vida e inspire outros com seu testemunho.
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
              onChange={handleSearch}
            />
          </div>

          <div className="flex gap-2">
            {isAuthenticated && (
              <Button
                variant={showMyTestimonies ? "default" : "outline"}
                onClick={() => setShowMyTestimonies(!showMyTestimonies)}
                className={showMyTestimonies ? "bg-church-700 hover:bg-church-800" : ""}
              >
                <User size={18} className="mr-2" />
                Meus testemunhos
              </Button>
            )}

            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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

            <Button className="bg-church-700 hover:bg-church-800" onClick={openDialog}>
              <Plus size={18} className="mr-2" /> Compartilhar
            </Button>
          </div>
        </div>

        {/* Testemunhos */}
        {filteredTestimonies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonies.map((testimony) => (
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
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {showMyTestimonies ? "Você ainda não tem testemunhos." : "Nenhum testemunho encontrado."}
            </p>
            <Button
              className="mt-4 bg-church-700 hover:bg-church-800"
              onClick={openDialog}
            >
              {showMyTestimonies ? "Compartilhar primeiro testemunho" : "Seja o primeiro a compartilhar"}
            </Button>
          </div>
        )}

        {/* Seção inspiradora */}
        <div className="mt-16 bg-church-50 p-8 rounded-xl text-center">
          <Heart size={48} className="mx-auto text-church-700 mb-4" />
          <h2 className="text-2xl font-bold text-church-900 mb-3">Deus continua fazendo milagres hoje</h2>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            "Contem entre os povos a sua glória, entre todas as nações as suas maravilhas."
            <br />
            <span className="font-medium">Salmos 96:3</span>
          </p>
          <Button
            className="bg-church-700 hover:bg-church-800"
            onClick={openDialog}
          >
            Compartilhe seu testemunho
          </Button>
        </div>
      </div>

      {/* Dialog para adicionar/editar testemunho */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTestimony ? "Editar Testemunho" : "Compartilhe seu testemunho"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select
              value={newTestimony.category}
              onValueChange={handleCategorySelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria do testemunho" />
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
              placeholder="Compartilhe como Deus agiu em sua vida..."
              className="h-32"
              value={newTestimony.message}
              onChange={handleInputChange}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAnonymous"
                checked={newTestimony.isAnonymous}
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
              {editingTestimony ? "Atualizar" : "Compartilhar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </Layout>
  );
};
export default Testemunhos;
