import '@/styles/ui/ProgressBar/ProgressBar.css';
import { cn } from '@/lib/cn';

interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('progress-bar', className)}>
      <div className="progress-bar__fill" style={{ width: `${normalizedValue}%` }} />
    </div>
  );
}