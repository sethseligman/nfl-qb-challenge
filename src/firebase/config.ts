import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('Firebase Config:', { ...firebaseConfig, apiKey: '[HIDDEN]' });

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    console.log('Attempting Google sign in...');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign in successful:', result.user.email);
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error.code, error.message);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log('Attempting email sign in...');
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('Email sign in successful:', result.user.email);
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with email:', error.code, error.message);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    console.log('Attempting email sign up...');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Email sign up successful:', result.user.email);
    return result.user;
  } catch (error: any) {
    console.error('Error signing up with email:', error.code, error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    console.log('Attempting sign out...');
    await signOut(auth);
    console.log('Sign out successful');
  } catch (error: any) {
    console.error('Error signing out:', error.code, error.message);
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    console.log('Checking current user...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      console.log('Current user:', user ? user.email : 'none');
      resolve(user);
    }, (error) => {
      console.error('Error getting current user:', error);
      reject(error);
    });
  });
}; 