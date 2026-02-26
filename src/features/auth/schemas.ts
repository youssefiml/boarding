import { z } from 'zod';
import { normalizeAuthEmail, normalizeAuthPassword, normalizePersonName } from '@/features/auth/normalization';

export const authEmailSchema = z
  .string()
  .transform((value) => normalizeAuthEmail(value))
  .pipe(z.string().min(1, 'Email is required').email('Enter a valid email address'));

export const authPasswordSchema = z
  .string()
  .transform((value) => normalizeAuthPassword(value))
  .pipe(z.string().min(8, 'Password must contain at least 8 characters'));

const fullNameSchema = z
  .string()
  .transform((value) => normalizePersonName(value))
  .pipe(z.string().min(2, 'Full name is required'));

export const loginSchema = z.object({
  email: authEmailSchema,
  password: authPasswordSchema,
});

export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    email: authEmailSchema,
    password: authPasswordSchema,
    acceptTerms: z.boolean(),
  })
  .superRefine((values, context) => {
    if (!/[A-Z]/.test(values.password)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Password must include at least 1 uppercase letter',
      });
    }

    if (!/\d/.test(values.password)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Password must include at least 1 number',
      });
    }

    if (!values.acceptTerms) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['acceptTerms'],
        message: 'You must accept Terms and Privacy',
      });
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
