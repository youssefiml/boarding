import '@/styles/ui/Input/Input.css';
import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  success?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, success, className, id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? props.name ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const helperMessage = hasError ? error : hasSuccess ? success : hint;
  const stateClass = hasError ? 'is-error' : hasSuccess ? 'is-success' : 'is-default';

  return (
    <label className="input-field" htmlFor={inputId}>
      <span className="input-field__label">{label}</span>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={hasError}
        aria-describedby={helperMessage ? messageId : undefined}
        className={cn('input-field__control', stateClass, className)}
        {...props}
      />
      {helperMessage ? (
        <span id={messageId} className={cn('input-field__message', stateClass)}>
          {helperMessage}
        </span>
      ) : null}
    </label>
  );
});