import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/routes';
import boardingLogo from '@/assets/boarding-logo.png';
import { cn } from '@/lib/cn';

interface LandingNavItem {
  label: string;
  href: string;
}

interface LandingNavbarProps {
  brandName?: string;
  brandSubtitle?: string;
  navItems?: readonly LandingNavItem[];
  loginLabel?: string;
  applyLabel?: string;
  applyHref?: string;
}

const defaultNavItems: readonly LandingNavItem[] = [
  { label: 'Products', href: '#concept' },
  { label: 'Pricing', href: '#offres' },
  { label: 'Processus', href: '#processus' },
  { label: 'Blog', href: '#temoignages' },
  { label: 'Contact', href: '#contact' },
];

const defaultApplyHref = 'mailto:lagenceboarding@gmail.com?subject=Rendez-vous%20gratuit%20Boarding';
const landingShellClass = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';
const focusRingClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

export function LandingNavbar({
  brandName = 'Boarding',
  brandSubtitle = 'Agency',
  navItems = defaultNavItems,
  loginLabel = 'Log In',
  applyLabel = 'Apply Now',
  applyHref = defaultApplyHref,
}: LandingNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="pointer-events-none relative z-30 py-4 sm:py-6">
      <div
        className="pointer-events-none absolute right-0 top-0 z-0 h-28 w-72 rounded-full opacity-60 blur-3xl sm:right-8 sm:w-96"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 24% 45%, rgba(78, 140, 255, 0.18), transparent 40%), radial-gradient(circle at 62% 36%, rgba(8, 145, 178, 0.14), transparent 38%), radial-gradient(circle at 80% 72%, rgba(255, 255, 255, 0.6), transparent 36%)',
        }}
      />

      <div className={cn(landingShellClass, 'pointer-events-none relative z-10')}>
        <div className="pointer-events-auto grid min-h-[4.75rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[1.6rem] border border-slate-900/10 bg-white/85 px-3 py-2 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl transition-all duration-200 sm:px-4 lg:grid-cols-[minmax(180px,0.75fr)_minmax(0,1.6fr)_minmax(180px,0.75fr)] lg:rounded-full lg:px-4">
          <a
            href="#accueil"
            className={cn(
              'inline-flex min-w-0 items-center gap-3 rounded-full p-1 pr-2 text-left transition-colors hover:bg-slate-900/5 sm:pr-3',
              focusRingClass
            )}
            aria-label="Retour à l’accueil Boarding"
            onClick={closeMenu}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d8eaf7] shadow-sm"
              aria-hidden="true"
              style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f4faff 100%)' }}
            >
              <img
                src={boardingLogo}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: '50% 50%', transform: 'scale(1.9)' }}
              />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-base font-extrabold text-[#07182f]">{brandName}</span>
              <span className="hidden truncate text-xs font-bold text-slate-500 min-[421px]:block">{brandSubtitle}</span>
            </span>
          </a>

          <nav className="hidden items-center justify-center gap-1 rounded-full bg-slate-900/5 p-1 lg:flex" aria-label="Navigation principale">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold text-slate-700 transition-all duration-150 hover:bg-white hover:text-[#07182f] hover:shadow-[0_4px_12px_-6px_rgba(15,23,42,0.14)]',
                  focusRingClass
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center justify-end gap-2 lg:flex">
            <Link
              to={ROUTES.login}
              className={cn(
                'inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold text-slate-700 transition-all duration-150 hover:bg-slate-900/5 hover:text-[#07182f]',
                focusRingClass
              )}
            >
              {loginLabel}
            </Link>
            <a
              href={applyHref}
              className={cn(
                'inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(29,79,208,0.55)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(29,79,208,0.6)]',
                focusRingClass
              )}
            >
              {applyLabel}
            </a>
          </div>

          <button
            type="button"
            className={cn(
              'inline-flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-1.5 justify-self-end rounded-full border border-slate-900/10 bg-white text-[#07182f] shadow-sm transition-colors hover:bg-[#f4faff] lg:hidden',
              focusRingClass
            )}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
            aria-controls="landing-mobile-menu"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </button>
        </div>

        <div
          id="landing-mobile-menu"
          className={cn(
            'pointer-events-auto mt-3 rounded-[1.75rem] border border-slate-900/10 bg-white/95 p-3 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.18)] backdrop-blur-2xl lg:hidden',
            isMenuOpen ? 'block' : 'hidden'
          )}
        >
          <nav className="grid gap-1" aria-label="Navigation mobile">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-[#f4faff] hover:text-[#07182f]',
                  focusRingClass
                )}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-3 grid gap-2 border-t border-slate-900/10 pt-3 sm:grid-cols-2">
            <Link
              to={ROUTES.login}
              className={cn(
                'inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-extrabold text-slate-700 transition-all duration-150 hover:bg-slate-900/5 hover:text-[#07182f]',
                focusRingClass
              )}
              onClick={closeMenu}
            >
              {loginLabel}
            </Link>
            <a
              href={applyHref}
              className={cn(
                'inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(29,79,208,0.55)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-8px_rgba(29,79,208,0.6)]',
                focusRingClass
              )}
              onClick={closeMenu}
            >
              {applyLabel}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
