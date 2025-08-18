import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  loginWithGoogle,
  loginWithApple,
  loginWithFacebook,
  loginWithTwitter,
  logout,
  onUser
} from '@/lib/firebase';

interface AuthButtonsProps {
  onAuthSuccess?: (user: User) => void;
  onAuthError?: (error: Error) => void;
  className?: string;
}

const providerConfig = {
  google: {
    name: 'Google',
    icon: '🔍',
    bgColor: 'bg-red-500 hover:bg-red-600',
    textColor: 'text-white',
    action: loginWithGoogle
  },
  apple: {
    name: 'Apple',
    icon: '🍎',
    bgColor: 'bg-black hover:bg-gray-800',
    textColor: 'text-white',
    action: loginWithApple
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    bgColor: 'bg-blue-600 hover:bg-blue-700',
    textColor: 'text-white',
    action: loginWithFacebook
  },
  twitter: {
    name: 'X (Twitter)',
    icon: '🐦',
    bgColor: 'bg-black hover:bg-gray-800',
    textColor: 'text-white',
    action: loginWithTwitter
  }
};

export default function AuthButtonsSimple({ onAuthSuccess, onAuthError, className }: AuthButtonsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onUser((currentUser) => {
      setUser(currentUser);
      console.log('[AUTH] User state changed:', currentUser?.email || 'signed out');
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (providerName: keyof typeof providerConfig) => {
    const config = providerConfig[providerName];
    setLoading(providerName);

    try {
      const result = await config.action();
      
      toast({
        title: "Sign in successful",
        description: `Welcome, ${result.user.displayName || result.user.email}!`,
      });

      onAuthSuccess?.(result.user);
    } catch (error: any) {
      console.error(`[AUTH] Sign in error with ${providerName}:`, error);
      
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      toast({
        title: `${config.name} sign in failed`,
        description: errorMessage,
        variant: "destructive",
      });

      onAuthError?.(error);
    } finally {
      setLoading(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      console.error('[AUTH] Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  if (user) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Welcome, {user.displayName || 'User'}!
          </CardTitle>
          <div className="text-sm text-gray-600">
            {user.email}
          </div>
          {user.photoURL && (
            <div className="flex justify-center mt-2">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-gray-200"
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Signed in with: {user.providerData[0]?.providerId || 'Unknown'}
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Sign in to VeganMapAI
        </CardTitle>
        <p className="text-gray-600">
          Choose your preferred sign-in method
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-3">
          {Object.entries(providerConfig).map(([key, config]) => (
            <Button
              key={key}
              variant="default"
              className={`${config.bgColor} ${config.textColor} w-full h-12 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95`}
              onClick={() => handleSignIn(key as keyof typeof providerConfig)}
              disabled={loading === key}
            >
              <span className="mr-2 text-lg">{config.icon}</span>
              {loading === key ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </div>
              ) : (
                `Continue with ${config.name}`
              )}
            </Button>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
}