import '@/styles/ui/Badge/Badge.css';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

type BadgeVariant = 'brand' | 'success' | 'warning' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  brand: 'badge--brand',
  success: 'badge--success',
  warning: 'badge--warning',
  neutral: 'badge--neutral',
};

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return <span className={cn('badge', variantClasses[variant], className)} {...props} />;
}