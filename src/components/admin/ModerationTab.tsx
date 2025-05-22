
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import api from "@/services/api";
import { format } from "date-fns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ModerationTab = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("prayers");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch prayers
  const { 
    data: prayers = [], 
    isLoading: prayersLoading, 
  } = useQuery({
    queryKey: ['prayers'],
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
    queryKey: ['testimonies'],
    queryFn: async () => {
      const response = await api.get('/testemunhos');
      return response.data;
    }
  });

  // Update prayer status mutation
  const updatePrayerMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string, approved: boolean }) => {
      return await api.put(`/oracoes/${id}`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayers'] });
      toast({
        title: "Sucesso",
        description: "Status do pedido de oração atualizado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Error updating prayer status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  });

  // Update testimony status mutation
  const updateTestimonyMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string, approved: boolean }) => {
      return await api.put(`/testemunhos/${id}`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonies'] });
      toast({
        title: "Sucesso",
        description: "Status do testemunho atualizado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Error updating testimony status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  });

  const handleApprovePrayer = (prayer: any) => {
    updatePrayerMutation.mutate({ id: prayer.id, approved: true });
  };

  const handleRejectPrayer = (prayer: any) => {
    updatePrayerMutation.mutate({ id: prayer.id, approved: false });
  };

  const handleApproveTestimony = (testimony: any) => {
    updateTestimonyMutation.mutate({ id: testimony.id, approved: true });
  };

  const handleRejectTestimony = (testimony: any) => {
    updateTestimonyMutation.mutate({ id: testimony.id, approved: false });
  };

  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  // Filter pending items
  const pendingPrayers = prayers.filter((prayer: any) => prayer.approved === null);
  const pendingTestimonies = testimonies.filter((testimony: any) => testimony.approved === null);
  
  // Filter approved items
  const approvedPrayers = prayers.filter((prayer: any) => prayer.approved === true);
  const approvedTestimonies = testimonies.filter((testimony: any) => testimony.approved === true);
  
  // Filter rejected items
  const rejectedPrayers = prayers.filter((prayer: any) => prayer.approved === false);
  const rejectedTestimonies = testimonies.filter((testimony: any) => testimony.approved === false);

  const renderPrayersTable = (items: any[], showActions: boolean = false) => (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                Nenhum pedido de oração encontrado
              </TableCell>
            </TableRow>
          ) : (
            items.map((prayer: any) => (
              <TableRow key={prayer.id}>
                <TableCell>{prayer.name}</TableCell>
                <TableCell>{prayer.category}</TableCell>
                <TableCell>
                  {prayer.createdAt ? format(new Date(prayer.createdAt), 'dd/MM/yyyy') : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewItem(prayer)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {showActions && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleApprovePrayer(prayer)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRejectPrayer(prayer)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderTestimoniesTable = (items: any[], showActions: boolean = false) => (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                Nenhum testemunho encontrado
              </TableCell>
            </TableRow>
          ) : (
            items.map((testimony: any) => (
              <TableRow key={testimony.id}>
                <TableCell>{testimony.name}</TableCell>
                <TableCell>{testimony.title}</TableCell>
                <TableCell>
                  {testimony.createdAt ? format(new Date(testimony.createdAt), 'dd/MM/yyyy') : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewItem(testimony)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {showActions && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleApproveTestimony(testimony)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRejectTestimony(testimony)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Moderação de Conteúdo</h2>
      
      <Tabs 
        defaultValue="prayers" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full mb-8">
          <TabsTrigger value="prayers">
            Pedidos de Oração
            {pendingPrayers.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-red-500 rounded-full">
                {pendingPrayers.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="testimonies">
            Testemunhos
            {pendingTestimonies.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-red-500 rounded-full">
                {pendingTestimonies.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="prayers" className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Pedidos Pendentes</h3>
            {prayersLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              renderPrayersTable(pendingPrayers, true)
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Pedidos Aprovados</h3>
            {prayersLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              renderPrayersTable(approvedPrayers)
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Pedidos Rejeitados</h3>
            {prayersLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              renderPrayersTable(rejectedPrayers)
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="testimonies" className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Testemunhos Pendentes</h3>
            {testimoniesLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              renderTestimoniesTable(pendingTestimonies, true)
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Testemunhos Aprovados</h3>
            {testimoniesLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              renderTestimoniesTable(approvedTestimonies)
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Testemunhos Rejeitados</h3>
            {testimoniesLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              renderTestimoniesTable(rejectedTestimonies)
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* View Prayer/Testimony Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "prayers" ? "Pedido de Oração" : "Testemunho"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {selectedItem && activeTab === "prayers" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Nome</h3>
                    <p>{selectedItem.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Categoria</h3>
                    <p>{selectedItem.category}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Pedido</h3>
                  <p className="whitespace-pre-wrap">{selectedItem.message}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Data</h3>
                  <p>{selectedItem.createdAt ? format(new Date(selectedItem.createdAt), 'dd/MM/yyyy HH:mm') : '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <p>
                    {selectedItem.approved === null && "Pendente"}
                    {selectedItem.approved === true && "Aprovado"}
                    {selectedItem.approved === false && "Rejeitado"}
                  </p>
                </div>
              </>
            )}
            
            {selectedItem && activeTab === "testimonies" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Nome</h3>
                    <p>{selectedItem.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Título</h3>
                    <p>{selectedItem.title}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Testemunho</h3>
                  <p className="whitespace-pre-wrap">{selectedItem.message}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Data</h3>
                  <p>{selectedItem.createdAt ? format(new Date(selectedItem.createdAt), 'dd/MM/yyyy HH:mm') : '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <p>
                    {selectedItem.approved === null && "Pendente"}
                    {selectedItem.approved === true && "Aprovado"}
                    {selectedItem.approved === false && "Rejeitado"}
                  </p>
                </div>
              </>
            )}
            
            <div className="flex justify-end gap-2 mt-6">
              {selectedItem && selectedItem.approved === null && (
                <>
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      if (activeTab === "prayers") {
                        handleApprovePrayer(selectedItem);
                      } else {
                        handleApproveTestimony(selectedItem);
                      }
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Aprovar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (activeTab === "prayers") {
                        handleRejectPrayer(selectedItem);
                      } else {
                        handleRejectTestimony(selectedItem);
                      }
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Rejeitar
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => setIsViewDialogOpen(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModerationTab;
