import { Outlet, useLocation } from 'react-router-dom';

import { AppSidebar } from '@/app/layout/AppSidebar/AppSidebar';
import { AppTopbar } from '@/app/layout/AppTopbar/AppTopbar';
import { MobileBottomNav } from '@/app/layout/MobileBottomNav/MobileBottomNav';
import { ROUTES } from '@/app/routes';
import { cn } from '@/lib/cn';

export function AppLayout() {
  const location = useLocation();
  const hideMobileNav = location.pathname.startsWith(ROUTES.onboarding) || location.pathname.startsWith(ROUTES.journey);

  return (
    <div className="min-h-dvh overflow-x-hidden text-slate-900 transition-colors dark:text-slate-100">
      <div
        className={cn(
          'mx-auto flex min-h-dvh w-full max-w-[1440px] gap-3 px-2 pt-3 sm:gap-4 sm:px-4 sm:pt-4 lg:gap-6 lg:px-6 xl:pb-4',
          hideMobileNav ? 'pb-3 sm:pb-4' : 'pb-[calc(env(safe-area-inset-bottom)+82px)]'
        )}
      >
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar />
          <main className="mt-3 flex-1 overflow-x-hidden p-2 animate-fade-in-up transition-colors sm:mt-4 sm:rounded-3xl sm:border sm:border-slate-200/90 sm:bg-white/95 sm:p-5 sm:shadow-panel lg:p-6 dark:sm:border-slate-700/90 dark:sm:bg-slate-900/90">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}
