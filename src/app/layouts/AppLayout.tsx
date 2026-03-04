import { Outlet } from 'react-router-dom';

import { AppSidebar } from '@/app/layout/AppSidebar/AppSidebar';
import { AppTopbar } from '@/app/layout/AppTopbar/AppTopbar';
import { RouteTransition } from '@/app/layout/RouteTransition';

export function AppLayout() {
  return (
    <div className="min-h-dvh overflow-x-hidden text-slate-900 transition-colors dark:text-slate-100">
      <div className="mx-auto flex min-h-dvh w-full max-w-[var(--app-shell-max-width)] gap-2 px-[var(--app-shell-gutter)] pb-3 pt-2 md:gap-4 md:pb-4 md:pt-4 lg:gap-6">
        <AppSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AppTopbar />
          <main className="mt-2 flex-1 overflow-x-hidden p-3 pb-5 transition-colors md:mt-4 md:rounded-3xl md:border md:border-slate-200/90 md:bg-white/95 md:p-5 md:shadow-panel lg:p-6 dark:md:border-slate-700/90 dark:md:bg-slate-900/90">
            <RouteTransition>
              <Outlet />
            </RouteTransition>
          </main>
        </div>
      </div>
    </div>
  );
}
