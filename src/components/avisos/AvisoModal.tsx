
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AvisoForm } from './AvisoForm';

interface AvisoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ministryId?: string;
}

export const AvisoModal: React.FC<AvisoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  ministryId
}) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Aviso</DialogTitle>
        </DialogHeader>
        <AvisoForm
          onSuccess={handleSuccess}
          onCancel={onClose}
          ministryId={ministryId}
        />
      </DialogContent>
    </Dialog>
  );
};
