
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Eye, Edit, Trash2, Search } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/use-toast";
import UploadEstudoForm from "@/components/ui/UploadEstudoForm";
import api from "@/services/api";

interface Study {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  pdfUrl?: string;
}

const EstudosGerenciar = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useCurrentUser();
  const { toast } = useToast();

  const [studies, setStudies] = useState<Study[]>([]);
  const [loadingStudies, setLoadingStudies] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Verificar permissões de acesso
  useEffect(() => {
    if (!isLoading && (!currentUser || (!currentUser.roles?.includes("ROLE_ADMIN") && !currentUser.roles?.includes("ROLE_PROFESSOR")))) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive",
      });
      navigate("/estudos");
    }
  }, [currentUser, isLoading, navigate, toast]);

  const fetchStudies = async () => {
    try {
      setLoadingStudies(true);
      const response = await api.get("/estudos");
      setStudies(response.data);
    } catch (error) {
      console.error("Erro ao buscar estudos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os estudos.",
        variant: "destructive",
      });
    } finally {
      setLoadingStudies(false);
    }
  };

  useEffect(() => {
    if (currentUser && (currentUser.roles?.includes("ROLE_ADMIN") || currentUser.roles?.includes("ROLE_PROFESSOR"))) {
      fetchStudies();
    }
  }, [currentUser]);

  const handleViewPDF = (study: Study) => {
    if (study.pdfUrl) {
      window.open(study.pdfUrl, "_blank");
    } else {
      toast({
        title: "PDF não disponível",
        description: "Este estudo não possui um arquivo PDF.",
        variant: "destructive",
      });
    }
  };

  const handleEditStudy = (study: Study) => {
    setSelectedStudy(study);
    setShowEditModal(true);
  };

  const handleDeleteStudy = async (study: Study) => {
    if (!window.confirm(`Tem certeza que deseja excluir o estudo "${study.title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      // Usar api que já adiciona o token no header
      await api.delete(`/estudos/${study.id}`);

      toast({
        title: "Sucesso",
        description: "Estudo excluído com sucesso.",
      });

      fetchStudies();
    } catch (error) {
      console.error("Erro ao excluir estudo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o estudo.",
        variant: "destructive",
      });
    }
  };

  const handleUploadSuccess = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedStudy(null);
    fetchStudies();
    toast({
      title: "Sucesso",
      description: "Estudo salvo com sucesso!",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Filter studies based on search term
  const filteredStudies = studies.filter(study =>
    study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="container-church py-8">
          <div className="text-center">Carregando...</div>
        </div>
      </Layout>
    );
  }

  if (!currentUser || (!currentUser.roles?.includes("ROLE_ADMIN") && !currentUser.roles?.includes("ROLE_PROFESSOR"))) {
    return null;
  }

  return (
    <Layout>
      <div className="container-church py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/estudos")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-church-900">Gerenciar Estudos Bíblicos</h1>
          </div>
          <p className="text-gray-600">
            Gerencie os estudos bíblicos disponíveis na plataforma.
          </p>
        </div>

        {/* Pesquisa e Botão Adicionar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Pesquisar estudos por título, descrição, autor ou categoria..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-church-900 text-white hover:bg-church-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Adicionar Novo
          </Button>
        </div>

        {/* Tabela de Estudos */}
        <div className="bg-white rounded-lg shadow">
          {loadingStudies ? (
            <div className="p-8 text-center">Carregando estudos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm ? "Nenhum estudo encontrado para sua pesquisa" : "Nenhum estudo encontrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudies.map((study) => (
                    <TableRow key={study.id}>
                      <TableCell className="font-medium">{study.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {study.description.length > 50
                          ? `${study.description.substring(0, 50)}...`
                          : study.description
                        }
                      </TableCell>
                      <TableCell>{study.author}</TableCell>
                      <TableCell>{study.category}</TableCell>
                      <TableCell>{formatDate(study.date)}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPDF(study)}
                            className="flex items-center gap-1"
                          >
                            <Eye size={14} />
                            Ver PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditStudy(study)}
                            className="flex items-center gap-1"
                          >
                            <Edit size={14} />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStudy(study)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                            Apagar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Modal Adicionar Novo */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Estudo</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <UploadEstudoForm onUploadSuccess={handleUploadSuccess} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal Editar */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Estudo: {selectedStudy?.title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {selectedStudy && (
                <UploadEstudoForm
                  onUploadSuccess={handleUploadSuccess}
                  initialData={selectedStudy}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default EstudosGerenciar;
