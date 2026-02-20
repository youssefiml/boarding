import { Input } from '@/ui/Input/Input';
import { Select } from '@/ui/Select/Select';
import type { OnboardingStepProps } from '@/features/onboarding/steps/StepProps';

export function EducationStep({ register, errors }: OnboardingStepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select
        label="Education level"
        className="sm:col-span-2"
        {...register('educationLevel')}
        error={errors.educationLevel?.message}
      >
        <option value="high_school">High school</option>
        <option value="bachelor">Bachelor</option>
        <option value="master">Master</option>
        <option value="other">Other</option>
      </Select>
      <Input
        label="Field of study"
        placeholder="Computer Science"
        className="sm:col-span-2"
        {...register('fieldOfStudy')}
        error={errors.fieldOfStudy?.message}
      />
      <Input
        label="Graduation year"
        inputMode="numeric"
        maxLength={4}
        placeholder="2027"
        className="sm:col-span-2"
        {...register('graduationYear')}
        error={errors.graduationYear?.message}
      />
    </div>
  );
}

