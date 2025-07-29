
import { useState, useEffect } from 'react';
import api from "@/services/api";
import { getAccessToken } from "@/utils/authHelper";
import { clearAuthData } from "@/utils/authHelper";


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
    const token = getAccessToken();;

    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/users/profile");
        setCurrentUser(response.data);
        console.log("Usuário logado via /users/profile:", response.data);
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
