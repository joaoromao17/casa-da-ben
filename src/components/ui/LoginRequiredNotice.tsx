
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, X } from "lucide-react";

interface LoginRequiredNoticeProps {
  message: string;
  onClose?: () => void;
}

const LoginRequiredNotice = ({ message, onClose }: LoginRequiredNoticeProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 slide-in-from-right-4">
      <Card className="w-80 shadow-lg border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Login Necessário</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-red-700 mb-4">
            {message}
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleLogin}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Fazer Login
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-100"
            >
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginRequiredNotice;
