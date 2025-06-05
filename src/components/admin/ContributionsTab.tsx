import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  hasGoal: z.boolean(),
  targetValue: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero").optional(),
  collectedValue: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero").optional(),
  hasEndDate: z.boolean(),
  endDate: z.date().optional(),
  isGoalVisible: z.boolean(),
  status: z.enum(["ATIVA", "CONCLUIDA", "CANCELADA"]).optional(),
  createdBy: z.string().min(3, "Campo obrigatório"),
  pixKey: z.string().min(5, "Chave Pix obrigatória"),
  image: z.any().optional(), // For file upload
}).refine((data) => {
  if (data.hasGoal && (!data.targetValue || data.targetValue <= 0)) {
    return false;
  }
  return true;
}, {
  message: "Meta é obrigatória quando 'Tem Meta de valor?' está marcado",
  path: ["targetValue"]
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
      hasGoal: false,
      targetValue: 0,
      collectedValue: 0,
      hasEndDate: false,
      endDate: undefined,
      isGoalVisible: true,
      status: "ATIVA",
      createdBy: "",
      pixKey: "",
    },
  });

  const watchHasGoal = form.watch("hasGoal");
  const watchHasEndDate = form.watch("hasEndDate");
  const watchImage = form.watch("image");

  // Create contribution campaign mutation
  const createContributionMutation = useMutation({
    mutationFn: async (data: ContributionFormData) => {
      // First, create the contribution with JSON data
      const contributionData = {
        title: data.title,
        description: data.description,
        targetValue: data.hasGoal ? (data.targetValue || 0) : 0,
        collectedValue: data.collectedValue || 0,
        isGoalVisible: data.hasGoal ? data.isGoalVisible : false,
        endDate: data.hasEndDate && data.endDate ? format(data.endDate, 'yyyy-MM-dd') : null,
        status: "ATIVA",
        createdBy: data.createdBy,
        pixKey: data.pixKey,
      };

      const response = await api.post('/contribuicoes', contributionData);
      const contributionId = response.data.id;

      // If there's an image, upload it separately
      if (data.image && data.image.length > 0) {
        const formData = new FormData();
        formData.append("imagem", data.image[0]);
        await api.post(`/contribuicoes/${contributionId}/imagem`, formData);
      }

      return response.data;
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
      
      // First, update the contribution with JSON data
      const updateData = {
        title: contributionData.title,
        description: contributionData.description,
        targetValue: contributionData.hasGoal ? (contributionData.targetValue || 0) : 0,
        collectedValue: contributionData.collectedValue || 0,
        isGoalVisible: contributionData.hasGoal ? contributionData.isGoalVisible : false,
        endDate: contributionData.hasEndDate && contributionData.endDate ? format(contributionData.endDate, 'yyyy-MM-dd') : null,
        status: contributionData.status || "ATIVA",
        createdBy: contributionData.createdBy,
        pixKey: contributionData.pixKey,
      };

      const response = await api.put(`/contribuicoes/${id}`, updateData);

      // Only upload image if a new one was selected
      if (contributionData.image && contributionData.image.length > 0) {
        const formData = new FormData();
        formData.append("imagem", contributionData.image[0]);
        await api.post(`/contribuicoes/${id}/imagem`, formData);
      }

      return response.data;
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
      hasGoal: false,
      targetValue: 0,
      collectedValue: 0,
      hasEndDate: false,
      endDate: undefined,
      isGoalVisible: true,
      createdBy: "",
      pixKey: "",
      image: undefined,
    });
    setIsModalOpen(true);
  };

  const handleEditContribution = (contribution: any) => {
    setIsCreating(false);
    setSelectedContribution(contribution);
    
    console.log('Editing contribution:', contribution); // Debug log
    console.log('Image URL:', contribution.imageUrl); // Debug log
    
    // Reset form with contribution data
    form.reset({
      title: contribution.title || "",
      description: contribution.description || "",
      hasGoal: (contribution.targetValue || 0) > 0,
      targetValue: contribution.targetValue || 0,
      collectedValue: contribution.collectedValue || 0,
      hasEndDate: !!contribution.endDate,
      endDate: contribution.endDate ? new Date(contribution.endDate) : undefined,
      isGoalVisible: contribution.isGoalVisible ?? true,
      status: contribution.status || "ATIVA",
      createdBy: contribution.createdBy || "",
      pixKey: contribution.pixKey || "",
      image: undefined, // Reset image field
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
      render: (targetValue: number) => {
        if (!targetValue || targetValue === 0) return "Sem meta";
        return `R$ ${targetValue.toLocaleString('pt-BR')}`;
      }
    },
    { 
      key: "collectedValue", 
      title: "Arrecadado",
      render: (collectedValue: number, record: any) => {
        const collected = collectedValue || 0;
        const target = record.targetValue || 0;
        
        if (target === 0) {
          return `R$ ${collected.toLocaleString('pt-BR')}`;
        }
        
        return (
          <div className="space-y-1">
            <div className="text-sm">R$ {collected.toLocaleString('pt-BR')}</div>
            <Progress value={calculateProgress(collected, target)} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {calculateProgress(collected, target)}% da meta
            </div>
          </div>
        );
      }
    },
    { 
      key: "endDate", 
      title: "Término",
      render: (date: string) => date ? format(new Date(date), 'dd/MM/yyyy') : "Sem prazo"
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

            <FormField
              control={form.control}
              name="hasGoal"
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
                      Tem Meta de valor?
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Marque se esta campanha possui uma meta financeira específica
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {watchHasGoal && (
              <>
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
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
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
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {!watchHasGoal && (
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
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="hasEndDate"
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
                      Tem Data Limite?
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Marque se esta campanha possui uma data limite para arrecadação
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {watchHasEndDate && (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Término</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecionar data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            {!isCreating && (
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
            )}

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  
                  {/* Show current image when editing */}
                  {!isCreating && selectedContribution?.imageUrl && (
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-2">Imagem atual:</p>
                      <img 
                        src={selectedContribution.imageUrl} 
                        alt="Imagem atual da campanha" 
                        className="h-32 w-auto rounded object-cover border border-gray-200" 
                        onError={(e) => {
                          console.log('Error loading image:', selectedContribution.imageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <FormControl>
                    <Input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                      value=""
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    {!isCreating ? "Selecione uma nova imagem apenas se quiser alterar a atual" : "Selecione uma imagem para a campanha"}
                  </p>
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
