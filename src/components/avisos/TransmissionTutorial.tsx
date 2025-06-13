
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export const TransmissionTutorial: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-blue-600 text-sm">
          <HelpCircle className="w-4 h-4 mr-1" />
          Não sabe como criar?
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Como criar uma Lista de Transmissão:</h4>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            <li>Abra o WhatsApp</li>
            <li>Vá no menu (três pontinhos)</li>
            <li>Toque em "Nova transmissão"</li>
            <li>Selecione os membros do ministério</li>
            <li>Envie a mensagem copiada 👌</li>
          </ol>
          <div className="text-xs text-gray-500 mt-2">
            💡 A lista de transmissão permite enviar a mesma mensagem para várias pessoas de uma vez!
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
