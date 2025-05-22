
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
import { format } from "date-fns";

// Form schema for study
const studyFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  author: z.string().min(3, "Nome do autor é obrigatório"),
  category: z.string().min(2, "Categoria é obrigatória"),
  pdfUrl: z.string().url("URL do PDF inválida").optional().nullable(),
  // File upload will be handled separately
});

type StudyFormData = z.infer<typeof studyFormSchema>;

const StudiesTab = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

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
      let response;

      // First create the study
      response = await api.post('/estudos', data);

      // If there's a file, upload it
      if (pdfFile && response.data.id) {
        const formData = new FormData();
        formData.append('file', pdfFile);

        await api.post(`/estudos/${response.data.id}/upload-pdf`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      toast({
        title: "Sucesso",
        description: "Estudo bíblico criado com sucesso",
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
      let response = await api.put(`/estudos/${id}`, studyData);

      // If there's a file, upload it
      if (pdfFile) {
        const formData = new FormData();
        formData.append('file', pdfFile);

        await api.post(`/estudos/${id}/upload-pdf`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      toast({
        title: "Sucesso",
        description: "Estudo bíblico atualizado com sucesso",
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
        description: "Estudo bíblico removido com sucesso",
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
    setPdfFile(null);
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
    setPdfFile(null);

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
        description: "Este estudo não possui um PDF anexado.",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudy(null);
    setIsCreating(false);
    setPdfFile(null);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPdfFile(event.target.files[0]);
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
      key: "author",
      title: "Autor",
    },
    {
      key: "category",
      title: "Categoria",
    },
    {
      key: "createdAt",
      title: "Data",
      render: (date: string) => date ? format(new Date(date), 'dd/MM/yyyy') : "-"
    },
    {
      key: "pdfUrl",
      title: "PDF",
      render: (url: string) => url ? "Disponível" : "Não disponível"
    },
  ];

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar estudos.</div>;
  }

  const categories = [
    "Todos", "Bíblia", "Doutrina", "Família", "Evangelismo", "Vida Cristã", "Finanças"
  ];

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
                      placeholder="Breve descrição sobre o estudo"
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
                        <SelectValue placeholder="Selecione a categoria" />
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

            <div className="space-y-2">
              <FormLabel>Arquivo PDF</FormLabel>
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {pdfFile && (
                <p className="text-sm text-muted-foreground">
                  Arquivo selecionado: {pdfFile.name}
                </p>
              )}
              {!pdfFile && selectedStudy?.pdfUrl && (
                <p className="text-sm text-muted-foreground">
                  PDF atual: <a href={selectedStudy.pdfUrl} target="_blank" rel="noreferrer" className="text-primary underline">Visualizar</a>
                </p>
              )}
            </div>
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
