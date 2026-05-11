import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import type { ComponentProps, ComponentType, ReactNode, SVGProps } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { Control, FieldPath } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import {
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Globe2,
  MapPin,
  Plane,
  Send,
  ShieldCheck,
  SmilePlus,
  Stamp,
} from 'lucide-react';

import travelAssets from '@/assets/boarding-form-travel-assets.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { assetUrl } from '@/lib/asset-url';
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
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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
    icon: SmilePlus,
    fields: ['fullName', 'age', 'email', 'languages', 'soloTravel', 'comfortZone'],
  },
  {
    id: 'professional',
    number: 2,
    title: 'Ton mood pro',
    icon: BriefcaseBusiness,
    fields: ['domains', 'internshipGoals', 'companyStyles', 'missionTypes'],
  },
  {
    id: 'workStyle',
    number: 3,
    title: 'Ton style au taf',
    icon: BrainCircuit,
    fields: ['workMode', 'workAmbience', 'selfView'],
  },
  {
    id: 'travel',
    number: 4,
    title: 'Tes vibes de voyage',
    icon: Globe2,
    fields: ['destinationPreference', 'englishLevel', 'travelAmbience'],
  },
  {
    id: 'practical',
    number: 5,
    title: 'Les infos pratiques',
    icon: CalendarDays,
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
            <div className="grid gap-5 lg:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="fullName" required>
                  Prénom &amp; Nom
                </FieldLabel>
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder="Ex : Aya Benali"
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
                  placeholder="Ex : 21"
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
                  placeholder="Ex : aya@email.com"
                  aria-invalid={Boolean(errors.email)}
                  className={inputClassName}
                  {...register('email')}
                />
                <FieldError message={errors.email?.message} />
              </Field>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
              <CheckboxGroup
                control={control}
                name="languages"
                label="Tu parles quelle(s) langue(s) ?"
                options={toOptions(options.languages)}
                error={errors.languages?.message}
                required
                className="grid-cols-2 sm:grid-cols-4 lg:grid-cols-4"
              />

              <RadioOptions
                control={control}
                name="soloTravel"
                label="T’as déjà voyagé seul(e) ?"
                options={toOptions(options.soloTravel)}
                error={errors.soloTravel?.message}
                required
                className="sm:grid-cols-3"
              />
            </div>

            <RatingScale control={control} error={errors.comfortZone?.message} />
          </>
        );

      case 'professional':
        return (
          <div className="grid gap-6 lg:grid-cols-2">
            <CheckboxGroup
              control={control}
              name="domains"
              label="Quel domaine kiffes tu ?"
              options={toOptions(options.domains)}
              error={errors.domains?.message}
              required
              className="sm:grid-cols-2"
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
              className="sm:grid-cols-2"
            />

            <CheckboxGroup
              control={control}
              name="missionTypes"
              label="Le type de missions que tu préfères ?"
              options={toOptions(options.missionTypes)}
              error={errors.missionTypes?.message}
              required
              className="sm:grid-cols-2"
            />
          </div>
        );

      case 'workStyle':
        return (
          <div className="grid gap-6 lg:grid-cols-3">
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
          <div className="grid gap-6 lg:grid-cols-3">
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
          <div className="space-y-6">
            <RadioOptions
              control={control}
              name="duration"
              label="Tu veux partir combien de temps ?"
              options={toOptions(options.duration)}
              error={errors.duration?.message}
              required
              className="sm:grid-cols-2 xl:grid-cols-4"
            />

            <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
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
                className="sm:grid-cols-2"
              />
            </div>

            <Field>
              <FieldLabel htmlFor="housingBudgetAmount" optional>
                Si oui, combien ?
              </FieldLabel>
              <Input
                id="housingBudgetAmount"
                placeholder="Ex : 300 € / mois"
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
                className="min-h-24 resize-none rounded-2xl border-[#DAD4C7] bg-white px-4 py-3 text-sm font-medium text-[#1A1F5C] shadow-sm placeholder:text-[#9498C4] focus-visible:border-[#2B35AF] focus-visible:ring-[#2B35AF]/20"
                {...register('notes')}
              />
              <FieldError message={errors.notes?.message} />
            </Field>
          </div>
        );
    }
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[#F5ECD7] px-4 py-8 text-[#1A1A2E] sm:px-6 sm:py-10 lg:px-8">
      <DecorativeLayer />

      <div className="relative z-10 mx-auto w-full max-w-[1100px]">
        <header className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-5 h-auto rounded-full border-[#2B35AF]/15 bg-white/60 px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#2B35AF]"
          >
            CANDIDATURE BOARDING
          </Badge>
          <p className="font-display text-sm font-semibold italic tracking-wide text-[#FF6B35] sm:text-base">
            On est là pour t’aider à décoller ✈️
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-[#07164C] sm:text-5xl lg:text-6xl">
            Parle-nous un peu de toi
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-[#1A1F5C]/75 sm:text-base">
            Ce petit formulaire nous aide à mieux te connaître pour te proposer le stage à l’étranger qui te correspond vraiment.
          </p>
        </header>

        <StepIndicator currentStep={currentStep} maxUnlockedStep={maxUnlockedStep} onStepSelect={(stepIndex) => void handleStepSelect(stepIndex)} />

        <form
          className="mt-8 space-y-5 sm:mt-10 sm:space-y-6"
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
          <FormSection step={String(activeStep.number)} title={activeStep.title} icon={activeStep.icon}>
            {renderStepFields()}
          </FormSection>

          <Card className="relative grid gap-5 overflow-visible rounded-[1.75rem] border border-[#2B35AF]/15 bg-white/95 p-5 text-[#1A1F5C] shadow-[0_20px_55px_-35px_rgba(26,31,92,0.55)] md:grid-cols-[minmax(160px,220px)_1fr_minmax(210px,290px)] md:items-center md:p-7">
            <Button
              type="button"
              variant="outline"
              disabled={currentStep === 0 || isSubmitting || isValidating}
              className="h-12 rounded-xl border-[#2B35AF] bg-white px-6 font-display text-sm font-bold text-[#2B35AF] hover:bg-[#2B35AF]/5 disabled:border-[#2B35AF]/25 disabled:text-[#2B35AF]/35"
              onClick={handlePrevious}
            >
              ← Retour
            </Button>

            <p className="flex items-start gap-3 text-xs font-medium leading-5 text-[#1A1F5C]/65 sm:text-sm">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-[#2B35AF]/20 bg-[#2B35AF]/5 text-[#2B35AF]">
                <ShieldCheck className="size-4" aria-hidden="true" />
              </span>
              Tes réponses sont confidentielles et utilisées uniquement pour te proposer le meilleur match.
            </p>

            <Button
              type={isLastStep ? 'submit' : 'button'}
              disabled={isSubmitting || isValidating}
              className="h-12 rounded-xl bg-[#0D4FE8] px-7 font-display text-sm font-bold tracking-wide text-white shadow-[0_14px_28px_-18px_rgba(13,79,232,0.85)] hover:bg-[#2B35AF]"
              onClick={isLastStep ? undefined : () => void handleNext()}
            >
              {isLastStep ? 'Envoyer mon profil →' : 'Suivant →'}
            </Button>

            <div
              className="pointer-events-none absolute -bottom-7 -right-10 hidden size-36 select-none bg-contain bg-center bg-no-repeat xl:block"
              style={{ backgroundImage: `url(${assetUrl(travelAssets)})` }}
              aria-hidden="true"
            />
          </Card>
        </form>
      </div>
    </main>
  );
}

const inputClassName =
  'h-11 rounded-2xl border-[#DAD4C7] bg-white px-4 text-sm font-medium text-[#1A1F5C] shadow-sm placeholder:text-[#9498C4] focus-visible:border-[#2B35AF] focus-visible:ring-[#2B35AF]/20';

function DecorativeLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-[-3rem] top-24 hidden h-32 w-44 rounded-[50%] border-2 border-dashed border-[#FF6B35]/30 sm:block" />
      <Plane className="absolute left-[10%] top-24 hidden size-10 rotate-[-18deg] text-[#FF6B35]/35 md:block" />
      <Send className="absolute left-[4%] top-44 hidden size-7 rotate-[-24deg] text-[#FF6B35]/35 lg:block" />

      <div className="absolute right-[-4rem] top-28 hidden size-44 rounded-full border border-[#FF6B35]/20 lg:block" />
      <Stamp className="absolute right-[8%] top-36 hidden size-20 rotate-[-12deg] text-[#FF6B35]/20 lg:block" />
      <span className="absolute right-[8.7%] top-[10.2rem] hidden rotate-[-12deg] font-mono text-[0.62rem] font-bold uppercase tracking-[0.15em] text-[#FF6B35]/30 lg:block">
        Ready for take-off
      </span>

      <MapPin className="absolute bottom-14 left-[3%] hidden size-11 text-[#FF6B35]/55 md:block" />
      <div className="absolute bottom-20 left-[-2rem] hidden h-24 w-44 rounded-[50%] border-2 border-dashed border-[#FF6B35]/35 md:block" />
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
      <ol className="mx-auto flex min-w-[700px] max-w-4xl items-start">
        {formSteps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isCompleted = index < maxUnlockedStep && !isCurrent;
          const isUnlocked = index <= maxUnlockedStep;
          const isClickable = isUnlocked && !isCurrent;
          const isConnectorComplete = index < maxUnlockedStep;

          return (
            <li key={step.id} className="relative flex flex-1 flex-col items-center text-center">
              {index < formSteps.length - 1 ? (
                <span className="absolute left-1/2 top-5 h-px w-full bg-[#CFC7B7]" aria-hidden="true">
                  <span className={cn('block h-full transition-colors', isConnectorComplete ? 'bg-[#0D4FE8]' : 'bg-[#CFC7B7]')} />
                </span>
              ) : null}
              <button
                type="button"
                disabled={!isClickable}
                className={cn(
                  'relative z-10 flex size-10 items-center justify-center rounded-full border bg-[#F5ECD7] font-mono text-sm font-bold transition-colors',
                  isCurrent && 'border-[#0D4FE8] bg-[#0D4FE8] text-white shadow-[0_10px_22px_-14px_rgba(13,79,232,0.9)]',
                  isCompleted && 'border-[#0D4FE8] bg-[#0D4FE8] text-white',
                  !isCurrent && !isCompleted && 'border-[#A7ABCA] text-[#1A1F5C]/75',
                  isClickable && 'hover:scale-[1.03] hover:border-[#0D4FE8]',
                  !isClickable && 'disabled:cursor-default'
                )}
                onClick={() => onStepSelect(index)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Étape ${step.number}: ${step.title}`}
              >
                {isCompleted ? <Check className="size-4" aria-hidden="true" /> : step.number}
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
  title,
  icon: Icon,
  children,
}: {
  step: string;
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  children: ReactNode;
}) {
  return (
    <Card className="grid overflow-hidden rounded-[1.75rem] border border-[#2B35AF]/15 bg-white/95 p-0 text-[#1A1F5C] shadow-[0_20px_55px_-35px_rgba(26,31,92,0.55)] lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="flex items-center gap-4 border-b border-[#2B35AF]/10 p-5 sm:p-6 lg:block lg:border-b-0 lg:border-r lg:p-8">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0D4FE8] font-mono text-sm font-bold text-white shadow-[0_10px_20px_-12px_rgba(13,79,232,0.9)]">
          {step}
        </span>
        <Icon className="size-9 shrink-0 text-[#0D4FE8] lg:mt-7" aria-hidden="true" />
        <h2 className="font-display text-2xl font-bold leading-tight tracking-[-0.04em] text-[#07164C] lg:mt-6 lg:text-3xl">{title}</h2>
      </aside>

      <div className="space-y-7 p-5 sm:p-7 lg:p-8">{children}</div>
    </Card>
  );
}

function Field({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('space-y-2', className)}>{children}</div>;
}

function FieldLabel({ children, required, optional, className, ...props }: ComponentProps<typeof Label> & { required?: boolean; optional?: boolean }) {
  return (
    <Label className={cn('text-xs font-extrabold leading-5 text-[#07164C]', className)} {...props}>
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
            <div className={cn('grid gap-2', className)}>
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
          <RadioGroup value={field.value} onValueChange={field.onChange} className={cn('grid gap-2', className)} aria-invalid={Boolean(error)}>
            {radioOptions.map((option) => {
              const id = createFieldId(name, option.value);
              const checked = field.value === option.value;

              return (
                <Label key={option.value} htmlFor={id} className={cn(optionCardClassName, checked && 'border-[#2B35AF] bg-[#2B35AF]/5 text-[#07164C]')}>
                  <RadioGroupItem id={id} value={option.value} aria-invalid={Boolean(error)} />
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
            className="grid grid-cols-5 overflow-hidden rounded-2xl border border-[#DAD4C7] bg-white shadow-sm"
            aria-invalid={Boolean(error)}
          >
            {ratingValues.map((value) => {
              const id = `comfort-zone-${value}`;
              const checked = field.value === value;

              return (
                <div key={value} className="border-r border-[#E7DFD0] last:border-r-0">
                  <RadioGroupItem id={id} value={value} className="sr-only" aria-invalid={Boolean(error)} />
                  <Label
                    htmlFor={id}
                    className={cn(
                      'flex h-11 items-center justify-center font-mono text-sm font-bold text-[#1A1F5C] transition-colors hover:bg-[#2B35AF]/5',
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

const optionCardClassName =
  'min-h-11 cursor-pointer rounded-xl border border-[#DAD4C7] bg-white px-3 py-2.5 text-xs font-bold leading-5 text-[#1A1F5C]/78 shadow-sm transition-colors hover:border-[#2B35AF]/45 hover:bg-[#2B35AF]/5';

function createFieldId(name: string, value: string) {
  return `${name}-${value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`;
}
