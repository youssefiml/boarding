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
    <div
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/85 px-4 py-8 text-center sm:px-6 sm:py-10 dark:border-slate-600 dark:bg-slate-800/60',
        tone === 'warning' && 'border-amber-300 bg-amber-50/70 dark:border-amber-500/45 dark:bg-amber-500/10',
        tone === 'danger' && 'border-rose-300 bg-rose-50/70 dark:border-rose-500/45 dark:bg-rose-500/10'
      )}
      role="status"
      aria-live="polite"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5 w-full sm:w-auto" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
