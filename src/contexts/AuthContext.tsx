
// AuthContext.tsx

import React, { createContext, ReactNode } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface AuthContextType {
  currentUser: {
    id: number;
    name: string;
    email: string;
    roles: string[];
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, isLoading } = useCurrentUser();
  
  // Verifica tanto localStorage quanto sessionStorage para o token
  const hasToken = !!(localStorage.getItem("authToken") || sessionStorage.getItem("authToken"));
  const isAuthenticated = !!currentUser && hasToken;

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};