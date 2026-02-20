import '@/styles/app/layout/AppSidebar/AppSidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';

import boardingLogo from '@/assets/boarding-logo.png';
import { ROUTES } from '@/app/routes';
import { getNavigationIconPath, navigationItems } from '@/app/layout/navigation';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';

const primaryPaths = new Set([ROUTES.dashboard, ROUTES.onboarding, ROUTES.matching, ROUTES.appointments, ROUTES.messaging]);

const primaryItems = navigationItems.filter((item) => primaryPaths.has(item.path));
const utilityItems = navigationItems.filter((item) => !primaryPaths.has(item.path));

export function AppSidebar() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const themeMode = useThemeStore((state) => state.mode);
  const toggleThemeMode = useThemeStore((state) => state.toggleMode);
  const navigate = useNavigate();
  const isDarkMode = themeMode === 'dark';

  const handleLogout = () => {
    clearSession();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__rail">
        <div className="app-sidebar__rail-logo" aria-hidden>
          <img src={boardingLogo} alt="" className="app-sidebar__rail-logo-image" />
        </div>

        <nav className="app-sidebar__rail-nav" aria-label="Navigation shortcuts">
          {primaryItems.map((item) => (
            <NavLink
              key={`rail-${item.path}`}
              to={item.path}
              className={({ isActive }) => cn('app-sidebar__rail-link', isActive ? 'is-active' : 'is-inactive')}
              aria-label={item.label}
            >
              <svg
                viewBox="0 0 24 24"
                className="app-sidebar__rail-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d={getNavigationIconPath(item.icon)} />
              </svg>
              <span className="app-sidebar__tooltip">{item.label}</span>
            </NavLink>
          ))}

          {utilityItems.map((item) => (
            <NavLink
              key={`rail-${item.path}`}
              to={item.path}
              className={({ isActive }) => cn('app-sidebar__rail-link', isActive ? 'is-active' : 'is-inactive')}
              aria-label={item.label}
            >
              <svg
                viewBox="0 0 24 24"
                className="app-sidebar__rail-icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d={getNavigationIconPath(item.icon)} />
              </svg>
              <span className="app-sidebar__tooltip">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar__rail-footer">
          <button
            type="button"
            className="app-sidebar__rail-link app-sidebar__rail-button"
            data-mode={themeMode}
            onClick={toggleThemeMode}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" className="app-sidebar__rail-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="4.3" />
                <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7M18.8 18.8l-1.7-1.7M6.9 6.9L5.2 5.2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="app-sidebar__rail-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3a7.1 7.1 0 1 0 9.8 9.8Z" />
              </svg>
            )}
            <span className="app-sidebar__tooltip">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
          </button>

          <button
            type="button"
            className="app-sidebar__rail-link app-sidebar__rail-button is-inactive"
            onClick={handleLogout}
            aria-label="Sign out"
          >
            <svg viewBox="0 0 24 24" className="app-sidebar__rail-icon" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="app-sidebar__tooltip">Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

