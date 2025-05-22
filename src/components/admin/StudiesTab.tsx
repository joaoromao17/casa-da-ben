
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
import { Button } from "@/components/ui/button";

// Form schema for study
const studyFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  author: z.string().min(2, "Autor deve ter pelo menos 2 caracteres"),
  category: z.string().min(1, "Categoria é obrigatória"),
  pdfUrl: z.string().url("URL do PDF inválida").optional().nullable(),
});

type StudyFormData = z.infer<typeof studyFormSchema>;

const StudiesTab = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

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

  // Form setup
  const form = useForm<StudyFormData>({
    resolver: zodResolver(studyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      category: "",
      pdfUrl: "",
    },
  });

  // Create study mutation
  const createStudyMutation = useMutation({
    mutationFn: async (data: StudyFormData) => {
      return await api.post('/estudos', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      toast({
        title: "Sucesso",
        description: "Estudo criado com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error creating study:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o estudo",
        variant: "destructive",
      });
    }
  });

  // Update study mutation
  const updateStudyMutation = useMutation({
    mutationFn: async (data: StudyFormData & { id: string }) => {
      const { id, ...studyData } = data;
      return await api.put(`/estudos/${id}`, studyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      toast({
        title: "Sucesso",
        description: "Estudo atualizado com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error updating study:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o estudo",
        variant: "destructive",
      });
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
      setIsDeleteDialogOpen(false);
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
    setIsCreating(true);
    form.reset({
      title: "",
      description: "",
      author: "",
      category: "",
      pdfUrl: "",
    });
    setIsModalOpen(true);
  };

  const handleEditStudy = (study: any) => {
    setIsCreating(false);
    setSelectedStudy(study);
    
    // Reset form with study data
    form.reset({
      title: study.title,
      description: study.description,
      author: study.author,
      category: study.category,
      pdfUrl: study.pdfUrl || "",
    });
    
    setIsModalOpen(true);
  };

  const handleDeleteStudy = (study: any) => {
    setSelectedStudy(study);
    setIsDeleteDialogOpen(true);
  };

  const handleViewStudy = (study: any) => {
    // Open the PDF in a new tab if available
    if (study.pdfUrl) {
      window.open(study.pdfUrl, '_blank');
    } else {
      toast({
        title: "Informação",
        description: "Este estudo não tem PDF disponível.",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudy(null);
    setIsCreating(false);
  };

  const onSubmit = (data: StudyFormData) => {
    if (isCreating) {
      createStudyMutation.mutate(data);
    } else if (selectedStudy) {
      updateStudyMutation.mutate({
        id: selectedStudy.id,
        ...data,
      });
    }
  };

  const confirmDelete = () => {
    if (selectedStudy) {
      deleteStudyMutation.mutate(selectedStudy.id);
    }
  };

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
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
  ];

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar estudos.</div>;
  }

  const categories = ["Bíblia", "Doutrina", "Família", "Evangelismo", "Vida Cristã", "Finanças", "Outro"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Estudos</h2>
      
      <AdminTable
        data={studies}
        columns={columns}
        isLoading={isLoading}
        onView={handleViewStudy}
        onEdit={handleEditStudy}
        onDelete={handleDeleteStudy}
        onAdd={handleAddStudy}
      />

      {/* Create/Edit Study Modal */}
      <AdminFormModal
        title={isCreating ? "Criar Novo Estudo" : `Editar Estudo: ${selectedStudy?.title || ""}`}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isSubmitting={createStudyMutation.isPending || updateStudyMutation.isPending}
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
                    <Input placeholder="Título do estudo" {...field} />
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
                      placeholder="Breve descrição do conteúdo do estudo" 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autor</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do autor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pdfUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do PDF</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://exemplo.com/arquivo.pdf" 
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
        description={`Tem certeza que deseja excluir o estudo "${selectedStudy?.title}"? Esta ação não pode ser desfeita.`}
        isDeleting={deleteStudyMutation.isPending}
      />
    </div>
  );
};

export default StudiesTab;