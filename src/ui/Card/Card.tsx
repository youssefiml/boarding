import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-panel backdrop-blur-sm transition-all duration-200 md:p-5 dark:border-slate-700/85 dark:bg-slate-900/90',
        className
      )}
      {...props}
    />
  );
}
