
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MinistryFormData } from "./ministryFormSchema";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

interface MinistryFormProps {
  form: UseFormReturn<MinistryFormData>;
  users: any[];
  isCreating: boolean;
  selectedMinistry?: any;
}

const MinistryForm = ({ form, users, isCreating, selectedMinistry }: MinistryFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addActivity = () => {
    const currentActivities = form.getValues('activities') || [];
    form.setValue('activities', [...currentActivities, '']);
  };

  const removeActivity = (index: number) => {
    const currentActivities = form.getValues('activities') || [];
    const newActivities = currentActivities.filter((_, i) => i !== index);
    form.setValue('activities', newActivities);
  };

  const updateActivity = (index: number, value: string) => {
    const currentActivities = form.getValues('activities') || [];
    const newActivities = [...currentActivities];
    newActivities[index] = value;
    form.setValue('activities', newActivities);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Ministério</FormLabel>
              <FormControl>
                <Input placeholder="Nome do ministério" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meetingDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dia de Reunião</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sábados às 14h" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descrição do ministério" 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem de Exibição</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="0" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="showOnHome"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Mostrar na Home
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Exibir este ministério na página inicial
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="leaderIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Líderes</FormLabel>
              <Select 
                onValueChange={(value) => {
                  const currentValues = field.value || [];
                  if (!currentValues.includes(value)) {
                    field.onChange([...currentValues, value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar líderes" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 space-y-1">
                {(field.value || []).map((leaderId) => {
                  const leader = users.find(u => u.id.toString() === leaderId);
                  return leader ? (
                    <div key={leaderId} className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded">
                      <span className="text-sm">{leader.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newValues = (field.value || []).filter(id => id !== leaderId);
                          field.onChange(newValues);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="viceLeaderIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vice-Líderes</FormLabel>
              <Select 
                onValueChange={(value) => {
                  const currentValues = field.value || [];
                  if (!currentValues.includes(value)) {
                    field.onChange([...currentValues, value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar vice-líderes" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 space-y-1">
                {(field.value || []).map((viceLeaderId) => {
                  const viceLeader = users.find(u => u.id.toString() === viceLeaderId);
                  return viceLeader ? (
                    <div key={viceLeaderId} className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded">
                      <span className="text-sm">{viceLeader.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newValues = (field.value || []).filter(id => id !== viceLeaderId);
                          field.onChange(newValues);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="activities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Atividades</FormLabel>
            <div className="space-y-2">
              {(field.value || ['']).map((activity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Atividade ${index + 1}`}
                    value={activity}
                    onChange={(e) => updateActivity(index, e.target.value)}
                  />
                  {(field.value || []).length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeActivity(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addActivity}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Atividade
            </Button>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imagem do Ministério</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </FormControl>
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
            {!isCreating && selectedMinistry?.imageUrl && !imagePreview && (
              <div className="mt-2">
                <img 
                  src={selectedMinistry.imageUrl} 
                  alt="Imagem atual" 
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MinistryForm;
