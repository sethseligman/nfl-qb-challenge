import { create } from 'zustand';

interface User {
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  signIn: async (email: string, password: string) => {
    // For now, we'll just set the user without actual authentication
    // In a real app, you would validate the password here
    if (email && password) {
      set({ user: { email } });
    }
  },
  signOut: async () => {
    // Implement your sign-out logic here
    set({ user: null });
  },
})); 