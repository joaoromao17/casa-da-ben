
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { format } from "date-fns";

import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { Progress } from "@/components/ui/progress";

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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Form schema for contribution campaign - aligned with backend
const contributionFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  targetValue: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  collectedValue: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  isGoalVisible: z.boolean(),
  status: z.enum(["ATIVA", "CONCLUIDA", "CANCELADA"]),
  createdBy: z.string().min(3, "Campo obrigatório"),
  pixKey: z.string().min(5, "Chave Pix obrigatória"),
  image: z.any().optional(), // For file upload
});

type ContributionFormData = z.infer<typeof contributionFormSchema>;

const ContributionsTab = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch contributions
  const { 
    data: contributions = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['contributions'],
    queryFn: async () => {
      const response = await api.get('/contribuicoes');
      return response.data;
    }
  });

  // Form setup
  const form = useForm<ContributionFormData>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      targetValue: 0,
      collectedValue: 0,
      endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      isGoalVisible: true,
      status: "ATIVA",
      createdBy: "",
      pixKey: "",
    },
  });

  // Create contribution campaign mutation
  const createContributionMutation = useMutation({
    mutationFn: async (data: ContributionFormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("targetValue", data.targetValue.toString());
      formData.append("collectedValue", data.collectedValue.toString());
      formData.append("endDate", data.endDate);
      formData.append("isGoalVisible", data.isGoalVisible.toString());
      formData.append("status", data.status);
      formData.append("createdBy", data.createdBy);
      formData.append("pixKey", data.pixKey);
      
      // Add image if provided
      if (data.image && data.image.length > 0) {
        formData.append("imagem", data.image[0]);
      }

      return await api.post('/contribuicoes', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      toast({
        title: "Sucesso",
        description: "Campanha de contribuição criada com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error creating contribution campaign:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a campanha",
        variant: "destructive",
      });
    }
  });

  // Update contribution campaign mutation
  const updateContributionMutation = useMutation({
    mutationFn: async (data: ContributionFormData & { id: string }) => {
      const { id, ...contributionData } = data;
      const formData = new FormData();
      
      formData.append("title", contributionData.title);
      formData.append("description", contributionData.description);
      formData.append("targetValue", contributionData.targetValue.toString());
      formData.append("collectedValue", contributionData.collectedValue.toString());
      formData.append("endDate", contributionData.endDate);
      formData.append("isGoalVisible", contributionData.isGoalVisible.toString());
      formData.append("status", contributionData.status);
      formData.append("createdBy", contributionData.createdBy);
      formData.append("pixKey", contributionData.pixKey);
      
      // Add image if provided
      if (contributionData.image && contributionData.image.length > 0) {
        formData.append("imagem", contributionData.image[0]);
      }

      return await api.put(`/contribuicoes/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      toast({
        title: "Sucesso",
        description: "Campanha de contribuição atualizada com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error updating contribution campaign:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a campanha",
        variant: "destructive",
      });
    }
  });

  // Delete contribution campaign mutation
  const deleteContributionMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/contribuicoes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      toast({
        title: "Sucesso",
        description: "Campanha de contribuição removida com sucesso",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting contribution campaign:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a campanha",
        variant: "destructive",
      });
    }
  });

  const handleAddContribution = () => {
    setIsCreating(true);
    form.reset({
      title: "",
      description: "",
      targetValue: 0,
      collectedValue: 0,
      endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      isGoalVisible: true,
      status: "ATIVA",
      createdBy: "",
      pixKey: "",
    });
    setIsModalOpen(true);
  };

  const handleEditContribution = (contribution: any) => {
    setIsCreating(false);
    setSelectedContribution(contribution);
    
    // Format date from the contribution data
    const endDate = contribution.endDate 
      ? format(new Date(contribution.endDate), 'yyyy-MM-dd') 
      : format(new Date(), 'yyyy-MM-dd');
    
    // Reset form with contribution data
    form.reset({
      title: contribution.title || "",
      description: contribution.description || "",
      targetValue: contribution.targetValue || 0,
      collectedValue: contribution.collectedValue || 0,
      endDate: endDate,
      isGoalVisible: contribution.isGoalVisible ?? true,
      status: contribution.status || "ATIVA",
      createdBy: contribution.createdBy || "",
      pixKey: contribution.pixKey || "",
    });
    
    setIsModalOpen(true);
  };

  const handleDeleteContribution = (contribution: any) => {
    setSelectedContribution(contribution);
    setIsDeleteDialogOpen(true);
  };

  const handleViewContribution = (contribution: any) => {
    // Redirect to contribution details page
    window.location.href = `/contribuicoes/${contribution.id}`;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContribution(null);
    setIsCreating(false);
  };

  const onSubmit = (data: ContributionFormData) => {
    if (isCreating) {
      createContributionMutation.mutate(data);
    } else if (selectedContribution) {
      updateContributionMutation.mutate({
        id: selectedContribution.id,
        ...data,
      });
    }
  };

  const confirmDelete = () => {
    if (selectedContribution) {
      deleteContributionMutation.mutate(selectedContribution.id);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    if (!target || target === 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  const columns = [
    { key: "title", title: "Título" },
    { 
      key: "targetValue", 
      title: "Meta",
      render: (targetValue: number) => `R$ ${(targetValue || 0).toLocaleString('pt-BR')}`
    },
    { 
      key: "collectedValue", 
      title: "Arrecadado",
      render: (collectedValue: number, record: any) => (
        <div className="space-y-1">
          <div className="text-sm">R$ {(collectedValue || 0).toLocaleString('pt-BR')}</div>
          <Progress value={calculateProgress(collectedValue || 0, record.targetValue || 0)} className="h-2" />
          <div className="text-xs text-muted-foreground">
            {calculateProgress(collectedValue || 0, record.targetValue || 0)}% da meta
          </div>
        </div>
      )
    },
    { 
      key: "endDate", 
      title: "Término",
      render: (date: string) => date ? format(new Date(date), 'dd/MM/yyyy') : "-"
    },
    { 
      key: "status", 
      title: "Status",
      render: (status: string) => {
        switch (status) {
          case "ATIVA":
            return (
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Ativa
              </span>
            );
          case "CONCLUIDA":
            return (
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Concluída
              </span>
            );
          case "CANCELADA":
            return (
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Cancelada
              </span>
            );
          default:
            return status;
        }
      }
    },
  ];

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar campanhas de contribuição.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Contribuições</h2>
      
      <AdminTable
        data={contributions}
        columns={columns}
        isLoading={isLoading}
        onView={handleViewContribution}
        onEdit={handleEditContribution}
        onDelete={handleDeleteContribution}
        onAdd={handleAddContribution}
      />

      {/* Create/Edit Contribution Modal */}
      <AdminFormModal
        title={isCreating ? "Criar Nova Campanha" : `Editar Campanha: ${selectedContribution?.title || ""}`}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isSubmitting={createContributionMutation.isPending || updateContributionMutation.isPending}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da campanha" {...field} />
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
                      placeholder="Descreva o propósito desta campanha" 
                      rows={4} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        step={0.01} 
                        placeholder="0.00" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collectedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Arrecadado (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0} 
                        step={0.01} 
                        placeholder="0.00" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Término</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="createdBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criado Por</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pixKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave Pix</FormLabel>
                  <FormControl>
                    <Input placeholder="Chave Pix para doações" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ATIVA">Ativa</SelectItem>
                      <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                      <SelectItem value="CANCELADA">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isGoalVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Meta Visível
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Mostrar a meta e barra de progresso no frontend
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <Input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
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
        description={`Tem certeza que deseja excluir a campanha "${selectedContribution?.title}"? Esta ação não pode ser desfeita.`}
        isDeleting={deleteContributionMutation.isPending}
      />
    </div>
  );
};

export default ContributionsTab;
