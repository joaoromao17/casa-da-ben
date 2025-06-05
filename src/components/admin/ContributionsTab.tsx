import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DataGrid } from '@mui/x-data-grid';
import { API_BASE_URL } from "@/services/api";
import api from "@/services/api";
import { Checkbox } from "@/components/ui/checkbox";

const ContributionsTab = () => {
  const [contributions, setContributions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    endDate: '',
    pixKey: '',
    isGoalVisible: true
  });
  const [editingContribution, setEditingContribution] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContributions();
  }, []);

  const loadContributions = async () => {
    try {
      const response = await api.get('/contribuicoes');
      setContributions(response.data);
    } catch (error) {
      console.error("Error loading contributions:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as contribuições.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({ ...prev, isGoalVisible: e }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const contributionData = {
        title: formData.title,
        description: formData.description,
        targetValue: parseFloat(formData.targetValue.replace(',', '.')),
        endDate: formData.endDate,
        startDate: new Date().toISOString().split("T")[0], // Adicionar data atual
        pixKey: formData.pixKey,
        isGoalVisible: formData.isGoalVisible
      };

      let response;
      if (editingContribution) {
        // Update existing contribution
        response = await api.put(`/contribuicoes/${editingContribution.id}`, contributionData);
        
        // Handle image upload if new image is selected
        if (imageFile) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          
          try {
            const imageResponse = await api.post(`/contribuicoes/${editingContribution.id}/upload-image`, imageFormData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Image uploaded successfully:", imageResponse.data);
          } catch (imageError) {
            console.error("Error uploading image:", imageError);
            toast({
              title: "Aviso",
              description: "Contribuição atualizada, mas houve erro no upload da imagem.",
              variant: "default"
            });
          }
        }
        
        setEditingContribution(null);
        toast({
          title: "Contribuição atualizada!",
          description: "A contribuição foi atualizada com sucesso."
        });
      } else {
        // Create new contribution
        response = await api.post('/contribuicoes', contributionData);
        
        // Handle image upload if image is selected
        if (imageFile) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          
          try {
            const imageResponse = await api.post(`/contribuicoes/${response.data.id}/upload-image`, imageFormData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Image uploaded successfully:", imageResponse.data);
          } catch (imageError) {
            console.error("Error uploading image:", imageError);
            toast({
              title: "Aviso", 
              description: "Contribuição criada, mas houve erro no upload da imagem.",
              variant: "default"
            });
          }
        }
        
        toast({
          title: "Contribuição criada!",
          description: "A nova contribuição foi criada com sucesso."
        });
      }

      // Reset form and reload data
      setFormData({
        title: '',
        description: '',
        targetValue: '',
        endDate: '',
        pixKey: '',
        isGoalVisible: true
      });
      setImageFile(null);
      setImagePreview(null);
      setDialogOpen(false);
      loadContributions();
    } catch (error) {
      console.error("Error saving contribution:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a contribuição. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (contribution) => {
    setEditingContribution(contribution);
    setFormData({
      title: contribution.title,
      description: contribution.description,
      targetValue: contribution.targetValue.toString(),
      endDate: contribution.endDate,
      pixKey: contribution.pixKey,
      isGoalVisible: contribution.isGoalVisible
    });
    setDialogOpen(true);

    // Load image for edit
    if (contribution.imageUrl) {
      const imageUrl = contribution.imageUrl.startsWith('http')
        ? contribution.imageUrl
        : `${API_BASE_URL}${contribution.imageUrl}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta contribuição?")) {
      try {
        await api.delete(`/contribuicoes/${id}`);
        toast({
          title: "Contribuição excluída!",
          description: "A contribuição foi excluída com sucesso."
        });
        loadContributions();
      } catch (error) {
        console.error("Error deleting contribution:", error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a contribuição. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Título', width: 200 },
    { field: 'description', headerName: 'Descrição', width: 300 },
    { field: 'targetValue', headerName: 'Valor Alvo', width: 130 },
    { field: 'endDate', headerName: 'Data de Encerramento', width: 150 },
    { field: 'pixKey', headerName: 'Chave PIX', width: 200 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEdit(params.row)}
            className="mr-2"
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(params.row.id)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="md:flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Gerenciar Contribuições</h2>
        <Button onClick={() => {
          setEditingContribution(null);
          setFormData({
            title: '',
            description: '',
            targetValue: '',
            endDate: '',
            pixKey: '',
            isGoalVisible: true
          });
          setImageFile(null);
          setImagePreview(null);
          setDialogOpen(true);
        }}>
          Adicionar Contribuição
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contribuições</CardTitle>
          <CardDescription>Visualize e gerencie as contribuições do seu site.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={contributions}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingContribution ? 'Editar Contribuição' : 'Nova Contribuição'}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para {editingContribution ? 'editar a contribuição selecionada' : 'criar uma nova contribuição'}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="targetValue">Valor Alvo</Label>
                <Input
                  type="text"
                  id="targetValue"
                  name="targetValue"
                  value={formData.targetValue}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endDate">Data de Encerramento</Label>
                <Input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="pixKey">Chave PIX</Label>
                <Input
                  type="text"
                  id="pixKey"
                  name="pixKey"
                  value={formData.pixKey}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isGoalVisible"
                checked={formData.isGoalVisible}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isGoalVisible">Mostrar meta no site</Label>
            </div>

            <div>
              <Label htmlFor="image">Imagem</Label>
              <Input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContributionsTab;
