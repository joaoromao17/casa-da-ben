
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import Select from "react-select";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MinistryFormData } from "./ministryFormSchema";
import { API_BASE_URL } from "@/services/api";

interface MinistryFormProps {
  form: UseFormReturn<MinistryFormData>;
  users: any[];
  isCreating: boolean;
  selectedMinistry?: any;
}

const MinistryForm = ({ form, users, isCreating, selectedMinistry }: MinistryFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="Nome do Ministério" {...field} />
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
              <Textarea
                placeholder="Descreva o propósito e visão deste ministério"
                rows={4}
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
        name="meetingDay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dia e horário de reunião</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: 17h aos Domingos para ensaio"
                {...field}
              />
            </FormControl>
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
                onChange={(e) => field.onChange(e.target.files?.[0])}
              />
            </FormControl>
            {/* Mostrar imagem atual se estiver editando */}
            {!isCreating && selectedMinistry?.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Imagem atual:</p>
                <img 
                  src={selectedMinistry.imageUrl.startsWith('http') 
                    ? selectedMinistry.imageUrl 
                    : `${API_BASE_URL}${selectedMinistry.imageUrl}`
                  } 
                  alt="Imagem atual" 
                  className="w-32 h-32 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/128x128?text=Sem+imagem";
                  }}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <Controller
        control={form.control}
        name="leaderIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Líder(es) do Ministério</FormLabel>
            <Select
              isMulti
              options={users.map((user) => ({ label: user.name, value: user.id.toString() }))}
              value={users
                .filter((u) => field.value?.includes(u.id.toString()))
                .map((u) => ({ label: u.name, value: u.id.toString() }))}
              onChange={(selected) =>
                field.onChange(selected ? selected.map((option) => option.value) : [])
              }
              className="text-black"
              placeholder="Selecione líder(es)"
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <Controller
        control={form.control}
        name="viceLeaderIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vice-líder(es)</FormLabel>
            <Select
              isMulti
              options={users.map((user) => ({ label: user.name, value: user.id.toString() }))}
              value={users
                .filter((u) => field.value?.includes(u.id.toString()))
                .map((u) => ({ label: u.name, value: u.id.toString() }))}
              onChange={(selected) =>
                field.onChange(selected ? selected.map((option) => option.value) : [])
              }
              className="text-black"
              placeholder="Selecione vice-líder(es)"
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormLabel>Atividades</FormLabel>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Input
              {...form.register(`activities.${index}`)}
              placeholder={`Atividade ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(index)}
            >
              ❌
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append("")}
        >
          + Adicionar atividade
        </Button>
      </div>
      <FormMessage />
    </Form>
  );
};

export default MinistryForm;
