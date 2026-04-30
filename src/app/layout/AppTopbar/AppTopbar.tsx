import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import { getNavigationIconPath, navigationItems } from '@/app/layout/navigation';
import { ROUTES } from '@/app/routes';
import { cn } from '@/lib/cn';
import { APP_NAME } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';

const pathTitleMap: Record<string, string> = {
  [ROUTES.dashboard]: 'Dashboard',
  [ROUTES.onboarding]: 'Onboarding',
  [ROUTES.profile]: 'Profile',
  [ROUTES.matching]: 'Matching',
  [ROUTES.appointments]: 'Appointments',
  [ROUTES.messaging]: 'Messaging',
  [ROUTES.journey]: 'Journey',
  [ROUTES.resources]: 'Resources',
};

export function AppTopbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const themeMode = useThemeStore((state) => state.mode);
  const toggleThemeMode = useThemeStore((state) => state.toggleMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'User';
  const firstInitial = user?.firstName?.trim().charAt(0).toUpperCase() ?? '';
  const lastInitial = user?.lastName?.trim().charAt(0).toUpperCase() ?? '';
  const nameInitials = `${firstInitial}${lastInitial}` || fullName.charAt(0).toUpperCase();
  const avatarUrl = user?.avatarUrl;
  const needsSetup = (user?.profileCompletion ?? 0) < 100;
  const setupCompletion = Math.max(0, Math.min(100, user?.profileCompletion ?? 0));

  const title =
    pathTitleMap[location.pathname] ??
    (location.pathname.startsWith(`${ROUTES.messaging}/`) ? 'Messaging' : 'Student Workspace');
  const isDarkMode = themeMode === 'dark';

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    clearSession();
    setIsMenuOpen(false);
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <>
      <header className="motion-list-reveal sticky top-0 z-30 animate-fade-in-up border-b border-slate-200/90 bg-white/95 px-2.5 py-2.5 shadow-sm sm:rounded-3xl sm:border sm:px-5 sm:py-3.5 sm:shadow-panel dark:border-slate-700/90 dark:bg-slate-900/90">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <p className="hidden text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:block dark:text-slate-400">{APP_NAME}</p>
              <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-xl dark:text-slate-100">{title}</h2>
            </div>
          </div>

          <div className="flex w-auto shrink-0 items-center justify-end gap-2 sm:gap-3">
            {needsSetup ? (
              <Link
                to={ROUTES.onboarding}
                className="hidden min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-center text-xs font-semibold text-amber-900 shadow-sm transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 md:inline-flex sm:w-auto sm:text-sm dark:border-amber-500/60 dark:bg-amber-500/10 dark:text-amber-200 dark:hover:bg-amber-500/20 dark:focus-visible:ring-amber-700/40"
                aria-label="Complete required setup"
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
                <span>Continue setup</span>
                <span className="rounded-full border border-amber-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-amber-800 sm:text-[11px] dark:border-amber-400/40 dark:bg-amber-900/40 dark:text-amber-100">
                  {setupCompletion}% complete
                </span>
              </Link>
            ) : null}

            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:bg-slate-700 dark:hover:text-brand-200"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <Link
              to={ROUTES.profile}
              className="hidden h-11 w-11 place-items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 lg:grid dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:bg-slate-700 dark:hover:text-brand-200"
              aria-label="Open profile"
              title="Open profile"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${fullName} avatar`}
                  className="h-full w-full object-cover"
                  width={40}
                  height={40}
                  decoding="async"
                  loading="eager"
                />
              ) : (
                nameInitials
              )}
            </Link>
          </div>
        </div>
      </header>

      {isMenuOpen ? (
        <>
          <button type="button" className="motion-backdrop-enter fixed inset-0 z-40 bg-slate-900/45 lg:hidden" onClick={() => setIsMenuOpen(false)} aria-label="Close navigation menu" />
          <aside
            id="mobile-navigation-menu"
            className="motion-drawer-enter fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-slate-200 bg-white p-4 shadow-panel lg:hidden dark:border-slate-700 dark:bg-slate-900"
            style={{ width: 'min(420px, 100vw)', maxWidth: '100vw', paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">{APP_NAME}</p>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="mt-5 flex-1 space-y-1.5 overflow-y-auto pr-1" aria-label="Mobile navigation links">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-xl border px-3 py-3 text-sm font-semibold transition-colors',
                      isActive
                        ? 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/60 dark:bg-brand-500/15 dark:text-brand-200'
                        : 'border-transparent bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-white dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700'
                    )
                  }
                >
                  <span className="flex items-center gap-2.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d={getNavigationIconPath(item.icon)} />
                    </svg>
                    <span>{item.label}</span>
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">{item.hint}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
              <button
                type="button"
                className="mb-3 inline-flex w-full min-h-11 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/90 px-2 py-1.5 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-200 dark:focus-visible:ring-slate-600"
                data-mode={themeMode}
                onClick={toggleThemeMode}
                aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              >
                <span className="relative inline-flex h-7 w-14 items-center overflow-hidden rounded-full border border-slate-200 bg-gradient-to-r from-brand-100 to-accent-100 p-0.5 dark:border-slate-600 dark:from-slate-800 dark:to-slate-700" aria-hidden>
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-70"
                    style={{
                      background:
                        'radial-gradient(circle at 22% 50%, rgba(255, 255, 255, 0.85), transparent 46%), radial-gradient(circle at 80% 50%, rgba(30, 41, 59, 0.4), transparent 52%)',
                    }}
                  />
                  <span className={cn('relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-brand-600 shadow-md transition-transform duration-300 ease-out dark:bg-slate-950 dark:text-slate-100', isDarkMode && 'translate-x-[1.4rem]')}>
                    <svg
                      viewBox="0 0 24 24"
                      className={cn('absolute h-3.5 w-3.5 transition-all duration-200', isDarkMode ? 'scale-75 opacity-0' : 'scale-100 opacity-100')}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="4.3" />
                      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7M18.8 18.8l-1.7-1.7M6.9 6.9L5.2 5.2" />
                    </svg>
                    <svg
                      viewBox="0 0 24 24"
                      className={cn('absolute h-3.5 w-3.5 transition-all duration-200', isDarkMode ? 'scale-100 opacity-100' : 'scale-75 opacity-0')}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3a7.1 7.1 0 1 0 9.8 9.8Z" />
                    </svg>
                  </span>
                </span>
                <span className="inline pr-1 text-xs font-semibold uppercase tracking-[0.08em]">{isDarkMode ? 'Dark mode' : 'Light mode'}</span>
              </button>

              <Link
                to={ROUTES.profile}
                onClick={() => setIsMenuOpen(false)}
                className="mb-3 flex items-center justify-between rounded-xl border border-transparent bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-200 hover:bg-white dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700"
              >
                <span className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={`${fullName} avatar`} className="h-full w-full object-cover" width={32} height={32} decoding="async" loading="eager" />
                    ) : (
                      nameInitials
                    )}
                  </span>
                  <span>Profile</span>
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Account</span>
              </Link>

              <button
                type="button"
                className="w-full rounded-xl border border-transparent bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-200 hover:bg-white dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                onClick={handleLogout}
              >
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" />
                      <path d="M16 17l5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                    <span>Sign out</span>
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Logout</span>
                </span>
              </button>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
