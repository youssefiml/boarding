'use client';

import dynamic from 'next/dynamic';

const SpaApp = dynamic(() => import('@/app/App'), {
  ssr: false,
  loading: () => <div className="min-h-dvh bg-[var(--surface-page)]" aria-live="polite" />,
});

export function ClientOnlySpa() {
  return <SpaApp />;
}
