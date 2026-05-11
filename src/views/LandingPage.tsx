import type { CSSProperties } from 'react';
import { IoIosAirplane } from 'react-icons/io';

import angyAvatar from '@/assets/Angy.webp';
import boardingLogo from '@/assets/boarding-logo.webp';
import heroGlobeImage from '@/assets/hero-globe-cutout.webp';
import heroStudentImage from '@/assets/hero-student-cutout.webp';
import heroSpaceBackground from '@/assets/heroSpaceBackground.webp';
import saraAvatar from '@/assets/Sara.webp';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { PricingSection } from '@/features/landing/components/PricingSection';
import ProcessSection from '@/features/landing/components/ProcessSection';
import { WhoWeAreSection } from '@/features/landing/components/WhoWeAreSection';
import { assetUrl } from '@/lib/asset-url';
import { cn } from '@/lib/cn';

const appointmentHref = 'mailto:lagenceboarding@gmail.com?subject=Rendez-vous%20gratuit%20Boarding';

const destinations = [
  {
    city: 'Maroc',
    tags: ['Marrakech', 'Casablanca', 'Entreprises partenaires', 'Logements vérifiés'],
    description:
      'Marrakech, Casablanca… Le Maroc est au cœur de notre projet. Un véritable terrain d’opportunités, d’apprentissage et de développement personnel. Partenariats déjà en place avec des entreprises et restaurants de M Avenue.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Marrakech%20skyline%20view.jpg',
  },
] as const;

const testimonials = [
  {
    name: 'Angy El Kady',
    subtitle: 'Étudiante en Management • IE Business School',
    context: 'Stage en communication • Casablanca',
    packLabel: 'Pack First Class',
    packType: 'first-class',
    rating: '5/5',
    quote:
      "J’ai effectué mon stage en communication à Casablanca dans le cadre de mon Master en Management à l’IE Business School. J’ai adoré l’accompagnement que j’ai reçu en choisissant le pack First Class de Boarding. Tout a été pris en charge, ce qui m’a permis de me concentrer pleinement sur mon expérience. J’ai eu la chance d’intégrer une entreprise où j’ai réellement pu comprendre le monde du marketing et développer des compétences concrètes. Ce stage a été une véritable opportunité, puisqu’il m’a permis de décrocher une offre d’emploi au sein de l’entreprise. Aujourd’hui, je suis épanouie dans mon travail. L’équipe Boarding reste toujours disponible et à l’écoute, même après la fin du stage. Je recommande à 100 %.",
    bottomPill: 'Stage à Casablanca, Maroc',
    initials: 'AE',
    avatarGradient: 'from-[#bfdbfe] via-[#60a5fa] to-[#1d4ed8]',
    avatarSrc: assetUrl(angyAvatar),
    avatarAlt: 'Portrait de Angy El Kady',
  },
  {
    name: 'Rey Lecomte',
    subtitle: 'Étudiant accompagné par Boarding',
    context: 'Stage en développement web • Maroc',
    packLabel: 'Pack Business',
    packType: 'business',
    rating: '5/5',
    quote:
      "Avant de partir, j’étais quelqu’un de très timide et j’avais beaucoup d’appréhension à l’idée de faire un stage à l’étranger. En choisissant le pack Business de Boarding, tout a été géré pour moi, ce qui m’a énormément rassuré. J’ai effectué mon stage dans une entreprise spécialisée dans le développement de sites web pour des entreprises, et l’expérience a été incroyable. J’ai même eu la chance de bénéficier d’une organisation flexible avec du télétravail le vendredi, ce qui m’a permis de découvrir le Maroc en parallèle. Mon stage a duré 3 mois, et j’en ressors grandi, avec des souvenirs incroyables. Je recommande pleinement Boarding. Merci encore à toute l’équipe !",
    bottomPill: 'Stage de 3 mois • Maroc',
    initials: 'RL',
    avatarGradient: 'from-[#93c5fd] via-[#60a5fa] to-[#2563eb]',
    avatarSrc: assetUrl(saraAvatar),
    avatarAlt: 'Portrait de Rey Lecomte',
  },
] as const;

