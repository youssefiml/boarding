import { forwardRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

import { AuthField } from '@/features/auth/components/AuthField';
import type { AuthFieldProps } from '@/features/auth/components/AuthField';

interface AuthPasswordFieldProps extends Omit<AuthFieldProps, 'type'> {
  capsLockMessage?: string;
  onCapsLockChange?: (value: boolean) => void;
}

function EyeOpenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M1.5 12s3.9-7 10.5-7 10.5 7 10.5 7-3.9 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.5A10.5 10.5 0 0 1 12 6c6.6 0 10.5 6 10.5 6a20.8 20.8 0 0 1-3.3 4.4" />
      <path d="M6.5 9A19.4 19.4 0 0 0 1.5 12s3.9 7 10.5 7c1.2 0 2.3-.2 3.4-.6" />
      <path d="M9.9 9.9A3.2 3.2 0 0 0 14 14" />
    </svg>
  );
}

export const AuthPasswordField = forwardRef<HTMLInputElement, AuthPasswordFieldProps>(function AuthPasswordField(
  { hint, capsLockMessage = 'Caps Lock is on', onCapsLockChange, onKeyDown, onKeyUp, onBlur, ...props },
  ref
) {
  const [isVisible, setIsVisible] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const syncCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    const nextValue = event.getModifierState('CapsLock');
    setCapsLockOn(nextValue);
    onCapsLockChange?.(nextValue);
  };

  return (
    <AuthField
      ref={ref}
      type={isVisible ? 'text' : 'password'}
      hint={capsLockOn ? capsLockMessage : hint}
      onKeyDown={(event) => {
        syncCapsLock(event);
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        syncCapsLock(event);
        onKeyUp?.(event);
      }}
      onBlur={(event) => {
        setCapsLockOn(false);
        onCapsLockChange?.(false);
        onBlur?.(event);
      }}
      rightAdornment={
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
        </button>
      }
      {...props}
    />
  );
});
