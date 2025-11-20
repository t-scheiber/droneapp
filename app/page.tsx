'use client';

import { AuthProvider, useAuth } from './auth-context';
import { Login } from './login';
import { PDFViewer } from './pdf-viewer';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <PDFViewer />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
