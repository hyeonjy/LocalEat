import { UserType } from '@/types/Auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
