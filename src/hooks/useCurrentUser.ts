
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
      
      // Tenta diferentes campos onde o ID pode estar no token
      const userId = decodedPayload.userId || decodedPayload.id || decodedPayload.sub;
      
      setCurrentUser({
        id: Number(userId), // Garante que é um número
        name: decodedPayload.name || "",
        email: decodedPayload.email || "",
        roles: decodedPayload.roles || []
      });
      
      console.log('Current user set to:', {
        id: Number(userId),
        name: decodedPayload.name || "",
        email: decodedPayload.email || "",
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
