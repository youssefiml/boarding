import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { Control, FieldPath } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import {
  Check,
  Plane,
  ShieldCheck,
  Stamp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const requiredMessage = 'Ce champ est requis.';

const applicationSchema = z.object({
  fullName: z.string().trim().min(1, requiredMessage),
  age: z.string().trim().min(1, requiredMessage),
  email: z.string().trim().min(1, requiredMessage).email('Entre un email valide.'),
  languages: z.array(z.string()).min(1, requiredMessage),
  soloTravel: z.string().min(1, requiredMessage),
  comfortZone: z.string().min(1, requiredMessage),
  domains: z.array(z.string()).min(1, requiredMessage),
  internshipGoals: z.array(z.string()).min(1, requiredMessage),
  companyStyles: z.array(z.string()).min(1, requiredMessage),
  missionTypes: z.array(z.string()).min(1, requiredMessage),
  workMode: z.string().min(1, requiredMessage),
  workAmbience: z.string().min(1, requiredMessage),
  selfView: z.string().min(1, requiredMessage),
  destinationPreference: z.string().min(1, requiredMessage),
  englishLevel: z.string().min(1, requiredMessage),
  travelAmbience: z.string().min(1, requiredMessage),
  duration: z.string().min(1, requiredMessage),
  startDate: z.string().min(1, requiredMessage),
  hasHousingBudget: z.string().min(1, requiredMessage),
  housingBudgetAmount: z.string().max(80, 'Reste sous 80 caractères.').optional(),
  notes: z.string().max(500, 'Maximum 500 caractères.').optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;
type ApplicationFieldName = FieldPath<ApplicationFormValues>;
type CheckboxFieldName = 'languages' | 'domains' | 'internshipGoals' | 'companyStyles' | 'missionTypes';
type RadioFieldName =
  | 'soloTravel'
  | 'workMode'
  | 'workAmbience'
  | 'selfView'
  | 'destinationPreference'
  | 'englishLevel'
  | 'travelAmbience'
  | 'duration'
  | 'hasHousingBudget';
type StepId = 'personal' | 'professional' | 'workStyle' | 'travel' | 'practical';

type Option = {
  label: string;
  value: string;
};

type FormStep = {
  id: StepId;
  number: number;
  title: string;
  fields: readonly ApplicationFieldName[];
};

const options = {
  languages: ['Français', 'Anglais', 'Arabe', 'Other'],
  soloTravel: ['Oui, souvent !', 'Une ou deux fois', 'Jamais encore'],
  domains: ['Marketing / Com’', 'Dév / IT', 'Tourisme / Hôtellerie', 'Éducation / Social', 'ONG / Humanitaire', 'Finance / Gestion'],
  internshipGoals: ['Découvrir un nouveau domaine', 'Gagner de l’expérience', 'Choper un job derrière 😎'],
  companyStyles: ['Start-up cool', 'Petite entreprise locale', 'Grande boîte'],
  missionTypes: ['Technique', 'Créatif', 'Humain / relationnel', 'Un peu de tout, je suis open'],
  workMode: ['En équipe', 'Seul(e) tranquille', 'Ça dépend de l’ambiance'],
  workAmbience: ['Calme et structuré', 'Dynamique et rythmé', 'Libre et flexible'],
  selfView: ['Organisé(e)', 'Créatif(ve)', 'Sociable', 'Persévérant(e)'],
  destinationPreference: ['Maroc — ambiance francophone', 'Afrique du Sud — ambiance anglophone & internationale', 'Je suis open aux deux !'],
  englishLevel: ['Débutant', 'Intermédiaire', 'Avancé'],
  travelAmbience: ['City life', 'Nature & chill', 'Mix des deux'],
  duration: ['1 mois', '2-3 mois', '6 mois ou plus', 'Je sais pas encore'],
  hasHousingBudget: ['Oui', 'Non'],
} satisfies Record<string, readonly string[]>;

const formSteps = [
  {
    id: 'personal',
    number: 1,
    title: 'Toi, en quelques mots',
    fields: ['fullName', 'age', 'email', 'languages', 'soloTravel', 'comfortZone'],
  },
  {
    id: 'professional',
    number: 2,
    title: 'Ton mood pro',
    fields: ['domains', 'internshipGoals', 'companyStyles', 'missionTypes'],
  },
  {
    id: 'workStyle',
    number: 3,
    title: 'Ton style au taf',
    fields: ['workMode', 'workAmbience', 'selfView'],
  },
  {
    id: 'travel',
    number: 4,
    title: 'Tes vibes de voyage',
    fields: ['destinationPreference', 'englishLevel', 'travelAmbience'],
  },
  {
    id: 'practical',
    number: 5,
    title: 'Les infos pratiques',
    fields: ['duration', 'startDate', 'hasHousingBudget', 'housingBudgetAmount', 'notes'],
  },
] as const satisfies readonly FormStep[];

const ratingValues = ['1', '2', '3', '4', '5'] as const;

const toOptions = (items: readonly string[]): Option[] => items.map((item) => ({ label: item, value: item }));

const defaultValues: ApplicationFormValues = {
  fullName: '',
  age: '',
  email: '',
  languages: [],
  soloTravel: '',
  comfortZone: '',
  domains: [],
  internshipGoals: [],
  companyStyles: [],
  missionTypes: [],
  workMode: '',
  workAmbience: '',
  selfView: '',
  destinationPreference: '',
  englishLevel: '',
  travelAmbience: '',
  duration: '',
  startDate: '',
  hasHousingBudget: '',
  housingBudgetAmount: '',
  notes: '',
};

export function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);
  const {
    control,
    handleSubmit,
    register,
    trigger,
    formState: { errors, isSubmitting, isValidating },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const notesValue = useWatch({ control, name: 'notes' }) ?? '';
  const activeStep = formSteps[currentStep] ?? formSteps[0];
  const isLastStep = currentStep === formSteps.length - 1;
  const canGoBack = currentStep > 0;

  const validateStep = async (stepIndex: number) => {
    const step = formSteps[stepIndex];

    if (!step) {
      return false;
    }

    return trigger([...step.fields], { shouldFocus: true });
  };

  const handleNext = async () => {
    const isCurrentStepValid = await validateStep(currentStep);

    if (!isCurrentStepValid) {
      return;
    }

    const nextStep = Math.min(currentStep + 1, formSteps.length - 1);
    setMaxUnlockedStep((value) => Math.max(value, nextStep));
    setCurrentStep(nextStep);
  };

  const handlePrevious = () => {
    setCurrentStep((value) => Math.max(value - 1, 0));
  };

  const handleStepSelect = async (targetStep: number) => {
    if (targetStep === currentStep || targetStep > maxUnlockedStep) {
      return;
    }

    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    const fieldsBeforeTarget = formSteps.slice(0, targetStep).flatMap((step) => [...step.fields]);
    const arePreviousStepsValid = await trigger(fieldsBeforeTarget, { shouldFocus: true });

    if (arePreviousStepsValid) {
      setCurrentStep(targetStep);
    }
  };

  const onSubmit = (values: ApplicationFormValues) => {
    const firstName = values.fullName.trim().split(/\s+/)[0] || 'ton profil';
    toast.success(`Merci ${firstName}, ton profil a bien été envoyé.`);
  };

  const renderStepFields = () => {
    switch (activeStep.id) {
      case 'personal':
        return (
          <>
            <div className="space-y-5">
              <Field>
                <FieldLabel htmlFor="fullName" required>
                  Prénom &amp; Nom
                </FieldLabel>
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder="Aya Benali"
                  aria-invalid={Boolean(errors.fullName)}
                  className={inputClassName}
                  {...register('fullName')}
                />
                <FieldError message={errors.fullName?.message} />
              </Field>

              <Field>
                <FieldLabel htmlFor="age" required>
                  Ton âge
                </FieldLabel>
                <Input
                  id="age"
                  inputMode="numeric"
                  placeholder="21"
                  aria-invalid={Boolean(errors.age)}
                  className={inputClassName}
                  {...register('age')}
                />
                <FieldError message={errors.age?.message} />
              </Field>

              <Field>
                <FieldLabel htmlFor="email" required>
                  Ton email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="aya@email.com"
                  aria-invalid={Boolean(errors.email)}
                  className={inputClassName}
                  {...register('email')}
                />
                <FieldError message={errors.email?.message} />
              </Field>
            </div>

            <div className="space-y-5">
              <CheckboxGroup
                control={control}
                name="languages"
                label="Tu parles quelle(s) langue(s) ?"
                options={toOptions(options.languages)}
                error={errors.languages?.message}
                required
              />

              <RadioOptions
                control={control}
                name="soloTravel"
                label="T’as déjà voyagé seul(e) ?"
                options={toOptions(options.soloTravel)}
                error={errors.soloTravel?.message}
                required
              />
            </div>

            <RatingScale control={control} error={errors.comfortZone?.message} />
          </>
        );

      case 'professional':
        return (
          <div className="space-y-5">
            <CheckboxGroup
              control={control}
              name="domains"
              label="Quel domaine kiffes tu ?"
              options={toOptions(options.domains)}
              error={errors.domains?.message}
              required
            />

            <CheckboxGroup
              control={control}
              name="internshipGoals"
              label="Ton objectif avec ce stage ?"
              options={toOptions(options.internshipGoals)}
              error={errors.internshipGoals?.message}
              required
            />

            <CheckboxGroup
              control={control}
              name="companyStyles"
              label="Le style d’entreprise qui te tente le plus ?"
              options={toOptions(options.companyStyles)}
              error={errors.companyStyles?.message}
              required
            />

            <CheckboxGroup
              control={control}
              name="missionTypes"
              label="Le type de missions que tu préfères ?"
              options={toOptions(options.missionTypes)}
              error={errors.missionTypes?.message}
              required
            />
          </div>
        );

      case 'workStyle':
        return (
          <div className="space-y-5">
            <RadioOptions
              control={control}
              name="workMode"
              label="Tu bosses mieux..."
              options={toOptions(options.workMode)}
              error={errors.workMode?.message}
              required
            />

            <RadioOptions
              control={control}
              name="workAmbience"
              label="Ambiance de rêve au boulot ?"
              options={toOptions(options.workAmbience)}
              error={errors.workAmbience?.message}
              required
            />

            <RadioOptions
              control={control}
              name="selfView"
              label="Comment te vois-tu ?"
              options={toOptions(options.selfView)}
              error={errors.selfView?.message}
              required
            />
          </div>
        );

      case 'travel':
        return (
          <div className="space-y-5">
            <RadioOptions
              control={control}
              name="destinationPreference"
              label="Cap ou pas cap ? Tu préfères aller..."
              options={toOptions(options.destinationPreference)}
              error={errors.destinationPreference?.message}
              required
            />

            <RadioOptions
              control={control}
              name="englishLevel"
              label="Ton niveau en anglais ?"
              options={toOptions(options.englishLevel)}
              error={errors.englishLevel?.message}
              required
            />

            <RadioOptions
              control={control}
              name="travelAmbience"
              label="Ambiance que tu préfères ?"
              options={toOptions(options.travelAmbience)}
              error={errors.travelAmbience?.message}
              required
            />
          </div>
        );

      case 'practical':
        return (
          <div className="space-y-5">
            <RadioOptions
              control={control}
              name="duration"
              label="Tu veux partir combien de temps ?"
              options={toOptions(options.duration)}
              error={errors.duration?.message}
              required
            />

            <div className="space-y-5">
              <Field>
                <FieldLabel htmlFor="startDate" required>
                  T’es dispo à partir de quand ?
                </FieldLabel>
                <Input
                  id="startDate"
                  type="date"
                  placeholder="Sélectionne une date"
                  aria-invalid={Boolean(errors.startDate)}
                  className={inputClassName}
                  {...register('startDate')}
                />
                <FieldError message={errors.startDate?.message} />
              </Field>

              <RadioOptions
                control={control}
                name="hasHousingBudget"
                label="T’as un budget logement ?"
                options={toOptions(options.hasHousingBudget)}
                error={errors.hasHousingBudget?.message}
                required
              />
            </div>

            <Field>
              <FieldLabel htmlFor="housingBudgetAmount" optional>
                Si oui, combien ?
              </FieldLabel>
              <Input
                id="housingBudgetAmount"
                placeholder="300 € / mois"
                aria-invalid={Boolean(errors.housingBudgetAmount)}
                className={inputClassName}
                {...register('housingBudgetAmount')}
              />
              <FieldError message={errors.housingBudgetAmount?.message} />
            </Field>

            <Field>
              <div className="flex items-center justify-between gap-3">
                <FieldLabel htmlFor="notes" optional>
                  Une précision à ajouter ? Une envie particulière ?
                </FieldLabel>
                <span className="font-mono text-[0.68rem] font-semibold text-[#9498C4]">{notesValue.length}/500</span>
              </div>
              <Textarea
                id="notes"
                maxLength={500}
                placeholder="Dis-nous tout ! Toute info utile pour te trouver le stage parfait ✨"
                aria-invalid={Boolean(errors.notes)}
                className={cn(
                  'min-h-20 resize-none rounded-xl border-[#DAD4C7] bg-white px-3.5 py-2.5 text-sm font-medium text-[#1A1F5C] shadow-sm placeholder:text-[#9498C4] hover:border-[#BDB5A5]',
                  controlFocusClassName
                )}
                {...register('notes')}
              />
              <FieldError message={errors.notes?.message} />
            </Field>
          </div>
        );
    }
  };

  const actionFooter = (
    <div className={cn('grid gap-3 md:items-center md:gap-4', canGoBack ? 'md:grid-cols-[minmax(120px,150px)_1fr_auto]' : 'md:grid-cols-[1fr_auto]')}>
      {canGoBack ? (
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || isValidating}
          className={secondaryActionButtonClassName}
          onClick={handlePrevious}
        >
          ← Retour
        </Button>
      ) : null}

      <p className="order-3 flex items-start gap-2.5 text-[0.72rem] font-medium leading-5 text-[#1A1F5C]/58 sm:text-xs md:order-none">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-[#0D4FE8]/10 bg-[#0D4FE8]/5 text-[#0D4FE8]/85">
          <ShieldCheck className="size-4" strokeWidth={1.9} aria-hidden="true" />
        </span>
        Tes réponses sont confidentielles et utilisées uniquement pour te proposer le meilleur match.
      </p>

      <Button
        type={isLastStep ? 'submit' : 'button'}
        disabled={isSubmitting || isValidating}
        className={primaryActionButtonClassName}
        onClick={isLastStep ? undefined : () => void handleNext()}
      >
        {isLastStep ? 'Envoyer mon profil →' : 'Suivant →'}
      </Button>
    </div>
  );

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#F5ECD7] px-4 py-8 text-[#1A1A2E] sm:px-6 sm:py-10 lg:px-8">
      <DecorativeLayer />

      <div className="relative z-10 mx-auto w-full max-w-[940px]">
        <header className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center justify-center gap-3 text-[#FF6B35]">
            <span className="inline-flex text-base font-extrabold uppercase tracking-[0.18em] sm:text-lg">
              Parcours Boarding
            </span>
            <Plane
              className="h-3.5 w-3.5 -rotate-12"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>
          <h1 className="mt-5 text-[clamp(1.6rem,3.2vw,3.25rem)] font-extrabold leading-tight text-[#1A1F5C]">
            Ton parcours Boarding, étape par étape
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-[#1A1F5C]/75 sm:text-base">
            Ce petit formulaire nous aide à mieux te connaître pour te proposer le stage à l’étranger qui te correspond vraiment.
          </p>
        </header>

        <StepIndicator currentStep={currentStep} maxUnlockedStep={maxUnlockedStep} onStepSelect={(stepIndex) => void handleStepSelect(stepIndex)} />

        <form
          className="mt-7 space-y-4 sm:mt-9 sm:space-y-5"
          onSubmit={
            isLastStep
              ? handleSubmit(onSubmit)
              : (event) => {
                  event.preventDefault();
                  void handleNext();
                }
          }
          noValidate
        >
          <FormSection step={activeStep} footer={actionFooter}>
            {renderStepFields()}
          </FormSection>
        </form>
      </div>
    </main>
  );
}

const controlFocusClassName =
  'focus-visible:border-[#2B35AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B35AF]/20 focus-visible:ring-offset-0 aria-invalid:ring-1 aria-invalid:ring-[#C2412D]/15';

const inputClassName = cn(
  'h-10 rounded-xl border-[#DAD4C7] bg-white px-3.5 text-sm font-medium text-[#1A1F5C] shadow-sm placeholder:text-[#9498C4] hover:border-[#BDB5A5]',
  controlFocusClassName
);

const actionButtonFocusClassName =
  'focus-visible:border-[#2B35AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B35AF]/20 focus-visible:ring-offset-0';

const primaryActionButtonClassName = cn(
  'order-1 h-11 w-auto min-w-[144px] justify-self-end rounded-xl border border-transparent bg-brand-600 px-5 font-display text-sm font-bold tracking-wide text-white shadow-[0_12px_24px_-20px_rgba(29,79,208,0.72)] transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-[0_16px_28px_-22px_rgba(29,79,208,0.78)] active:translate-y-px active:bg-brand-800 active:shadow-none disabled:translate-y-0 disabled:bg-brand-600/55 disabled:shadow-none md:order-none',
  actionButtonFocusClassName
);

const secondaryActionButtonClassName = cn(
  'order-2 h-11 w-auto min-w-[120px] justify-self-end rounded-xl border-[#2B35AF]/70 bg-white px-4 font-display text-sm font-bold text-[#2B35AF] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#2B35AF] hover:bg-[#2B35AF]/5 active:translate-y-px active:bg-[#2B35AF]/10 disabled:translate-y-0 disabled:border-[#2B35AF]/20 disabled:bg-white disabled:text-[#2B35AF]/35 disabled:shadow-none md:order-none md:justify-self-start',
  actionButtonFocusClassName
);

function DecorativeLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Plane
        className="absolute left-[7%] top-24 hidden size-9 -rotate-12 text-[#FF6B35]/25 lg:block"
        strokeWidth={1.8}
      />
      <Stamp
        className="absolute right-[8%] top-32 hidden size-16 -rotate-12 text-[#0D4FE8]/20 lg:block"
        strokeWidth={1.8}
      />
    </div>
  );
}

function StepIndicator({
  currentStep,
  maxUnlockedStep,
  onStepSelect,
}: {
  currentStep: number;
  maxUnlockedStep: number;
  onStepSelect: (stepIndex: number) => void;
}) {
  return (
    <nav className="mt-8 overflow-x-auto pb-2 sm:mt-10" aria-label="Progression du formulaire">
      <ol className="mx-auto flex min-w-[680px] max-w-4xl items-start">
        {formSteps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isCompleted = index < maxUnlockedStep && !isCurrent;
          const isUnlocked = index <= maxUnlockedStep;
          const isClickable = isUnlocked && !isCurrent;
          const isConnectorComplete = index < maxUnlockedStep;

          return (
            <li key={step.id} className="relative flex flex-1 flex-col items-center text-center">
              {index < formSteps.length - 1 ? (
                <span className="absolute left-1/2 top-[18px] h-px w-full bg-[#CFC7B7]" aria-hidden="true">
                  <span className={cn('block h-full transition-colors', isConnectorComplete ? 'bg-[#0D4FE8]' : 'bg-[#CFC7B7]')} />
                </span>
              ) : null}
              <button
                type="button"
                disabled={!isClickable}
                className={cn(
                  'relative z-10 flex size-9 items-center justify-center rounded-full border bg-[#F5ECD7] font-mono text-[0.8rem] font-bold transition-colors',
                  isCurrent && 'border-[#0D4FE8] bg-[#0D4FE8] text-white shadow-[0_8px_18px_-14px_rgba(13,79,232,0.9)]',
                  isCompleted && 'border-[#0D4FE8] bg-[#0D4FE8] text-white',
                  !isCurrent && !isCompleted && 'border-[#A7ABCA] text-[#1A1F5C]/75',
                  isClickable && 'hover:border-[#0D4FE8]',
                  !isClickable && 'disabled:cursor-default'
                )}
                onClick={() => onStepSelect(index)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Étape ${step.number}: ${step.title}`}
              >
                {isCompleted ? <Check className="size-3.5" strokeWidth={2.2} aria-hidden="true" /> : step.number}
              </button>
              <span className={cn('mt-3 max-w-32 text-xs font-bold leading-4', isCurrent ? 'text-[#1A1F5C]' : 'text-[#1A1F5C]/60')}>
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function FormSection({
  step,
  footer,
  children,
}: {
  step: FormStep;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-[1.5rem] border border-[#2B35AF]/15 bg-white/95 p-0 text-[#1A1F5C] shadow-[0_20px_55px_-35px_rgba(26,31,92,0.55)]">
      <div className="mx-auto w-full max-w-[680px] p-5 sm:p-6 lg:p-7 lg:pb-6">
        <div className="mb-5">
          <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#9498C4]">
            Étape {String(step.number).padStart(2, '0')}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-[#07164C] sm:text-3xl">
            {step.title}
          </h2>
        </div>

        <div className="space-y-5">{children}</div>
      </div>
      <div className="border-t border-[#2B35AF]/10 bg-[#FBF8EF]/45">
        <div className="mx-auto w-full max-w-[680px] px-5 py-4 sm:px-6 lg:px-7">{footer}</div>
      </div>
    </Card>
  );
}

function Field({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('space-y-2.5', className)}>{children}</div>;
}

function FieldLabel({ children, required, optional, className, ...props }: ComponentProps<typeof Label> & { required?: boolean; optional?: boolean }) {
  return (
    <Label className={cn('text-sm font-bold leading-5 text-[#07164C]', className)} {...props}>
      <span>{children}</span>
      {required ? <span className="text-[#FF6B35]">*</span> : null}
      {optional ? <span className="text-[0.68rem] font-semibold italic text-[#1A1F5C]/45">(optionnel)</span> : null}
    </Label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-semibold text-[#C2412D]">{message}</p>;
}

function CheckboxGroup({
  control,
  name,
  label,
  options: checkboxOptions,
  error,
  required,
  className,
}: {
  control: Control<ApplicationFormValues>;
  name: CheckboxFieldName;
  label: string;
  options: Option[];
  error?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <Field>
      <FieldLabel required={required}>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const selectedValues = Array.isArray(field.value) ? field.value : [];

          return (
            <div className={cn('space-y-2.5', className)}>
              {checkboxOptions.map((option) => {
                const id = createFieldId(name, option.value);
                const checked = selectedValues.includes(option.value);

                return (
                  <Label
                    key={option.value}
                    htmlFor={id}
                    className={cn(optionCardClassName, checked && 'border-[#2B35AF] bg-[#2B35AF]/5 text-[#07164C]')}
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      aria-invalid={Boolean(error)}
                      className={optionControlClassName}
                      onCheckedChange={(nextChecked) => {
                        const nextValues = nextChecked
                          ? [...selectedValues, option.value]
                          : selectedValues.filter((value) => value !== option.value);
                        field.onChange(nextValues);
                      }}
                    />
                    <span>{option.label}</span>
                  </Label>
                );
              })}
            </div>
          );
        }}
      />
      <FieldError message={error} />
    </Field>
  );
}

function RadioOptions({
  control,
  name,
  label,
  options: radioOptions,
  error,
  required,
  className,
}: {
  control: Control<ApplicationFormValues>;
  name: RadioFieldName;
  label: string;
  options: Option[];
  error?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <Field>
      <FieldLabel required={required}>{label}</FieldLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup value={field.value} onValueChange={field.onChange} className={cn('space-y-2.5', className)} aria-invalid={Boolean(error)}>
            {radioOptions.map((option) => {
              const id = createFieldId(name, option.value);
              const checked = field.value === option.value;

              return (
                <Label key={option.value} htmlFor={id} className={cn(optionCardClassName, checked && 'border-[#2B35AF] bg-[#2B35AF]/5 text-[#07164C]')}>
                  <RadioGroupItem id={id} value={option.value} className={optionControlClassName} aria-invalid={Boolean(error)} />
                  <span>{option.label}</span>
                </Label>
              );
            })}
          </RadioGroup>
        )}
      />
      <FieldError message={error} />
    </Field>
  );
}

function RatingScale({ control, error }: { control: Control<ApplicationFormValues>; error?: string }) {
  return (
    <Field>
      <FieldLabel required>Sortir de ta zone de confort, c’est...</FieldLabel>
      <Controller
        control={control}
        name="comfortZone"
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="grid grid-cols-5 overflow-hidden rounded-xl border border-[#DAD4C7] bg-white shadow-sm"
            aria-invalid={Boolean(error)}
          >
            {ratingValues.map((value) => {
              const id = `comfort-zone-${value}`;
              const checked = field.value === value;

              return (
                <div
                  key={value}
                  className="border-r border-[#E7DFD0] last:border-r-0 focus-within:relative focus-within:z-10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#2B35AF]/20"
                >
                  <RadioGroupItem id={id} value={value} className="sr-only focus-visible:ring-0" aria-invalid={Boolean(error)} />
                  <Label
                    htmlFor={id}
                    className={cn(
                      'flex h-10 items-center justify-center font-mono text-sm font-bold text-[#1A1F5C] transition-colors hover:bg-[#2B35AF]/5',
                      checked && 'bg-[#2B35AF] text-white hover:bg-[#2B35AF]'
                    )}
                  >
                    {value}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        )}
      />
      <div className="flex items-center justify-between gap-4 px-2 text-[0.7rem] font-semibold italic text-[#1A1F5C]/55">
        <span>1 = Pas trop mon truc</span>
        <span>5 = J’adore ça !</span>
      </div>
      <FieldError message={error} />
    </Field>
  );
}

const optionControlClassName =
  'focus-visible:border-[#2B35AF] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:ring-0';

const optionCardClassName =
  'min-h-10 cursor-pointer items-start gap-2.5 rounded-xl border border-[#DAD4C7] bg-white px-3 py-2 text-[0.82rem] font-semibold leading-5 text-[#1A1F5C]/78 shadow-sm transition-colors hover:border-[#BDB5A5] hover:bg-[#2B35AF]/5 focus-within:border-[#2B35AF] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#2B35AF]/15 focus-within:ring-offset-0';

function createFieldId(name: string, value: string) {
  return `${name}-${value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`;
}
