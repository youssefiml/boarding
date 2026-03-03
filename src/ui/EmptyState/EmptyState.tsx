import '@/styles/ui/EmptyState/EmptyState.css';
import { cn } from '@/lib/cn';
import { Button } from '@/ui/Button/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'warning' | 'danger';
}

export function EmptyState({ title, description, actionLabel, onAction, tone = 'neutral' }: EmptyStateProps) {
  return (
    <div className={cn('empty-state', `empty-state--${tone}`)} role="status" aria-live="polite">
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {actionLabel && onAction ? (
        <Button className="empty-state__action" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
