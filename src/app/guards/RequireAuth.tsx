import { Outlet, Navigate } from 'react-router-dom';

import { ROUTES } from '@/app/routes';
import { useAuthStore } from '@/stores/auth.store';

export function RequireAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
}
