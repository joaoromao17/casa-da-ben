
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import MinistryEditForm, { MinistryEditFormData } from "./MinistryEditForm";
import api from "@/services/api";

// Schema simplificado para edição por líderes
const ministryEditSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  meetingDay: z.string().optional(),
  image: z.instanceof(File).optional(),
  activities: z.array(z.string()).default([]),
});

interface MinistryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministry: any;
  users: any[];
  onSuccess: () => void;
}

const MinistryEditModal = ({ isOpen, onClose, ministry, users, onSuccess }: MinistryEditModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MinistryEditFormData>({
    resolver: zodResolver(ministryEditSchema),
    defaultValues: {
      name: ministry?.name || "",
      description: ministry?.description || "",
      meetingDay: ministry?.meetingDay || ministry?.schedule || "",
      image: undefined,
      activities: (ministry?.activities && ministry?.activities.length > 0) ? ministry?.activities : [""],
    },
  });

  const onSubmit = async (data: MinistryEditFormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();

      const dto = {
        name: data.name,
        description: data.description,
        meetingDay: data.meetingDay || null,
        activities: data.activities?.filter(activity => activity && activity.trim() !== "") || [],
        // Manter os líderes e vice-líderes existentes
        leaderIds: ministry?.leaders?.map((leader: any) => leader.id) || [],
        viceLeaderIds: ministry?.viceLeaders?.map((vice: any) => vice.id) || [],
        wall: ministry?.wall || null,
      };

      formData.append(
        "dto",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
      );

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      await api.post(`/ministerios/${ministry.id}`, formData);

      toast({
        title: "Sucesso",
        description: "Ministério atualizado com sucesso",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating ministry:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o ministério",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Ministério: {ministry?.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <MinistryEditForm
              form={form}
              selectedMinistry={ministry}
            />
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MinistryEditModal;
