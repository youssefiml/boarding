import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingLabel?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-transparent bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800 focus-visible:ring-brand-200 dark:bg-brand-500 dark:hover:bg-brand-400 dark:active:bg-brand-500 dark:focus-visible:ring-brand-500/40',
  secondary:
    'border border-slate-200 bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:active:bg-slate-700 dark:focus-visible:ring-slate-600',
  outline:
    'border border-slate-300 bg-white text-slate-800 shadow-sm hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:active:bg-slate-700 dark:focus-visible:ring-slate-600',
  ghost:
    'border border-transparent bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700 dark:focus-visible:ring-slate-600',
  danger:
    'border border-transparent bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-200 dark:bg-rose-500 dark:hover:bg-rose-400 dark:active:bg-rose-500 dark:focus-visible:ring-rose-500/40',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-4 text-sm',
  md: 'min-h-11 px-4 text-sm md:min-h-12 md:px-5',
  lg: 'min-h-12 px-5 text-sm md:min-h-[3.25rem] md:px-6 md:text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, children, variant = 'primary', size = 'md', disabled, isLoading = false, loadingLabel = 'Loading', ...props },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-[0.01em] transition-[background-color,border-color,color,opacity,box-shadow,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:-translate-y-px data-[loading=true]:cursor-progress',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      data-loading={isLoading ? 'true' : 'false'}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});
