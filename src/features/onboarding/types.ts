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
    description: 'Basic details used by recruiters and placement agents.',
    fields: ['firstName', 'lastName', 'email', 'phone'] as const,
  },
  {
    id: 'education',
    title: 'Academic profile',
    description: 'Your education and specialization fit.',
    fields: ['educationLevel', 'fieldOfStudy', 'graduationYear'] as const,
  },
  {
    id: 'preferences',
    title: 'Placement preferences',
    description: 'Country, industry and practical support expectations.',
    fields: ['preferredCountry', 'preferredIndustry', 'languages', 'housingSupportNeeded', 'bio'] as const,
  },
] as const;
