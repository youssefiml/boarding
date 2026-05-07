import type { CSSProperties } from 'react';
import { IoIosAirplane } from 'react-icons/io';

import boardingLogo from '@/assets/boarding-logo.webp';
import heroGlobeImage from '@/assets/hero-globe-cutout.webp';
import heroStudentImage from '@/assets/hero-student-cutout.webp';
import heroSpaceBackground from '@/assets/heroSpaceBackground.webp';
import { PricingSection } from '@/features/landing/components/PricingSection';
import ProcessSection from '@/features/landing/components/ProcessSection';
import { assetUrl } from '@/lib/asset-url';
import { cn } from '@/lib/cn';

const appointmentHref = 'mailto:lagenceboarding@gmail.com?subject=Rendez-vous%20gratuit%20Boarding';
const contactHref = 'mailto:lagenceboarding@gmail.com?subject=Projet%20de%20stage%20a%20l%27etranger';

const destinations = [
  {
    city: 'Maroc',
    tags: ['Marrakech', 'Casablanca', 'Entreprises partenaires', 'Logements vérifiés'],
    description:
      'Marrakech, Casablanca… Le Maroc est au cœur de notre projet. Un véritable terrain d’opportunités, d’apprentissage et de développement personnel. Partenariats déjà en place avec des entreprises et restaurants de M Avenue.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Marrakech%20skyline%20view.jpg',
  },
  {
    city: 'Afrique du Sud',
    tags: ['Cape Town', 'Multiculturel', 'Anglophone', 'Dynamique'],
    description:
      'Cape Town et ses alentours offrent un cadre exceptionnel pour un stage à l’international. Une destination dynamique, multiculturelle et inspirante pour les étudiants en quête d’aventure.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cape%20Town%20Skyline.jpg',
  },
] as const;

const testimonials = [
  {
    quote: 'Boarding m’a aidé à comprendre toutes les étapes avant mon départ. Le processus était clair et rassurant.',
    role: 'Étudiante en commerce',
  },
  {
    quote: 'J’avais besoin d’un cadre, surtout pour l’entretien et le logement. L’accompagnement m’a permis d’avancer sans me sentir seul.',
    role: 'Étudiant en hôtellerie',
  },
  {
    quote: 'Le rendez-vous m’a permis de poser mes questions et de voir si mon projet était réaliste. C’est simple, humain et structuré.',
    role: 'Étudiante en marketing',
  },
] as const;

const landingShellClass = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';
const landingSectionClass = 'relative py-12 sm:py-14 lg:py-16 [scroll-margin-top:6rem]';
const landingSectionHeadingClass = 'mx-auto max-w-3xl text-center';
const landingSectionTitleClass = 'mt-3 text-lg font-extrabold leading-tight text-[#07182f]';
const landingSectionParagraphClass = 'mt-4 text-base leading-7 text-slate-500 sm:text-lg';
const landingKickerClass = 'inline-flex text-base font-extrabold uppercase tracking-[0.18em] text-brand-600 sm:text-lg';
const landingButtonBaseClass =
  'inline-flex min-h-12 w-full items-center justify-center rounded-xl border px-5 py-2.5 text-center text-sm font-bold leading-5 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto';
const landingButtonPrimaryClass =
  'border-[#2557D6] bg-[#2557D6] text-white shadow-[0_20px_36px_-22px_rgba(37,87,214,0.95)] hover:bg-[#224fc4] hover:shadow-[0_24px_40px_-20px_rgba(37,87,214,0.9)] focus-visible:ring-[#2557D6]/70';
const landingButtonLightClass =
  'border-slate-200 bg-white text-[#07182f] hover:border-[#cfdcec] hover:shadow-[0_10px_22px_-10px_rgba(15,23,42,0.18)] focus-visible:ring-brand-500';
