import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  success?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, success, className, id, children, ...props },
  ref
) {
  const generatedId = useId();
  const selectId = id ?? props.name ?? generatedId;
  const messageId = `${selectId}-message`;
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const helperMessage = hasError ? error : hasSuccess ? success : hint;
  const controlStateClass = hasError
    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500/70 dark:bg-rose-500/10 dark:focus:border-rose-400 dark:focus:ring-rose-500/30'
    : hasSuccess
      ? 'border-emerald-400 bg-emerald-50/30 focus:border-emerald-500 focus:ring-emerald-100 dark:border-emerald-500/70 dark:bg-emerald-500/10 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30'
      : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100 dark:border-slate-600 dark:focus:border-brand-400 dark:focus:ring-brand-500/30';
  const messageStateClass = hasError
    ? 'font-medium text-rose-700 dark:text-rose-300'
    : hasSuccess
      ? 'font-medium text-emerald-700 dark:text-emerald-300'
      : 'text-slate-500 dark:text-slate-400';

  return (
    <label className="flex w-full flex-col gap-2" htmlFor={selectId}>
      <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200">{label}</span>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={hasError}
        aria-describedby={helperMessage ? messageId : undefined}
        className={cn(
          'min-h-12 w-full rounded-xl border bg-white px-4 text-base text-slate-900 shadow-sm transition-[border-color,box-shadow,background-color] duration-150 ease-out focus:outline-none focus:ring-4 md:text-sm dark:bg-slate-900 dark:text-slate-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 dark:disabled:border-slate-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-500',
          controlStateClass,
          className
        )}
        {...props}
      >
        {children}
      </select>
      {helperMessage ? (
        <span
          id={messageId}
          role={hasError ? 'alert' : 'status'}
          aria-live={hasError ? 'assertive' : 'polite'}
          className={cn('text-xs leading-5', messageStateClass)}
        >
          {helperMessage}
        </span>
      ) : null}
    </label>
  );
});
