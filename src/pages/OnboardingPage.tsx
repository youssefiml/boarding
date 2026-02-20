import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { profileApi } from '@/api/modules/profile.api';
import { ROUTES } from '@/app/routes';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { Button } from '@/ui/Button/Button';
import { ProgressBar } from '@/ui/ProgressBar/ProgressBar';
import { EducationStep } from '@/features/onboarding/steps/EducationStep';
import { PersonalInfoStep } from '@/features/onboarding/steps/PersonalInfoStep';
import { PreferencesStep } from '@/features/onboarding/steps/PreferencesStep';
import { onboardingSchema } from '@/features/onboarding/schemas';
import { onboardingSteps } from '@/features/onboarding/types';
import type { OnboardingFormValues } from '@/features/onboarding/types';
import { formatDateTime } from '@/lib/date';
import { useOnboardingStore } from '@/stores/onboarding.store';

const stepComponents = [PersonalInfoStep, EducationStep, PreferencesStep] as const;

export function OnboardingPage() {
  const navigate = useNavigate();

  const currentStep = useOnboardingStore((state) => state.currentStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const draft = useOnboardingStore((state) => state.draft);
  const mergeDraft = useOnboardingStore((state) => state.mergeDraft);
  const resetDraft = useOnboardingStore((state) => state.resetDraft);
  const updatedAt = useOnboardingStore((state) => state.updatedAt);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: draft,
    mode: 'onBlur',
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      mergeDraft(watchedValues);
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mergeDraft, watchedValues]);

  const step = onboardingSteps[currentStep];
  const StepComponent = stepComponents[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNextStep = useCallback(async () => {
    const isValid = await trigger([...step.fields]);

    if (!isValid) {
      return;
    }

    setCurrentStep(Math.min(onboardingSteps.length - 1, currentStep + 1));
  }, [currentStep, setCurrentStep, step.fields, trigger]);

  const handlePreviousStep = useCallback(() => {
    setCurrentStep(Math.max(0, currentStep - 1));
  }, [currentStep, setCurrentStep]);

  const saveDraftManually = useCallback(() => {
    mergeDraft(watchedValues);
    toast.success('Draft saved');
  }, [mergeDraft, watchedValues]);

  const onSubmit = async (values: OnboardingFormValues) => {
    try {
      await profileApi.updateProfile(values);
      resetDraft();
      toast.success('Profile submitted. You are ready for matching.');
      navigate(ROUTES.dashboard);
    } catch {
      toast.error('Unable to submit onboarding right now.');
    }
  };

  const updatedAtLabel = useMemo(() => {
    if (!updatedAt) {
      return 'Not saved yet';
    }

    return `Autosaved ${formatDateTime(updatedAt)}`;
  }, [updatedAt]);

  return (
    <div>
      <PageHeader
        title="Onboarding"
        subtitle="Complete your profile in 3 guided steps with autosave enabled."
        action={
          <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={saveDraftManually}>
            Save draft
          </Button>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4 dark:border-slate-700 dark:bg-slate-800/65">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
            Step {currentStep + 1} of {onboardingSteps.length}: {step.title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-300">{updatedAtLabel}</p>
        </div>
        <ProgressBar className="mt-3" value={progress} />
      </div>

      <form className="mt-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">{step.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
        </div>

        <StepComponent register={register} errors={errors} watch={watch} setValue={setValue} />

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            Back
          </Button>

          {!isLastStep ? (
            <Button type="button" className="w-full sm:w-auto" onClick={() => void handleNextStep()}>
              Continue
            </Button>
          ) : (
            <Button type="submit" className="w-full sm:w-auto" isLoading={isSubmitting}>
              Submit onboarding
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}


