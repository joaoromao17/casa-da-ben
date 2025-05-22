
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
import { Checkbox } from "@/components/ui/checkbox";

// Form schema for verse
const verseFormSchema = z.object({
  reference: z.string().min(3, "Referência deve ter pelo menos 3 caracteres"),
  text: z.string().min(10, "Texto do versículo deve ter pelo menos 10 caracteres"),
  book: z.string().min(2, "Livro bíblico é obrigatório"),
  chapter: z.coerce.number().min(1, "Capítulo deve ser maior que zero"),
  verse: z.coerce.number().min(1, "Versículo deve ser maior que zero"),
  translation: z.string().optional(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

type VerseFormData = z.infer<typeof verseFormSchema>;

const VersesTab = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch verses
  const { 
    data: verses = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['verses'],
    queryFn: async () => {
      const response = await api.get('/versiculos');
      return response.data;
    }
  });

  // Form setup
  const form = useForm<VerseFormData>({
    resolver: zodResolver(verseFormSchema),
    defaultValues: {
      reference: "",
      text: "",
      book: "",
      chapter: 1,
      verse: 1,
      translation: "NVI",
      active: true,
      featured: false,
    },
  });

  // Create verse mutation
  const createVerseMutation = useMutation({
    mutationFn: async (data: VerseFormData) => {
      return await api.post('/versiculos', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verses'] });
      toast({
        title: "Sucesso",
        description: "Versículo criado com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error creating verse:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o versículo",
        variant: "destructive",
      });
    }
  });

  // Update verse mutation
  const updateVerseMutation = useMutation({
    mutationFn: async (data: VerseFormData & { id: string }) => {
      const { id, ...verseData } = data;
      return await api.put(`/versiculos/${id}`, verseData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verses'] });
      toast({
        title: "Sucesso",
        description: "Versículo atualizado com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error updating verse:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o versículo",
        variant: "destructive",
      });
    }
  });

  // Delete verse mutation
  const deleteVerseMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/versiculos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verses'] });
      toast({
        title: "Sucesso",
        description: "Versículo removido com sucesso",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting verse:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o versículo",
        variant: "destructive",
      });
    }
  });

  const handleAddVerse = () => {
    setIsCreating(true);
    form.reset({
      reference: "",
      text: "",
      book: "",
      chapter: 1,
      verse: 1,
      translation: "NVI",
      active: true,
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleEditVerse = (verse: any) => {
    setIsCreating(false);
    setSelectedVerse(verse);
    
    // Reset form with verse data
    form.reset({
      reference: verse.reference,
      text: verse.text,
      book: verse.book,
      chapter: verse.chapter || 1,
      verse: verse.verse || 1,
      translation: verse.translation || "NVI",
      active: verse.active !== false,
      featured: verse.featured || false,
    });
    
    setIsModalOpen(true);
  };

  const handleDeleteVerse = (verse: any) => {
    setSelectedVerse(verse);
    setIsDeleteDialogOpen(true);
  };

  const handleViewVerse = (verse: any) => {
    // Placeholder for verse view action
    console.log("View verse:", verse);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVerse(null);
    setIsCreating(false);
  };

  const onSubmit = (data: VerseFormData) => {
    if (isCreating) {
      createVerseMutation.mutate(data);
    } else if (selectedVerse) {
      updateVerseMutation.mutate({
        id: selectedVerse.id,
        ...data,
      });
    }
  };

  const confirmDelete = () => {
    if (selectedVerse) {
      deleteVerseMutation.mutate(selectedVerse.id);
    }
  };

  const columns = [
    { key: "reference", title: "Referência" },
    { 
      key: "text", 
      title: "Texto",
      render: (text: string) => text?.length > 50 ? `${text.substring(0, 50)}...` : text
    },
    { 
      key: "translation", 
      title: "Tradução",
      render: (translation: string) => translation || "NVI"
    },
    { 
      key: "featured", 
      title: "Destaque",
      render: (featured: boolean) => featured ? "Sim" : "Não"
    },
    { 
      key: "active", 
      title: "Status",
      render: (active: boolean) => 
        active !== false ? (
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Ativo
          </span>
        ) : (
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Inativo
          </span>
        )
    },
  ];

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar versículos.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Versículos</h2>
      
      <AdminTable
        data={verses}
        columns={columns}
        isLoading={isLoading}
        onView={handleViewVerse}
        onEdit={handleEditVerse}
        onDelete={handleDeleteVerse}
        onAdd={handleAddVerse}
      />

      {/* Create/Edit Verse Modal */}
      <AdminFormModal
        title={isCreating ? "Criar Novo Versículo" : `Editar Versículo: ${selectedVerse?.reference || ""}`}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isSubmitting={createVerseMutation.isPending || updateVerseMutation.isPending}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referência</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João 3:16" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="book"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Livro</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chapter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capítulo</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="verse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versículo</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite o texto do versículo" 
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
              name="translation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tradução</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: NVI, ACF, ARA" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Ativo</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Destacar na página inicial</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
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
        description={`Tem certeza que deseja excluir o versículo "${selectedVerse?.reference}"? Esta ação não pode ser desfeita.`}
        isDeleting={deleteVerseMutation.isPending}
      />
    </div>
  );
};

export default VersesTab;
