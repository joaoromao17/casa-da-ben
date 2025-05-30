
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import Select from "react-select";

import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Form schema for ministry
const ministryFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  meetingDay: z.string().optional(),
  image: z.any().optional(),
  leaderIds: z.array(z.string()).default([]),
  viceLeaders: z.array(z.string()).default([]),
  activities: z.array(z.string()).optional(),
});

type MinistryFormData = z.infer<typeof ministryFormSchema>;

const MinistriesTab = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewMinistryOpen, setViewMinistryOpen] = useState(false);

  // Fetch ministries
  const {
    data: ministries = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => {
      const response = await api.get('/ministerios');
      return response.data;
    }
  });

  // Fetch users for leader selection
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    }
  });

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  // Create ministry mutation
  const createMinistryMutation = useMutation({
    mutationFn: async (data: MinistryFormData) => {
      const formData = new FormData();
      
      // Campos obrigatórios
      formData.append("name", data.name);
      formData.append("description", data.description);
      
      // Campos opcionais
      if (data.meetingDay) {
        formData.append("meetingDay", data.meetingDay);
      }
      
      // Imagem - nome correto: 'image'
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }
      
      // Arrays - enviar como múltiplos campos com o mesmo nome
      if (data.leaderIds && data.leaderIds.length > 0) {
        data.leaderIds.forEach(id => {
          formData.append("leaderIds", id.toString());
        });
      }
      
      if (data.viceLeaders && data.viceLeaders.length > 0) {
        data.viceLeaders.forEach(id => {
          formData.append("viceLeaders", id.toString());
        });
      }
      
      if (data.activities && data.activities.length > 0) {
        data.activities.forEach(activity => {
          if (activity && activity.trim() !== "") {
            formData.append("activities", activity.trim());
          }
        });
      }

      console.log("Enviando FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      return await api.post('/ministerios', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
      toast({
        title: "Sucesso",
        description: "Ministério criado com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error creating ministry:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o ministério",
        variant: "destructive",
      });
    }
  });

  // Update ministry mutation
  const updateMinistryMutation = useMutation({
    mutationFn: async (data: MinistryFormData & { id: string }) => {
      const formData = new FormData();
      
      // Campos obrigatórios
      formData.append("name", data.name);
      formData.append("description", data.description);
      
      // Campos opcionais
      if (data.meetingDay) {
        formData.append("meetingDay", data.meetingDay);
      }
      
      // Imagem - nome correto: 'image'
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }
      
      // Arrays - enviar como múltiplos campos com o mesmo nome
      if (data.leaderIds && data.leaderIds.length > 0) {
        data.leaderIds.forEach(id => {
          formData.append("leaderIds", id.toString());
        });
      }
      
      if (data.viceLeaders && data.viceLeaders.length > 0) {
        data.viceLeaders.forEach(id => {
          formData.append("viceLeaders", id.toString());
        });
      }
      
      if (data.activities && data.activities.length > 0) {
        data.activities.forEach(activity => {
          if (activity && activity.trim() !== "") {
            formData.append("activities", activity.trim());
          }
        });
      }

      console.log("Atualizando FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const { id } = data;
      return await api.put(`/ministerios/${id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
      toast({
        title: "Sucesso",
        description: "Ministério atualizado com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error updating ministry:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o ministério",
        variant: "destructive",
      });
    }
  });

  // Delete ministry mutation
  const deleteMinistryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/ministerios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
      toast({
        title: "Sucesso",
        description: "Ministério removido com sucesso",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting ministry:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o ministério",
        variant: "destructive",
      });
    }
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
      meetingDay: ministry.meetingDay || ministry.schedule || "", 
      image: undefined, // Imagem não pode ser resetada para exibição
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
    // Navegar para a página do ministério
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
      createMinistryMutation.mutate(data);
    } else if (selectedMinistry) {
      updateMinistryMutation.mutate({
        id: selectedMinistry.id,
        ...data,
      });
    }
  };

  const confirmDelete = () => {
    if (selectedMinistry) {
      deleteMinistryMutation.mutate(selectedMinistry.id);
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
        <Form {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Ministério" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o propósito e visão deste ministério"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meetingDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia e horário de reunião</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: 17h aos Domingos para ensaio"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem do Ministério</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                {/* Mostrar imagem atual se estiver editando */}
                {!isCreating && selectedMinistry?.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Imagem atual:</p>
                    <img 
                      src={selectedMinistry.imageUrl.startsWith('http') 
                        ? selectedMinistry.imageUrl 
                        : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${selectedMinistry.imageUrl}`
                      } 
                      alt="Imagem atual" 
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/128x128?text=Sem+imagem";
                      }}
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="leaderIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Líder(es) do Ministério</FormLabel>
                <Select
                  isMulti
                  options={users.map((user) => ({ label: user.name, value: user.id.toString() }))}
                  value={users
                    .filter((u) => field.value?.includes(u.id.toString()))
                    .map((u) => ({ label: u.name, value: u.id.toString() }))}
                  onChange={(selected) =>
                    field.onChange(selected ? selected.map((option) => option.value) : [])
                  }
                  className="text-black"
                  placeholder="Selecione líder(es)"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="viceLeaders"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vice-líder(es)</FormLabel>
                <Select
                  isMulti
                  options={users.map((user) => ({ label: user.name, value: user.id.toString() }))}
                  value={users
                    .filter((u) => field.value?.includes(u.id.toString()))
                    .map((u) => ({ label: u.name, value: u.id.toString() }))}
                  onChange={(selected) =>
                    field.onChange(selected ? selected.map((option) => option.value) : [])
                  }
                  className="text-black"
                  placeholder="Selecione vice-líder(es)"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormLabel>Atividades</FormLabel>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <Input
                  {...form.register(`activities.${index}`)}
                  placeholder={`Atividade ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                >
                  ❌
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append("")}
            >
              + Adicionar atividade
            </Button>
          </div>
          <FormMessage />
        </Form>
      </AdminFormModal>

      {/* View Ministry Dialog */}
      <Dialog open={viewMinistryOpen} onOpenChange={setViewMinistryOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Ministério</DialogTitle>
          </DialogHeader>

          {selectedMinistry && (
            <div className="py-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                <p className="mt-1 text-lg font-semibold">{selectedMinistry.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Descrição</h3>
                <p className="mt-1">{selectedMinistry.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dia de Reunião</h3>
                  <p className="mt-1">{selectedMinistry.meetingDay || "-"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Líder</h3>
                  <p className="mt-1">{selectedMinistry.leader?.name || "-"}</p>
                </div>
              </div>

              {selectedMinistry.imageUrl && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Imagem</h3>
                  <div className="mt-2 max-w-md">
                    <img
                      src={selectedMinistry.imageUrl}
                      alt={selectedMinistry.name}
                      className="rounded-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/300x200?text=Imagem+não+disponível";
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Atividades</h3>
                <p className="mt-1">{selectedMinistry.activities || "-"}</p>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setViewMinistryOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