const landingSurfaceCardClass = 'rounded-3xl border border-slate-200 bg-white shadow-[0_4px_14px_-8px_rgba(15,23,42,0.08)]';
const heroMotionClass = 'motion-safe:animate-fade-in-up';

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
    <section className="hero relative isolate overflow-hidden bg-[#020817] text-white [scroll-margin-top:6rem] lg:min-h-[980px]" id="accueil">
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

          <div className="header-actions flex shrink-0 items-center gap-3">
            <a
              href="/login"
              className="hidden h-14 min-w-[172px] items-center justify-center rounded-xl border border-white/35 bg-white/[0.02] px-6 text-base font-bold text-white shadow-[0_20px_40px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152b] sm:inline-flex max-[1280px]:h-12 max-[1280px]:min-w-[148px] max-[1280px]:px-4 max-[1280px]:text-sm max-[1100px]:min-w-[132px]"
            >
              Se connecter
            </a>
            <a
              href={appointmentHref}
              className={cn(
                landingButtonBaseClass,
                landingButtonPrimaryClass,
                'h-14 min-w-[156px] px-6 text-base hover:translate-y-0 hover:bg-[#2557D6] hover:shadow-[0_20px_36px_-22px_rgba(37,87,214,0.95)] focus-visible:ring-offset-[#07152b] max-[1280px]:h-12 max-[1280px]:min-w-[140px] max-[1280px]:px-4 max-[1280px]:text-sm max-[1100px]:min-w-[126px]'
              )}
            >
              Candidater
            </a>
          </div>
        </header>

        <div className="hero-main relative grid items-center gap-10 pt-4 lg:min-h-[700px] lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-12">
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

          <div className={cn('hero-visual relative h-[520px] w-full overflow-visible sm:h-[580px] lg:h-[700px] lg:translate-x-3 max-[1280px]:h-[620px] max-[1280px]:translate-x-0', heroMotionClass)} style={{ animationDelay: '420ms' }}>
            <div className="pointer-events-none absolute right-[88px] top-[104px] z-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(49,144,255,0.58),rgba(29,95,215,0.24)_56%,transparent_78%)] blur-[56px] max-[1280px]:right-[60px] max-[1280px]:top-[92px] max-[1280px]:h-[340px] max-[1280px]:w-[340px]" aria-hidden="true" />

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

        <div className="trust-stats relative z-30 mt-[20px] h-auto rounded-[24px] border border-white/[0.1] bg-[rgba(6,18,38,0.65)] p-6 shadow-[0_32px_56px_-38px_rgba(0,0,0,0.9)] backdrop-blur-[12px] lg:h-[164px] lg:px-10 lg:py-8">
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

