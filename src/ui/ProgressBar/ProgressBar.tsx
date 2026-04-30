import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700', className)}>
      <div className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500 transition-all duration-500" style={{ width: `${normalizedValue}%` }} />
    </div>
  );
}
