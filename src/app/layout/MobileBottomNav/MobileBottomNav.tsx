import '@/styles/app/layout/MobileBottomNav/MobileBottomNav.css';
import { NavLink, useLocation } from 'react-router-dom';

import { ROUTES } from '@/app/routes';
import { getNavigationIconPath } from '@/app/layout/navigation';
import { cn } from '@/lib/cn';

interface MobileNavItem {
  label: string;
  path: string;
  icon: Parameters<typeof getNavigationIconPath>[0];
}

const mobileNavItems: MobileNavItem[] = [
  { label: 'Home', path: ROUTES.dashboard, icon: 'dashboard' },
  { label: 'Matches', path: ROUTES.matching, icon: 'matching' },
  { label: 'Messages', path: ROUTES.messaging, icon: 'messaging' },
  { label: 'Journey', path: ROUTES.journey, icon: 'journey' },
  { label: 'Profile', path: ROUTES.profile, icon: 'profile' },
];

export function MobileBottomNav() {
  const location = useLocation();

  // Keep focused step flows clean on mobile.
  if (location.pathname.startsWith(ROUTES.onboarding) || location.pathname.startsWith(ROUTES.journey)) {
    return null;
  }

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <ul className="mobile-bottom-nav__list">
        {mobileNavItems.map((item) => (
          <li key={item.path} className="mobile-bottom-nav__item">
            <NavLink
              to={item.path}
              className={({ isActive }) => cn('mobile-bottom-nav__link', isActive ? 'is-active' : 'is-inactive')}
            >
              <svg
                viewBox="0 0 24 24"
                className="mobile-bottom-nav__icon"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d={getNavigationIconPath(item.icon)} />
              </svg>
              <span className="mobile-bottom-nav__label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

