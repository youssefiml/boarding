import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { authApi } from '@/api/modules/auth.api';
import { normalizeApiError } from '@/api/client';
import { ROUTES } from '@/app/routes';
import { AuthField } from '@/features/auth/components/AuthField';
import { AuthFormShell } from '@/features/auth/components/AuthFormShell';
import { AuthPasswordField } from '@/features/auth/components/AuthPasswordField';
import { AuthPrimaryButton } from '@/features/auth/components/AuthPrimaryButton';
import { normalizeAuthEmail, normalizeRegisterPayload, splitFullName } from '@/features/auth/normalization';
import { registerSchema } from '@/features/auth/schemas';
import type { RegisterFormValues } from '@/features/auth/schemas';
import { useAuthStore } from '@/stores/auth.store';

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  });

  const passwordValue = useWatch({
    control,
    name: 'password',
  }) ?? '';

  const passwordChecks = {
    minLength: passwordValue.length >= 8,
    hasNumber: /\d/.test(passwordValue),
    hasUppercase: /[A-Z]/.test(passwordValue),
  };

  const onSubmit = async (values: RegisterFormValues) => {
    clearErrors('root');
    const { firstName, lastName } = splitFullName(values.fullName);
    const normalizedPayload = normalizeRegisterPayload({
      firstName,
      lastName,
      email: normalizeAuthEmail(values.email),
      password: values.password,
    });

    try {
      const session = await authApi.register(normalizedPayload);
      setSession(session);
      toast.success('Account created. Let us build your profile.');
      navigate(ROUTES.onboarding, { replace: true });
    } catch (error) {
      const message = normalizeApiError(error);

      if (message.includes('already exists')) {
        setError('email', {
          type: 'server',
          message,
        });
        return;
      }

      setError('root', {
        type: 'server',
        message,
      });
    }
  };

  return (
    <AuthFormShell
      title="Create your account"
      subtitle="Start your placement journey in minutes."
      footer={
        <>
          Already registered?{' '}
          <Link className="font-semibold text-brand-700 hover:text-brand-800" to={ROUTES.login}>
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthField label="Full name" placeholder="Sara Meyer" {...register('fullName')} error={errors.fullName?.message} />

        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="name@email.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <AuthPasswordField
          label="Password"
          autoComplete="new-password"
          placeholder="********"
          hint="Use 8+ characters, 1 number, 1 uppercase letter"
          {...register('password')}
          error={errors.password?.message}
        />

        <ul className="space-y-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
          <li className={passwordChecks.minLength ? 'text-emerald-700' : ''}>8+ characters</li>
          <li className={passwordChecks.hasNumber ? 'text-emerald-700' : ''}>1 number</li>
          <li className={passwordChecks.hasUppercase ? 'text-emerald-700' : ''}>1 uppercase letter</li>
        </ul>

        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            {...register('acceptTerms')}
          />
          <span>
            I agree to{' '}
            <a href="mailto:support@boarding.dev?subject=Terms%20request" className="font-semibold text-brand-700 hover:text-brand-800">
              Terms
            </a>{' '}
            and{' '}
            <a href="mailto:support@boarding.dev?subject=Privacy%20request" className="font-semibold text-brand-700 hover:text-brand-800">
              Privacy
            </a>
          </span>
        </label>
        {errors.acceptTerms?.message ? <p className="text-xs font-medium text-rose-700">{errors.acceptTerms.message}</p> : null}
        {errors.root?.message ? <p className="text-sm font-medium text-rose-700">{errors.root.message}</p> : null}

        <AuthPrimaryButton className="mt-1" type="submit" isLoading={isSubmitting}>
          Create account
        </AuthPrimaryButton>
      </form>
    </AuthFormShell>
  );
}
