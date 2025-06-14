
import { useState, useEffect } from 'react';

interface Ministry {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  meetingDay: string;
  atividades: string[];
  wall: any;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  ministries?: Ministry[];
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

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar usuário");

      const user = await response.json();
      setCurrentUser(user); // Já virá com id, name, email, roles e ministries
      console.log("Usuário logado via /users/profile:", user);
    } catch (error) {
      console.error("Erro ao buscar usuário atual:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUser();
}, []);

  return { currentUser, isLoading };
};
