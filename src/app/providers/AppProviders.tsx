import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { GlobalLoadingOverlay } from '@/app/feedback/GlobalLoadingOverlay/GlobalLoadingOverlay';
import { ROUTES } from '@/app/routes';
import type { ThemeMode } from '@/stores/theme.store';
import { useThemeStore } from '@/stores/theme.store';
import { useUiStore } from '@/stores/ui.store';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const location = useLocation();
  const lastError = useUiStore((state) => state.lastError);
  const clearError = useUiStore((state) => state.clearError);
  const themeMode = useThemeStore((state) => state.mode);
  const isAuthRoute = location.pathname.startsWith(ROUTES.login) || location.pathname.startsWith(ROUTES.register);
  const appliedThemeMode: ThemeMode = isAuthRoute ? 'light' : themeMode;

  useEffect(() => {
    if (!lastError) {
      return;
    }

    toast.error(lastError);
    clearError();
  }, [clearError, lastError]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', appliedThemeMode === 'dark');
    root.dataset.theme = appliedThemeMode;
  }, [appliedThemeMode]);

  const toastStyle = getToastStyle(appliedThemeMode);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: toastStyle,
        }}
      />
      <GlobalLoadingOverlay />
    </>
  );
}

function getToastStyle(themeMode: ThemeMode) {
  if (themeMode === 'dark') {
    return {
      border: '1px solid rgba(71, 85, 105, 0.95)',
      background: 'rgba(15, 23, 42, 0.96)',
      color: '#e2e8f0',
      fontSize: '0.9rem',
      borderRadius: '14px',
      boxShadow: '0 20px 50px -28px rgba(2, 6, 23, 0.75)',
    };
  }

  return {
    border: '1px solid #d0d5dd',
    background: '#ffffff',
    color: '#101828',
    fontSize: '0.9rem',
    borderRadius: '14px',
    boxShadow: '0 18px 45px -26px rgba(15, 23, 42, 0.45)',
  };
}

