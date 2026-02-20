import { Outlet } from 'react-router-dom';

import { AppSidebar } from '@/app/layout/AppSidebar/AppSidebar';
import { AppTopbar } from '@/app/layout/AppTopbar/AppTopbar';

export function AppLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden text-slate-900 transition-colors dark:text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] gap-3 px-2 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:gap-6 lg:px-6">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar />
          <main className="mt-3 flex-1 overflow-x-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-panel animate-fade-in-up transition-colors sm:mt-4 sm:rounded-3xl sm:p-5 lg:p-6 dark:border-slate-700/90 dark:bg-slate-900/90">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}



