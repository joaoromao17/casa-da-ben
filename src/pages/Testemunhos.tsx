
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
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
import { Search, Filter, Plus, Heart } from "lucide-react";

// Dados de exemplo para testemunhos
const testimoniesData = [
  {
    id: 1,
    name: "Maria Silva",
    date: new Date(2024, 2, 15),
    content: "Fui curada de uma doença grave após a igreja orar por mim durante um culto de oração. Deus é fiel!",
    category: "cura"
  },
  {
    id: 2,
    name: "João Oliveira",
    date: new Date(2024, 3, 5),
    content: "Meu casamento estava à beira do fim, mas após frequentarmos os estudos para casais, nossa relação foi restaurada.",
    category: "família"
  },
  {
    id: 3,
    name: "Ana Cristina",
    date: new Date(2024, 3, 20),
    content: "Estava desempregada há mais de um ano e, após participar da corrente de oração, recebi duas propostas de emprego em uma semana!",
    category: "provisão"
  },
  {
    id: 4,
    name: "Carlos Mendes",
    date: new Date(2024, 4, 2),
    content: "Meu filho estava envolvido com drogas, mas após muito jejum e oração, ele aceitou ajuda e está limpo há 6 meses.",
    isAnonymous: true,
    category: "libertação"
  },
  {
    id: 5,
    name: "Roberta Almeida",
    date: new Date(2024, 4, 10),
    content: "Depois de muitas tentativas, consegui engravidar após receber oração de imposição de mãos do pastor.",
    category: "milagre"
  }
];

const Testemunhos = () => {
  const { toast } = useToast();
  const [testimonies, setTestimonies] = useState(testimoniesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTestimony, setNewTestimony] = useState({
    name: "",
    content: "",
    isAnonymous: false,
    category: ""
  });

  const filteredTestimonies = testimonies.filter(testimony => {
    const matchesSearch = testimony.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        testimony.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || testimony.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimony(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setNewTestimony(prev => ({ ...prev, isAnonymous: checked }));
  };

  const handleCategorySelect = (value: string) => {
    setNewTestimony(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = () => {
    if (!newTestimony.content.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, compartilhe seu testemunho antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    const newEntry = {
      id: testimonies.length + 1,
      name: newTestimony.name || "Membro da Igreja",
      date: new Date(),
      content: newTestimony.content,
      isAnonymous: newTestimony.isAnonymous,
      category: newTestimony.category || "geral"
    };

    setTestimonies([newEntry, ...testimonies]);
    setIsDialogOpen(false);
    setNewTestimony({
      name: "",
      content: "",
      isAnonymous: false,
      category: ""
    });

    toast({
      title: "Testemunho compartilhado",
      description: "Seu testemunho foi compartilhado com sucesso. Obrigado!",
    });
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
            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter size={18} />
                    <SelectValue placeholder="Filtrar por" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="cura">Cura</SelectItem>
                  <SelectItem value="família">Família</SelectItem>
                  <SelectItem value="provisão">Provisão</SelectItem>
                  <SelectItem value="libertação">Libertação</SelectItem>
                  <SelectItem value="milagre">Milagre</SelectItem>
                  <SelectItem value="geral">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="bg-church-700 hover:bg-church-800" onClick={() => setIsDialogOpen(true)}>
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
                name={testimony.name}
                date={testimony.date}
                content={testimony.content}
                isAnonymous={testimony.isAnonymous}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Nenhum testemunho encontrado.</p>
            <Button 
              className="mt-4 bg-church-700 hover:bg-church-800"
              onClick={() => setIsDialogOpen(true)}
            >
              Seja o primeiro a compartilhar
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
            onClick={() => setIsDialogOpen(true)}
          >
            Compartilhe seu testemunho
          </Button>
        </div>
      </div>

      {/* Dialog para adicionar testemunho */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhe seu testemunho</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Input
                name="name"
                placeholder="Seu nome"
                value={newTestimony.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Select onValueChange={handleCategorySelect}>
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
            </div>
            <div>
              <Textarea
                name="content"
                placeholder="Compartilhe como Deus agiu em sua vida..."
                className="h-32"
                value={newTestimony.content}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={newTestimony.isAnonymous}
                onCheckedChange={handleCheckboxChange}
              />
              <label
                htmlFor="anonymous"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Compartilhar anonimamente
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-church-700 hover:bg-church-800"
              onClick={handleSubmit}
            >
              Compartilhar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Testemunhos;
