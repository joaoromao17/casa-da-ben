
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

// Form schema for user edit
const userFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido").optional().nullable(),
  roles: z.array(z.string()),
  member: z.boolean().optional(),
  active: z.boolean().default(true),
  ministries: z.array(z.string()).optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

const UsersTab = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Fetch users
  const { 
    data: users = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    }
  });

  // Fetch ministries for dropdown
  const { data: ministries = [] } = useQuery({
    queryKey: ['ministries'],
    queryFn: async () => {
      const response = await api.get('/ministerios');
      return response.data;
    }
  });

  // Form setup
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      roles: [],
      member: false,
      active: true,
      ministries: [],
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: UserFormData & { id: string }) => {
      const { id, ...userData } = data;
      return await api.put(`/users/${id}`, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário",
        variant: "destructive",
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o usuário",
        variant: "destructive",
      });
    }
  });

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    
    // Reset form with user data
    form.reset({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      roles: user.roles || [],
      member: user.member || false,
      active: user.active !== false,
      ministries: user.ministries?.map((m: any) => m.id || m) || [],
    });
    
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleViewUser = (user: any) => {
    // Redirect to user details page or show a read-only modal
    console.log("View user:", user);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const onSubmit = (data: UserFormData) => {
    if (selectedUser) {
      updateUserMutation.mutate({
        id: selectedUser.id,
        ...data,
      });
    }
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const columns = [
    { key: "name", title: "Nome" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Telefone" },
    { 
      key: "roles", 
      title: "Funções",
      render: (roles: string[]) => roles?.join(", ") || "-"
    },
    { 
      key: "member", 
      title: "Membro", 
      render: (isMember: boolean) => isMember ? "Sim" : "Não"
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
    return <div className="text-center text-red-500">Erro ao carregar usuários.</div>;
  }

  // Available roles
  const availableRoles = [
    { id: "ADMIN", label: "Administrador" },
    { id: "PASTOR", label: "Pastor" },
    { id: "LIDER", label: "Líder" },
    { id: "MEMBRO", label: "Membro" },
    { id: "USER", label: "Usuário" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h2>
      
      <AdminTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />

      {/* Edit User Modal */}
      <AdminFormModal
        title={`Editar Usuário: ${selectedUser?.name || ""}`}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isSubmitting={updateUserMutation.isPending}
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
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>Funções</FormLabel>
                  <div className="space-y-2">
                    {availableRoles.map((role) => (
                      <FormField
                        key={role.id}
                        control={form.control}
                        name="roles"
                        render={({ field }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`role-${role.id}`}
                              checked={field.value?.includes(role.id)}
                              onCheckedChange={(checked) => {
                                const updatedRoles = checked
                                  ? [...field.value, role.id]
                                  : field.value.filter((r: string) => r !== role.id);
                                field.onChange(updatedRoles);
                              }}
                            />
                            <label 
                              htmlFor={`role-${role.id}`}
                              className="text-sm font-medium leading-none"
                            >
                              {role.label}
                            </label>
                          </div>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="member"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Membro da Igreja</FormLabel>
                  </div>
                </FormItem>
              )}
            />

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
                    <FormLabel>Usuário Ativo</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ministries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ministérios</FormLabel>
                  <div className="space-y-2">
                    {ministries.map((ministry: any) => (
                      <FormField
                        key={ministry.id}
                        control={form.control}
                        name="ministries"
                        render={({ field: ministriesField }) => (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`ministry-${ministry.id}`}
                              checked={ministriesField.value?.includes(ministry.id)}
                              onCheckedChange={(checked) => {
                                const updatedMinistries = checked
                                  ? [...ministriesField.value, ministry.id]
                                  : ministriesField.value.filter((m: string) => m !== ministry.id);
                                ministriesField.onChange(updatedMinistries);
                              }}
                            />
                            <label 
                              htmlFor={`ministry-${ministry.id}`}
                              className="text-sm font-medium leading-none"
                            >
                              {ministry.name}
                            </label>
                          </div>
                        )}
                      />
                    ))}
                  </div>
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
        description={`Tem certeza que deseja excluir o usuário ${selectedUser?.name}? Esta ação não pode ser desfeita.`}
        isDeleting={deleteUserMutation.isPending}
      />
    </div>
  );
};

export default UsersTab;
