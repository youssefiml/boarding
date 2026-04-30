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
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-lg backdrop-blur xl:hidden dark:border-slate-700/90 dark:bg-slate-900/95"
      aria-label="Mobile navigation"
    >
      <ul className="mx-auto grid w-full max-w-2xl grid-cols-5 gap-1">
        {mobileNavItems.map((item) => (
          <li key={item.path} className="min-w-0">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-xl border text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
                  isActive
                    ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-400/55 dark:bg-brand-500/15 dark:text-brand-100'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                )
              }
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d={getNavigationIconPath(item.icon)} />
              </svg>
              <span className="truncate text-[10px] font-semibold uppercase tracking-[0.06em]">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
