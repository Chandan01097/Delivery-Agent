import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  mobile: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (mobile: string, name: string) => void;
  logout: () => void;
  setPendingUser: (mobile: string, name: string) => void;
  pendingUser: { mobile: string; name: string } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pendingUser, setPendingUserState] = useState<{ mobile: string; name: string } | null>(null);

  const login = (mobile: string, name: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      mobile,
      name,
    };
    setUser(newUser);
    setPendingUserState(null);
  };

  const logout = () => {
    setUser(null);
    setPendingUserState(null);
  };

  const setPendingUser = (mobile: string, name: string) => {
    setPendingUserState({ mobile, name });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      setPendingUser,
      pendingUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}