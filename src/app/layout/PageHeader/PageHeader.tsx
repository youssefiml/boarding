import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="mb-5 flex animate-fade-in-up flex-col gap-3 md:mb-7 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Workspace</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl dark:text-slate-100">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
      </div>
      {action ? <div className="w-full md:w-auto">{action}</div> : null}
    </header>
  );
}
