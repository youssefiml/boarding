import '@/styles/ui/Button/Button.css';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'ui-button--primary',
  secondary: 'ui-button--secondary',
  outline: 'ui-button--outline',
  ghost: 'ui-button--ghost',
  danger: 'ui-button--danger',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'ui-button--sm',
  md: 'ui-button--md',
  lg: 'ui-button--lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, children, variant = 'primary', size = 'md', disabled, isLoading = false, ...props },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      className={cn('ui-button', variantClasses[variant], sizeClasses[size], className)}
      disabled={isDisabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="ui-button__spinner" aria-hidden />
          <span>Loading</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});