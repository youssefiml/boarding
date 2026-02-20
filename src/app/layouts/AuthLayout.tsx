import { Outlet, useLocation } from 'react-router-dom';

import boardingLogo from '@/assets/boarding-logo.png';
import authIllustrationImage from '@/assets/original-1515b5a9a4c928db996c1e2a4e379d40.png';
import { APP_NAME } from '@/lib/constants';

interface AuthIllustrationProps {
  compact?: boolean;
}

function AuthIllustration({ compact = false }: AuthIllustrationProps) {
  return (
    <figure className={`mx-auto w-full ${compact ? 'max-w-[280px]' : 'max-w-[420px]'}`}>
      <div
        className={`relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100 ${
          compact ? 'p-4' : 'p-6'
        }`}
      >
        <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-brand-200/45 blur-3xl" />

        <img
          src={authIllustrationImage}
          alt="Auth illustration"
          className="relative h-auto w-full object-contain"
        />
      </div>

      <figcaption className="mt-5 text-center">
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Unify onboarding, matching, and placement actions in one focused student workspace.
        </p>
      </figcaption>
    </figure>
  );
}

export function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname.includes('/login');

  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-4 sm:px-5 sm:py-8 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(143,214,184,0.45),transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(29,158,144,0.22),transparent_34%),linear-gradient(135deg,_#e8f6ee_0%,_#eef8f4_50%,_#f7fbff_100%)]" />

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid overflow-hidden rounded-3xl border border-emerald-200/80 bg-white/88 shadow-panelStrong backdrop-blur-sm sm:rounded-[2rem] lg:grid-cols-[1.05fr_0.95fr]">
          <section className="hidden min-h-[620px] items-center border-r border-emerald-200/70 bg-gradient-to-br from-emerald-100/70 via-emerald-50/65 to-teal-100/55 p-8 xl:p-10 lg:flex">
            <AuthIllustration />
          </section>

          <section className="relative bg-white/95 p-4 sm:p-7 lg:p-10">
            <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center">
              <div className="mb-4 hidden sm:block lg:hidden">
                <AuthIllustration compact />
              </div>

              <div className="mb-6 text-center lg:text-left">
                <img
                  src={boardingLogo}
                  alt={`${APP_NAME} logo`}
                  className="mx-auto h-auto w-full max-w-[190px] object-contain sm:max-w-[230px] lg:mx-0"
                />
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {isLogin ? 'Sign in to your workspace' : 'Create your student account'}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {isLogin
                    ? 'Continue where you left off and manage your placement journey.'
                    : 'Set up access to begin onboarding and matching.'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 shadow-sm sm:p-6">
                <Outlet />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


