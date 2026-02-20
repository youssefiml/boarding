import '@/styles/app/feedback/GlobalLoadingOverlay/GlobalLoadingOverlay.css';
import { useUiStore } from '@/stores/ui.store';

export function GlobalLoadingOverlay() {
  const pendingRequests = useUiStore((state) => state.pendingRequests);

  if (pendingRequests <= 0) {
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