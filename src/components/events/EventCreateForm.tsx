
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { TextareaWithCounter } from "@/components/ui/TextareaWithCounter";
import { Plus, Loader2 } from "lucide-react";

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

interface EventCreateFormProps {
  children: React.ReactNode;
}

const EventCreateForm = ({ children }: EventCreateFormProps) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    mutationFn: async (formData: FormData) => {
      return await api.post('/eventos', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso",
      });
      handleCloseModal();
      // Refresh the page to show the new event
      window.location.reload();
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.reset({
      title: "",
      description: "",
      date: format(new Date(), 'yyyy-MM-dd'),
      time: "19:00",
      location: "",
      image: undefined,
      category: "",
    });
  };

  const onSubmit = (data: EventFormData) => {
    const formData = new FormData();

    const evento = {
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      location: data.location,
      category: data.category,
    };

    formData.append("evento", new Blob([JSON.stringify(evento)], { type: "application/json" }));

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    createEventMutation.mutate(formData);
  };

  const categories = [
    "Culto", "Oração", "Ação Social", "Retiro"
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Evento</DialogTitle>
          <DialogDescription>
            Preencha as informações do evento que deseja criar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <TextareaWithCounter
                      placeholder="Descreva o evento"
                      maxLength={500}
                      className="h-32"
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={createEventMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createEventMutation.isPending}
                className="bg-church-600 hover:bg-church-700"
              >
                {createEventMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Evento
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventCreateForm;
