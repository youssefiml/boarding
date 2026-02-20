import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/routes';
import { Button } from '@/ui/Button/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">404</p>
        <h1 className="mt-2 font-display text-4xl text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">The page you are looking for does not exist.</p>
        <Link to={ROUTES.dashboard} className="mt-6 inline-block">
          <Button>Go to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}

