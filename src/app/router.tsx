import { Navigate, Route, Routes } from 'react-router-dom';

import { RequireAuth } from '@/app/guards/RequireAuth';
import { RequireGuest } from '@/app/guards/RequireGuest';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ROUTES } from '@/app/routes';
import { AppointmentsPage } from '@/pages/AppointmentsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { JourneyPage } from '@/pages/JourneyPage';
import { MatchingPage } from '@/pages/MatchingPage';
import { MessagingPage } from '@/pages/MessagingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ResourcesPage } from '@/pages/ResourcesPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { useAuthStore } from '@/stores/auth.store';

export function AppRouter() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <Routes>
      <Route path={ROUTES.root} element={<Navigate to={accessToken ? ROUTES.dashboard : ROUTES.login} replace />} />

      <Route element={<RequireGuest />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.register} element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.onboarding} element={<OnboardingPage />} />
          <Route path={ROUTES.profile} element={<ProfilePage />} />
          <Route path={ROUTES.matching} element={<MatchingPage />} />
          <Route path={ROUTES.appointments} element={<AppointmentsPage />} />
          <Route path={ROUTES.messaging} element={<MessagingPage />} />
          <Route path={`${ROUTES.messaging}/:threadId`} element={<MessagingPage />} />
          <Route path={ROUTES.journey} element={<JourneyPage />} />
          <Route path={ROUTES.resources} element={<ResourcesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
