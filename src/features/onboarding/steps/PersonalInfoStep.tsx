import { Input } from '@/ui/Input/Input';
import type { OnboardingStepProps } from '@/features/onboarding/steps/StepProps';

export function PersonalInfoStep({ register, errors }: OnboardingStepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input label="First name" placeholder="Sara" {...register('firstName')} error={errors.firstName?.message} />
      <Input label="Last name" placeholder="Meyer" {...register('lastName')} error={errors.lastName?.message} />
      <Input
        label="Email"
        type="email"
        placeholder="sara@example.com"
        className="sm:col-span-2"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Phone"
        placeholder="+1 555 010 999"
        className="sm:col-span-2"
        {...register('phone')}
        error={errors.phone?.message}
      />
    </div>
  );
}

