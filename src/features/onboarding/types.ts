import type { StudentProfile } from '@/types/domain';

export type OnboardingFormValues = Omit<StudentProfile, 'id' | 'completion'>;

export const defaultOnboardingValues: OnboardingFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  educationLevel: 'bachelor',
  fieldOfStudy: '',
  graduationYear: '',
  preferredCountry: '',
  preferredIndustry: '',
  languages: '',
  housingSupportNeeded: false,
  bio: '',
};

export const onboardingSteps = [
  {
    id: 'personal',
    title: 'Personal information',
    description:
      'Recruiters use this information to evaluate your profile. Make sure it is accurate and up to date.',
    fields: ['firstName', 'lastName', 'email', 'phone'] as const,
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Your academic background helps us align you with companies that match your learning track.',
    fields: ['educationLevel', 'fieldOfStudy', 'graduationYear'] as const,
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Define your destination, industry, and support needs so your matching quality improves.',
    fields: ['preferredCountry', 'preferredIndustry', 'languages', 'housingSupportNeeded', 'bio'] as const,
  },
] as const;
