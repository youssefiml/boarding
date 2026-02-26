import '@/styles/app/layout/AppSidebar/AppSidebar.css';
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

  const [isCollapsed, setIsCollapsed] = useState(false);
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
    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    setIsCollapsed(stored === 'true');
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

  return (
    <aside
      className={cn('app-sidebar', isCollapsed ? 'is-collapsed' : 'is-expanded')}
      aria-label="Primary navigation"
      ref={sidebarRef}
      onKeyDown={handleArrowNavigation}
    >
      <div className="app-sidebar__panel">
        <Link to={ROUTES.dashboard} className="app-sidebar__brand" aria-label="Go to dashboard" data-sidebar-focusable="true">
          <img src={boardingLogo} alt="" className="app-sidebar__brand-image" />
          <div className="app-sidebar__brand-copy">
            <p className="app-sidebar__brand-title">Boarding</p>
            <p className="app-sidebar__brand-subtitle">Student platform</p>
          </div>
        </Link>

        <div className="app-sidebar__toggle-row">
          <button
            type="button"
            className="app-sidebar__collapse-toggle"
            onClick={() => setIsCollapsed((current) => !current)}
            aria-label={isCollapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
            data-sidebar-focusable="true"
          >
            <svg viewBox="0 0 24 24" className={cn('app-sidebar__collapse-icon', isCollapsed ? 'is-collapsed' : '')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 5l-6 7 6 7" />
            </svg>
            <span className="app-sidebar__collapse-label">{isCollapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        </div>

        <div className="app-sidebar__scroll">
          <nav className="app-sidebar__nav" aria-label="Application navigation">
            {groupedItems.map((group) => (
              <section key={group.id} className="app-sidebar__group" aria-label={group.label}>
                <p className="app-sidebar__group-label">{group.label}</p>
                <ul className="app-sidebar__list">
                  {group.items.map((item) => {
                    const badge = getBadge(item.path);
                    const hint = getHint(item.path, item.hint);

                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          data-sidebar-focusable="true"
                          aria-label={`${item.label}${badge > 0 ? ` (${badge})` : ''}`}
                          className={({ isActive }) => cn('app-sidebar__item', isActive ? 'is-active' : 'is-inactive')}
                        >
                          <span className="app-sidebar__item-icon-wrap">
                            <svg
                              viewBox="0 0 24 24"
                              className="app-sidebar__item-icon"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <path d={getNavigationIconPath(item.icon)} />
                            </svg>
                            {badge > 0 ? <span className="app-sidebar__item-badge">{badge > 99 ? '99+' : badge}</span> : null}
                          </span>

                          <span className="app-sidebar__item-copy">
                            <span className="app-sidebar__item-label">{item.label}</span>
                            <span className="app-sidebar__item-hint">{hint}</span>
                          </span>

                          <span className="app-sidebar__tooltip">{item.label}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </nav>
        </div>

        <div className="app-sidebar__footer">
          <button
            type="button"
            className="app-sidebar__utility app-sidebar__utility--theme"
            data-mode={themeMode}
            onClick={toggleThemeMode}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            data-sidebar-focusable="true"
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" className="app-sidebar__utility-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="4.3" />
                <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7M18.8 18.8l-1.7-1.7M6.9 6.9L5.2 5.2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="app-sidebar__utility-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3a7.1 7.1 0 1 0 9.8 9.8Z" />
              </svg>
            )}
            <span className="app-sidebar__utility-label">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
            <span className="app-sidebar__tooltip">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
          </button>

          <button
            type="button"
            className="app-sidebar__utility app-sidebar__utility--logout"
            onClick={handleLogout}
            aria-label="Sign out"
            data-sidebar-focusable="true"
          >
            <svg viewBox="0 0 24 24" className="app-sidebar__utility-icon" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="app-sidebar__utility-label">Sign out</span>
            <span className="app-sidebar__tooltip">Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
