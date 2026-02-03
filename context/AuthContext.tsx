import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCredentials: (username: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { data } = useData();

  useEffect(() => {
    const storedAuth = localStorage.getItem('technova_auth');
    if (storedAuth) {
      // Re-hydrate user session
      const parsedUser = JSON.parse(storedAuth);
      // Verify user still exists in data
      const found = data.users?.find(u => u.username === parsedUser.username);
      if (found) {
          setUser({ ...found, isAuthenticated: true });
      } else {
          logout(); // User deleted remotely
      }
    }
  }, [data.users]); // Re-run if users change

  const login = (username: string, pass: string): boolean => {
    // Check against users in DataContext
    const foundUser = data.users?.find(u => u.username === username && u.password === pass);
    
    if (foundUser) {
      const authUser = { ...foundUser, isAuthenticated: true };
      setUser(authUser);
      localStorage.setItem('technova_auth', JSON.stringify(authUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('technova_auth');
  };

  const updateCredentials = (username: string, pass: string) => {
      // This is now legacy/wrapper for the Settings update, kept for compatibility
      // Real update happens in DataContext via Settings page now.
      console.log('Credential update handled via Data Context users array');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};