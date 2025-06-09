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
  
  const isAuthenticated = !!currentUser && !!sessionStorage.getItem("authToken");

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
