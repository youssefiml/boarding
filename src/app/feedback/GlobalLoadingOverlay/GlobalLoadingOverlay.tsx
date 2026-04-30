import { useEffect, useRef, useState } from 'react';
import { useUiStore } from '@/stores/ui.store';

const SHOW_DELAY_MS = 120;
const MIN_VISIBLE_MS = 240;

export function GlobalLoadingOverlay() {
  const pendingRequests = useUiStore((state) => state.pendingRequests);
  const [isVisible, setIsVisible] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (showTimerRef.current) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (pendingRequests > 0) {
      if (isVisible) {
        return undefined;
      }

      showTimerRef.current = window.setTimeout(() => {
        shownAtRef.current = Date.now();
        setIsVisible(true);
      }, SHOW_DELAY_MS);

      return undefined;
    }

    if (!isVisible) {
      return undefined;
    }

    const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : MIN_VISIBLE_MS;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    hideTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      shownAtRef.current = null;
    }, remaining);

    return undefined;
  }, [isVisible, pendingRequests]);

  useEffect(
    () => () => {
      if (showTimerRef.current) {
        window.clearTimeout(showTimerRef.current);
      }

      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    },
    []
  );

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center p-3 sm:justify-end sm:p-4">
      <div className="pointer-events-auto inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-panel motion-toast-enter dark:border-slate-700 dark:bg-slate-900">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" aria-hidden />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Updating workspace...</span>
      </div>
    </div>
  );
}
