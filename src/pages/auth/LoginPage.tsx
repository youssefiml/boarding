import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { authApi } from '@/api/modules/auth.api';
import { normalizeApiError } from '@/api/client';
import { ROUTES } from '@/app/routes';
import { AuthField } from '@/features/auth/components/AuthField';
import { AuthFormShell } from '@/features/auth/components/AuthFormShell';
import { AuthPasswordField } from '@/features/auth/components/AuthPasswordField';
import { AuthPrimaryButton } from '@/features/auth/components/AuthPrimaryButton';
import { normalizeLoginPayload } from '@/features/auth/normalization';
import { loginSchema } from '@/features/auth/schemas';
import type { LoginFormValues } from '@/features/auth/schemas';
import { useAuthStore } from '@/stores/auth.store';

const DEV_QUICK_LOGIN = {
  email: 'student@boarding.dev',
  password: 'admin1234',
} as const;

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const normalizedValues = normalizeLoginPayload(values);
    clearErrors('root');

    if (
      import.meta.env.DEV &&
      normalizedValues.email === DEV_QUICK_LOGIN.email &&
      normalizedValues.password === DEV_QUICK_LOGIN.password
    ) {
      setSession({
        accessToken: 'dev-access-token',
        refreshToken: 'dev-refresh-token',
        user: {
          id: 'dev-student-1',
          firstName: 'Demo',
          lastName: 'Student',
          email: DEV_QUICK_LOGIN.email,
          profileCompletion: 64,
          status: 'active',
        },
      });
      toast.success('Logged in with local dev account.');
      navigate(ROUTES.dashboard, { replace: true });
      return;
    }

    try {
      const session = await authApi.login(normalizedValues);
      setSession(session);
      toast.success('Welcome back.');
      navigate(ROUTES.dashboard, { replace: true });
    } catch (error) {
      const message = normalizeApiError(error);

      if (message === 'Invalid email or password.') {
        setError('password', {
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
      title="Sign in"
      subtitle="Continue your placement journey."
      footer={
        <>
          New on BOARDING?{' '}
          <Link className="font-semibold text-brand-700 hover:text-brand-800" to={ROUTES.register}>
            Create account
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
          autoComplete="current-password"
          placeholder="********"
          labelAction={
            <a className="hover:text-brand-800" href="mailto:support@boarding.dev">
              Forgot password?
            </a>
          }
          {...register('password')}
          error={errors.password?.message}
        />

        {errors.root?.message ? <p className="text-sm font-medium text-rose-700">{errors.root.message}</p> : null}

        <AuthPrimaryButton className="mt-1" type="submit" isLoading={isSubmitting}>
          Sign in
        </AuthPrimaryButton>
      </form>

      {import.meta.env.DEV ? (
        <div className="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-xs text-brand-900">
          <p className="font-semibold uppercase tracking-wide">Dev quick login</p>
          <p>Email: {DEV_QUICK_LOGIN.email}</p>
          <p>Password: {DEV_QUICK_LOGIN.password}</p>
        </div>
      ) : null}
    </AuthFormShell>
  );
}
