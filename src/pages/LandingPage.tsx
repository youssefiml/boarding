import type { CSSProperties } from 'react';

import boardingLogo from '@/assets/boarding-logo.png';
import { AnimatedCounter } from '@/features/landing/components/AnimatedCounter';
import { LandingNavbar } from '@/features/landing/components/LandingNavbar';
import { Reveal } from '@/features/landing/components/Reveal';
import { SwipeCardStack } from '@/features/landing/components/SwipeCardStack';
import { cn } from '@/lib/cn';

const appointmentHref = 'mailto:lagenceboarding@gmail.com?subject=Rendez-vous%20gratuit%20Boarding';
const contactHref = 'mailto:lagenceboarding@gmail.com?subject=Projet%20de%20stage%20a%20l%27etranger';

const trustBadges = ['Stage garanti', 'Accompagnement 7j/7', 'Process guidé', 'Destinations sélectionnées'] as const;

const proofStats = [
  {
    value: 500,
    suffix: '+',
    label: 'étudiants accompagnés',
    note: 'Valeur de démonstration à remplacer',
  },
  {
    value: 25,
    suffix: '+',
    label: 'destinations préparées',
    note: 'Valeur de démonstration à remplacer',
  },
  {
    value: 120,
    suffix: '+',
    label: 'entreprises partenaires',
    note: 'Valeur de démonstration à remplacer',
  },
  {
    value: 92,
    suffix: '%',
    label: 'satisfaction étudiant',
    note: 'Valeur de démonstration à remplacer',
  },
] as const;

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

