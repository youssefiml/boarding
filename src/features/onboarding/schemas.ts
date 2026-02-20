import { z } from 'zod';

export const onboardingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Phone is required'),
  educationLevel: z.enum(['high_school', 'bachelor', 'master', 'other']),
  fieldOfStudy: z.string().min(2, 'Field of study is required'),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, 'Use YYYY format')
    .refine((value) => {
      const year = Number(value);
      return year >= 1990 && year <= 2100;
    }, 'Enter a realistic graduation year'),
  preferredCountry: z.string().min(2, 'Preferred country is required'),
  preferredIndustry: z.string().min(2, 'Preferred industry is required'),
  languages: z.string().min(2, 'Language info is required'),
  housingSupportNeeded: z.boolean(),
  bio: z.string().min(20, 'Bio must contain at least 20 characters').max(500, 'Bio max is 500 characters'),
});

export type OnboardingSchemaValues = z.infer<typeof onboardingSchema>;
