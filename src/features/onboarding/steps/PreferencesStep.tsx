import { Input } from '@/ui/Input/Input';
import { TextArea } from '@/ui/TextArea/TextArea';
import type { OnboardingStepProps } from '@/features/onboarding/steps/StepProps';

export function PreferencesStep({ register, errors, watch, setValue }: OnboardingStepProps) {
  const housingSupportNeeded = watch('housingSupportNeeded');

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Preferred country"
        placeholder="Germany"
        className="sm:col-span-2"
        {...register('preferredCountry')}
        error={errors.preferredCountry?.message}
      />
      <Input
        label="Preferred industry"
        placeholder="Hospitality"
        className="sm:col-span-2"
        {...register('preferredIndustry')}
        error={errors.preferredIndustry?.message}
      />
      <Input
        label="Languages"
        placeholder="English, French"
        className="sm:col-span-2"
        {...register('languages')}
        error={errors.languages?.message}
      />
      <label className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300 text-brand-600 dark:border-slate-500"
          checked={housingSupportNeeded}
          onChange={(event) => {
            setValue('housingSupportNeeded', event.target.checked, { shouldDirty: true });
          }}
        />
        I need housing support after placement
      </label>
      <TextArea
        label="Short bio"
        className="sm:col-span-2"
        placeholder="Tell us about your strengths, motivation and internship goals."
        {...register('bio')}
        error={errors.bio?.message}
      />
    </div>
  );
}

