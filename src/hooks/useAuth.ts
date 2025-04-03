import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInAnonymously
} from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Setting up auth listener');
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('useAuth: Auth state changed:', user ? 'authenticated' : 'no user');
      
      if (user) {
        console.log('useAuth: User exists, setting user state');
        setUser(user);
        setLoading(false);
      } else {
        console.log('useAuth: No user, attempting anonymous sign in');
        try {
          const anonymousUser = await signInAnonymously(auth);
          console.log('useAuth: Anonymous sign in successful:', anonymousUser.user.uid);
          setUser(anonymousUser.user);
        } catch (error) {
          console.error('useAuth: Anonymous sign in error:', error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      console.log('useAuth: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('useAuth: User logged in:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('useAuth: Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('useAuth: User registered:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('useAuth: Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('useAuth: User logged out');
    } catch (error) {
      console.error('useAuth: Logout error:', error);
      throw error;
    }
  };

  return { user, loading, login, register, logout };
}; 