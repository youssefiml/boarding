import { ROUTES } from '@/app/routes';

export interface NavigationItem {
  label: string;
  path: string;
  hint: string;
  icon: NavigationIcon;
}

export type NavigationIcon =
  | 'dashboard'
  | 'onboarding'
  | 'matching'
  | 'appointments'
  | 'messaging'
  | 'journey'
  | 'resources';

const navigationIconPaths: Record<NavigationIcon, string> = {
  dashboard: 'M3.5 3.5h7v7h-7z M13.5 3.5h7v4.5h-7z M13.5 10.5h7v10h-7z M3.5 13.5h7v7h-7z',
  onboarding: 'M8 3.5h8 M9 3.5v2 M15 3.5v2 M5 7.5h14 M5.5 6h13a1.5 1.5 0 0 1 1.5 1.5V19a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19V7.5A1.5 1.5 0 0 1 5.5 6z M9.5 13.5l2 2 4-4',
  matching: 'M10 4.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11z M14.5 14.5L20 20',
  appointments:
    'M7 3.5v3 M17 3.5v3 M4.5 9.5h15 M5.5 6h13A1.5 1.5 0 0 1 20 7.5v11A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6z',
  messaging: 'M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19.5 17.5H10l-5.5 4v-4H4.5A1.5 1.5 0 0 1 3 16V7A1.5 1.5 0 0 1 4.5 5.5z',
  journey: 'M4 17.5h3l3.5-10l4.5 8l2-4h3 M4 6.5h3 M17 6.5h3',
  resources:
    'M5 4.5h6a3 3 0 0 1 3 3v12.5a3 3 0 0 0-3-3H5z M19 4.5h-6a3 3 0 0 0-3 3v12.5a3 3 0 0 1 3-3h6z',
};

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: ROUTES.dashboard, hint: 'Overview', icon: 'dashboard' },
  { label: 'Onboarding', path: ROUTES.onboarding, hint: 'Setup', icon: 'onboarding' },
  { label: 'Matching', path: ROUTES.matching, hint: 'Opportunities', icon: 'matching' },
  { label: 'Appointments', path: ROUTES.appointments, hint: 'Schedule', icon: 'appointments' },
  { label: 'Messaging', path: ROUTES.messaging, hint: 'Inbox', icon: 'messaging' },
  { label: 'Journey', path: ROUTES.journey, hint: 'Timeline', icon: 'journey' },
  { label: 'Resources', path: ROUTES.resources, hint: 'Knowledge', icon: 'resources' },
];

export function getNavigationIconPath(icon: NavigationIcon) {
  return navigationIconPaths[icon];
}
