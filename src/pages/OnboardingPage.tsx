import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { profileApi } from '@/api/modules/profile.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { ROUTES } from '@/app/routes';
import { onboardingSchema } from '@/features/onboarding/schemas';
import { EducationStep } from '@/features/onboarding/steps/EducationStep';
import { PersonalInfoStep } from '@/features/onboarding/steps/PersonalInfoStep';
import { PreferencesStep } from '@/features/onboarding/steps/PreferencesStep';
import { defaultOnboardingValues, onboardingSteps } from '@/features/onboarding/types';
import type { OnboardingFormValues } from '@/features/onboarding/types';
import { cn } from '@/lib/cn';
import { formatDateTime } from '@/lib/date';
import { useOnboardingStore } from '@/stores/onboarding.store';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { ProgressBar } from '@/ui/ProgressBar/ProgressBar';

const stepComponents = [PersonalInfoStep, EducationStep, PreferencesStep] as const;

const stepValidationSchemas = [
  onboardingSchema.pick({ firstName: true, lastName: true, email: true, phone: true }),
  onboardingSchema.pick({ educationLevel: true, fieldOfStudy: true, graduationYear: true }),
  onboardingSchema.pick({ preferredCountry: true, preferredIndustry: true, languages: true, housingSupportNeeded: true, bio: true }),
] as const;

const stepSectionTitles = ['Personal details', 'Academic details', 'Placement preferences'] as const;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, '').length >= 7;
}

function isValidGraduationYear(value: string) {
  if (!/^\d{4}$/.test(value)) {
    return false;
  }

  const year = Number(value);
  return year >= 1990 && year <= 2100;
}

