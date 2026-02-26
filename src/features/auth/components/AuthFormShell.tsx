import type { ReactNode } from 'react';

interface AuthFormShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthFormShell({ title, subtitle, children, footer }: AuthFormShellProps) {
  return (
    <div className="space-y-5">
      <header className="text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">{children}</div>

      {footer ? <div className="text-center text-sm text-slate-600">{footer}</div> : null}
    </div>
  );
}
