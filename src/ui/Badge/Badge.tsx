import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type BadgeVariant = 'brand' | 'success' | 'warning' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  brand: 'border border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-400/80 dark:bg-brand-500/35 dark:text-brand-50',
  success: 'border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/80 dark:bg-emerald-500/35 dark:text-emerald-50',
  warning: 'border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/80 dark:bg-amber-500/35 dark:text-amber-50',
  neutral: 'border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-500 dark:bg-slate-700/85 dark:text-slate-100',
};

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide', variantClasses[variant], className)}
      {...props}
    />
  );
}
