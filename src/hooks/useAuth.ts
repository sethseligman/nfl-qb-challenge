import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

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

  const login = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const register = async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  return { user, loading, login, register, logout };
}; 