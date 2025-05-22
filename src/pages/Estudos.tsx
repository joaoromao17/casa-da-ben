import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import StudyCard from "@/components/ui/StudyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import UploadEstudoForm from "@/components/ui/UploadEstudoForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";


const categories = ["Todos", "Bíblia", "Doutrina", "Família", "Evangelismo", "Vida Cristã", "Finanças"];

interface Study {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  pdfUrl?: string;
}

const Estudos = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [openDialog, setOpenDialog] = useState(false);
  const [newStudy, setNewStudy] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
  });
  const [uploadSuccess, setUploadSuccess] = useState(false); // <- Novo estado

  const { toast } = useToast();

  const fetchStudies = () => {
    axios.get("http://localhost:8080/api/estudos")
      .then((response) => setStudies(response.data))
      .catch((error) => console.error("Erro ao buscar estudos:", error));
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const handleCreateStudy = async () => {
    try {
      await axios.post("http://localhost:8080/api/estudos", newStudy);
      toast({ title: "Estudo criado com sucesso!" });
      setOpenDialog(false);
      fetchStudies();
      setNewStudy({ title: "", description: "", author: "", category: "" });
    } catch (error) {
      toast({ title: "Erro ao criar estudo", variant: "destructive" });
    }
  };

  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "Todos" || study.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container-church py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-church-900 mb-4">Estudos Bíblicos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore nossa coleção de estudos bíblicos, materiais de ensino e recursos para aprofundar sua fé e conhecimento das escrituras.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-church-100 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pesquisar estudos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <Tabs defaultValue="Todos" onValueChange={setSelectedCategory}>
                <TabsList className="bg-white overflow-x-auto">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-gray-600 mr-2 mt-1">Tópicos populares:</p>
            {["Oração", "Salvação", "Santidade", "Adoração", "Discipulado"].map((topic) => (
              <Button
                key={topic}
                variant="outline"
                size="sm"
                className="bg-white"
                onClick={() => setSearchTerm(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-church-900 mb-6 flex items-center">
            <BookOpen className="mr-2" /> Materiais de Estudo
          </h2>

          {filteredStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudies.map((study) => (
                <StudyCard
                  key={study.id}
                  id={study.id}
                  title={study.title}
                  description={study.description}
                  author={study.author}
                  date={new Date(study.date)}
                  category={study.category}
                  pdfUrl={study.pdfUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Nenhum estudo encontrado para sua pesquisa.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Todos");
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {/* Call to Action + Dialog */}
        <div className="bg-church-900 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Escola Bíblica</h2>
          <p className="mb-6">Participe de nossa Escola Bíblica todas as quartas-feiras às 20h e aprofunde seu conhecimento da Palavra.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-white text-church-900 hover:bg-gray-200">
                  Adicionar Estudo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{uploadSuccess ? "Estudo publicado ✅" : "Novo Estudo"}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                  {uploadSuccess ? (
                    <Button
                      onClick={() => {
                        setOpenDialog(false);
                        setUploadSuccess(false);
                        window.location.reload(); // Atualiza a página
                      }}
                      className="bg-church-900 text-white hover:bg-church-700"
                    >
                      Ok
                    </Button>
                  ) : (
                    <UploadEstudoForm onUploadSuccess={() => setUploadSuccess(true)} />
                  )}
                </div>
              </DialogContent>


            </Dialog>

            <Link to="/cultos">
              <Button className="bg-white text-church-900 hover:bg-gray-200">
                Ver Horários
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Estudos;
