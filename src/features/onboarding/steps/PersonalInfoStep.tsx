import { useMemo } from 'react';

import type { OnboardingStepProps } from '@/features/onboarding/steps/StepProps';
import { Input } from '@/ui/Input/Input';

const COUNTRY_PREFIXES = [
  { prefix: '+1', label: 'United States / Canada' },
  { prefix: '+33', label: 'France' },
  { prefix: '+34', label: 'Spain' },
  { prefix: '+39', label: 'Italy' },
  { prefix: '+44', label: 'United Kingdom' },
  { prefix: '+49', label: 'Germany' },
  { prefix: '+212', label: 'Morocco' },
  { prefix: '+216', label: 'Tunisia' },
  { prefix: '+971', label: 'United Arab Emirates' },
];

function formatPhoneNumber(value: string) {
  const trimmed = value.trim();
  const hasPlusPrefix = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  const chunks = digits.match(/.{1,3}/g) ?? [digits];
  return `${hasPlusPrefix ? '+' : ''}${chunks.join(' ')}`;
}

function detectCountryFromPhone(value: string) {
  const normalized = value.replace(/\s+/g, '');

  if (!normalized.startsWith('+')) {
    return null;
  }

  return COUNTRY_PREFIXES.find((item) => normalized.startsWith(item.prefix)) ?? null;
}

export function PersonalInfoStep({ register, errors, watch, setValue }: OnboardingStepProps) {
  const phoneValue = watch('phone') ?? '';

  const detectedCountry = useMemo(() => {
    return detectCountryFromPhone(phoneValue);
  }, [phoneValue]);

  const phoneRegistration = register('phone', {
    onBlur: (event) => {
      const formatted = formatPhoneNumber(event.target.value);
      setValue('phone', formatted, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });

  return (
    <div className="app-form-grid">
      <Input label="First name" placeholder="Sara" {...register('firstName')} error={errors.firstName?.message} />
      <Input label="Last name" placeholder="Meyer" {...register('lastName')} error={errors.lastName?.message} />
      <Input
        label="Email"
        type="email"
        placeholder="sara@example.com"
        {...register('email')}
        error={errors.email?.message}
        hint={!errors.email ? 'Validation runs when you leave the field.' : undefined}
      />
      <Input
        label="Phone"
        placeholder="+1 555 010 999"
        {...phoneRegistration}
        error={errors.phone?.message}
        hint={
          errors.phone
            ? undefined
            : detectedCountry
              ? `Detected country: ${detectedCountry.label}`
              : 'Include country code for faster profile review.'
        }
      />
    </div>
  );
}
