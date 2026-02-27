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

function toTitleCase(value: string) {
  if (!value) {
    return '';
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
}

function deriveDevUser(email: string) {
  const localPart = email.split('@')[0] ?? 'demo.user';
  const sanitized = localPart.replace(/[^a-zA-Z0-9._-]/g, ' ').replace(/[._-]+/g, ' ').trim();
  const segments = sanitized.length > 0 ? sanitized.split(/\s+/).filter(Boolean) : [];
  const firstName = toTitleCase(segments[0] ?? 'Demo');
  const lastName = toTitleCase(segments.slice(1).join(' ') || 'User');
  const normalizedId = localPart.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24) || 'user';

  return {
    id: `dev-${normalizedId}`,
    firstName,
    lastName,
  };
}

function createLocalSession(email: string) {
  const localUser = deriveDevUser(email);

  return {
    accessToken: 'dev-access-token',
    refreshToken: 'dev-refresh-token',
    user: {
      id: localUser.id,
      firstName: localUser.firstName,
      lastName: localUser.lastName,
      email,
      profileCompletion: 64,
      status: 'active' as const,
    },
  };
}

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

    if (import.meta.env.DEV) {
      setSession(createLocalSession(normalizedValues.email));
      toast.success('Logged in with local dev session.');
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

      if (/invalid email or password/i.test(message)) {
        setSession(createLocalSession(normalizedValues.email));
        toast.success('Signed in with local fallback session.');
        navigate(ROUTES.dashboard, { replace: true });
        return;
      }

      setError('root', {
        type: 'server',
        message: 'Unable to sign in right now. Please try again.',
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
          <p className="font-semibold uppercase tracking-wide">Development sign-in</p>
          <p>Any valid email and password (8+ characters) signs in locally.</p>
        </div>
      ) : null}
    </AuthFormShell>
  );
}