const landingShellClass = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';
const landingSectionClass = 'relative py-12 sm:py-14 lg:py-16 [scroll-margin-top:6rem]';
const landingSectionHeadingClass = 'mx-auto max-w-3xl text-center';
const landingSectionTitleClass = 'mt-3 text-[clamp(1.6rem,3.2vw,3.25rem)] font-extrabold leading-tight text-[#07182f]';
const landingSectionParagraphClass = 'mt-4 text-base leading-7 text-slate-500 sm:text-lg';
const landingKickerClass = 'inline-flex text-base font-extrabold uppercase tracking-[0.18em] text-brand-600 sm:text-lg';
const landingButtonBaseClass =
  'inline-flex min-h-12 w-full items-center justify-center rounded-xl border px-5 py-2.5 text-center text-sm font-bold leading-5 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto';
const landingButtonPrimaryClass =
  'border-[#2557D6] bg-[#2557D6] text-white shadow-[0_20px_36px_-22px_rgba(37,87,214,0.95)] hover:bg-[#224fc4] hover:shadow-[0_24px_40px_-20px_rgba(37,87,214,0.9)] focus-visible:ring-[#2557D6]/70';
const landingSurfaceCardClass = 'rounded-3xl border border-slate-200 bg-white shadow-[0_4px_14px_-8px_rgba(15,23,42,0.08)]';
const heroMotionClass = 'motion-safe:animate-fade-in-up';
const navActionButtonBaseClass =
  'inline-flex items-center justify-center whitespace-nowrap rounded-[14px] px-7 text-[15px] font-semibold leading-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152b] lg:h-12 max-[1366px]:h-11 max-[1366px]:px-5 max-[1366px]:text-sm';

const heroStats = [
  { value: '+500', label: 'Étudiants accompagnés', icon: 'network' },
  { value: '+120', label: 'Entreprises partenaires', icon: 'building' },
  { value: 'Maroc', label: 'Destination V1', icon: 'globe' },
  { value: '92%', label: 'Taux de satisfaction', icon: 'heart' },
] as const;

const heroMoroccoCities = [
  { label: 'Casablanca', className: 'city-casablanca', delay: '640ms' },
  { label: 'Marrakech', className: 'city-marrakech', delay: '800ms' },
] as const;

const heroNavItems: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Processus', href: '#processus' },
  { label: 'À propos de nous', href: '#concept' },
];

function HeroStatIcon({ icon }: { icon: (typeof heroStats)[number]['icon'] }) {
  const cls = 'h-7 w-7';

  if (icon === 'building') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18" />
        <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M4 22h16" />
      </svg>
    );
  }

  if (icon === 'globe') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9S14.4 18.4 12 21M12 3C9.6 5.6 8.4 8.6 8.4 12s1.2 6.4 3.6 9" />
      </svg>
    );
  }

  if (icon === 'heart') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21l8.8-8a5.2 5.2 0 0 0 0-7.4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 8.6 15.4 15.5M15.5 8.5 8.6 15.4M12 3v3M12 18v3M3 12h3M18 12h3" />
    </svg>
  );
}

