'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

export type Role = 'demo' | 'owner';
type Status = 'loading' | 'signed-out' | Role;

interface AuthContextType {
  status: Status;
  login: (passphrase: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The passphrase is checked by /api/session on the server. The browser only
// learns the resulting role; the session itself is an httpOnly cookie.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    // Left over from the old client-side login.
    localStorage.removeItem('pdf-viewer-auth');

    fetch('/api/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data: { role: Role | null }) => setStatus(data.role ?? 'signed-out'))
      .catch(() => setStatus('signed-out'));
  }, []);

  const login = useCallback(async (passphrase: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      });
      if (!response.ok) return false;
      const data: { role: Role } = await response.json();
      setStatus(data.role);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/session', { method: 'DELETE' }).catch(() => undefined);
    setStatus('signed-out');
  }, []);

  return <AuthContext.Provider value={{ status, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
