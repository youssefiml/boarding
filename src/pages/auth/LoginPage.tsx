import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { authApi } from '@/api/modules/auth.api';
import { normalizeApiError } from '@/api/client';
import { ROUTES } from '@/app/routes';
import { loginSchema } from '@/features/auth/schemas';
import type { LoginFormValues } from '@/features/auth/schemas';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/ui/Button/Button';
import { Input } from '@/ui/Input/Input';

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
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (
      import.meta.env.DEV &&
      values.email === DEV_QUICK_LOGIN.email &&
      values.password === DEV_QUICK_LOGIN.password
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
      const session = await authApi.login(values);
      setSession(session);
      toast.success('Welcome back.');
      navigate(ROUTES.dashboard, { replace: true });
    } catch (error) {
      toast.error(normalizeApiError(error));
    }
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Username or email"
          type="email"
          autoComplete="email"
          placeholder="student@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="********"
          {...register('password')}
          error={errors.password?.message}
        />

        <p className="text-right text-xs font-medium text-slate-500">Need help with password? Contact support.</p>

        <Button className="mt-1 w-full" type="submit" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>

      {import.meta.env.DEV ? (
        <div className="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-xs text-brand-900">
          <p className="font-semibold uppercase tracking-wide">Dev quick login</p>
          <p>Email: {DEV_QUICK_LOGIN.email}</p>
          <p>Password: {DEV_QUICK_LOGIN.password}</p>
        </div>
      ) : null}

      <p className="mt-5 text-center text-sm text-slate-600">
        New on BOARDING?{' '}
        <Link className="font-semibold text-brand-700 hover:text-brand-800" to={ROUTES.register}>
          Create account
        </Link>
      </p>
    </div>
  );
}
