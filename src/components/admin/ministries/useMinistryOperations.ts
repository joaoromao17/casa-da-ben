
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { MinistryFormData } from "./ministryFormSchema";

export const useMinistryOperations = () => {
  const queryClient = useQueryClient();

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

      // Criar o DTO no formato esperado pelo backend
      const dto = {
        name: data.name,
        description: data.description,
        meetingDay: data.meetingDay || null,
        leaderIds: data.leaderIds?.map(id => parseInt(id)) || [],
        viceLeaderIds: data.viceLeaders?.map(id => parseInt(id)) || [],
        activities: data.activities?.filter(activity => activity && activity.trim() !== "") || [],
        wall: null,
      };

      // Adiciona o dto como Blob com Content-Type 'application/json'
      formData.append(
        "dto",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
      );

      // Adicionar imagem apenas se for um File válido
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      console.log("DTO sendo enviado:", dto);
      console.log("FormData entries:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const { id } = data;
      
      return await api.post(`/ministerios/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ministries'] });
      toast({
        title: "Sucesso",
        description: "Ministério atualizado com sucesso",
      });
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

  return {
    ministries,
    users,
    isLoading,
    error,
    createMinistryMutation,
    updateMinistryMutation,
    deleteMinistryMutation
  };
};
