import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/lib/constants';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

function getInitialThemeMode(): ThemeMode {
  return 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: getInitialThemeMode(),
      setMode: (mode) => {
        set({ mode });
      },
      toggleMode: () => {
        set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' }));
      },
    }),
    {
      name: STORAGE_KEYS.theme,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
      }),
    }
  )
);

