import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onUser } from '@/lib/firebase';

interface FirebaseAuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {}
});

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onUser((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      console.log('[FIREBASE AUTH PROVIDER] User state updated:', {
        isAuthenticated: !!currentUser,
        uid: currentUser?.uid,
        email: currentUser?.email
      });
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { signOut } = await import('@/lib/firebase');
    await signOut();
  };

  const value = {
    user,
    loading,
    signOut: handleSignOut
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};