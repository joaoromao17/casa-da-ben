
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import api from "@/services/api";

import AdminTable from "./AdminTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UploadEstudoForm from "@/components/ui/UploadEstudoForm";

interface Study {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  pdfUrl?: string;
}

const StudiesTab = () => {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch studies
  const { 
    data: studies = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['studies'],
    queryFn: async () => {
      const response = await api.get('/estudos');
      return response.data;
    }
  });

  // Delete study mutation
  const deleteStudyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/estudos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      toast({
        title: "Sucesso",
        description: "Estudo removido com sucesso",
      });
    },
    onError: (error) => {
      console.error('Error deleting study:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o estudo",
        variant: "destructive",
      });
    }
  });

  const handleAddStudy = () => {
    setShowAddModal(true);
  };

  const handleEditStudy = (study: Study) => {
    setSelectedStudy(study);
    setShowEditModal(true);
  };

  const handleDeleteStudy = async (study: Study) => {
    if (!window.confirm(`Tem certeza que deseja excluir o estudo "${study.title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    deleteStudyMutation.mutate(study.id);
  };

  const handleViewStudy = (study: Study) => {
    if (study.pdfUrl) {
      window.open(study.pdfUrl, '_blank');
    } else {
      toast({
        title: "PDF não disponível",
        description: "Este estudo não possui um arquivo PDF.",
        variant: "destructive",
      });
    }
  };

  const handleUploadSuccess = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedStudy(null);
    queryClient.invalidateQueries({ queryKey: ['studies'] });
    toast({
      title: "Sucesso",
      description: "Estudo salvo com sucesso!",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Filter studies based on search term
  const filteredStudies = studies.filter((study: Study) =>
    study.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    study.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "title", title: "Título" },
    { 
      key: "description", 
      title: "Descrição",
      render: (desc: string) => desc?.length > 50 ? `${desc.substring(0, 50)}...` : desc
    },
    { key: "author", title: "Autor" },
    { key: "category", title: "Categoria" },
    { 
      key: "date", 
      title: "Data",
      render: (date: string) => formatDate(date)
    },
  ];

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar estudos.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Estudos</h2>
      
      {/* Campo de Pesquisa */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Pesquisar estudos por título, descrição, autor ou categoria..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <AdminTable
        data={filteredStudies}
        columns={columns}
        isLoading={isLoading}
        onView={handleViewStudy}
        onEdit={handleEditStudy}
        onDelete={handleDeleteStudy}
        onAdd={handleAddStudy}
      />

      {/* Modal Adicionar Novo */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Estudo</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            <UploadEstudoForm onUploadSuccess={handleUploadSuccess} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Editar */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Editar Estudo: {selectedStudy?.title}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
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
  );
};

export default StudiesTab;