const trustIndicators = [
  'Accompagnement personnalisé',
  'Entreprises vérifiées',
  'Support avant et après le départ',
  'Process clair et structuré',
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
      'Marrakech, Casablanca, Rabat... Le Maroc est au cœur de notre projet. Un véritable terrain d’opportunités, d’apprentissage et de développement personnel. Partenariats déjà en place avec des entreprises et restaurants de M Avenue.',
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

const processSteps = [
  {
    title: 'Choisis ta destination',
    description: 'On t’aide à identifier la ville et le cadre qui correspondent à ton profil, ton budget et ton objectif.',
  },
  {
    title: 'Crée ton profil',
    description: 'Tu partages ton parcours, tes attentes et ton énergie pour que le matching soit vraiment pertinent.',
  },
  {
    title: 'Reçois ton matching',
    description: 'Boarding sélectionne les entreprises adaptées à ton secteur, tes missions et ta personnalité.',
  },
  {
    title: 'Prépare ton départ',
    description: 'Entretien, logement, documents, arrivée et intégration : chaque étape est préparée avec notre équipe.',
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

const partnerItems = ['Réseau d’entreprises partenaires', 'Écoles et centres de formation', 'Solutions logement', 'Communauté étudiante'] as const;

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
const heroCardFloatClass = 'motion-safe:animate-[landingFloat_6s_ease-in-out_1.4s_infinite]';

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-[radial-gradient(circle_at_82%_14%,rgba(78,140,255,0.18),transparent_36%),radial-gradient(circle_at_14%_30%,rgba(8,145,178,0.12),transparent_36%),linear-gradient(180deg,#eef7ff_0%,#f8fbff_55%,#ffffff_100%)] [scroll-margin-top:6rem] max-lg:min-h-0 lg:min-h-[760px]"
      id="accueil"
    >
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[rgba(78,140,255,0.18)] opacity-50 blur-3xl sm:h-96 sm:w-96" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 left-1/2 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-[rgba(8,145,178,0.12)] opacity-40 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(248,251,255,0.4)_100%)]" aria-hidden="true" />

      <LandingNavbar />

      <div className={cn(landingShellClass, 'relative z-10 grid gap-8 pb-16 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,0.98fr)_minmax(360px,0.72fr)] lg:items-center lg:pb-20 lg:pt-16')}>
        <div className="max-w-3xl">
          <p className={cn(landingKickerClass, heroMotionClass)} style={{ animationDelay: '80ms' }}>
            Stage à l’étranger, sans confusion
          </p>
          <h1 className={cn('mt-5 max-w-4xl font-display text-5xl font-bold leading-[1.02] text-[#07182f] sm:text-6xl lg:text-7xl', heroMotionClass)} style={{ animationDelay: '160ms' }}>
            Trouve ton stage à l’étranger, étape par étape.
          </h1>
          <p className={cn('mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl', heroMotionClass)} style={{ animationDelay: '240ms' }}>
            Boarding accompagne les étudiants de A à Z : choix de la destination, matching avec l’entreprise, préparation du départ
            et intégration sur place.
          </p>

          <div className={cn('mt-8 flex flex-col gap-3 sm:flex-row', heroMotionClass)} style={{ animationDelay: '320ms' }}>
            <a href={appointmentHref} className={cn(landingButtonBaseClass, landingButtonLargeClass, landingButtonPrimaryClass)}>
              Postuler maintenant
            </a>
            <a href="#processus" className={cn(landingButtonBaseClass, landingButtonLargeClass, landingButtonLightClass)}>
              Voir comment ça marche
            </a>
          </div>

          <div className={cn('mt-8 flex flex-wrap gap-2', heroMotionClass)} style={{ animationDelay: '400ms' }} aria-label="Garanties Boarding">
            {trustBadges.map((badge) => (
              <span key={badge} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-[#07182f] shadow-sm backdrop-blur">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className={cn('motion-safe:animate-fade-in-up lg:justify-self-end', heroCardFloatClass)} style={{ animationDelay: '460ms' }}>
          <div
            className="relative w-full rounded-[2rem] border border-slate-200 bg-white p-5 text-[#07182f] shadow-[0_24px_60px_-28px_rgba(15,23,42,0.18),0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur"
            style={{ width: 'min(100%, 28rem)' }}
            aria-label="Aperçu du parcours étudiant Boarding"
          >
            <div className="absolute -left-4 top-8 h-24 w-2 rounded-full bg-gradient-to-b from-brand-600 to-cyan-600" aria-hidden="true" />

            <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-sm font-bold text-slate-500">
              <span>Parcours Boarding</span>
              <strong className="rounded-full bg-[#e0ecff] px-3 py-1 text-[#07182f]">Maroc</strong>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#eef4ff] p-4">
              <span className="h-3 w-3 shrink-0 rounded-full bg-brand-600 shadow-[0_0_0_8px_rgba(29,79,208,0.12)]" />
              <div className="flex min-w-0 flex-col">
                <strong className="text-sm font-extrabold text-[#182f6d]">Matching en cours</strong>
                <span className="text-sm text-[#182f6d]/70">3 entreprises adaptées à ton profil</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <span className="text-sm text-slate-500">Destination</span>
                <strong className="mt-1 block text-lg font-extrabold text-[#07182f]">Marrakech</strong>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <span className="text-sm text-slate-500">Appel équipe</span>
                <strong className="mt-1 block text-lg font-extrabold text-[#07182f]">30 min</strong>
              </div>
            </div>

            <ol className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-500">
              <li className="flex items-center gap-3 before:h-2.5 before:w-2.5 before:shrink-0 before:rounded-full before:bg-emerald-500">Projet clarifié</li>
              <li className="flex items-center gap-3 font-bold text-[#07182f] before:h-2.5 before:w-2.5 before:shrink-0 before:rounded-full before:bg-brand-600">Entreprise sélectionnée</li>
              <li className="flex items-center gap-3 before:h-2.5 before:w-2.5 before:shrink-0 before:rounded-full before:bg-slate-300">Départ préparé</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section
      className={cn(landingSectionClass, 'bg-[linear-gradient(180deg,#ffffff_0%,#f4faff_100%)] py-14 sm:py-16')}
      aria-labelledby="stats-title"
    >
      <div className={landingShellClass}>
        <Reveal className={landingSectionHeadingClass}>
          <span className={landingKickerClass}>Preuves à valider</span>
          <h2 id="stats-title" className="mt-3 font-display text-3xl font-bold leading-tight text-[#07182f] sm:text-4xl">
            Des indicateurs pensés pour rassurer avant de passer à l’action.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            Ces chiffres sont structurés comme données éditables. Remplace-les par les chiffres réels validés par l’équipe.
          </p>
        </Reveal>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {proofStats.map((stat, index) => (
            <Reveal
              key={stat.label}
              as="article"
              className={cn(
                landingSurfaceCardClass,
                'rounded-3xl p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#cfdcec] hover:shadow-[0_12px_28px_-10px_rgba(29,79,208,0.18)]'
              )}
              delay={index * 70}
            >
              <strong className="block bg-gradient-to-r from-brand-600 to-cyan-600 bg-clip-text font-display text-4xl font-bold leading-none text-transparent sm:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </strong>
              <span className="mt-3 block text-sm font-extrabold text-[#07182f]">{stat.label}</span>
              <span className="mt-2 block text-xs font-semibold leading-5 text-slate-500">{stat.note}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyBoardingSection() {
  return (
    <section className={cn(landingSectionClass, 'bg-[linear-gradient(180deg,#f4faff_0%,#ffffff_100%)]')} aria-labelledby="why-title">
      <div className={landingShellClass}>
        <Reveal className={landingSectionHeadingClass}>
          <span className={landingKickerClass}>Pourquoi Boarding ?</span>
          <h2 id="why-title" className={landingSectionTitleClass}>
            Un service conçu pour enlever le doute et accélérer ton projet.
          </h2>
          <p className={landingSectionParagraphClass}>
            L’étudiant ne cherche pas seulement une entreprise. Il cherche un cadre, des réponses et une équipe capable de l’aider à
            avancer sans se disperser.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {whyBoardingCards.map((card, index) => (
            <Reveal
              key={card.title}
              as="article"
              className={cn(
                landingSurfaceCardClass,
                'relative overflow-hidden p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#cfdcec] hover:shadow-[0_14px_30px_-12px_rgba(29,79,208,0.15)] before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent_0%,#1d4fd0_50%,transparent_100%)] before:opacity-0 before:transition-opacity hover:before:opacity-100'
              )}
              delay={index * 80}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-xs font-extrabold text-white shadow-sm">
                {card.marker}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold leading-tight text-[#07182f]">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{card.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className={cn(landingSectionClass, 'bg-[linear-gradient(180deg,#f4faff_0%,#ffffff_100%)] py-12')} aria-labelledby="trust-title">
      <div className={landingShellClass}>
        <Reveal className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_14px_38px_-18px_rgba(15,23,42,0.18)] lg:grid-cols-[0.65fr_1fr] lg:items-center lg:p-8">
          <div>
            <span className={landingKickerClass}>Confiance</span>
            <h2 id="trust-title" className="mt-2 font-display text-2xl font-bold leading-tight text-[#07182f] sm:text-3xl">
              Un cadre clair pour partir avec plus de sérénité.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {trustIndicators.map((item, index) => (
              <span
                key={item}
                className="rounded-2xl border border-slate-200 bg-[#f4faff] px-4 py-3 text-sm font-extrabold text-[#07182f] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b9d3ff] hover:bg-[#eef4ff]"
                style={{ '--indicator-delay': `${index * 70}ms` } as CSSProperties}
              >
                {item}
              </span>
            ))}
          </div>
        </Reveal>
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

interface ProcessStepProps {
  index: number;
  title: string;
  description: string;
}

function ProcessStep({ index, title, description }: ProcessStepProps) {
  return (
    <Reveal
      as="article"
      className={cn(
        landingSurfaceCardClass,
        'relative p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#cfdcec] hover:shadow-[0_14px_30px_-12px_rgba(29,79,208,0.15)]'
      )}
      delay={index * 90}
    >
      <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-sm font-extrabold text-white shadow-sm">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div>
        <h3 className="mt-5 font-display text-xl font-bold leading-tight text-[#07182f]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
      </div>
    </Reveal>
  );
}

function ProcessSection() {
  return (
    <section
      className={cn(landingSectionClass, 'bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]')}
      id="processus"
      aria-labelledby="processus-title"
    >
      <div className={landingShellClass}>
        <Reveal className={landingSectionHeadingClass}>
          <span className={landingKickerClass}>Comment ça marche ?</span>
          <h2 id="processus-title" className={landingSectionTitleClass}>
            Quatre étapes pour transformer ton projet en départ concret.
          </h2>
          <p className={landingSectionParagraphClass}>
            Le parcours réduit la confusion : tu sais quoi faire, quand le faire, et comment Boarding t’accompagne.
          </p>
        </Reveal>

        <div className="relative mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 hidden h-px xl:block"
            style={{ background: 'linear-gradient(90deg, transparent 0%, #b9d3ff 50%, transparent 100%)' }}
            aria-hidden="true"
          />
          {processSteps.map((step, index) => (
            <ProcessStep key={step.title} index={index} {...step} />
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

function PricingCard({ name, price, suffix, description, cta, features, featured }: PricingCardProps) {
  const previewFeatures = features.slice(0, pricingPreviewLimit);
  const remainingCount = Math.max(0, features.length - previewFeatures.length);

  return (
    <Reveal
      as="article"
      className={cn(
        'relative flex flex-col overflow-hidden rounded-[1.65rem] border bg-white p-0 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_32px_-12px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_4px_6px_rgba(15,23,42,0.04),0_24px_56px_-14px_rgba(15,23,42,0.14)]',
        featured
          ? 'border-brand-600/25 shadow-[0_1px_3px_rgba(29,79,208,0.06),0_18px_52px_-14px_rgba(29,79,208,0.18)] lg:-translate-y-2 lg:hover:-translate-y-3 lg:hover:border-brand-600/35 lg:hover:shadow-[0_4px_6px_rgba(29,79,208,0.06),0_28px_60px_-16px_rgba(29,79,208,0.22)]'
          : 'border-slate-200 hover:border-[#cfdcec]'
      )}
      delay={featured ? 100 : 0}
    >
      <div
        className={cn(
          'h-1 w-full shrink-0',
          featured
            ? 'bg-[linear-gradient(90deg,#1d4fd0_0%,#0891b2_50%,#1d4fd0_100%)]'
            : 'bg-[linear-gradient(90deg,#e2e8f0_0%,#cbd5e1_100%)]'
        )}
        aria-hidden="true"
      />

      {featured ? (
        <span className="mx-7 mt-6 inline-flex w-fit items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_2px_8px_-2px_rgba(29,79,208,0.4)]">
          Offre recommandée
        </span>
      ) : null}

      <div className={cn('px-7 pb-0 pt-7', featured ? 'pt-5' : '')}>
        <h3 className="text-[1.15rem] font-display font-bold leading-tight text-slate-700">{name}</h3>
        <p className="mt-4 text-[2.35rem] font-extrabold leading-[1.05] text-[#07182f]">
          {price}
          {suffix ? <span className="ml-1 text-base font-semibold text-slate-500">{suffix}</span> : null}
        </p>
        <p className="mt-4 text-[0.96rem] leading-7 text-slate-500">{description}</p>
      </div>

      <a
        href={`${appointmentHref}&body=Bonjour%20Boarding%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20le%20pack%20${name}.`}
        className={cn(
          'mx-7 mt-8 flex min-h-12 items-center justify-center rounded-xl border px-5 py-3.5 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2',
          featured
            ? 'border-transparent bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-[0_4px_18px_-4px_rgba(29,79,208,0.4)] hover:shadow-[0_8px_24px_-4px_rgba(29,79,208,0.5)]'
            : 'border-slate-200 bg-slate-100 text-[#07182f] hover:-translate-y-0.5 hover:bg-slate-200'
        )}
      >
        {cta}
      </a>

      <div
        className="mx-7 mt-8 h-px shrink-0 bg-[linear-gradient(90deg,transparent_0%,rgba(15,23,42,0.08)_50%,transparent_100%)]"
        aria-hidden="true"
      />

      <ul className="m-0 grid list-none gap-4 px-7 pb-8 pt-7">
        {previewFeatures.map((feature) => (
          <li
            key={feature.label}
            className={cn(
              'flex items-start gap-3 text-[0.96rem] font-medium leading-7',
              feature.included ? 'text-slate-700' : 'text-slate-400'
            )}
          >
            {feature.included ? (
              <svg
                className={cn('mt-1 shrink-0', featured ? 'text-emerald-600' : 'text-emerald-500')}
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
                className="mt-1 shrink-0 text-slate-300"
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
        <p className="mx-7 mb-7 mt-1 rounded-xl border border-dashed border-[#cfdcec] bg-[#f4faff] px-4 py-2 text-center text-xs font-semibold text-slate-500">
          + {remainingCount} autres éléments dans le comparatif
        </p>
      ) : null}
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

        <div className="mx-auto mt-14 w-full max-w-md px-2 pb-10 sm:max-w-lg lg:mt-16 lg:max-w-xl">
          <SwipeCardStack
            items={pricingPlans}
            getKey={(plan) => plan.name}
            renderItem={(plan) => <PricingCard {...plan} />}
            ariaLabel="Offres Boarding"
            previousLabel="Offre précédente"
            nextLabel="Offre suivante"
          />
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

function PartnersSection() {
  return (
    <section className={cn(landingSectionClass, 'py-10 sm:py-12')} aria-labelledby="partenaires-title">
      <div className={landingShellClass}>
        <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_14px_38px_-18px_rgba(15,23,42,0.18)] lg:grid-cols-[0.6fr_1fr] lg:items-center lg:p-8">
          <div>
            <span className={landingKickerClass}>Ils nous font confiance</span>
            <h2 id="partenaires-title" className="mt-2 font-display text-2xl font-bold text-[#07182f] sm:text-3xl">
              Un réseau construit autour de l’étudiant.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2" aria-label="Indicateurs de confiance">
            {partnerItems.map((item) => (
              <span
                key={item}
                className="flex min-h-20 items-center justify-center rounded-2xl border border-dashed border-[#cfdcec] bg-[#f4faff] px-4 text-center text-sm font-bold text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
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
        <StatsSection />
        <WhyBoardingSection />
        <ProcessSection />
        <TrustSection />
        <ProblemSolutionSection />
        <ConceptSection />
        <DestinationsSection />
        <PricingSection />
        <TestimonialsSection />
        <PartnersSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
