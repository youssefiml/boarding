import '@/styles/ui/TextArea/TextArea.css';
import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  success?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, success, className, id, ...props },
  ref
) {
  const generatedId = useId();
  const textAreaId = id ?? props.name ?? generatedId;
  const messageId = `${textAreaId}-message`;
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success) && !hasError;
  const helperMessage = hasError ? error : hasSuccess ? success : hint;
  const stateClass = hasError ? 'is-error' : hasSuccess ? 'is-success' : 'is-default';

  return (
    <label className="textarea-field" htmlFor={textAreaId}>
      <span className="textarea-field__label">{label}</span>
      <textarea
        ref={ref}
        id={textAreaId}
        aria-invalid={hasError}
        aria-describedby={helperMessage ? messageId : undefined}
        className={cn('textarea-field__control', stateClass, className)}
        {...props}
      />
      {helperMessage ? (
        <span id={messageId} className={cn('textarea-field__message', stateClass)}>
          {helperMessage}
        </span>
      ) : null}
    </label>
  );
});