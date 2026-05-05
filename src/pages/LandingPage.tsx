import type { CSSProperties } from 'react';

import boardingLogo from '@/assets/boarding-logo.webp';
import heroGlobeImage from '@/assets/hero-globe-cutout.webp';
import heroStudentImage from '@/assets/hero-student-cutout.webp';
import heroSpaceBackground from '@/assets/heroSpaceBackground.webp';
import LightRays from '@/features/landing/components/LightRays';
import { ProcessusSection } from '@/features/landing/components/ProcessusSection';
import { Reveal } from '@/features/landing/components/Reveal';
import { SwipeCardStack } from '@/features/landing/components/SwipeCardStack';
import { cn } from '@/lib/cn';

const appointmentHref = 'mailto:lagenceboarding@gmail.com?subject=Rendez-vous%20gratuit%20Boarding';
const contactHref = 'mailto:lagenceboarding@gmail.com?subject=Projet%20de%20stage%20a%20l%27etranger';

const whyBoardingCards = [
  {
    marker: '01',
    title: 'Matching avec les bonnes entreprises',
    description: 'On relie ton profil, ton secteur et ta personnalité à des entreprises cohérentes avec ton projet.',
  },
  {
    marker: '02',
    title: 'Accompagnement étape par étape',
    description: 'Tu avances avec une méthode claire, des points de contact humains et des priorités simples à suivre.',
  },
  {
    marker: '03',
    title: 'Préparation avant le départ',
    description: 'Documents, entretien, logement, budget et arrivée : les détails importants sont anticipés avec toi.',
  },
  {
    marker: '04',
    title: 'Suivi jusqu’à l’intégration',
    description: 'Boarding reste présent avant, pendant et après ton arrivée pour sécuriser ton expérience sur place.',
  },
] as const;

const problemCards = [
  {
    label: 'Recherche',
    title: 'Trop d’informations dispersées',
    description: 'Entre entreprises, logements, documents et entretiens, les étudiants perdent vite le fil.',
  },
  {
    label: 'Stress',
    title: 'Un départ difficile à organiser seul',
    description: 'Administratif, budget, langue, arrivée sur place : chaque détail peut devenir une source d’inquiétude.',
  },
  {
    label: 'Solution',
    title: 'Un parcours clair et accompagné',
    description: 'Boarding centralise les étapes, structure les décisions et garde un contact humain à chaque moment clé.',
  },
] as const;

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



