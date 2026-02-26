import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  labelAction?: ReactNode;
  rightAdornment?: ReactNode;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  { id, name, label, error, hint, labelAction, rightAdornment, className, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const helperMessage = error || hint;
  const helperId = helperMessage ? `${inputId}-helper` : undefined;
  const hasError = Boolean(error);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-800">
          {label}
        </label>
        {labelAction ? <div className="text-xs font-semibold text-brand-700">{labelAction}</div> : null}
      </div>

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          name={name}
          aria-invalid={hasError}
          aria-describedby={helperId}
          className={cn(
            'h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-4',
            hasError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-100',
            rightAdornment ? 'pr-12' : '',
            className
          )}
          {...props}
        />

        {rightAdornment ? <div className="absolute inset-y-0 right-2 flex items-center">{rightAdornment}</div> : null}
      </div>

      {helperMessage ? (
        <p id={helperId} className={cn('text-xs', hasError ? 'font-medium text-rose-700' : 'text-slate-500')}>
          {helperMessage}
        </p>
      ) : null}
    </div>
  );
});

export type { AuthFieldProps };
