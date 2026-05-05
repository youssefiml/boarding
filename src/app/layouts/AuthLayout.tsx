import { Outlet } from 'react-router-dom';

import boardingLogo from '@/assets/boarding-logo.webp';
import { RouteTransition } from '@/app/layout/RouteTransition';
import { APP_NAME } from '@/lib/constants';

const authBenefits = [
  'One guided flow from onboarding to placement actions.',
  'Fast updates on matches, interviews, and student progress.',
] as const;

export function AuthLayout() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-50/80 to-slate-100 px-3 py-4 sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 shadow-panel sm:rounded-[2rem] lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="hidden border-r border-emerald-100 bg-emerald-50/70 p-8 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">BOARDING platform</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-slate-900">
              Calm workflows for faster student placement.
            </h2>

            <ul className="mt-6 space-y-3">
              {authBenefits.map((item) => (
                <li key={item} className="rounded-xl border border-emerald-200/70 bg-white/70 px-3 py-2 text-sm text-slate-700">
                  {item}
                </li>
              ))}
            </ul>

            <blockquote className="mt-8 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              "BOARDING gave us one clear place to track onboarding, interviews, and next actions."
            </blockquote>
          </aside>

          <section className="bg-white/95 px-4 py-6 sm:px-8 sm:py-9 lg:px-10">
            <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center">
              <div className="mb-6 text-center">
                <img src={boardingLogo} alt={`${APP_NAME} logo`} className="mx-auto h-auto w-full max-w-[180px] object-contain sm:max-w-[210px]" />
              </div>

              <div>
                <RouteTransition>
                  <Outlet />
                </RouteTransition>
              </div>

              <p className="mt-6 text-center text-xs text-slate-500">
                Need support?{' '}
                <a href="mailto:support@boarding.dev" className="font-semibold text-brand-700 hover:text-brand-800">
                  Contact support
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

