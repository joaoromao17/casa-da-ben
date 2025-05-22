
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";

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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

// Form schema for ministry
const ministryFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  meetingDay: z.string().optional(),
  imageUrl: z.string().url("URL de imagem inválida").optional().nullable(),
  leaderId: z.string().optional().nullable(),
  activities: z.string().optional(),
});

type MinistryFormData = z.infer<typeof ministryFormSchema>;

const MinistriesTab = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

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
      imageUrl: "",
      leaderId: "",
      activities: "",
    },
  });

  // Create ministry mutation
  const createMinistryMutation = useMutation({
    mutationFn: async (data: MinistryFormData) => {
      return await api.post('/ministerios', data);
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
      const { id, ...ministryData } = data;
      return await api.put(`/ministerios/${id}`, ministryData);
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
      imageUrl: "",
      leaderId: "",
      activities: "",
    });
    setIsModalOpen(true);
  };

  const handleEditMinistry = (ministry: any) => {
    setIsCreating(false);
    setSelectedMinistry(ministry);
    
    // Reset form with ministry data
    form.reset({
      name: ministry.name,
      description: ministry.description,
      meetingDay: ministry.meetingDay || "",
      imageUrl: ministry.imageUrl || "",
      leaderId: ministry.leader?.id || "",
      activities: ministry.activities || "",
    });
    
    setIsModalOpen(true);
  };

  const handleDeleteMinistry = (ministry: any) => {
    setSelectedMinistry(ministry);
    setIsDeleteDialogOpen(true);
  };

  const handleViewMinistry = (ministry: any) => {
    // Redirect to ministry details page
    window.location.href = `/ministerios/${ministry.id}`;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMinistry(null);
    setIsCreating(false);
  };

  const onSubmit = (data: MinistryFormData) => {
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
      key: "meetingDay", 
      title: "Dia de Reunião",
      render: (day: string) => day || "-"
    },
    { 
      key: "leader", 
      title: "Líder",
      render: (leader: any) => leader?.name || "-"
    },
  ];

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar ministérios.</div>;
  }

  const weekdays = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", 
    "Quinta-feira", "Sexta-feira", "Sábado"
  ];

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
          <div className="space-y-4">
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
                  <FormLabel>Dia de Reunião</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Não definido</SelectItem>
                      {weekdays.map((day, index) => (
                        <SelectItem key={index} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://exemplo.com/imagem.jpg" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leaderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Líder do Ministério</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o líder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Não definido</SelectItem>
                      {users.map((user: any) => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atividades</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Liste as principais atividades do ministério" 
                      rows={3} 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </AdminFormModal>

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
