import { create } from 'zustand';

interface UiState {
  pendingRequests: number;
  lastError: string | null;
  startRequest: () => void;
  endRequest: () => void;
  setError: (message: string) => void;
  clearError: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  pendingRequests: 0,
  lastError: null,
  startRequest: () => {
    set((state) => ({ pendingRequests: state.pendingRequests + 1 }));
  },
  endRequest: () => {
    set((state) => ({ pendingRequests: Math.max(0, state.pendingRequests - 1) }));
  },
  setError: (message) => {
    set({ lastError: message });
  },
  clearError: () => {
    set({ lastError: null });
  },
}));