function ConceptSection() {
  return (
    <section className={landingSectionClass} id="concept" aria-labelledby="concept-title">
      <div className={cn(landingShellClass, 'grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(320px,0.74fr)] lg:items-center')}>
        <div className="max-w-3xl">
          <span className={landingKickerClass}>Qui sommes-nous ?</span>
          <h2 id="concept-title" className={landingSectionTitleClass}>
            Une startup pensée pour rassurer les étudiants et structurer leur départ.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
            Boarding simplifie la recherche de stage à l’étranger grâce à un accompagnement humain, personnalisé et structuré.
            Notre mission : permettre à chaque étudiant de partir l’esprit léger, avec un stage adapté à son profil et un cadre
            rassurant.
          </p>
          <a href="#offres" className={cn(landingButtonBaseClass, landingButtonLightClass, 'mt-7')}>
            Découvrir les offres
          </a>
        </div>

        <div
          className="grid gap-4 rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#f4faff_0%,#ffffff_100%)] p-5 shadow-[0_14px_38px_-18px_rgba(15,23,42,0.18)]"
          aria-label="Ce que Boarding centralise"
        >
          <div className="rounded-3xl border border-slate-100 bg-white p-5">
            <span className="text-sm font-extrabold text-brand-600">01</span>
            <strong className="mt-2 block text-lg font-extrabold text-[#07182f]">Orientation</strong>
            <p className="mt-2 text-sm leading-6 text-slate-500">On clarifie ton projet, ton rythme et la destination qui correspond à ton profil.</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5">
            <span className="text-sm font-extrabold text-brand-600">02</span>
            <strong className="mt-2 block text-lg font-extrabold text-[#07182f]">Matching</strong>
            <p className="mt-2 text-sm leading-6 text-slate-500">On recherche les entreprises cohérentes avec ton secteur, tes missions et ton énergie.</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5">
            <span className="text-sm font-extrabold text-brand-600">03</span>
            <strong className="mt-2 block text-lg font-extrabold text-[#07182f]">Intégration</strong>
            <p className="mt-2 text-sm leading-6 text-slate-500">On t’aide à préparer ton arrivée, ton logement, tes documents et ton quotidien sur place.</p>
          </div>
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
            Maroc et Afrique du Sud : deux destinations fortes pour ton projet.
          </h2>
          <p className={landingSectionParagraphClass}>
            Deux environnements complémentaires pour vivre un stage à l’international avec un cadre structuré,
            un accompagnement humain et des opportunités réelles sur place.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {destinations.map((destination) => (
            <DestinationCard key={destination.city} {...destination} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  quote: string;
  role: string;
}

function TestimonialCard({ quote, role }: TestimonialCardProps) {
  return (
    <figure className={cn(landingSurfaceCardClass, 'm-0 p-6')}>
      <blockquote className="text-base text-slate-700">{quote}</blockquote>
      <figcaption className="mt-5 text-sm font-extrabold text-[#07182f]">{role}</figcaption>
    </figure>
  );
}

function TestimonialsSection() {
  return (
    <section
      className={landingSectionClass}
      id="temoignages"
      aria-labelledby="temoignages-title"
    >
      <div className={landingShellClass}>
        <div className={landingSectionHeadingClass}>
          <span className={landingKickerClass}>Témoignages</span>
          <h2 id="temoignages-title" className={landingSectionTitleClass}>
            Une expérience pensée pour donner confiance avant le départ.
          </h2>
          <p className={landingSectionParagraphClass}>
            Ces textes sont prêts à être remplacés par de vrais retours étudiants dès que les premiers témoignages sont validés.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.quote} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
  <footer className="border-t border-slate-200 bg-[#F5ECD7] py-12">
      <div className={cn(landingShellClass, 'grid gap-8 md:grid-cols-[1.1fr_0.55fr_0.55fr]')}>
        <div>
          <a
            href="#accueil"
            className="inline-flex min-w-0 items-center gap-3 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F5ECD7]"
            aria-label="Retour à l’accueil Boarding"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d8eaf7] shadow-sm"
              aria-hidden="true"
              style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f4faff 100%)' }}
            >
              <img src={assetUrl(boardingLogo)} alt="" className="h-full w-full object-cover" style={{ objectPosition: '50% 50%', transform: 'scale(1.9)' }} />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-base font-extrabold text-[#07182f]">Boarding</span>
              <span className="hidden text-xs font-semibold text-slate-500 sm:block">Stages à l’étranger</span>
            </span>
          </a>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
            Boarding accompagne les étudiants dans leur recherche de stage à l’étranger avec un parcours clair, humain et guidé.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm font-semibold text-slate-700" aria-label="Liens rapides">
          <a href="#concept">Concept</a>
          <a href="#destinations">Destinations</a>
          <a href="#processus">Processus</a>
          <a href="#offres">Offres</a>
        </div>

        <div className="flex flex-col gap-3 text-sm font-semibold text-slate-700" aria-label="Contact">
          <a href="mailto:lagenceboarding@gmail.com">Email</a>
          <a href="https://www.boardingagence.com" target="_blank" rel="noreferrer">
            Site web
          </a>
          <a href={contactHref}>Contact</a>
          <span className="text-slate-500">Instagram</span>
        </div>
      </div>

      <div className={cn(landingShellClass, 'mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500')}>
        <span>© {new Date().getFullYear()} Boarding. Tous droits réservés.</span>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="font-body isolate min-h-dvh overflow-hidden text-[#07182f] [color-scheme:light] [background:#F5ECD7]">
      <main>
        <HeroSection />
        <ProcessSection />
        <ConceptSection />
        <DestinationsSection />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <LandingFooter />
    </div>
  );
}

