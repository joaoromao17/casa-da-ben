
import { useState, useEffect } from 'react';

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      console.log('Decoded JWT payload:', decodedPayload);
      
      // Extrai o email do campo 'sub' e outros dados disponíveis
      const userEmail = decodedPayload.sub || decodedPayload.email || "";
      const userId = decodedPayload.userId || decodedPayload.id || 0;
      
      setCurrentUser({
        id: Number(userId) || 0,
        name: decodedPayload.name || "",
        email: userEmail,
        roles: decodedPayload.roles || []
      });
      
      console.log('Current user set to:', {
        id: Number(userId) || 0,
        name: decodedPayload.name || "",
        email: userEmail,
        roles: decodedPayload.roles || []
      });
      
    } catch (error) {
      console.error("Error decoding token:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { currentUser, isLoading };
};
