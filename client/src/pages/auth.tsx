import React from 'react';
import { useLocation } from 'wouter';
import AuthButtons from '@/components/auth/AuthButtons';
import { User } from 'firebase/auth';

export default function AuthPage() {
  const [, setLocation] = useLocation();

  const handleAuthSuccess = (user: User) => {
    console.log('[AUTH PAGE] Authentication successful:', user.email);
    // Redirect to home page after successful authentication
    setLocation('/home');
  };

  const handleAuthError = (error: Error) => {
    console.error('[AUTH PAGE] Authentication error:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthButtons
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
        />
      </div>
    </div>
  );
}