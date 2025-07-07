
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import MinistryForm from "./ministries/MinistryForm";
import MinistryViewDialog from "./ministries/MinistryViewDialog";
import { useMinistryOperations } from "./ministries/useMinistryOperations";
import { ministryFormSchema, MinistryFormData } from "./ministries/ministryFormSchema";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const MinistriesTab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMinistryOpen, setViewMinistryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    ministries,
    users,
    isLoading,
    error,
    createMinistryMutation,
    updateMinistryMutation,
    deleteMinistryMutation,
    refetch
  } = useMinistryOperations();

  // Form setup
  const form = useForm<MinistryFormData>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      meetingDay: "",
      image: undefined,
      leaderIds: [],
      activities: [''],
      viceLeaderIds: [],
    },
  });

  const handleAddMinistry = () => {
    setIsCreating(true);
    form.reset({
      name: "",
      description: "",
      meetingDay: "",
      image: undefined,
      leaderIds: [],
      viceLeaderIds: [],
      activities: [''],
    });
    setIsModalOpen(true);
  };

  const handleEditMinistry = (ministry: any) => {
    setIsCreating(false);
    setSelectedMinistry(ministry);

    console.log("Ministry data for edit:", ministry);

    const leaderIds = (ministry.leaderIds || [])
      .map((leaderId: number) => leaderId.toString())
      .filter(Boolean);

    const viceLeaderIds = (ministry.viceLeaderIds || [])
      .map((viceLeaderId: number) => viceLeaderId.toString())
      .filter(Boolean);

    console.log('leaderIds:', leaderIds);
    console.log('viceLeaderIds:', viceLeaderIds);

    form.reset({
      name: ministry.name || "",
      description: ministry.description || "",
      meetingDay: ministry.meetingDay || "",
      image: undefined,
      leaderIds: leaderIds,
      viceLeaderIds: viceLeaderIds,
      activities: Array.isArray(ministry.activities) && ministry.activities.length > 0
        ? ministry.activities
        : [''],
    });

    setIsModalOpen(true);
  };

  const handleDeleteMinistry = async (ministry: any) => {
    try {
      const response = await api.get(`/users/ministerios/${ministry.id}/membros`);
      const membros = response.data || [];

      setSelectedMinistry({
        ...ministry,
        memberCount: membros.length,
      });

      setIsDeleteDialogOpen(true);
    } catch (error) {
      console.error("Erro ao buscar membros do ministério:", error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar os membros do ministério",
        variant: "destructive",
      });
    }
  };

  const handleViewMinistry = (ministry: any) => {
    navigate(`/ministerios/${ministry.id}`);
  };

  const handleMoveUp = async (ministry: any) => {
    try {
      const currentIndex = ministries.findIndex(m => m.id === ministry.id);
      if (currentIndex <= 0) return; // Já está no topo
      
      const previousMinistry = ministries[currentIndex - 1];
      
      // Trocar as posições
      await api.put(`/ministerios/${ministry.id}/ordem`, { 
        newOrder: currentIndex - 1 
      });
      
      await api.put(`/ministerios/${previousMinistry.id}/ordem`, { 
        newOrder: currentIndex 
      });
      
      toast({
        title: "Sucesso",
        description: "Ordem do ministério atualizada",
      });
      
      refetch();
    } catch (error) {
      console.error('Erro ao mover ministério:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a ordem do ministério",
        variant: "destructive",
      });
    }
  };

  const handleMoveDown = async (ministry: any) => {
    try {
      const currentIndex = ministries.findIndex(m => m.id === ministry.id);
      if (currentIndex >= ministries.length - 1) return; // Já está no final
      
      const nextMinistry = ministries[currentIndex + 1];
      
      // Trocar as posições
      await api.put(`/ministerios/${ministry.id}/ordem`, { 
        newOrder: currentIndex + 1 
      });
      
      await api.put(`/ministerios/${nextMinistry.id}/ordem`, { 
        newOrder: currentIndex 
      });
      
      toast({
        title: "Sucesso",
        description: "Ordem do ministério atualizada",
      });
      
      refetch();
    } catch (error) {
      console.error('Erro ao mover ministério:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a ordem do ministério",
        variant: "destructive",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMinistry(null);
    setIsCreating(false);
  };

  const onSubmit = (data: MinistryFormData) => {
    console.log("Dados do formulário:", data);

    const formDataWithDefaults = {
      ...data,
      imageUrl: !data.image ? "/uploads/ministerios/ministerio_default.jpg" : undefined
    };

    if (isCreating) {
      createMinistryMutation.mutate(formDataWithDefaults, {
        onSuccess: handleCloseModal
      });
    } else if (selectedMinistry) {
      updateMinistryMutation.mutate({
        id: selectedMinistry.id,
        ...formDataWithDefaults,
      }, {
        onSuccess: handleCloseModal
      });
    }
  };

  const confirmDelete = () => {
    if (selectedMinistry) {
      deleteMinistryMutation.mutate(selectedMinistry.id, {
        onSuccess: () => setIsDeleteDialogOpen(false)
      });
    }
  };

  // Filter ministries based on search term
  const filteredMinistries = ministries.filter(ministry =>
    ministry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.leaderNames?.some((name: string) => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    { key: "name", title: "Nome" },
    {
      key: "description",
      title: "Descrição",
      render: (desc: string) => desc?.length > 50 ? `${desc.substring(0, 50)}...` : desc
    },
    {
      key: "leaderNames",
      title: "Líder",
      render: (leaderNames: string[]) => {
        if (!leaderNames || leaderNames.length === 0) return "-";
        return leaderNames.join(", ");
      }
    },
  ];

  // Função personalizada para renderizar ações com as setas
  const renderActions = (ministry: any) => {
    const currentIndex = ministries.findIndex(m => m.id === ministry.id);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === ministries.length - 1;
    
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleMoveUp(ministry)}
          disabled={isFirst}
          title="Mover para cima"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleMoveDown(ministry)}
          disabled={isLast}
          title="Mover para baixo"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleViewMinistry(ministry)}>
          👁️
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleEditMinistry(ministry)}>
          ✏️
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDeleteMinistry(ministry)}>
          🗑️
        </Button>
      </div>
    );
  };

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar ministérios.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Ministérios</h2>

      {/* Campo de Pesquisa */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Pesquisar ministérios por nome, descrição ou líder..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AdminTable
        data={filteredMinistries}
        columns={columns}
        isLoading={isLoading}
        onView={handleViewMinistry}
        onEdit={handleEditMinistry}
        onDelete={handleDeleteMinistry}
        onAdd={handleAddMinistry}
        customActions={renderActions}
      />

      {/* Create/Edit Ministry Modal */}
      <AdminFormModal
        title={isCreating ? "Criar Novo Ministério" : `Editar Ministério: ${selectedMinistry?.name || ""}`}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isSubmitting={createMinistryMutation.isPending || updateMinistryMutation.isPending}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <MinistryForm
          form={form}
          users={users}
          isCreating={isCreating}
          selectedMinistry={selectedMinistry}
        />
      </AdminFormModal>

      {/* View Ministry Dialog */}
      <MinistryViewDialog
        isOpen={viewMinistryOpen}
        onClose={() => setViewMinistryOpen(false)}
        ministry={selectedMinistry}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        description={
          selectedMinistry?.memberCount > 0 
            ? `Não é possível excluir o ministério "${selectedMinistry?.name}" pois ele possui ${selectedMinistry?.memberCount} membro(s). Para excluir, o ministério não deve ter nenhum membro.`
            : `Tem certeza que deseja excluir o ministério ${selectedMinistry?.name}? Esta ação não pode ser desfeita.`
        }
        isDeleting={deleteMinistryMutation.isPending}
        disableConfirm={selectedMinistry?.memberCount > 0}
      />
    </div>
  );
};

export default MinistriesTab;
