import '@/styles/app/layout/AppTopbar/AppTopbar.css';
import { Link, useLocation } from 'react-router-dom';

import { ROUTES } from '@/app/routes';
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
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const themeMode = useThemeStore((state) => state.mode);
  const toggleThemeMode = useThemeStore((state) => state.toggleMode);

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

  return (
    <header className="app-topbar">
      <div className="app-topbar__row">
        <div className="app-topbar__title-wrap">
          <div className="app-topbar__title-block">
            <p className="app-topbar__kicker">{APP_NAME}</p>
            <h2 className="app-topbar__title">{title}</h2>
          </div>
        </div>

        <div className="app-topbar__actions">
          {needsSetup ? (
            <Link to={ROUTES.onboarding} className="app-topbar__setup-link" aria-label="Complete required setup">
              <span className="app-topbar__setup-dot" aria-hidden />
              <span>Continue setup</span>
              <span className="app-topbar__setup-pill">{setupCompletion}% complete</span>
            </Link>
          ) : null}

          <button
            type="button"
            className="app-topbar__theme-toggle app-topbar__theme-toggle--compact xl:hidden"
            data-mode={themeMode}
            onClick={toggleThemeMode}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            <span className="app-topbar__theme-track" aria-hidden>
              <span className="app-topbar__theme-glow" />
              <span className="app-topbar__theme-thumb">
                <svg
                  viewBox="0 0 24 24"
                  className="app-topbar__theme-icon app-topbar__theme-icon--sun"
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
                  className="app-topbar__theme-icon app-topbar__theme-icon--moon"
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
            <span className="app-topbar__theme-text">{isDarkMode ? 'Dark mode' : 'Light mode'}</span>
          </button>

          <Link
            to={ROUTES.profile}
            className="app-topbar__profile-link app-topbar__profile-link--desktop"
            aria-label="Open profile"
            title="Open profile"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${fullName} avatar`}
                className="app-topbar__profile-image"
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
  );
}