function completionPercentage(values: OnboardingFormValues) {
  const checks = [
    values.firstName.trim().length >= 2,
    values.lastName.trim().length >= 2,
    isValidEmail(values.email.trim()),
    isValidPhone(values.phone),
    values.fieldOfStudy.trim().length >= 2,
    isValidGraduationYear(values.graduationYear.trim()),
    values.preferredCountry.trim().length >= 2,
    values.preferredIndustry.trim().length >= 2,
    values.languages.trim().length >= 2,
    values.bio.trim().length >= 20,
  ];

  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

export function OnboardingPage() {
  const navigate = useNavigate();

  const currentStep = useOnboardingStore((state) => state.currentStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const draft = useOnboardingStore((state) => state.draft);
  const mergeDraft = useOnboardingStore((state) => state.mergeDraft);
  const resetDraft = useOnboardingStore((state) => state.resetDraft);
  const updatedAt = useOnboardingStore((state) => state.updatedAt);

  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>(updatedAt ? 'saved' : 'idle');
  const [completedMessage, setCompletedMessage] = useState<string | null>(null);

  const autosaveTimerRef = useRef<number | null>(null);
  const completionTimerRef = useRef<number | null>(null);

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

  const liveValues = useMemo<OnboardingFormValues>(() => {
    return {
      ...defaultOnboardingValues,
      ...(watchedValues ?? {}),
    };
  }, [watchedValues]);

  useEffect(() => {
    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    const savingIndicatorTimer = window.setTimeout(() => {
      setSaveState('saving');
    }, 0);

    autosaveTimerRef.current = window.setTimeout(() => {
      mergeDraft(liveValues);
      setSaveState('saved');
    }, 450);

    return () => {
      window.clearTimeout(savingIndicatorTimer);

      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [liveValues, mergeDraft]);

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
      }

      if (completionTimerRef.current) {
        window.clearTimeout(completionTimerRef.current);
      }
    };
  }, []);

  const safeCurrentStep = Math.max(0, Math.min(currentStep, onboardingSteps.length - 1));
  const step = onboardingSteps[safeCurrentStep];
  const StepComponent = stepComponents[safeCurrentStep];
  const isLastStep = safeCurrentStep === onboardingSteps.length - 1;

  const stepValidity = useMemo(() => {
    return stepValidationSchemas.map((schema) => schema.safeParse(liveValues).success);
  }, [liveValues]);

  const isCurrentStepValid = stepValidity[safeCurrentStep];
  const isFormValid = onboardingSchema.safeParse(liveValues).success;

  const profileCompletion = useMemo(() => completionPercentage(liveValues), [liveValues]);
  const stepProgress = Math.round(((safeCurrentStep + 1) / onboardingSteps.length) * 100);

  const saveStatusLabel =
    saveState === 'saving' ? 'Saving...' : updatedAt || saveState === 'saved' ? 'All changes saved' : 'Not saved yet';

  const handleNextStep = useCallback(async () => {
    const isValid = await trigger([...step.fields]);

    if (!isValid) {
      return;
    }

    setCompletedMessage(`Step ${safeCurrentStep + 1} completed`);

    if (completionTimerRef.current) {
      window.clearTimeout(completionTimerRef.current);
    }

    completionTimerRef.current = window.setTimeout(() => {
      setCompletedMessage(null);
    }, 1800);

    setCurrentStep(Math.min(onboardingSteps.length - 1, safeCurrentStep + 1));
  }, [safeCurrentStep, setCurrentStep, step.fields, trigger]);

  const handlePreviousStep = useCallback(() => {
    setCurrentStep(Math.max(0, safeCurrentStep - 1));
  }, [safeCurrentStep, setCurrentStep]);

  const onSubmit = useCallback(async (values: OnboardingFormValues) => {
    try {
      await profileApi.updateProfile(values);
      resetDraft();
      setSaveState('saved');
      toast.success('Profile submitted. You are ready for matching.');
      navigate(ROUTES.dashboard);
    } catch {
      toast.error('Unable to submit onboarding right now.');
    }
  }, [navigate, resetDraft]);

  const handlePrimaryAction = useCallback(() => {
    if (isLastStep) {
      void handleSubmit(onSubmit)();
      return;
    }

    void handleNextStep();
  }, [handleNextStep, handleSubmit, isLastStep, onSubmit]);

  const nextStepTitle = onboardingSteps[safeCurrentStep + 1]?.title;
  const primaryLabel = isLastStep ? 'Complete onboarding' : `Continue to ${nextStepTitle}`;
  const primaryDisabled = isLastStep ? !isFormValid || isSubmitting : !isCurrentStepValid;

  return (
    <div>
      <PageHeader
        title="Onboarding"
        subtitle="Complete your profile with guided steps designed to maximize completion and match quality."
      />

      <div className="grid gap-5 pb-24 sm:pb-0 xl:grid-cols-[minmax(0,720px)_280px] xl:justify-center">
        <div className="mx-auto w-full max-w-[720px] space-y-4 xl:mx-0">
          <section className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/85 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">Step {safeCurrentStep + 1} of {onboardingSteps.length}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{step.title}</h2>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile {profileCompletion}% complete</p>
            </div>

            <ol className="mt-4 flex items-start" aria-label="Onboarding steps">
              {onboardingSteps.map((stepItem, index) => {
                const isCurrent = index === safeCurrentStep;
                const isCompleted = index < safeCurrentStep && stepValidity[index];

                return (
                  <li
                    key={stepItem.id}
                    className="relative flex-1 px-1"
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {index < onboardingSteps.length - 1 ? (
                      <span
                        className={cn(
                          'absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-[18px] h-px',
                          index < safeCurrentStep ? 'bg-brand-500 dark:bg-brand-400' : 'bg-slate-300 dark:bg-slate-700'
                        )}
                        aria-hidden
                      />
                    ) : null}

                    <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                      <span
                        className={cn(
                          'grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold transition-colors',
                          isCompleted
                            ? 'border-brand-500 bg-brand-500 text-white dark:border-brand-400 dark:bg-brand-400'
                            : isCurrent
                              ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/20 dark:text-brand-200'
                              : 'border-slate-300 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400'
                        )}
                      >
                        {isCompleted ? (
                          <span className="h-2.5 w-1.5 -translate-y-[1px] rotate-45 border-b-2 border-r-2 border-current" aria-hidden />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-medium leading-5',
                          isCurrent ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'
                        )}
                      >
                        {stepItem.title}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>

            <ProgressBar className="mt-4" value={stepProgress} />

            <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300" aria-live="polite">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  saveState === 'saving' ? 'animate-pulse bg-amber-400' : 'bg-emerald-500'
                )}
                aria-hidden
              />
              <span>{saveStatusLabel}</span>
              {updatedAt ? (
                <span
                  className="inline-flex h-5 min-w-5 cursor-help items-center justify-center rounded-full border border-slate-300 text-[10px] font-semibold text-slate-500 dark:border-slate-600 dark:text-slate-300"
                  title={`Last saved ${formatDateTime(updatedAt)}`}
                  aria-label={`Last saved ${formatDateTime(updatedAt)}`}
                >
                  i
                </span>
              ) : null}
            </div>

            {completedMessage ? (
              <p
                className="mt-3 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 animate-fade-in-up dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
                role="status"
                aria-live="polite"
              >
                {completedMessage}
              </p>
            ) : null}
          </section>

          <form
            className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/85 sm:p-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">{step.id}</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{stepSectionTitles[safeCurrentStep]}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
            </div>

            <StepComponent register={register} errors={errors} watch={watch} setValue={setValue} />

            <div className="mt-6 hidden items-end justify-between gap-4 sm:flex">
              <Button
                type="button"
                variant="ghost"
                onClick={handlePreviousStep}
                disabled={safeCurrentStep === 0}
              >
                Back
              </Button>

              <div className="text-right">
                <Button
                  type="button"
                  onClick={handlePrimaryAction}
                  disabled={primaryDisabled}
                  isLoading={isSubmitting && isLastStep}
                >
                  {primaryLabel}
                </Button>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">You can edit this later.</p>
              </div>
            </div>

            <button type="submit" className="sr-only" tabIndex={-1} aria-hidden>
              Submit
            </button>
          </form>
        </div>

        <aside className="hidden xl:block">
          <Card className="p-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Why we ask this</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Accurate information improves your match score and interview chances. Your profile is evaluated by agencies and recruiters.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Profile strength meter</p>
              <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{profileCompletion}%</p>
              <ProgressBar className="mt-2" value={profileCompletion} />
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
                Strong completion helps prioritize your profile in matching.
              </li>
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
                Clear preferences reduce interview delays and back-and-forth.
              </li>
              <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
                You can update every field later from Profile.
              </li>
            </ul>
          </Card>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-3 shadow-lg backdrop-blur sm:hidden dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto flex w-full max-w-[720px] items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            className="shrink-0"
            onClick={handlePreviousStep}
            disabled={safeCurrentStep === 0}
          >
            Back
          </Button>

          <div className="min-w-0 flex-1">
            <Button
              type="button"
              className="w-full"
              onClick={handlePrimaryAction}
              disabled={primaryDisabled}
              isLoading={isSubmitting && isLastStep}
            >
              {primaryLabel}
            </Button>
            <p className="mt-1 text-center text-[11px] text-slate-500 dark:text-slate-400">You can edit this later.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

