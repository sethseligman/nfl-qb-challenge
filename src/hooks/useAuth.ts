import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Setting up auth listener');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('useAuth: Auth state changed:', {
        user: user ? 'authenticated' : 'anonymous',
        uid: user?.uid
      });
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log('useAuth: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  return { user, loading };
}; 