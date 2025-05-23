
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { Search } from "lucide-react";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Form schema for user edit
const userFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido").optional().nullable(),
  roles: z.array(z.string()),
  member: z.boolean().optional(),
  active: z.boolean().default(true),
  ministries: z.array(z.string()).optional().default([]),
});

type UserFormData = z.infer<typeof userFormSchema>;

const UsersTab = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewUserOpen, setViewUserOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

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
    
    // Garantindo que ministries seja sempre um array de strings
    const userMinistries = user.ministries 
      ? user.ministries.map((m: any) => typeof m === 'object' ? m.id : m)
      : [];
    
    // Reset form with user data
    form.reset({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      roles: user.roles || [],
      member: user.member || false,
      active: user.active !== false,
      ministries: userMinistries,
    });
    
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setViewUserOpen(true);
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

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoleFilter = !roleFilter || roleFilter === 'todas' || 
                              (user.roles && user.roles.includes(roleFilter));
    
    return matchesSearch && matchesRoleFilter;
  });

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
    { id: "PROFESSOR", label: "Professor" },
    { id: "PASTORAUXILIAR", label: "Pastor Auxiliar" },
    { id: "EVANGELISTA", label: "Evangelista" },
    { id: "DIACONO", label: "Diácono" },
    { id: "MISSIONARIO", label: "Missionário" },
    { id: "PRESBITERO", label: "Presbítero" },
    { id: "VISITANTE", label: "Visitante" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Usuários</h2>
      
      {/* Search and Filter */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Pesquisar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-64">
            <Select 
              value={roleFilter || "todas"} 
              onValueChange={(value) => setRoleFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as funções</SelectItem>
                {availableRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>{role.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <AdminTable
        data={filteredUsers}
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
                      <div key={ministry.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`ministry-${ministry.id}`}
                          checked={field.value?.includes(ministry.id)}
                          onCheckedChange={(checked) => {
                            const current = Array.isArray(field.value) ? field.value : [];
                            if (checked) {
                              field.onChange([...current, ministry.id]);
                            } else {
                              field.onChange(current.filter((id) => id !== ministry.id));
                            }
                          }}
                        />
                        <label 
                          htmlFor={`ministry-${ministry.id}`}
                          className="text-sm font-medium leading-none"
                        >
                          {ministry.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </AdminFormModal>

      {/* View User Dialog */}
      <Dialog open={viewUserOpen} onOpenChange={setViewUserOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nome</h3>
                  <p className="mt-1">{selectedUser.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Telefone</h3>
                  <p className="mt-1">{selectedUser.phone || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    {selectedUser.active !== false ? (
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Inativo
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Funções</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedUser.roles && selectedUser.roles.length > 0 ? (
                    selectedUser.roles.map((role: string) => (
                      <span 
                        key={role} 
                        className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                      >
                        {availableRoles.find(r => r.id === role)?.label || role}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ministérios</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedUser.ministries && selectedUser.ministries.length > 0 ? (
                    selectedUser.ministries.map((ministry: any) => {
                      const ministryId = ministry.id || ministry;
                      const ministryName = ministry.name || 
                        ministries.find((m: any) => m.id === ministryId)?.name || 
                        "Ministério";
                      
                      return (
                        <span 
                          key={ministryId} 
                          className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
                        >
                          {ministryName}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setViewUserOpen(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
