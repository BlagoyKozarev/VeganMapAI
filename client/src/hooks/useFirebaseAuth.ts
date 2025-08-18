import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onUser, getCurrentUser } from '@/lib/firebase';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export const useFirebaseAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onUser((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      setError(null);
    });

    // Check if user is already signed in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
};