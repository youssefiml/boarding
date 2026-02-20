import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { authApi } from '@/api/modules/auth.api';
import { normalizeApiError } from '@/api/client';
import { ROUTES } from '@/app/routes';
import { registerSchema } from '@/features/auth/schemas';
import type { RegisterFormValues } from '@/features/auth/schemas';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/ui/Button/Button';
import { Input } from '@/ui/Input/Input';

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async ({ confirmPassword, ...payload }: RegisterFormValues) => {
    void confirmPassword;

    try {
      const session = await authApi.register(payload);
      setSession(session);
      toast.success('Account created. Let us build your profile.');
      navigate(ROUTES.onboarding, { replace: true });
    } catch (error) {
      toast.error(normalizeApiError(error));
    }
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First name" placeholder="Sara" {...register('firstName')} error={errors.firstName?.message} />
          <Input label="Last name" placeholder="Meyer" {...register('lastName')} error={errors.lastName?.message} />
        </div>

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="student@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="********"
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="********"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button className="mt-1 w-full" type="submit" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        Already registered?{' '}
        <Link className="font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200" to={ROUTES.login}>
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
