import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

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

  const {
    ministries,
    users,
    isLoading,
    error,
    createMinistryMutation,
    updateMinistryMutation,
    deleteMinistryMutation
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

    // Extrair IDs dos líderes diretamente do campo leaderIds
    const leaderIds = (ministry.leaderIds || [])
      .map((leaderId: number) => leaderId.toString())
      .filter(Boolean);

    // Extrair IDs dos vice-líderes diretamente do campo viceLeaderIds
    const viceLeaderIds = (ministry.viceLeaderIds || [])
      .map((viceLeaderId: number) => viceLeaderId.toString())
      .filter(Boolean);

    console.log('leaderIds:', leaderIds);
    console.log('viceLeaderIds:', viceLeaderIds);

    // Reset form with ministry data
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMinistry(null);
    setIsCreating(false);
  };

  const onSubmit = (data: MinistryFormData) => {
    console.log("Dados do formulário:", data);

    // Prepare the form data with default image if none provided
    const formDataWithDefaults = {
      ...data,
      imageUrl: !data.image ? "/images/ministerios/ministerio_default.jpg" : undefined
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

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar ministérios.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Ministérios</h2>

      <AdminTable
        data={ministries}
        columns={columns}
        isLoading={isLoading}
        onView={handleViewMinistry}
        onEdit={handleEditMinistry}
        onDelete={handleDeleteMinistry}
        onAdd={handleAddMinistry}
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
            ? `Não é possível excluir o ministério "${selectedMinistry?.name}" pois ele possui ${selectedMinistry?.memberCount} membro(s). Para excluir, o ministério não pode ter nenhum membro.`
            : `Tem certeza que deseja excluir o ministério ${selectedMinistry?.name}? Esta ação não pode ser desfeita.`
        }
        isDeleting={deleteMinistryMutation.isPending}
        disableConfirm={selectedMinistry?.memberCount > 0}
      />
    </div>
  );
};

export default MinistriesTab;
