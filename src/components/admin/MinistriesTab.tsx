
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

const MinistriesTab = () => {
  const navigate = useNavigate();
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
      viceLeaders: [],
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
      viceLeaders: [],
      activities: [''],
    });
    setIsModalOpen(true);
  };

  const handleEditMinistry = (ministry: any) => {
    setIsCreating(false);
    setSelectedMinistry(ministry);

    console.log("Ministry data for edit:", ministry);

    // Encontrar os IDs dos líderes baseado nos nomes
    const leaderIds = ministry.leaders?.map((leaderName: string) => {
      const user = users.find(u => u.name === leaderName);
      return user ? user.id?.toString() : '';
    }).filter(Boolean) || [];

    // Encontrar os IDs dos vice-líderes baseado nos nomes
    const viceLeaderIds = ministry.viceLeaders?.map((viceLeaderName: string) => {
      const user = users.find(u => u.name === viceLeaderName);
      return user ? user.id?.toString() : '';
    }).filter(Boolean) || [];

    // Reset form with ministry data
    form.reset({
      name: ministry.name || "",
      description: ministry.description || "",
      meetingDay: ministry.meetingDay || ministry.schedule || ministry.meetingSchedule || "", 
      image: undefined,
      leaderIds: leaderIds,
      viceLeaders: viceLeaderIds,
      activities: (ministry.activities && ministry.activities.length > 0) ? ministry.activities : [''],
    });

    setIsModalOpen(true);
  };

  const handleDeleteMinistry = (ministry: any) => {
    setSelectedMinistry(ministry);
    setIsDeleteDialogOpen(true);
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
    
    if (isCreating) {
      createMinistryMutation.mutate(data, {
        onSuccess: handleCloseModal
      });
    } else if (selectedMinistry) {
      updateMinistryMutation.mutate({
        id: selectedMinistry.id,
        ...data,
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
      key: "leaders",
      title: "Líder",
      render: (leaders: any[]) => {
        if (!leaders || leaders.length === 0) return "-";
        return leaders.map(leader => leader.name).join(", ");
      }
    },
    {
      key: "viceLeaders",
      title: "Vice-Líder",
      render: (viceLeaders: any[]) => {
        if (!viceLeaders || viceLeaders.length === 0) return "-";
        return viceLeaders.map(vice => vice.name).join(", ");
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
        description={`Tem certeza que deseja excluir o ministério ${selectedMinistry?.name}? Esta ação não pode ser desfeita.`}
        isDeleting={deleteMinistryMutation.isPending}
      />
    </div>
  );
};

export default MinistriesTab;