function HeroSection() {
  return (
    <section className="hero relative isolate overflow-hidden bg-[#020817] text-white [scroll-margin-top:6rem] lg:min-h-[min(96vh,980px)]" id="accueil">
      <img
        src={assetUrl(heroSpaceBackground)}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full select-none object-cover opacity-[0.55]"
        loading="eager"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_32%,rgba(42,124,255,0.35),transparent_43%),radial-gradient(circle_at_18%_18%,rgba(18,90,215,0.22),transparent_40%),linear-gradient(180deg,#030a1e_0%,#051333_48%,#041025_100%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.7)_1px,transparent_1px),radial-gradient(circle_at_66%_68%,rgba(255,255,255,0.45)_1px,transparent_1px),radial-gradient(circle_at_88%_28%,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:240px_240px,300px_300px,220px_220px]" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[6%] top-[22%] -z-10 h-72 w-72 rounded-full bg-[#1f5cff]/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[8%] top-[40%] -z-10 h-[32rem] w-[32rem] rounded-full bg-[#1487ff]/20 blur-[110px]" aria-hidden="true" />

      <div className="hero-inner relative z-20 mx-auto w-full max-w-[1536px] px-5 sm:px-8 lg:px-[56px] max-[1280px]:px-8">
        <header className="header flex h-24 items-center justify-between gap-4">
          <a href="#accueil" className="inline-flex shrink-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152b]" aria-label="Accueil Boarding">
            <img src={assetUrl(boardingLogo)} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover [object-position:50%_50%] [transform:scale(1.8)]" />
            <span className="whitespace-nowrap text-3xl font-extrabold uppercase tracking-[0.01em] text-white max-[1100px]:text-[1.72rem]">BOARDING</span>
          </a>

          <nav className="nav mx-6 hidden flex-1 items-center justify-center gap-[44px] whitespace-nowrap lg:flex max-[1280px]:gap-8 max-[1100px]:gap-5" aria-label="Navigation principale">
            {heroNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-[1.08rem] font-bold text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152b] max-[1280px]:text-base max-[1100px]:text-[0.9rem]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions flex shrink-0 items-center gap-2">
            <a
              href="/login"
              className={cn(
                navActionButtonBaseClass,
                'hidden min-w-[150px] border border-white/35 bg-white/[0.02] text-white shadow-[0_20px_40px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors hover:bg-white/10 focus-visible:ring-brand-300 sm:inline-flex'
              )}
            >
              Se connecter
            </a>
            <a
              href={appointmentHref}
              className={cn(
                navActionButtonBaseClass,
                landingButtonPrimaryClass,
                'min-w-[132px] hover:translate-y-0 hover:bg-[#2557D6] hover:shadow-[0_20px_36px_-22px_rgba(37,87,214,0.95)]'
              )}
            >
              Candidater
            </a>
          </div>
        </header>

        <div className="hero-main relative grid items-center gap-10 pt-4 lg:min-h-[min(64vh,700px)] lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-12">
          <div className="hero-content relative z-30 max-w-[560px]">
            <p
              className={cn(
                'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-bold text-white shadow-[0_18px_30px_-24px_rgba(0,0,0,0.9)] ring-1 ring-cyan-300/20 backdrop-blur-md',
                heroMotionClass
              )}
              style={{ animationDelay: '80ms' }}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#2bb0ff]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9S14.4 18.4 12 21M12 3C9.6 5.6 8.4 8.6 8.4 12s1.2 6.4 3.6 9" />
              </svg>
              La startup créée par des jeunes pour des jeunes
            </p>

            <h1 className={cn('hero-title mt-8 text-lg font-extrabold leading-tight text-white', heroMotionClass)} style={{ animationDelay: '160ms' }}>
              Trouve ton stage à l’étranger, sans prise de tête
            </h1>

            <p className={cn('hero-description mt-6 max-w-[560px] text-base leading-[1.6] text-slate-200 sm:text-lg', heroMotionClass)} style={{ animationDelay: '240ms' }}>
              En choisissant Boarding, tu contribues directement à donner à un étudiant marocain défavorisé l’opportunité de poursuivre ses études.
            </p>

            <div className={cn('hero-actions mt-10 flex flex-col gap-4 lg:flex-row lg:gap-4', heroMotionClass)} style={{ animationDelay: '320ms' }}>
              <a
                href="/register"
                className={cn(
                  landingButtonBaseClass,
                  landingButtonPrimaryClass,
                  'group w-full sm:w-auto focus-visible:ring-offset-[#07152b]'
                )}
              >
                <span className="btn-label">Postuler maintenant</span>
                <span className="btn-icon transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  <IoIosAirplane className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>

          <div className={cn('hero-visual relative h-[520px] w-full overflow-visible sm:h-[580px] lg:h-[clamp(560px,64vh,700px)] lg:translate-x-3 max-[1280px]:h-[clamp(520px,60vh,620px)] max-[1280px]:translate-x-0', heroMotionClass)} style={{ animationDelay: '420ms' }}>
            <div className="hero-visual-glow pointer-events-none absolute right-[88px] top-[104px] z-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(49,144,255,0.58),rgba(29,95,215,0.24)_56%,transparent_78%)] blur-[56px] max-[1280px]:right-[60px] max-[1280px]:top-[92px] max-[1280px]:h-[340px] max-[1280px]:w-[340px]" aria-hidden="true" />

            <img
              src={assetUrl(heroGlobeImage)}
              alt=""
              aria-hidden="true"
              className="globe pointer-events-none absolute right-[102px] top-[80px] z-10 h-auto w-[clamp(590px,43vw,720px)] select-none bg-transparent object-contain [mix-blend-mode:normal] [filter:drop-shadow(0_0_34px_rgba(40,140,255,0.5))] max-[1280px]:right-[68px] max-[1280px]:top-[84px] max-[1280px]:w-[clamp(500px,39vw,620px)]"
              loading="eager"
              decoding="async"
            />

            <div className="hero-ai-radar" aria-hidden="true">
              <span className="hero-ai-ring hero-ai-ring-outer" />
              <span className="hero-ai-ring hero-ai-ring-mid" />
              <span className="hero-ai-ring hero-ai-ring-inner" />

              <span className="hero-ai-node hero-ai-node-1" />
              <span className="hero-ai-node hero-ai-node-2" />
              <span className="hero-ai-node hero-ai-node-3" />

              <span className="hero-ai-badge">
                <strong>Matching IA en cours</strong>
                <small>3 propositions détectées</small>
              </span>
            </div>

            <img
              src={assetUrl(heroStudentImage)}
              alt="Etudiant Boarding avec ordinateur portable"
              className="student pointer-events-none absolute right-[86px] top-[40px] z-30 h-[clamp(630px,49vw,760px)] w-auto select-none bg-transparent object-contain [mix-blend-mode:normal] [filter:drop-shadow(0_20px_42px_rgba(0,8,24,0.85))] max-[1280px]:right-[72px] max-[1280px]:top-[48px] max-[1280px]:h-[clamp(520px,43vw,660px)]"
              width={1024}
              height={1536}
              loading="eager"
              decoding="async"
            />

            <article
              className="morocco-card absolute z-40 hidden motion-safe:animate-hero-tag-float motion-safe:[animation-fill-mode:both] lg:flex max-[1024px]:hidden"
              style={{ animationDelay: '560ms' } as CSSProperties}
            >
              <span className="morocco-flag" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 4.4 13.9 9.2h5.1l-4.1 3 1.6 4.9-4.4-3-4.4 3 1.6-4.9-4.1-3h5.1L12 4.4Z" />
                </svg>
              </span>
              <span className="content">
                <span className="destination-name">Maroc</span>
                <span className="opportunity-line">
                  <span className="count">+80</span>
                  <span className="label">opportunités</span>
                </span>
              </span>
            </article>

            {heroMoroccoCities.map((city) => (
              <span
                key={city.label}
                className={cn(
                  'city-chip absolute z-40 hidden motion-safe:animate-hero-tag-float motion-safe:[animation-fill-mode:both] lg:inline-flex max-[1024px]:hidden',
                  city.className
                )}
                style={{ animationDelay: city.delay } as CSSProperties}
              >
                {city.label}
              </span>
            ))}

          </div>
        </div>

        <div className="trust-stats relative z-40 mt-[20px] h-auto rounded-[24px] border border-white/[0.1] bg-[rgba(6,18,38,0.65)] p-6 shadow-[0_32px_56px_-38px_rgba(0,0,0,0.9)] backdrop-blur-[12px] lg:h-[164px] lg:px-10 lg:py-8">
          <dl className="grid h-full grid-cols-2 gap-y-7 lg:grid-cols-4 lg:items-center lg:gap-y-0" aria-label="Indicateurs clés">
            {heroStats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'flex min-w-0 items-center gap-4 lg:px-6',
                  i % 2 === 1 && 'border-l border-white/[0.12] pl-5',
                  i >= 2 && 'border-t border-white/[0.12] pt-7 lg:border-t-0 lg:pt-0',
                  i > 0 && 'lg:border-l lg:border-white/[0.12]'
                )}
              >
                <span className="stat-icon grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-[#2b7eff] text-[#2b7eff] shadow-[0_0_24px_-10px_rgba(43,126,255,0.9)]">
                  <HeroStatIcon icon={stat.icon} />
                </span>
                <div className="min-w-0">
                  <dd className="stat-number text-lg font-extrabold leading-tight text-white">{stat.value}</dd>
                  <dt className="stat-label mt-2 text-base font-medium leading-5 text-[#b9c8e4]">{stat.label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

interface DestinationCardProps {
  city: string;
  tags: readonly string[];
  description: string;
  image: string;
}

function DestinationCard({ city, tags, description, image }: DestinationCardProps) {
  return (
    <article className="group relative flex min-h-[26rem] flex-col overflow-hidden rounded-2xl shadow-[0_18px_40px_-16px_rgba(15,23,42,0.25)] transition-[box-shadow] duration-300 hover:shadow-[0_28px_56px_-18px_rgba(15,23,42,0.3)] xl:min-h-[30rem]">
      <div className="absolute inset-0">
        <img
          src={image}
          alt={city}
          className="h-full w-full transform-gpu object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
          width={1254}
          height={1254}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.55) 40%, rgba(0, 0, 0, 0.15) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mt-auto flex flex-col gap-3 p-6">
        <h3 className="text-lg font-extrabold leading-tight text-white">{city}</h3>
        <p className="text-sm leading-relaxed text-white/85">{description}</p>

        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full border border-white/25 bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-xl"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function DestinationsSection() {
  return (
    <section
      className={landingSectionClass}
      id="destinations"
      aria-labelledby="destinations-title"
    >
      <div className={landingShellClass}>
        <div className={landingSectionHeadingClass}>
          <span className={landingKickerClass}>Destinations</span>
          <h2 id="destinations-title" className={landingSectionTitleClass}>
            Le Maroc : notre destination V1 pour ton projet.
          </h2>
          <p className={landingSectionParagraphClass}>
            Un environnement concret pour vivre un stage à l’international avec un cadre structuré,
            un accompagnement humain et des opportunités réelles sur place.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6">
          {destinations.map((destination) => (
            <DestinationCard key={destination.city} {...destination} />
          ))}
        </div>
      </div>
    </section>
  );
}

type TestimonialItem = (typeof testimonials)[number];

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7.2 6.5C4.7 8.2 3.5 10.6 3.5 13.6c0 2.3 1.4 3.9 3.5 3.9 1.9 0 3.2-1.3 3.2-3.1 0-1.7-1.2-2.9-2.9-2.9-.4 0-.8.1-1.1.2.3-1.4 1.2-2.6 2.8-3.8L7.2 6.5Zm10 0c-2.5 1.7-3.7 4.1-3.7 7.1 0 2.3 1.4 3.9 3.5 3.9 1.9 0 3.2-1.3 3.2-3.1 0-1.7-1.2-2.9-2.9-2.9-.4 0-.8.1-1.1.2.3-1.4 1.2-2.6 2.8-3.8l-1.8-1.4Z" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
      <rect x="4" y="6" width="16" height="14" rx="3" />
      <path d="M4 11h16" />
      <path d="M9 11v2h6v-2" />
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z" />
      <path d="M5 19h14" />
    </svg>
  );
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="m12 2.8 2.8 5.7 6.3.9-4.55 4.43 1.07 6.27L12 17.15 6.38 20.1l1.07-6.27L2.9 9.4l6.3-.9L12 2.8Z" />
    </svg>
  );
}

function PaperPlaneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2 14.2 8.2 20 10.5 14.2 12.8 12 19 9.8 12.8 4 10.5 9.8 8.2 12 2Z" />
      <path d="M19 16 20 18.5 22.5 19.5 20 20.5 19 23 18 20.5 15.5 19.5 18 18.5 19 16Z" />
    </svg>
  );
}

function RatingStars({ rating }: { rating: string }) {
  return (
    <div className="flex items-center gap-3" aria-label={`Note ${rating}`}>
      <div className="flex items-center gap-1.5 text-[#F7B733]" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon key={index} className="h-[18px] w-[18px]" />
        ))}
      </div>
      <span className="text-base font-black tracking-[0.02em] text-[#0f2f5f]">{rating}</span>
    </div>
  );
}

function TestimonialCard({ testimonial, highlighted }: { testimonial: TestimonialItem; highlighted?: boolean }) {
  const isFirstClass = testimonial.packType === 'first-class';

  return (
    <article
      className={cn(
        landingSurfaceCardClass,
        'relative m-0 flex h-full flex-col overflow-hidden rounded-[32px] border border-[rgba(20,35,60,0.08)] bg-[rgba(255,255,255,0.94)] p-7 shadow-none sm:p-8',
        highlighted && 'border-[#2563eb]/35 ring-1 ring-[#2563eb]/30 shadow-none'
      )}
      aria-label={`Témoignage de ${testimonial.name}`}
    >
      <QuoteIcon className="pointer-events-none absolute right-7 top-7 h-12 w-12 text-[#2563eb]/20" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(37,99,235,0.06)_0%,transparent_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-start gap-4 sm:gap-5">
        <div
          className={cn(
            'grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br text-base font-black tracking-[0.08em] text-white ring-4 ring-white',
            testimonial.avatarGradient
          )}
          aria-hidden="true"
        >
          {testimonial.avatarSrc ? (
            <img
              src={testimonial.avatarSrc}
              alt={testimonial.avatarAlt}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            testimonial.initials
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-[1.33rem] font-black leading-tight text-[#07182f]">{testimonial.name}</h3>
          <p className="mt-1.5 text-[0.98rem] font-medium leading-6 text-[#607089]">{testimonial.subtitle}</p>
          <p className="mt-0.5 text-[0.92rem] font-semibold leading-6 text-[#4f6587]">{testimonial.context}</p>

          <span
            className={cn(
              'mt-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.09em]',
              isFirstClass
                ? 'border-[#2563eb]/35 bg-[#2563eb]/14 text-[#1845a4]'
                : 'border-[#1d67f0]/30 bg-[#1d67f0]/12 text-[#1d67f0]'
            )}
          >
            {isFirstClass ? <CrownIcon className="h-4 w-4" /> : <BriefcaseIcon className="h-4 w-4" />}
            {testimonial.packLabel}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <RatingStars rating={testimonial.rating} />
      </div>

      <p className="relative z-10 mt-6 text-[1.02rem] leading-8 text-[#607089]">{testimonial.quote}</p>

      <div className="relative z-10 mt-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#d5e5ff] bg-[rgba(255,255,255,0.95)] px-4 py-2 text-sm font-bold text-[#194b9f]">
          <LocationPinIcon className="h-4 w-4" />
          {testimonial.bottomPill}
        </span>
      </div>
    </article>
  );
}

function TestimonialsSection() {
  return (
    <section className={cn(landingSectionClass, 'overflow-hidden bg-[#F5ECD7]')} id="temoignages" aria-labelledby="temoignages-title">
      <div className={cn(landingShellClass, 'relative')}>
        <div className="pointer-events-none absolute -left-16 top-24 hidden text-[#2a66df]/18 lg:block" aria-hidden="true">
          <svg viewBox="0 0 200 260" className="h-56 w-44" fill="none">
            <path d="M24 8c58 24 108 80 106 138-1 48-38 89-96 106" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 8" />
          </svg>
        </div>
        <div className="pointer-events-none absolute -right-10 top-20 hidden text-[#2a66df]/18 lg:block" aria-hidden="true">
          <svg viewBox="0 0 220 280" className="h-56 w-44" fill="none">
            <path d="M190 10c-60 20-114 74-118 132-3 50 30 101 90 130" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 8" />
          </svg>
        </div>
        <SparklesIcon className="pointer-events-none absolute left-8 top-4 hidden h-9 w-9 text-[#2563eb]/24 lg:block" />
        <PaperPlaneIcon className="pointer-events-none absolute right-12 top-6 hidden h-9 w-9 text-[#2563eb]/26 lg:block" />
        <div className="pointer-events-none absolute -bottom-20 left-6 hidden h-32 w-32 rounded-full bg-[#2563eb]/10 blur-3xl lg:block" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 right-6 hidden h-36 w-36 rounded-full bg-[#1d67f0]/10 blur-3xl lg:block" aria-hidden="true" />

        <div className={landingSectionHeadingClass}>
          <span className={landingKickerClass}>TÉMOIGNAGES</span>
          <h2 id="temoignages-title" className="mx-auto mt-4 max-w-4xl text-[clamp(1.6rem,3.2vw,3.25rem)] font-extrabold leading-[1.12] text-[#07182f]">
            Une expérience pensée pour donner confiance avant le départ.
          </h2>
          <p className="mx-auto mt-5 max-w-[900px] text-base leading-8 text-[#607089] sm:text-lg">
            Des retours authentiques d’étudiants accompagnés par Boarding dans leur stage à l’étranger.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-[1320px] gap-8 lg:grid-cols-2 xl:gap-10">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} highlighted={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="font-body isolate min-h-dvh overflow-hidden text-[#07182f] [color-scheme:light] [background:#F5ECD7]">
      <main>
        <HeroSection />
        <ProcessSection />
        <WhoWeAreSection />
        <DestinationsSection />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <LandingFooter />
    </div>
  );
}
