import { Outlet, Navigate } from 'react-router-dom';

import { ROUTES } from '@/app/routes';
import { useAuthStore } from '@/stores/auth.store';

export function RequireGuest() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <Outlet />;
}
