import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/lib/constants';
import type { AuthSession } from '@/types/api';
import type { StudentUser } from '@/types/domain';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: StudentUser | null;
  setSession: (session: AuthSession) => void;
  updateUser: (userPatch: Partial<StudentUser>) => void;
  updateAccessToken: (accessToken: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: (session) => {
        set({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          user: session.user,
        });
      },
      updateUser: (userPatch) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...userPatch,
              }
            : state.user,
        }));
      },
      updateAccessToken: (accessToken) => {
        set({ accessToken });
      },
      clearSession: () => {
        set({ accessToken: null, refreshToken: null, user: null });
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
