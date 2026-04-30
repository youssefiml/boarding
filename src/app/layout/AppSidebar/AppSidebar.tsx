import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { appointmentsApi } from '@/api/modules/appointments.api';
import { matchingApi } from '@/api/modules/matching.api';
import { messagingApi } from '@/api/modules/messaging.api';
import boardingLogo from '@/assets/boarding-logo.png';
import { ROUTES } from '@/app/routes';
import { getNavigationIconPath, navigationItems } from '@/app/layout/navigation';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/stores/auth.store';
import { useThemeStore } from '@/stores/theme.store';

type GroupId = 'core' | 'placement' | 'support';

interface SidebarSignals {
  unreadMessages: number;
  pendingAppointments: number;
  highFitMatches: number;
  nextInterviewInDays: number | null;
}

const SIDEBAR_STORAGE_KEY = 'boarding.sidebar.collapsed';

const navGroups: Array<{ id: GroupId; label: string; paths: string[] }> = [
  {
    id: 'core',
    label: 'Core',
    paths: [ROUTES.dashboard, ROUTES.profile, ROUTES.journey],
  },
  {
    id: 'placement',
    label: 'Placement',
    paths: [ROUTES.onboarding, ROUTES.matching, ROUTES.appointments, ROUTES.messaging],
  },
  {
    id: 'support',
    label: 'Support',
    paths: [ROUTES.resources],
  },
];