const pricingPlans = [
  {
    name: 'Economy Class',
    price: '499€',
    suffix: '',
    description: 'L’essentiel pour démarrer avec un cadre clair et des bases solides.',
    cta: 'Choisir Economy',
    features: [
      { label: 'Stage garanti', included: true },
      { label: 'Appel avant départ', included: true },
      { label: 'Guide de destination', included: true },
      { label: 'Assistance 7j/7', included: true },
      { label: 'Accès à la communauté', included: true },
      { label: 'Test de personnalité', included: true },
      { label: '100 % personnalisable', included: true },
      { label: 'Logement garanti', included: false },
      { label: 'Administratif', included: false },
      { label: 'Échange monnaie', included: false },
      { label: 'Transfert aller/retour', included: false },
      { label: 'Carte promotionnelle', included: false },
      { label: '2 cours de langue', included: false },
      { label: 'Aide pour l’entretien', included: false },
      { label: 'Guide tour', included: false },
      { label: 'Welcome pack', included: false },
    ],
  },
  {
    name: 'First Class',
    price: '999€',
    suffix: '',
    description:
      'L’expérience complète pour partir l’esprit léger, avec un accompagnement total.',
    cta: 'Postuler maintenant',
    featured: true,
    features: [
      { label: 'Stage garanti', included: true },
      { label: 'Appel avant départ', included: true },
      { label: 'Guide de destination', included: true },
      { label: 'Assistance 7j/7', included: true },
      { label: 'Accès à la communauté', included: true },
      { label: 'Test de personnalité', included: true },
      { label: '100 % personnalisable', included: true },
      { label: 'Logement garanti', included: true },
      { label: 'Administratif', included: true },
      { label: 'Échange monnaie', included: true },
      { label: 'Transfert aller/retour', included: true },
      { label: 'Carte promotionnelle', included: true },
      { label: '2 cours de langue', included: true },
      { label: 'Aide pour l’entretien', included: true },
      { label: 'Guide tour', included: true },
      { label: 'Welcome pack', included: true },
    ],
  },
  {
    name: 'Business Class',
    price: '699€',
    suffix: '',
    description:
      'Le pack équilibré pour avancer avec un accompagnement personnalisé et structuré.',
    cta: 'Choisir Business',
    features: [
      { label: 'Stage garanti', included: true },
      { label: 'Appel avant départ', included: true },
      { label: 'Guide de destination', included: true },
      { label: 'Assistance 7j/7', included: true },
      { label: 'Accès à la communauté', included: true },
      { label: 'Test de personnalité', included: true },
      { label: '100 % personnalisable', included: true },
      { label: 'Logement garanti', included: true },
      { label: 'Administratif', included: true },
      { label: 'Échange monnaie', included: true },
      { label: 'Transfert aller/retour', included: true },
      { label: 'Carte promotionnelle', included: true },
      { label: '2 cours de langue', included: false },
      { label: 'Aide pour l’entretien', included: false },
      { label: 'Guide tour', included: false },
      { label: 'Welcome pack', included: false },
    ],
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
const landingSectionClass = 'relative py-16 sm:py-20 lg:py-24 [scroll-margin-top:6rem]';
const landingSectionHeadingClass = 'mx-auto max-w-3xl text-center';
const landingSectionTitleClass = 'mt-3 font-display text-3xl font-bold leading-tight text-[#07182f] sm:text-4xl lg:text-5xl';
const landingSectionParagraphClass = 'mt-4 text-base leading-7 text-slate-500 sm:text-lg';
const landingKickerClass = 'inline-flex text-base font-extrabold uppercase tracking-[0.18em] text-brand-600 sm:text-lg';
const landingButtonBaseClass =
  'inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-2.5 text-center text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:w-auto';
const landingButtonLargeClass = 'min-h-12 px-6 text-base';
const landingButtonPrimaryClass =
  'bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-[0_8px_20px_-8px_rgba(29,79,208,0.45)] hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-8px_rgba(29,79,208,0.55)]';
const landingButtonLightClass =
  'border border-slate-200 bg-white text-[#07182f] hover:-translate-y-0.5 hover:border-[#cfdcec] hover:shadow-[0_10px_22px_-10px_rgba(15,23,42,0.18)]';
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
  { label: 'À propos', href: '#concept' },
  { label: 'Étapes', href: '#processus' },
  { label: 'Bénéfices', href: '#destinations' },
  { label: 'Témoignages', href: '#temoignages' },
  { label: 'Contact', href: '#contact' },
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
        src={heroSpaceBackground}
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
            <img src={boardingLogo} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover [object-position:50%_50%] [transform:scale(1.8)]" />
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
              className="inline-flex h-14 min-w-[156px] items-center justify-center rounded-xl bg-gradient-to-br from-[#3f87ff] via-[#2d63f6] to-[#3348f1] px-6 text-base font-bold text-white shadow-[0_22px_46px_-24px_rgba(58,112,255,0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-18px_rgba(58,112,255,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152b] max-[1280px]:h-12 max-[1280px]:min-w-[140px] max-[1280px]:px-4 max-[1280px]:text-sm max-[1100px]:min-w-[126px]"
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

            <h1 className={cn('hero-title mt-8 font-display text-5xl font-bold leading-[1.08] text-white sm:text-6xl lg:text-[clamp(56px,5vw,72px)]', heroMotionClass)} style={{ animationDelay: '160ms' }}>
              Trouve ton stage à l’étranger, sans prise de tête
            </h1>

            <p className={cn('hero-description mt-6 max-w-[560px] text-base leading-[1.6] text-slate-200 sm:text-lg', heroMotionClass)} style={{ animationDelay: '240ms' }}>
              En choisissant Boarding, tu contribues directement à donner à un étudiant marocain défavorisé l’opportunité de poursuivre ses études.
            </p>

            <div className={cn('hero-actions mt-10 flex flex-col gap-4 lg:flex-row lg:gap-4', heroMotionClass)} style={{ animationDelay: '320ms' }}>
              <a
                href="/register"
                className="btn btn-primary group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152b]"
              >
                <span className="btn-label">Postuler maintenant</span>
                <span className="btn-icon transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
              <a
                href={appointmentHref}
                className="btn btn-secondary group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152b]"
              >
                <span className="btn-label">
                  <span className="block">Prendre rendez-vous</span>
                  <span className="btn-subtext">30 minutes pour en savoir plus</span>
                </span>
                <span className="btn-icon transition-colors group-hover:bg-white/15" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5 fill-current">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          <div className={cn('hero-visual relative h-[520px] w-full overflow-visible sm:h-[580px] lg:h-[700px] lg:translate-x-3 max-[1280px]:h-[620px] max-[1280px]:translate-x-0', heroMotionClass)} style={{ animationDelay: '420ms' }}>
            <div className="pointer-events-none absolute right-[88px] top-[104px] z-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(49,144,255,0.58),rgba(29,95,215,0.24)_56%,transparent_78%)] blur-[56px] max-[1280px]:right-[60px] max-[1280px]:top-[92px] max-[1280px]:h-[340px] max-[1280px]:w-[340px]" aria-hidden="true" />

            <img
              src={heroGlobeImage}
              alt=""
              aria-hidden="true"
              className="globe pointer-events-none absolute right-[102px] top-[80px] z-10 h-auto w-[clamp(590px,43vw,720px)] select-none bg-transparent object-contain [mix-blend-mode:normal] [filter:drop-shadow(0_0_34px_rgba(40,140,255,0.5))] max-[1280px]:right-[68px] max-[1280px]:top-[84px] max-[1280px]:w-[clamp(500px,39vw,620px)]"
              loading="eager"
              decoding="async"
            />

            <div className="flight-path" aria-hidden="true">
              <svg viewBox="0 0 860 640">
                <circle className="flight-start" cx="185" cy="455" r="5" />
                <path className="flight-route" d="M185 455C246 356 332 350 421 346C551 340 575 181 674 150C724 135 765 146 800 178" />
                <path className="flight-plane" d="M796 139 833 150 812 168 830 187 821 199 802 181 785 210 771 204 786 173 763 174 759 161 787 154 781 138Z" />
              </svg>
            </div>

            <img
              src={heroStudentImage}
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
                  <dd className="stat-number font-display text-4xl font-bold leading-none tracking-tight text-white">{stat.value}</dd>
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

function WhyBoardingSection() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#f7fafd_0%,#f5f8fc_58%,#ffffff_100%)] px-0 py-20 sm:py-24 lg:pb-[120px] lg:pt-[100px]"
      aria-labelledby="why-title"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-12 -z-10 h-72 w-[min(42rem,92vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(43,126,255,0.14)_0%,rgba(43,126,255,0.07)_42%,transparent_72%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10">
        <Reveal className="mx-auto max-w-[900px] text-center">
          <span className="inline-flex text-sm font-semibold uppercase tracking-[0.18em] text-[#1d67f0]">
            Pourquoi Boarding ?
          </span>
          <h2
            id="why-title"
            className="mx-auto mt-5 max-w-[900px] font-display text-4xl font-bold leading-[1.1] text-[#081f3d] sm:text-5xl lg:text-[56px] xl:text-[60px]"
          >
            Un service conçu pour enlever le doute et accélérer ton projet.
          </h2>
          <p className="mx-auto mt-6 max-w-[760px] text-lg leading-[1.7] text-[#63728a] sm:text-xl">
            L’étudiant ne cherche pas seulement une entreprise. Il cherche un cadre, des réponses et une équipe capable de l’aider à
            avancer sans se disperser.
          </p>
        </Reveal>

        <div className="mt-[60px] grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
          {whyBoardingCards.map((card, index) => (
            <Reveal
              key={card.title}
              as="article"
              className="group flex min-h-[260px] flex-col rounded-[24px] border border-[rgba(15,45,85,0.08)] bg-white p-8 shadow-[0_16px_40px_rgba(20,60,110,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[rgba(43,126,255,0.26)] hover:shadow-[0_24px_56px_rgba(20,60,110,0.12)]"
              delay={index * 80}
            >
              <span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-gradient-to-br from-[#1677ff] to-[#3157ff] text-sm font-bold text-white shadow-[0_12px_24px_rgba(43,126,255,0.22)] transition-transform duration-300 group-hover:scale-105">
                {card.marker}
              </span>
              <h3 className="mt-7 font-display text-[22px] font-semibold leading-[1.3] text-[#081f3d]">{card.title}</h3>
              <p className="mt-[18px] text-base leading-[1.75] text-[#63728a] sm:text-[17px]">{card.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  label: string;
  title: string;
  description: string;
}

function FeatureCard({ label, title, description }: FeatureCardProps) {
  return (
    <Reveal as="article" className={cn(landingSurfaceCardClass, 'p-6')}>
      <span className="inline-flex text-sm font-extrabold text-brand-600">{label}</span>
      <h3 className="mt-3 font-display text-xl font-bold leading-tight text-[#07182f]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
    </Reveal>
  );
}

function ProblemSolutionSection() {
  return (
    <section className={cn(landingSectionClass, 'bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]')} aria-labelledby="probleme-title">
      <div className={landingShellClass}>
        <div className={landingSectionHeadingClass}>
          <span className={landingKickerClass}>Problème et solution</span>
          <h2 id="probleme-title" className={landingSectionTitleClass}>
            Partir à l’étranger doit être excitant, pas flou.
          </h2>
          <p className={landingSectionParagraphClass}>
            La recherche d’un stage à l’étranger mélange souvent trop d’étapes, trop d’interlocuteurs et trop d’incertitudes.
            Boarding transforme ce parcours en expérience guidée, centralisée et humaine.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {problemCards.map((card) => (
            <FeatureCard key={card.title} {...card} />
          ))}
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
        <h3 className="font-display text-2xl font-bold leading-none text-white sm:text-4xl">{city}</h3>
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
      className={cn(landingSectionClass, 'bg-[linear-gradient(180deg,#eef7ff_0%,#f4faff_100%)]')}
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





interface PricingCardProps {
  name: string;
  price: string;
  suffix: string;
  description: string;
  cta: string;
  features: readonly { label: string; included: boolean }[];
  featured?: boolean;
}

const pricingPreviewLimit = 7;

function PricingCard({ name, price, suffix, description, cta: _cta, features, featured }: PricingCardProps) {
  const previewFeatures = features.slice(0, pricingPreviewLimit);
  const remainingCount = Math.max(0, features.length - previewFeatures.length);

  return (
    <Reveal
      as="article"
      className={cn(
        'relative flex flex-col overflow-hidden rounded-[1.65rem] border bg-white p-0 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_32px_-12px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_4px_6px_rgba(15,23,42,0.04),0_24px_56px_-14px_rgba(15,23,42,0.14)]',
        featured
          ? 'border-brand-600/35 bg-[#06132a] shadow-[0_1px_3px_rgba(29,79,208,0.12),0_18px_52px_-14px_rgba(29,79,208,0.35)] lg:-translate-y-2 lg:hover:-translate-y-3 lg:hover:border-brand-500/60 lg:hover:shadow-[0_4px_6px_rgba(29,79,208,0.14),0_28px_60px_-16px_rgba(29,79,208,0.38)]'
          : 'border-slate-200 hover:border-[#cfdcec]'
      )}
      delay={featured ? 100 : 0}
    >
      {featured ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-0">
            <LightRays
              raysOrigin="top-center"
              raysColor="#4ea2ff"
              raysSpeed={0.95}
              lightSpread={0.82}
              rayLength={1.05}
              fadeDistance={0.95}
              saturation={0.95}
              followMouse={false}
              mouseInfluence={0}
              noiseAmount={0.02}
              distortion={0.01}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(58,126,255,0.2),transparent_58%),linear-gradient(180deg,rgba(2,10,28,0.78)_0%,rgba(3,14,35,0.86)_38%,rgba(5,22,54,0.9)_100%)]" />
        </>
      ) : null}

      <div
        className={cn(
          'relative z-10 h-1 w-full shrink-0',
          featured
            ? 'bg-[linear-gradient(90deg,#1d4fd0_0%,#0891b2_50%,#1d4fd0_100%)]'
            : 'bg-[linear-gradient(90deg,#e2e8f0_0%,#cbd5e1_100%)]'
        )}
        aria-hidden="true"
      />

      {featured ? (
        <span className="relative z-10 mx-7 mt-6 inline-flex w-fit items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_4px_12px_-4px_rgba(78,162,255,0.55)]">
          Offre recommandée
        </span>
      ) : null}

      <div className={cn('relative z-10 px-7 pb-0 pt-7', featured ? 'pt-5' : '')}>
        <h3 className={cn('text-[1.15rem] font-display font-bold leading-tight', featured ? 'text-slate-100' : 'text-slate-700')}>{name}</h3>
        <p className={cn('mt-4 text-[2.35rem] font-extrabold leading-[1.05]', featured ? 'text-white' : 'text-[#07182f]')}>
          {price}
          {suffix ? <span className={cn('ml-1 text-base font-semibold', featured ? 'text-slate-300' : 'text-slate-500')}>{suffix}</span> : null}
        </p>
        <p className={cn('mt-4 text-[0.96rem] leading-7', featured ? 'text-slate-200' : 'text-slate-500')}>{description}</p>
      </div>

      <div
        className={cn(
          'relative z-10 mx-7 mt-8 h-px shrink-0',
          featured
            ? 'bg-[linear-gradient(90deg,transparent_0%,rgba(191,219,254,0.38)_50%,transparent_100%)]'
            : 'bg-[linear-gradient(90deg,transparent_0%,rgba(15,23,42,0.08)_50%,transparent_100%)]'
        )}
        aria-hidden="true"
      />

      <ul className="relative z-10 m-0 grid list-none gap-4 px-7 pb-8 pt-7">
        {previewFeatures.map((feature) => (
          <li
            key={feature.label}
            className={cn(
              'flex items-start gap-3 text-[0.96rem] font-medium leading-7',
              feature.included
                ? featured
                  ? 'text-slate-100'
                  : 'text-slate-700'
                : featured
                  ? 'text-slate-400'
                  : 'text-slate-400'
            )}
          >
            {feature.included ? (
              <svg
                className={cn('mt-1 shrink-0', featured ? 'text-emerald-300' : 'text-emerald-500')}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                className={cn('mt-1 shrink-0', featured ? 'text-slate-500' : 'text-slate-300')}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
            {feature.label}
          </li>
        ))}
      </ul>

      {remainingCount > 0 ? (
        <p
          className={cn(
            'relative z-10 mx-7 mb-7 mt-1 rounded-xl border border-dashed px-4 py-2 text-center text-xs font-semibold',
            featured
              ? 'border-blue-300/35 bg-blue-500/10 text-slate-200'
              : 'border-[#cfdcec] bg-[#f4faff] text-slate-500'
          )}
        >
          + {remainingCount} autres éléments dans le comparatif
        </p>
      ) : null}

      <a
        href={`${appointmentHref}&body=Bonjour%20Boarding%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20le%20pack%20${name}.`}
        className={cn(
          'relative z-10 mx-7 mb-7 mt-auto flex min-h-12 items-center justify-center rounded-xl border px-5 py-3.5 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
          featured
            ? 'border-transparent bg-gradient-to-br from-[#5aa8ff] to-[#2a68ff] text-white shadow-[0_8px_22px_-8px_rgba(59,130,246,0.65)] hover:shadow-[0_12px_28px_-8px_rgba(59,130,246,0.75)]'
            : 'border-slate-200 bg-slate-100 text-[#07182f] hover:-translate-y-0.5 hover:bg-slate-200'
        )}
      >
        Embarquer maintenant
      </a>
    </Reveal>
  );
}

function PricingSection() {
  const comparisonRows = pricingPlans[0]?.features.map((feature) => feature.label) ?? [];

  return (
    <section
      className={cn(
        landingSectionClass,
        'relative overflow-hidden bg-[linear-gradient(180deg,#f4faff_0%,#eef7ff_50%,#f8fbff_100%)] py-20 sm:py-24 lg:py-28'
      )}
      id="offres"
      aria-labelledby="offres-title"
    >
      <div className={landingShellClass}>
        <Reveal className="grid gap-6 max-md:text-center lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="max-w-xl max-md:mx-auto">
            <span className={landingKickerClass}>Offres</span>
            <h2 id="offres-title" className={landingSectionTitleClass}>
              Choisis l’accompagnement qui te convient.
            </h2>
          </div>
          <p className="m-0 max-w-xl text-base leading-8 text-slate-500 max-md:mx-auto lg:text-lg">
            Découvre nos formules d’accompagnement pour avancer étape par étape vers ton stage à l’étranger. Les tarifs peuvent évoluer selon la destination et la durée.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 w-full max-w-md px-2 pb-10 sm:max-w-lg lg:hidden">
          <SwipeCardStack
            items={pricingPlans}
            getKey={(plan) => plan.name}
            renderItem={(plan) => <PricingCard {...plan} />}
            ariaLabel="Offres Boarding"
            previousLabel="Offre précédente"
            nextLabel="Offre suivante"
          />
        </div>

        <div className="mt-16 hidden grid-cols-3 gap-6 lg:grid">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        <Reveal className="mx-auto mt-10 max-w-[1240px] rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_14px_38px_-18px_rgba(15,23,42,0.12)] sm:p-6 lg:p-8" delay={180}>
          <h3 className="text-lg font-display font-bold text-[#07182f] sm:text-xl">Comparatif complet des options</h3>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <thead>
                <tr>
                  <th className="w-[44%] border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-700">Options</th>
                  {pricingPlans.map((plan) => (
                    <th key={`${plan.name}-head`} className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-bold text-slate-700">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((label) => (
                  <tr key={label}>
                    <th className="border-b border-slate-100 px-4 py-3 text-left text-sm font-semibold text-slate-700">{label}</th>
                    {pricingPlans.map((plan) => {
                      const status = plan.features.find((feature) => feature.label === label)?.included ?? false;
                      return (
                        <td
                          key={`${plan.name}-${label}`}
                          className={cn(
                            'border-b border-slate-100 px-4 py-3 text-center text-base font-extrabold',
                            status ? 'text-emerald-600' : 'text-slate-300'
                          )}
                          aria-label={`${plan.name} - ${label} : ${status ? 'inclus' : 'non inclus'}`}
                        >
                          {status ? '✓' : '✕'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
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
      className={cn(landingSectionClass, 'bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]')}
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

function FinalCTA() {
  return (
    <section
      className={cn(landingSectionClass, 'bg-[linear-gradient(180deg,#f8fbff_0%,#eef7ff_100%)] py-16 sm:py-20')}
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className={landingShellClass}>
        <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f4faff_100%)] p-6 text-center text-[#07182f] shadow-[0_24px_60px_-28px_rgba(29,79,208,0.25)] sm:p-10">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 20% 0%, rgba(29, 79, 208, 0.08), transparent 40%), radial-gradient(circle at 80% 100%, rgba(8, 145, 178, 0.06), transparent 40%)',
            }}
            aria-hidden="true"
          />
          <span className={cn(landingKickerClass, 'relative z-10')}>Prêt à trouver ton stage à l’étranger ?</span>
          <h2 id="contact-title" className="relative z-10 mt-3 font-display text-4xl font-bold leading-tight text-[#07182f] sm:text-5xl">
            Passe de l’idée au départ avec un parcours clair.
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
            Postule maintenant et construisons ensemble ton projet, de la destination jusqu’à ton intégration sur place.
          </p>

          <div className="relative z-10 mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={appointmentHref} className={cn(landingButtonBaseClass, landingButtonLargeClass, landingButtonPrimaryClass)}>
              Postuler maintenant
            </a>
            <a href={contactHref} className={cn(landingButtonBaseClass, landingButtonLargeClass, landingButtonLightClass)}>
              Nous contacter
            </a>
          </div>

          <address className="relative z-10 mt-8 flex flex-col items-center justify-center gap-2 not-italic sm:flex-row sm:gap-5">
            <a className="text-sm font-bold text-slate-700 transition-colors hover:text-[#07182f]" href="mailto:lagenceboarding@gmail.com">
              lagenceboarding@gmail.com
            </a>
            <a href="https://www.boardingagence.com" target="_blank" rel="noreferrer">
              www.boardingagence.com
            </a>
          </address>
        </Reveal>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[linear-gradient(180deg,#f4faff_0%,#eef7ff_100%)] py-12">
      <div className={cn(landingShellClass, 'grid gap-8 md:grid-cols-[1.1fr_0.55fr_0.55fr]')}>
        <div>
          <a
            href="#accueil"
            className="inline-flex min-w-0 items-center gap-3 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
            aria-label="Retour à l’accueil Boarding"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d8eaf7] shadow-sm"
              aria-hidden="true"
              style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f4faff 100%)' }}
            >
              <img src={boardingLogo} alt="" className="h-full w-full object-cover" style={{ objectPosition: '50% 50%', transform: 'scale(1.9)' }} />
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
    <div className="host-grotesk-regular isolate min-h-dvh overflow-hidden text-[#07182f] [color-scheme:light] [background:linear-gradient(180deg,#f8fbff_0%,#ffffff_22%,#f4faff_48%,#ffffff_70%,#eef7ff_90%,#f8fbff_100%)]">
      <main>
        <HeroSection />
        <WhyBoardingSection />
        <ProcessusSection />
        <ProblemSolutionSection />
        <ConceptSection />
        <DestinationsSection />
        <PricingSection />
        <TestimonialsSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
