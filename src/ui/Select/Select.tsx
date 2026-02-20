import '@/styles/ui/Select/Select.css';
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
  const stateClass = hasError ? 'is-error' : hasSuccess ? 'is-success' : 'is-default';

  return (
    <label className="select-field" htmlFor={selectId}>
      <span className="select-field__label">{label}</span>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={hasError}
        aria-describedby={helperMessage ? messageId : undefined}
        className={cn('select-field__control', stateClass, className)}
        {...props}
      >
        {children}
      </select>
      {helperMessage ? (
        <span id={messageId} className={cn('select-field__message', stateClass)}>
          {helperMessage}
        </span>
      ) : null}
    </label>
  );
});