import '@/styles/app/feedback/GlobalLoadingOverlay/GlobalLoadingOverlay.css';
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
    <div className="global-loading-overlay">
      <div className="global-loading-overlay__content">
        <span className="global-loading-overlay__spinner" aria-hidden />
        <span className="global-loading-overlay__text">Updating workspace...</span>
      </div>
    </div>
  );
}
