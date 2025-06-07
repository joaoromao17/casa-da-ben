
import React, { createContext, useContext, ReactNode } from 'react';
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser, isLoading } = useCurrentUser();
  
  const isAuthenticated = !!currentUser && !!localStorage.getItem("authToken");

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
