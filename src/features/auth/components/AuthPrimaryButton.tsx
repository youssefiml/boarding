import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';
import { Button } from '@/ui/Button/Button';

type AuthPrimaryButtonProps = ComponentPropsWithoutRef<typeof Button>;

export function AuthPrimaryButton({ className, ...props }: AuthPrimaryButtonProps) {
  return <Button className={cn('w-full min-h-12', className)} {...props} />;
}