function daysUntil(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const diff = date.getTime() - Date.now();

  if (diff < 0) {
    return 0;
  }

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function AppSidebar() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const themeMode = useThemeStore((state) => state.mode);
  const toggleThemeMode = useThemeStore((state) => state.toggleMode);
  const navigate = useNavigate();
  const isDarkMode = themeMode === 'dark';
  const sidebarRef = useRef<HTMLElement | null>(null);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  });
  const [signals, setSignals] = useState<SidebarSignals>({
    unreadMessages: 0,
    pendingAppointments: 0,
    highFitMatches: 0,
    nextInterviewInDays: null,
  });

  const groupedItems = useMemo(() => {
    const itemMap = new Map(navigationItems.map((item) => [item.path, item]));

    return navGroups.map((group) => ({
      ...group,
      items: group.paths
        .map((path) => itemMap.get(path))
        .filter((item): item is (typeof navigationItems)[number] => Boolean(item)),
    }));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, isCollapsed ? 'true' : 'false');
  }, [isCollapsed]);

  useEffect(() => {
    let isMounted = true;

    const loadSignals = async () => {
      const [threadsResult, appointmentsResult, matchesResult] = await Promise.allSettled([
        messagingApi.listThreads({ page: 1, pageSize: 40 }),
        appointmentsApi.listAppointments({ page: 1, pageSize: 40, status: 'scheduled' }),
        matchingApi.listMatches({ page: 1, pageSize: 40, minScore: 85 }),
      ]);

      if (!isMounted) {
        return;
      }

      const unreadMessages =
        threadsResult.status === 'fulfilled'
          ? threadsResult.value.items.reduce((sum, thread) => sum + Math.max(0, thread.unreadCount), 0)
          : 0;

      const scheduledAppointments =
        appointmentsResult.status === 'fulfilled' ? appointmentsResult.value.items.filter((item) => item.status === 'scheduled') : [];
      const pendingAppointments = scheduledAppointments.length;

      const nextInterview = scheduledAppointments
        .filter((item) => item.type === 'interview')
        .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())[0];

      const nextInterviewInDays = nextInterview ? daysUntil(nextInterview.date) : null;

      const highFitMatches =
        matchesResult.status === 'fulfilled'
          ? matchesResult.value.items.filter((item) => item.status !== 'rejected' && item.score >= 85).length
          : 0;

      setSignals({
        unreadMessages,
        pendingAppointments,
        highFitMatches,
        nextInterviewInDays,
      });
    };

    void loadSignals();

    return () => {
      isMounted = false;
    };
  }, []);

  const getHint = useCallback(
    (path: string, fallbackHint: string) => {
      if (path === ROUTES.matching && signals.highFitMatches > 0) {
        return `${signals.highFitMatches} high-fit`;
      }

      if (path === ROUTES.messaging && signals.unreadMessages > 0) {
        return `${signals.unreadMessages} unread`;
      }

      if (path === ROUTES.appointments && signals.pendingAppointments > 0) {
        return `${signals.pendingAppointments} pending`;
      }

      if (path === ROUTES.journey && signals.nextInterviewInDays !== null) {
        return `Interview in ${signals.nextInterviewInDays}d`;
      }

      return fallbackHint;
    },
    [signals.highFitMatches, signals.nextInterviewInDays, signals.pendingAppointments, signals.unreadMessages]
  );

  const getBadge = useCallback(
    (path: string) => {
      if (path === ROUTES.messaging && signals.unreadMessages > 0) {
        return signals.unreadMessages;
      }

      if (path === ROUTES.appointments && signals.pendingAppointments > 0) {
        return signals.pendingAppointments;
      }

      if (path === ROUTES.matching && signals.highFitMatches > 0) {
        return signals.highFitMatches;
      }

      return 0;
    },
    [signals.highFitMatches, signals.pendingAppointments, signals.unreadMessages]
  );

  const handleArrowNavigation = (event: KeyboardEvent<HTMLElement>) => {
    if (!sidebarRef.current) {
      return;
    }

    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      return;
    }

    const focusableItems = Array.from(sidebarRef.current.querySelectorAll<HTMLElement>('[data-sidebar-focusable="true"]')).filter(
      (element) => !element.hasAttribute('disabled')
    );

    if (focusableItems.length === 0) {
      return;
    }

    const activeElement = document.activeElement as HTMLElement | null;
    const activeIndex = activeElement ? focusableItems.indexOf(activeElement) : -1;
    let nextIndex = activeIndex;

    if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = focusableItems.length - 1;
    } else if (event.key === 'ArrowDown') {
      nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % focusableItems.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = activeIndex < 0 ? focusableItems.length - 1 : (activeIndex - 1 + focusableItems.length) % focusableItems.length;
    }

    focusableItems[nextIndex]?.focus();
    event.preventDefault();
  };

  const handleLogout = () => {
    clearSession();
    navigate(ROUTES.login, { replace: true });
  };

  const sidebarLeft = isCollapsed
    ? 'max(var(--app-shell-gutter), calc((100vw - var(--app-shell-max-width)) / 2 + var(--app-shell-gutter)))'
    : 'max(0px, calc((100vw - var(--app-shell-max-width)) / 2))';

  return (
    <aside
      className={cn('relative z-30 hidden shrink-0 self-start lg:flex', isCollapsed ? 'w-[78px]' : 'w-72')}
      aria-label="Primary navigation"
      ref={sidebarRef}
      onKeyDown={handleArrowNavigation}
    >
      <div
        className={cn(
          'fixed flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 shadow-panel transition-colors dark:border-slate-700/90 dark:bg-slate-900/90',
          isCollapsed ? 'w-[78px] overflow-visible' : 'w-[calc(18rem+var(--app-shell-gutter))]'
        )}
        style={{ top: '1rem', bottom: '1rem', left: sidebarLeft }}
      >
        <Link
          to={ROUTES.dashboard}
          className={cn(
            'flex items-center gap-3 border-b border-slate-200/80 px-3 py-3 transition-colors hover:bg-slate-50 dark:border-slate-700/80 dark:hover:bg-slate-800/65',
            isCollapsed && 'justify-center px-2'
          )}
          aria-label="Go to dashboard"
          data-sidebar-focusable="true"
        >
          <img src={boardingLogo} alt="" className="h-10 w-10 object-cover [object-position:22%_50%]" />
          <div className={cn('min-w-0', isCollapsed && 'hidden')}>
            <p className="truncate text-sm font-semibold uppercase tracking-[0.12em] text-slate-900 dark:text-slate-100">Boarding</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Student platform</p>
          </div>
        </Link>

        <div className={cn('px-2 py-2', isCollapsed && 'flex justify-center')}>
          <button
            type="button"
            className={cn(
              'inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-900',
              isCollapsed && 'h-9 w-9 rounded-xl px-0'
            )}
            onClick={() => setIsCollapsed((current) => !current)}
            aria-label={isCollapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
            data-sidebar-focusable="true"
          >
            <svg
              viewBox="0 0 24 24"
              className={cn('h-4 w-4 transition-transform duration-200', isCollapsed && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 5l-6 7 6 7" />
            </svg>
            <span className={cn(isCollapsed && 'hidden')}>{isCollapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        </div>

        <div className={cn('flex-1 overflow-y-auto px-2 pb-2', isCollapsed && 'overflow-visible')}>
          <nav className="flex flex-col gap-3" aria-label="Application navigation">
            {groupedItems.map((group) => (
              <section key={group.id} className="space-y-1.5" aria-label={group.label}>
                <p className={cn('px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400', isCollapsed && 'sr-only')}>
                  {group.label}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const badge = getBadge(item.path);
                    const hint = getHint(item.path, item.hint);

                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          data-sidebar-focusable="true"
                          aria-label={`${item.label}${badge > 0 ? ` (${badge})` : ''}`}
                          className={({ isActive }) =>
                            cn(
                              'group relative flex min-h-11 items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2 text-slate-600 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-slate-300 dark:focus-visible:ring-offset-slate-900',
                              isActive
                                ? 'border-brand-200 bg-brand-50 text-brand-800 shadow-sm [box-shadow:inset_3px_0_0_0_rgb(37_99_235_/_0.95)] dark:border-brand-400/55 dark:bg-brand-500/20 dark:text-brand-100'
                                : 'hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                              isCollapsed && 'mx-auto h-11 w-11 justify-center px-0',
                              isCollapsed && isActive && '[box-shadow:0_0_#0000]'
                            )
                          }
                        >
                          <span className={cn('relative inline-flex h-8 w-8 shrink-0 basis-8 items-center justify-center', isCollapsed && 'h-9 w-9 basis-9')}>
                            <svg
                              viewBox="0 0 24 24"
                              className={cn('h-[18px] w-[18px] shrink-0', isCollapsed && 'h-5 w-5')}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <path d={getNavigationIconPath(item.icon)} />
                            </svg>
                            {badge > 0 ? (
                              <span className={cn('absolute right-0 top-0 m-0 inline-flex min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white', isCollapsed && 'min-h-4 min-w-4 text-[9px]')}>
                                {badge > 99 ? '99+' : badge}
                              </span>
                            ) : null}
                          </span>

                          <span className={cn('flex min-w-0 flex-1 items-center justify-between gap-2', isCollapsed && 'hidden')}>
                            <span className="truncate text-sm font-semibold">{item.label}</span>
                            <span className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">{hint}</span>
                          </span>

                          <span
                            className={cn(
                              'hidden',
                              isCollapsed &&
                                "pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 inline-flex -translate-y-1/2 rounded-md bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-150 before:absolute before:left-[-6px] before:top-1/2 before:h-[10px] before:w-[6px] before:-translate-y-1/2 before:bg-slate-900 before:content-[''] before:[clip-path:polygon(100%_0,100%_100%,0_50%)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 dark:bg-slate-100 dark:text-slate-900 dark:before:bg-slate-100"
                            )}
                            style={isCollapsed ? { transform: 'translate(-4px, -50%)' } : undefined}
                          >
                            {item.label}
                          </span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-200/80 px-2 py-3 dark:border-slate-700/80">
          <button
            type="button"
            className={cn(
              'group relative flex min-h-10 w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-slate-700 transition-colors hover:border-slate-300 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-900',
              isCollapsed && 'mx-auto h-10 w-10 justify-center px-0'
            )}
            data-mode={themeMode}
            onClick={toggleThemeMode}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            data-sidebar-focusable="true"
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" className={cn('h-[18px] w-[18px] shrink-0', isCollapsed && 'h-5 w-5')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="4.3" />
                <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7M18.8 18.8l-1.7-1.7M6.9 6.9L5.2 5.2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className={cn('h-[18px] w-[18px] shrink-0', isCollapsed && 'h-5 w-5')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3a7.1 7.1 0 1 0 9.8 9.8Z" />
              </svg>
            )}
            <span className={cn('text-sm font-semibold', isCollapsed && 'hidden')}>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
            <span
              className={cn(
                'hidden',
                isCollapsed &&
                  "pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 inline-flex -translate-y-1/2 rounded-md bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-150 before:absolute before:left-[-6px] before:top-1/2 before:h-[10px] before:w-[6px] before:-translate-y-1/2 before:bg-slate-900 before:content-[''] before:[clip-path:polygon(100%_0,100%_100%,0_50%)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 dark:bg-slate-100 dark:text-slate-900 dark:before:bg-slate-100"
              )}
              style={isCollapsed ? { transform: 'translate(-4px, -50%)' } : undefined}
            >
              {isDarkMode ? 'Light mode' : 'Dark mode'}
            </span>
          </button>

          <button
            type="button"
            className={cn(
              'group relative mt-1.5 flex min-h-10 w-full items-center gap-2.5 rounded-xl border border-transparent px-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-900',
              isCollapsed && 'mx-auto h-10 w-10 justify-center px-0'
            )}
            onClick={handleLogout}
            aria-label="Sign out"
            data-sidebar-focusable="true"
          >
            <svg viewBox="0 0 24 24" className={cn('h-[18px] w-[18px] shrink-0', isCollapsed && 'h-5 w-5')} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={cn('text-sm font-semibold', isCollapsed && 'hidden')}>Sign out</span>
            <span
              className={cn(
                'hidden',
                isCollapsed &&
                  "pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 inline-flex -translate-y-1/2 rounded-md bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-150 before:absolute before:left-[-6px] before:top-1/2 before:h-[10px] before:w-[6px] before:-translate-y-1/2 before:bg-slate-900 before:content-[''] before:[clip-path:polygon(100%_0,100%_100%,0_50%)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 dark:bg-slate-100 dark:text-slate-900 dark:before:bg-slate-100"
              )}
              style={isCollapsed ? { transform: 'translate(-4px, -50%)' } : undefined}
            >
              Sign out
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
