
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ministryFormSchema, type MinistryFormData } from '../admin/ministries/ministryFormSchema';
import { TextareaWithCounter } from '../ui/TextareaWithCounter';

interface User {
  id: number;
  name: string;
}

interface Ministry {
  id: number;
  name: string;
  description: string;
  leader?: User;
  viceLeader?: User;
  members: User[];
}

interface MinistryEditFormProps {
  ministry: Ministry;
  onSave: (data: MinistryFormData) => void;
  onCancel: () => void;
  users: User[];
}

const MinistryEditForm: React.FC<MinistryEditFormProps> = ({
  ministry,
  onSave,
  onCancel,
  users,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MinistryFormData>({
    resolver: zodResolver(ministryFormSchema),
    defaultValues: {
      name: ministry.name || '',
      description: ministry.description || '',
      leaderIds: ministry.leader ? [ministry.leader.id.toString()] : [],
      viceLeaderIds: ministry.viceLeader ? [ministry.viceLeader.id.toString()] : [],
      activities: [''],
    },
  });

  const leaderIds = watch('leaderIds') || [];
  const viceLeaderIds = watch('viceLeaderIds') || [];

  const handleLeaderToggle = (userId: string) => {
    const currentLeaders = leaderIds;
    const newLeaders = currentLeaders.includes(userId)
      ? currentLeaders.filter(id => id !== userId)
      : [...currentLeaders, userId];
    setValue('leaderIds', newLeaders);
  };

  const handleViceLeaderToggle = (userId: string) => {
    const currentViceLeaders = viceLeaderIds;
    const newViceLeaders = currentViceLeaders.includes(userId)
      ? currentViceLeaders.filter(id => id !== userId)
      : [...currentViceLeaders, userId];
    setValue('viceLeaderIds', newViceLeaders);
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
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
        <Label>Líderes</Label>
        <div className="space-y-2 border rounded px-3 py-3 max-h-48 overflow-y-auto">
          {users.map(user => (
            <div key={user.id} className="flex items-center space-x-2">
              <Checkbox
                id={`leader-${user.id}`}
                checked={leaderIds.includes(user.id.toString())}
                onCheckedChange={() => handleLeaderToggle(user.id.toString())}
              />
              <label htmlFor={`leader-${user.id}`} className="text-sm flex-1">
                {user.name}
              </label>
            </div>
          ))}
        </div>
        {errors.leaderIds && (
          <p className="text-red-500 text-sm mt-1">{errors.leaderIds.message}</p>
        )}
      </div>

      <div>
        <Label>Vice-Líderes</Label>
        <div className="space-y-2 border rounded px-3 py-3 max-h-48 overflow-y-auto">
          {users.map(user => (
            <div key={user.id} className="flex items-center space-x-2">
              <Checkbox
                id={`vice-leader-${user.id}`}
                checked={viceLeaderIds.includes(user.id.toString())}
                onCheckedChange={() => handleViceLeaderToggle(user.id.toString())}
              />
              <label htmlFor={`vice-leader-${user.id}`} className="text-sm flex-1">
                {user.name}
              </label>
            </div>
          ))}
        </div>
        {errors.viceLeaderIds && (
          <p className="text-red-500 text-sm mt-1">{errors.viceLeaderIds.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};

export default MinistryEditForm;
export type { MinistryFormData };
