
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorAlert = ({ 
  title = "Erro", 
  message, 
  onRetry 
}: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="my-8">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
        {onRetry && (
          <div className="mt-4">
            <Button 
              onClick={onRetry}
              variant="outline"
            >
              Tentar novamente
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
