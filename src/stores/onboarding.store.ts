import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { defaultOnboardingValues } from '@/features/onboarding/types';
import { STORAGE_KEYS } from '@/lib/constants';
import type { OnboardingFormValues } from '@/features/onboarding/types';

interface OnboardingState {
  currentStep: number;
  draft: OnboardingFormValues;
  updatedAt: string | null;
  setCurrentStep: (step: number) => void;
  mergeDraft: (values: Partial<OnboardingFormValues>) => void;
  resetDraft: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      draft: defaultOnboardingValues,
      updatedAt: null,
      setCurrentStep: (step) => {
        set({ currentStep: step });
      },
      mergeDraft: (values) => {
        set((state) => ({
          draft: {
            ...state.draft,
            ...values,
          },
          updatedAt: new Date().toISOString(),
        }));
      },
      resetDraft: () => {
        set({
          currentStep: 0,
          draft: defaultOnboardingValues,
          updatedAt: null,
        });
      },
    }),
    {
      name: STORAGE_KEYS.onboardingDraft,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        draft: state.draft,
        updatedAt: state.updatedAt,
      }),
    }
  )
);
