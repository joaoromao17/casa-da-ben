
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl?: string;
}

// Form schema for event
const eventFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
  location: z.string().min(3, "Local do evento é obrigatório"),
  image: z.any().optional(),
  category: z.string().min(2, "Categoria é obrigatória"),
});

type EventFormData = z.infer<typeof eventFormSchema>;

const EventsTab = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch events
  const {
    data: events = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get('/eventos');
      return response.data;
    }
  });

  // Form setup
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      time: "19:00",
      location: "",
      image: undefined,
      category: "",
    },
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const formData = new FormData();

      // Prepare event data without image
      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        category: data.category
      };

      formData.append("evento", JSON.stringify(eventData));

      // Add image if selected
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      // Explicitly set the correct Content-Type for multipart/form-data
      return await api.post('/eventos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o evento",
        variant: "destructive",
      });
    }
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async (data: EventFormData & { id: string }) => {
      const { id, ...eventFormData } = data;
      const formData = new FormData();

      // Prepare event data without image
      const eventData = {
        title: eventFormData.title,
        description: eventFormData.description,
        date: eventFormData.date,
        time: eventFormData.time,
        location: eventFormData.location,
        category: eventFormData.category
      };

      formData.append("evento", JSON.stringify(eventData));

      // Add image if selected
      if (eventFormData.image && eventFormData.image[0]) {
        formData.append("image", eventFormData.image[0]);
      }

      // Explicitly set the correct Content-Type for multipart/form-data
      return await api.put(`/eventos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o evento",
        variant: "destructive",
      });
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/eventos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Sucesso",
        description: "Evento removido com sucesso",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o evento",
        variant: "destructive",
      });
    }
  });

  const handleAddEvent = () => {
    setIsCreating(true);
    form.reset({
      title: "",
      description: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      time: "19:00",
      location: "",
      image: undefined,
      category: "",
    });
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setIsCreating(false);
    setSelectedEvent(event);

    // Format date and time from the event data
    const eventDate = event.date ? format(new Date(event.date), 'yyyy-MM-dd') : "";
    const eventTime = event.time || "19:00";

    // Reset form with event data
    form.reset({
      title: event.title,
      description: event.description,
      date: eventDate,
      time: eventTime,
      location: event.location,
      image: undefined,
      category: event.category,
    });

    setIsModalOpen(true);
  };

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    // Redirect to event details page
    window.location.href = `/eventos/${event.id}`;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setIsCreating(false);
  };

  const onSubmit = (data: EventFormData) => {
    if (isCreating) {
      createEventMutation.mutate(data);
    } else if (selectedEvent) {
      updateEventMutation.mutate({
        id: selectedEvent.id,
        ...data,
      });
    }
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent.id);
    }
  };

  const columns = [
    { key: "title", title: "Título" },
    {
      key: "date",
      title: "Data",
      render: (date: string) => date ? format(new Date(date), 'dd/MM/yyyy') : "-"
    },
    {
      key: "time",
      title: "Hora",
    },
    {
      key: "location",
      title: "Local",
    },
    {
      key: "category",
      title: "Categoria",
    },
  ];

  if (error) {
    return <div className="text-center text-red-500">Erro ao carregar eventos.</div>;
  }

  const categories = [
    "Culto", "Oração", "Ação Social", "Retiro"
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Eventos</h2>

      <AdminTable
        data={events}
        columns={columns}
        isLoading={isLoading}
        onView={handleViewEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onAdd={handleAddEvent}
      />

      {/* Create/Edit Event Modal */}
      <AdminFormModal
        title={isCreating ? "Criar Novo Evento" : `Editar Evento: ${selectedEvent?.title || ""}`}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isSubmitting={createEventMutation.isPending || updateEventMutation.isPending}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título do evento" {...field} />
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
                      placeholder="Descreva o evento"
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Local do evento" {...field} />
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

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Imagem do Evento</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {selectedEvent?.imageUrl && (
                        <img src={selectedEvent.imageUrl} alt="Imagem atual" className="w-32 h-auto mb-2 rounded" />
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        multiple={false}
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </AdminFormModal>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir o evento "${selectedEvent?.title}"? Esta ação não pode ser desfeita.`}
        isDeleting={deleteEventMutation.isPending}
      />
    </div>
  );
};

export default EventsTab;
