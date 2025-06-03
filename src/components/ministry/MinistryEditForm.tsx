
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ministryFormSchema, type MinistryFormData } from './ministryFormSchema';

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
      leaderId: ministry.leader?.id || undefined,
      viceLeaderId: ministry.viceLeader?.id || undefined,
      memberIds: ministry.members?.map(member => member.id) || [],
    },
  });

  const memberIds = watch('memberIds') || [];

  const handleMemberToggle = (userId: number) => {
    const currentMembers = memberIds;
    const newMembers = currentMembers.includes(userId)
      ? currentMembers.filter(id => id !== userId)
      : [...currentMembers, userId];
    setValue('memberIds', newMembers);
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
        <Textarea
          id="description"
          {...register('description')}
          className={errors.description ? 'border-red-500' : ''}
          rows={4}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="leaderId">Líder</Label>
        <select
          id="leaderId"
          {...register('leaderId', { valueAsNumber: true })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Selecione um líder</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.leaderId && (
          <p className="text-red-500 text-sm mt-1">{errors.leaderId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="viceLeaderId">Vice-Líder</Label>
        <select
          id="viceLeaderId"
          {...register('viceLeaderId', { valueAsNumber: true })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Selecione um vice-líder</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.viceLeaderId && (
          <p className="text-red-500 text-sm mt-1">{errors.viceLeaderId.message}</p>
        )}
      </div>

      <div>
        <Label>Membros</Label>
        <div className="space-y-2 border rounded px-3 py-3 max-h-48 overflow-y-auto">
          {users.map(user => (
            <div key={user.id} className="flex items-center space-x-2">
              <Checkbox
                id={`member-${user.id}`}
                checked={memberIds.includes(user.id)}
                onCheckedChange={() => handleMemberToggle(user.id)}
              />
              <label htmlFor={`member-${user.id}`} className="text-sm flex-1">
                {user.name}
              </label>
            </div>
          ))}
        </div>
        {errors.memberIds && (
          <p className="text-red-500 text-sm mt-1">{errors.memberIds.message}</p>
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
