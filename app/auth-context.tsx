'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (passphrase: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const authStatus = localStorage.getItem('pdf-viewer-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (passphrase: string): boolean => {
    // Get passphrase from environment variable (embedded at build time for static export)
    const correctPassphrase = process.env.NEXT_PUBLIC_DRONE_PASSPHRASE;

    if (!correctPassphrase) {
      console.error('NEXT_PUBLIC_DRONE_PASSPHRASE environment variable is not set');
      return false;
    }

    // Case-insensitive comparison
    if (passphrase.toLowerCase().trim() === correctPassphrase.toLowerCase().trim()) {
      setIsAuthenticated(true);
      localStorage.setItem('pdf-viewer-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pdf-viewer-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
