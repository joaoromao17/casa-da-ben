
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ministryFormSchema, MinistryFormData } from "@/components/admin/ministries/ministryFormSchema";
import MinistryForm from "@/components/admin/ministries/MinistryForm";
import api from "@/services/api";

interface MinistryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  ministry: any;
  users: any[];
  onSuccess: () => void;
}

const MinistryEditModal = ({ isOpen, onClose, ministry, users, onSuccess }: MinistryEditModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MinistryFormData>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      name: ministry?.name || "",
      description: ministry?.description || "",
      meetingDay: ministry?.meetingDay || ministry?.schedule || "",
      image: undefined,
      leaderIds: ministry?.leaders?.map((leader: any) => {
        const user = users.find(u => u.name === leader.name);
        return user ? user.id?.toString() : '';
      }).filter(Boolean) || [],
      viceLeaders: ministry?.viceLeaders?.map((vice: any) => {
        const user = users.find(u => u.name === vice.name);
        return user ? user.id?.toString() : '';
      }).filter(Boolean) || [],
      activities: (ministry?.activities && ministry?.activities.length > 0) ? ministry?.activities : [''],
    },
  });

  const onSubmit = async (data: MinistryFormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();

      const dto = {
        name: data.name,
        description: data.description,
        meetingDay: data.meetingDay || null,
        leaderIds: data.leaderIds?.map(id => parseInt(id)) || [],
        viceLeaderIds: data.viceLeaders?.map(id => parseInt(id)) || [],
        activities: data.activities?.filter(activity => activity && activity.trim() !== "") || [],
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
            <MinistryForm
              form={form}
              users={users}
              isCreating={false}
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
