
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { TextareaWithCounter } from "../ui/TextareaWithCounter";

const PrayerTestimonyTab = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("prayers");

  // Modal states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Edit form states
  const [editMessage, setEditMessage] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editAnonymous, setEditAnonymous] = useState(false);

  // Fetch prayers
  const {
    data: prayers = [],
    isLoading: prayersLoading,
  } = useQuery({
    queryKey: ['admin-prayers'],
    queryFn: async () => {
      const response = await api.get('/oracoes');
      return response.data;
    }
  });

  // Fetch testimonies
  const {
    data: testimonies = [],
    isLoading: testimoniesLoading,
  } = useQuery({
    queryKey: ['admin-testimonies'],
    queryFn: async () => {
      const response = await api.get('/testemunhos');
      return response.data;
    }
  });

  // Update prayer mutation
  const updatePrayerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return await api.put(`/oracoes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prayers'] });
      toast({
        title: "Sucesso",
        description: "Pedido de oração atualizado com sucesso",
      });
      setEditDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating prayer:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pedido de oração",
        variant: "destructive",
      });
    }
  });

  // Update testimony mutation
  const updateTestimonyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return await api.put(`/testemunhos/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonies'] });
      toast({
        title: "Sucesso",
        description: "Testemunho atualizado com sucesso",
      });
      setEditDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating testimony:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o testemunho",
        variant: "destructive",
      });
    }
  });

  // Delete prayer mutation
  const deletePrayerMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/oracoes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prayers'] });
      toast({
        title: "Sucesso",
        description: "Pedido de oração excluído com sucesso",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting prayer:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o pedido de oração",
        variant: "destructive",
      });
    }
  });

  // Delete testimony mutation
  const deleteTestimonyMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/testemunhos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonies'] });
      toast({
        title: "Sucesso",
        description: "Testemunho excluído com sucesso",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting testimony:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o testemunho",
        variant: "destructive",
      });
    }
  });

  const categories = ["Cura", "Família", "Provisão", "Libertação", "Milagre", "Geral"];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const truncateMessage = (message: string, maxLength = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const handleView = (item: any) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setEditMessage(item.message);
    setEditCategory(item.category);
    setEditAnonymous(item.name === "Anônimo");
    setEditDialogOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedItem) return;

    const updateData = {
      message: editMessage,
      category: editCategory,
      ...(editAnonymous ? { name: "Anônimo" } : {})
    };

    if (activeTab === "prayers") {
      updatePrayerMutation.mutate({ id: selectedItem.id, data: updateData });
    } else {
      updateTestimonyMutation.mutate({ id: selectedItem.id, data: updateData });
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedItem) return;

    if (activeTab === "prayers") {
      deletePrayerMutation.mutate(selectedItem.id);
    } else {
      deleteTestimonyMutation.mutate(selectedItem.id);
    }
  };

  // Filter prayers
  const unansweredPrayers = prayers.filter((prayer: any) => !prayer.responded);
  const answeredPrayers = prayers.filter((prayer: any) => prayer.responded);

  const renderPrayersTable = (items: any[], title: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Nome da Pessoa</TableHead>
                <TableHead className="min-w-[100px]">Categoria</TableHead>
                <TableHead className="min-w-[100px]">Data</TableHead>
                <TableHead className="min-w-[200px]">Mensagem</TableHead>
                <TableHead className="text-right min-w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    Nenhum pedido de oração encontrado
                  </TableCell>
                </TableRow>
              ) : (
                items.map((prayer: any) => (
                  <TableRow key={prayer.id}>
                    <TableCell className="font-medium">{prayer.name}</TableCell>
                    <TableCell>{prayer.category}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(prayer.createdAt)}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={prayer.message}>
                        {truncateMessage(prayer.message)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleView(prayer)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(prayer)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(prayer)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  const renderTestimoniesTable = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Todos os Testemunhos</h3>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Nome da Pessoa</TableHead>
                <TableHead className="min-w-[100px]">Categoria</TableHead>
                <TableHead className="min-w-[100px]">Data</TableHead>
                <TableHead className="min-w-[200px]">Mensagem</TableHead>
                <TableHead className="min-w-[120px]">Veio de Oração?</TableHead>
                <TableHead className="text-right min-w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Nenhum testemunho encontrado
                  </TableCell>
                </TableRow>
              ) : (
                testimonies.map((testimony: any) => (
                  <TableRow key={testimony.id}>
                    <TableCell className="font-medium">{testimony.name}</TableCell>
                    <TableCell>{testimony.category}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(testimony.createdAt)}</TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={testimony.message}>
                        {truncateMessage(testimony.message)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {testimony.oracaoOriginal ? "Sim" : "Não"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleView(testimony)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(testimony)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(testimony)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold">Oração/Testemunho</h2>

      <Tabs
        defaultValue="prayers"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="prayers" className="text-sm">Pedidos de Oração</TabsTrigger>
          <TabsTrigger value="testimonies" className="text-sm">Testemunhos</TabsTrigger>
        </TabsList>

        <TabsContent value="prayers" className="space-y-6">
          {prayersLoading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : (
            <>
              {renderPrayersTable(unansweredPrayers, "Pedidos de Oração não respondidos")}
              {renderPrayersTable(answeredPrayers, "Pedidos de Oração respondidos")}
            </>
          )}
        </TabsContent>

        <TabsContent value="testimonies">
          {testimoniesLoading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : (
            renderTestimoniesTable()
          )}
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[95vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {activeTab === "prayers" ? "Detalhes do Pedido de Oração" : "Detalhes do Testemunho"}
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Nome</h3>
                  <p className="break-words">{selectedItem.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Categoria</h3>
                  <p>{selectedItem.category}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium">{activeTab === "prayers" ? "Pedido" : "Testemunho"}</h3>
                <p className="whitespace-pre-wrap break-words text-sm">{selectedItem.message}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Data</h3>
                <p>{formatDate(selectedItem.createdAt)}</p>
              </div>
              {activeTab === "prayers" && (
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <p>{selectedItem.responded ? "Respondido" : "Não respondido"}</p>
                </div>
              )}
              {activeTab === "testimonies" && selectedItem.oracaoOriginal && (
                <div>
                  <h3 className="text-sm font-medium">Oração Original</h3>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm"><strong>Categoria:</strong> {selectedItem.oracaoOriginal.category}</p>
                    <p className="text-sm break-words"><strong>Mensagem:</strong> {selectedItem.oracaoOriginal.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[95vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Editar {activeTab === "prayers" ? "Pedido de Oração" : "Testemunho"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Mensagem</Label>
              <TextareaWithCounter
                id="message"
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                rows={4}
                placeholder="Digite sua mensagem..."
                maxLength={500}
                className="h-24 sm:h-32 text-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={editAnonymous}
                onCheckedChange={(checked) => setEditAnonymous(checked as boolean)}
              />
              <Label htmlFor="anonymous" className="text-sm">Compartilhar anonimamente</Label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updatePrayerMutation.isPending || updateTestimonyMutation.isPending}
                className="w-full sm:w-auto"
              >
                {(updatePrayerMutation.isPending || updateTestimonyMutation.isPending) ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Excluir ${activeTab === "prayers" ? "Pedido de Oração" : "Testemunho"}`}
        description={`Tem certeza que deseja excluir este ${activeTab === "prayers" ? "pedido de oração" : "testemunho"}? Esta ação não pode ser desfeita.`}
        isDeleting={deletePrayerMutation.isPending || deleteTestimonyMutation.isPending}
      />
    </div>
  );
};

export default PrayerTestimonyTab;
