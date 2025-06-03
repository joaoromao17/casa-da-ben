
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export interface MinistryEditFormData {
  name: string;
  description: string;
  meetingDay: string;
  activities: string[];
  image?: File;
}

interface MinistryEditFormProps {
  form: UseFormReturn<MinistryEditFormData>;
  onSubmit: (data: MinistryEditFormData) => void;
  isSubmitting: boolean;
}

const MinistryEditForm: React.FC<MinistryEditFormProps> = ({ form, onSubmit, isSubmitting }) => {
  const activitiesOptions = [
    'Cultos',
    'Estudos Bíblicos',
    'Evangelismo',
    'Visitação',
    'Eventos',
    'Conferências',
    'Retiros',
    'Workshops',
    'Ministração Musical',
    'Teatro/Drama',
    'Trabalho Social'
  ];

  const meetingDayOptions = [
    { value: 'Segunda-feira', label: 'Segunda-feira' },
    { value: 'Terça-feira', label: 'Terça-feira' },
    { value: 'Quarta-feira', label: 'Quarta-feira' },
    { value: 'Quinta-feira', label: 'Quinta-feira' },
    { value: 'Sexta-feira', label: 'Sexta-feira' },
    { value: 'Sábado', label: 'Sábado' },
    { value: 'Domingo', label: 'Domingo' },
    { value: 'Variável', label: 'Variável' }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome */}
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

        {/* Descrição */}
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

        {/* Dia de Reunião */}
        <FormField
          control={form.control}
          name="meetingDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dia de Reunião</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia de reunião" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {meetingDayOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Atividades */}
        <FormField
          control={form.control}
          name="activities"
          render={() => (
            <FormItem>
              <FormLabel>Atividades</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {activitiesOptions.map((activity) => (
                  <FormField
                    key={activity}
                    control={form.control}
                    name="activities"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`activity-${activity}`}
                          checked={field.value?.includes(activity) || false}
                          onCheckedChange={(checked) => {
                            const currentActivities = field.value || [];
                            if (checked) {
                              field.onChange([...currentActivities, activity]);
                            } else {
                              field.onChange(currentActivities.filter((item: string) => item !== activity));
                            }
                          }}
                        />
                        <label 
                          htmlFor={`activity-${activity}`}
                          className="text-sm font-medium leading-none"
                        >
                          {activity}
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

        {/* Imagem */}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Imagem do Ministério</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MinistryEditForm;
