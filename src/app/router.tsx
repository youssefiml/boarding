import { Suspense, lazy } from 'react';
import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { RequireAuth } from '@/app/guards/RequireAuth';
import { RequireGuest } from '@/app/guards/RequireGuest';
import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { ROUTES } from '@/app/routes';
import { useAuthStore } from '@/stores/auth.store';

const DashboardPage = lazy(() => import('@/views/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const OnboardingPage = lazy(() => import('@/views/OnboardingPage').then((module) => ({ default: module.OnboardingPage })));
const ProfilePage = lazy(() => import('@/views/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const MatchingPage = lazy(() => import('@/views/MatchingPage').then((module) => ({ default: module.MatchingPage })));
const AppointmentsPage = lazy(() => import('@/views/AppointmentsPage').then((module) => ({ default: module.AppointmentsPage })));
const MessagingPage = lazy(() => import('@/views/MessagingPage').then((module) => ({ default: module.MessagingPage })));
const JourneyPage = lazy(() => import('@/views/JourneyPage').then((module) => ({ default: module.JourneyPage })));
const ResourcesPage = lazy(() => import('@/views/ResourcesPage').then((module) => ({ default: module.ResourcesPage })));
const LandingPage = lazy(() => import('@/views/LandingPage').then((module) => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('@/views/auth/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('@/views/auth/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const NotFoundPage = lazy(() => import('@/views/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function RouteFallback() {
  return (
    <div className="space-y-3 p-4 md:p-5" aria-live="polite">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-10 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-36 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="h-36 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

function withSuspense(element: ReactElement) {
  return <Suspense fallback={<RouteFallback />}>{element}</Suspense>;
}

export function AppRouter() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <Routes>
      <Route path={ROUTES.root} element={accessToken ? <Navigate to={ROUTES.dashboard} replace /> : withSuspense(<LandingPage />)} />

      <Route element={<RequireGuest />}>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.login} element={withSuspense(<LoginPage />)} />
          <Route path={ROUTES.register} element={withSuspense(<RegisterPage />)} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.dashboard} element={withSuspense(<DashboardPage />)} />
          <Route path={ROUTES.onboarding} element={withSuspense(<OnboardingPage />)} />
          <Route path={ROUTES.profile} element={withSuspense(<ProfilePage />)} />
          <Route path={ROUTES.matching} element={withSuspense(<MatchingPage />)} />
          <Route path={ROUTES.appointments} element={withSuspense(<AppointmentsPage />)} />
          <Route path={ROUTES.messaging} element={withSuspense(<MessagingPage />)} />
          <Route path={`${ROUTES.messaging}/:threadId`} element={withSuspense(<MessagingPage />)} />
          <Route path={ROUTES.journey} element={withSuspense(<JourneyPage />)} />
          <Route path={ROUTES.resources} element={withSuspense(<ResourcesPage />)} />
        </Route>
      </Route>

      <Route path="*" element={withSuspense(<NotFoundPage />)} />
    </Routes>
  );
}
