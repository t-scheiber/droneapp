'use client';

import { AuthProvider, useAuth } from './auth-context';
import { Login } from './login';
import { PDFViewer } from './pdf-viewer';

function AppContent() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-50" aria-busy="true" />;
  }

  if (status === 'signed-out') {
    return <Login />;
  }

  return <PDFViewer role={status} />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
