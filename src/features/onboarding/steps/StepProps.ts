import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

import type { OnboardingFormValues } from '@/features/onboarding/types';

export interface OnboardingStepProps {
  register: UseFormRegister<OnboardingFormValues>;
  errors: FieldErrors<OnboardingFormValues>;
  watch: UseFormWatch<OnboardingFormValues>;
  setValue: UseFormSetValue<OnboardingFormValues>;
}
