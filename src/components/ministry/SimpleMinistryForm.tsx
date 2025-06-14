
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TextareaWithCounter } from '../ui/TextareaWithCounter';

export interface MinistryEditFormData {
  name: string;
  description: string;
  meetingDay?: string;
  image?: File;
  activities?: string[];
}

interface SimpleMinistryFormProps {
  form: UseFormReturn<MinistryEditFormData>;
  selectedMinistry: any;
}

const SimpleMinistryForm: React.FC<SimpleMinistryFormProps> = ({ form, selectedMinistry }) => {
  const { register, formState: { errors }, setValue, watch } = form;
  const activities = watch('activities') || [''];

  const addActivity = () => {
    const newActivities = [...activities, ''];
    setValue('activities', newActivities);
  };

  const removeActivity = (index: number) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setValue('activities', newActivities);
  };

  const updateActivity = (index: number, value: string) => {
    const newActivities = [...activities];
    newActivities[index] = value;
    setValue('activities', newActivities);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Nome do Ministério</Label>
        <Input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <TextareaWithCounter
          id="description"
          maxLength={500}
          placeholder="Descreva o conteúdo..."
          className={`h-32 ${errors.description ? 'border-red-500' : ''}`}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="meetingDay">Dia de Reunião</Label>
        <Input
          id="meetingDay"
          {...register('meetingDay')}
          className={errors.meetingDay ? 'border-red-500' : ''}
          placeholder="Ex: Todas as quartas-feiras às 19h"
        />
        {errors.meetingDay && (
          <p className="text-red-500 text-sm mt-1">{errors.meetingDay.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="image">Imagem do Ministério</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setValue('image', file);
            }
          }}
          className={errors.image ? 'border-red-500' : ''}
        />
        {errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
        )}
      </div>

      <div>
        <Label>Atividades</Label>
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={activity}
                onChange={(e) => updateActivity(index, e.target.value)}
                placeholder="Digite uma atividade"
                className="flex-1"
              />
              {activities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  className="px-2 py-1 text-red-500 hover:bg-red-50 rounded"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addActivity}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            + Adicionar atividade
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleMinistryForm;
