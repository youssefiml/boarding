import {
  Briefcase,
  Calendar,
  Check,
  Crown,
  Globe,
  Plane,
  Send,
  Sparkles,
  Star,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';

import processusPic1 from '@/assets/processus-pic1.webp';
import processusPic2 from '@/assets/processus-pic2.webp';
import processusPic3 from '@/assets/processus-pic3.webp';
import processusPic4 from '@/assets/processus-pic4.webp';
import processusPic5 from '@/assets/processus-pic5.webp';
import processusPic6 from '@/assets/processus-pic6.webp';
import { Reveal } from '@/features/landing/components/Reveal';
import { assetUrl } from '@/lib/asset-url';
import { cn } from '@/lib/cn';

type StepSide = 'left' | 'right';
type ImageKind = 'photo' | 'pricing' | 'matching' | 'meeting' | 'departure';

interface StickerBadge {
  line1: string;
  line2: string;
}

interface ProcessStep {
  index: number;
  label: string;
  title: string;
  description: string;
  side: StepSide;
  icon: LucideIcon;
  iconAccent: 'navy' | 'sunset';
  imageKind: ImageKind;
  imageSrc?: string;
  imageAlt?: string;
  sticker?: StickerBadge;
}

const STEPS: ProcessStep[] = [
  {
    index: 1,
    label: 'ÉTAPE 01',
    title: 'Création du profil',
    description:
      "Commence par créer ton profil en renseignant ton parcours, tes expériences, tes centres d'intérêt ainsi que ta personnalité. Ces informations nous permettent de mieux comprendre qui tu es et de te proposer des opportunités réellement adaptées. Tu peux également ajouter ton CV afin d'enrichir ton profil.",
    side: 'left',
    icon: User,
    iconAccent: 'navy',
    imageKind: 'photo',
    imageSrc: assetUrl(processusPic1),
    imageAlt: 'Étudiante créant son profil sur Boarding',
    sticker: { line1: 'PASS BOARDING', line2: 'PROFIL CRÉÉ' },
  },
  {
    index: 2,
    label: 'ÉTAPE 02',
    title: 'Choisis ton pack',
    description:
      "Sélectionne le pack d'accompagnement qui correspond à tes besoins : Économique, Classe Affaires ou Première Classe.",
    side: 'right',
    icon: Briefcase,
    iconAccent: 'sunset',
    imageKind: 'pricing',
    imageSrc: assetUrl(processusPic2),
    imageAlt: 'Choix du pack Boarding',
    sticker: { line1: 'PACK CHOISI', line2: 'PRÊT À COMMENCER' },
  },
  {
    index: 3,
    label: 'ÉTAPE 03',
    title: 'Matching avec\nles entreprises',
    description:
      "Une fois ton profil complété, notre système te propose rapidement une sélection de trois entreprises en adéquation avec ton profil. Tu peux consulter chaque opportunité, évaluer les compatibilités et choisir celle qui correspond le mieux à tes attentes.",
    side: 'left',
    icon: Users,
    iconAccent: 'navy',
    imageKind: 'matching',
    imageSrc: assetUrl(processusPic3),
    imageAlt: 'Matching avec les entreprises',
    sticker: { line1: 'RÉSULTAT MATCHING', line2: '3 OPTIONS' },
  },
  {
    index: 4,
    label: 'ÉTAPE 04',
    title: 'Prise de contact',
    description:
      "Après avoir identifié l'entreprise qui te convient, tu peux directement prendre rendez-vous pour échanger avec elle. L'objectif est de faciliter la mise en relation et de te permettre d'avancer rapidement dans ton processus.",
    side: 'right',
    icon: Calendar,
    iconAccent: 'sunset',
    imageKind: 'meeting',
    imageSrc: assetUrl(processusPic4),
    imageAlt: 'Visioconférence avec une entreprise partenaire',
    sticker: { line1: 'RENDEZ-VOUS', line2: 'PLANIFIÉ' },
  },
  {
    index: 5,
    label: 'ÉTAPE 05',
    title: 'Organisation\ndu départ',
    description:
      "En fonction du pack choisi, nous prenons en charge toute la logistique liée à ton arrivée : logement, transfert depuis l'aéroport, accompagnement et conseils pratiques. Tout est pensé pour simplifier ton départ.",
    side: 'left',
    icon: Send,
    iconAccent: 'navy',
    imageKind: 'departure',
    imageSrc: assetUrl(processusPic5),
    imageAlt: 'Préparation des bagages pour le stage à l’étranger',
    sticker: { line1: 'PRÊT', line2: 'POUR LE DÉPART' },
  },
  {
    index: 6,
    label: 'ÉTAPE 06',
    title: 'Intégration sur place',
    description:
      "Tu arrives dans les meilleures conditions, avec un cadre déjà organisé. Tu peux ainsi te concentrer pleinement sur ton stage et ton expérience à l'étranger. Tu rejoins aussi la communauté Boarding pour que tu ne sois pas tout seul.",
    side: 'right',
    icon: Globe,
    iconAccent: 'sunset',
    imageKind: 'photo',
    imageSrc: assetUrl(processusPic6),
    imageAlt: 'Communauté Boarding réunie sur place',
    sticker: { line1: 'BIENVENUE DANS', line2: 'LA COMMUNAUTÉ BOARDING' },
  },
];

/* ─────────────────────────── Mini UI mocks ─────────────────────────── */

function PricingMock() {
  return (
    <div className="grid h-full w-full grid-cols-3 gap-1.5 rounded-[1.25rem] bg-[#0E1233] p-2.5 sm:gap-2 sm:p-3">
      {/* ECONOMIC */}
      <div className="flex flex-col rounded-xl bg-[#181E4A] p-2 sm:p-2.5">
        <Briefcase className="h-3.5 w-3.5 text-white/55" aria-hidden="true" />
        <p className="mt-2 font-mono text-[7px] font-normal uppercase tracking-[0.14em] text-white/55 sm:text-[8px]">
          ÉCONOMIQUE
        </p>
        <ul className="mt-2 space-y-1 text-[7px] leading-[1.3] text-white/70 sm:text-[8px]">
          <li className="flex gap-1">
            <Check className="h-2 w-2 shrink-0 text-emerald-400" /> Accompagnement essentiel
          </li>
          <li className="flex gap-1">
            <Check className="h-2 w-2 shrink-0 text-emerald-400" /> Support dédié
          </li>
          <li className="flex gap-1">
            <Check className="h-2 w-2 shrink-0 text-emerald-400" /> Ressources clés
          </li>
        </ul>
        <div className="mt-auto pt-2 text-lg font-extrabold leading-tight text-white">
          490 €
        </div>
      </div>

      {/* BUSINESS — recommended */}
      <div className="relative flex flex-col rounded-xl bg-[#181E4A] p-2 ring-2 ring-[#FF6B35] sm:p-2.5">
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#FF6B35] px-1.5 py-[1px] font-mono text-[6px] font-normal uppercase tracking-[0.16em] text-white sm:text-[7px]">
          Recommandé
        </span>
        <Star className="h-3.5 w-3.5 text-[#FF6B35]" aria-hidden="true" />
        <p className="mt-2 font-mono text-[7px] font-normal uppercase tracking-[0.14em] text-[#FF8E5C] sm:text-[8px]">
          AFFAIRES
        </p>
        <ul className="mt-2 space-y-1 text-[7px] leading-[1.3] text-white/85 sm:text-[8px]">
          <li className="flex gap-1">
            <Check className="h-2 w-2 shrink-0 text-[#FF8E5C]" /> Accompagnement complet
          </li>
          <li className="flex gap-1">
            <Check className="h-2 w-2 shrink-0 text-[#FF8E5C]" /> Mise en relation prioritaire
          </li>
          <li className="flex gap-1">
            <Check className="h-2 w-2 shrink-0 text-[#FF8E5C]" /> Suivi personnalisé
          </li>
        </ul>
        <div className="mt-auto pt-2 text-lg font-extrabold leading-tight text-white">
          990 €
        </div>
      </div>

      {/* FIRST CLASS */}
      <div className="flex flex-col rounded-xl bg-[#181E4A] p-2 sm:p-2.5">
        <Crown className="h-3.5 w-3.5 text-white/55" aria-hidden="true" />
        <p className="mt-2 font-mono text-[7px] font-normal uppercase tracking-[0.14em] text-white/55 sm:text-[8px]">
          PREMIÈRE&nbsp;CLASSE
        </p>
        <ul className="mt-2 space-y-1 text-[7px] leading-[1.3] text-white/70 sm:text-[8px]">
          <li className="flex gap-1">
            <Check className="h-2 w-2 shrink-0 text-emerald-400" /> Accompagnement premium
          </li>
          <li className="flex gap-1">
            <Check className="h-2 w-2 shrink-0 text-emerald-400" /> Service sur-mesure
          </li>
          <li className="flex gap-1">
            <Check className="h-2 w-2 shrink-0 text-emerald-400" /> Expérience VIP
          </li>
        </ul>
        <div className="mt-auto pt-2 text-lg font-extrabold leading-tight text-white">
          1490 €
        </div>
      </div>
    </div>
  );
}

function MatchCard({
  name,
  city,
  pct,
  hue,
}: {
  name: string;
  city: string;
  pct: number;
  hue: 'orange' | 'cyan' | 'green';
}) {
  const hueClass =
    hue === 'orange'
      ? 'bg-[#FF6B35]'
      : hue === 'cyan'
      ? 'bg-[#3FB6E0]'
      : 'bg-[#3DCB91]';

  return (
    <div className="flex flex-col items-center rounded-xl bg-[#181E4A] px-2 py-2.5 text-center text-white sm:px-2.5 sm:py-3">
      <span className={cn('grid h-7 w-7 place-items-center rounded-md text-white', hueClass)}>
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <p className="mt-2 text-lg font-extrabold leading-tight text-white">
        {name}
      </p>
      <p className="font-mono text-[7px] font-normal uppercase tracking-[0.14em] text-white/55 sm:text-[8px]">
        {city}
      </p>
      <p className="mt-1.5 text-lg font-extrabold leading-tight">
        {pct}%
      </p>
      <p className="font-mono text-[6px] font-normal uppercase tracking-[0.14em] text-white/50 sm:text-[7px]">
        Compatibilité
      </p>
      <span className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-[#2B35AF] py-[3px] font-mono text-[7px] font-normal text-white sm:text-[8px]">
        Voir l’offre
      </span>
    </div>
  );
}

function MatchingMock() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 rounded-[1.25rem] bg-[#0E1233] p-2.5 sm:gap-2 sm:p-3">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        <MatchCard name="TechFlow" city="Casablanca" pct={95} hue="orange" />
        <MatchCard name="BlueWave" city="Rabat" pct={92} hue="cyan" />
        <MatchCard name="GreenPath" city="Tanger" pct={90} hue="green" />
      </div>
      <div className="mt-auto flex items-center justify-center gap-1.5 rounded-md bg-[#FF6B35]/15 py-1.5 font-mono text-[7px] font-normal uppercase tracking-[0.14em] text-[#FF8E5C] sm:text-[8px]">
        <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />3 opportunités trouvées pour toi
      </div>
    </div>
  );
}

function MeetingMock({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="grid h-full w-full grid-cols-[44%_1fr] gap-2 rounded-[1.25rem] bg-[#F5ECD7] p-2 sm:p-2.5">
      <div className="flex flex-col rounded-xl border border-[#1A1F5C]/10 bg-white p-2 shadow-sm">
        <p className="font-mono text-[7px] font-normal uppercase tracking-[0.14em] text-[#2B35AF] sm:text-[8px]">
          Prendre rendez-vous
        </p>
        <p className="mt-1 text-lg font-extrabold leading-tight text-[#1A1F5C]">
          Novembre 2026
        </p>
        <div className="mt-1.5 grid grid-cols-7 gap-[2px] text-[6px] font-medium text-[#1A1F5C]/70 sm:text-[7px]">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <span key={`${d}-${i}`} className="text-center text-[#1A1F5C]/40">
              {d}
            </span>
          ))}
          {Array.from({ length: 28 }).map((_, i) => {
            const day = i + 1;
            const isActive = day === 18;
            return (
              <span
                key={day}
                className={cn(
                  'flex h-3 w-3 items-center justify-center rounded-[3px] text-[6px] sm:h-3.5 sm:w-3.5 sm:text-[7px]',
                  isActive
                    ? 'bg-[#2B35AF] font-bold text-white'
                    : 'text-[#1A1F5C]/70'
                )}
              >
                {day}
              </span>
            );
          })}
        </div>
        <div className="mt-auto rounded-md bg-[#2B35AF]/8 px-1.5 py-1 font-mono text-[6px] uppercase tracking-[0.12em] text-[#2B35AF] sm:text-[7px]">
          Confirmé · 18 nov · 11:00
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

function DepartureMock({ src, alt }: { src: string; alt: string }) {
  const items = [
    'Logement réservé',
    'Transfert aéroport',
    'Guide pratique',
    'Assistance 24/7',
  ];
  return (
    <div className="grid h-full w-full grid-cols-[1fr_44%] gap-2 rounded-[1.25rem] bg-[#0E1233] p-2 sm:p-2.5">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      <ul className="flex flex-col gap-1 self-center rounded-xl bg-[#181E4A] p-2 sm:gap-1.5 sm:p-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-1.5 font-mono text-[7px] font-normal uppercase tracking-[0.12em] text-white/85 sm:text-[8px]"
          >
            <span className="grid h-3 w-3 shrink-0 place-items-center rounded-sm bg-emerald-400/90 text-[#0E1233]">
              <Check className="h-2 w-2" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PhotoImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}

/* ─────────────────────────── Step pieces ─────────────────────────── */

function Sticker({ sticker }: { sticker: StickerBadge }) {
  return (
    <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-xl border border-white/55 bg-white/90 px-2.5 py-1.5 shadow-[0_10px_22px_-14px_rgba(26,31,92,0.55)] backdrop-blur-md sm:bottom-4 sm:left-4 sm:gap-2.5 sm:px-3 sm:py-2">
      <span className="grid h-4 w-4 place-items-center rounded-full bg-[#FF6B35] text-white sm:h-5 sm:w-5">
        <Check className="h-2.5 w-2.5 stroke-[3]" aria-hidden="true" />
      </span>
      <div className="font-mono text-[8px] font-normal uppercase leading-tight tracking-[0.14em] text-[#1A1F5C] sm:text-[9px]">
        <div className="text-[#1A1F5C]/65">{sticker.line1}</div>
        <div className="font-bold text-[#1A1F5C]">{sticker.line2}</div>
      </div>
    </div>
  );
}

function StepImage({ step }: { step: ProcessStep }) {
  return (
    <div className="relative h-[190px] overflow-hidden rounded-[1.25rem] sm:h-[200px] lg:h-full">
      {step.imageSrc && step.imageAlt ? (
        <PhotoImage src={step.imageSrc} alt={step.imageAlt} />
      ) : (
        <>
          {step.imageKind === 'pricing' && <PricingMock />}
          {step.imageKind === 'matching' && <MatchingMock />}
          {step.imageKind === 'meeting' && (
            <MeetingMock
              src={step.imageSrc ?? assetUrl(processusPic4)}
              alt={step.imageAlt ?? 'Visioconference'}
            />
          )}
          {step.imageKind === 'departure' && (
            <DepartureMock
              src={step.imageSrc ?? assetUrl(processusPic5)}
              alt={step.imageAlt ?? 'Preparation du depart'}
            />
          )}
        </>
      )}

      {step.sticker && <Sticker sticker={step.sticker} />}
    </div>
  );
}

function StepText({ step }: { step: ProcessStep }) {
  return (
    <div className="flex h-full flex-col justify-start px-4 py-4 sm:px-5 sm:py-5">
      <p className="font-mono text-[10px] font-normal uppercase tracking-[0.22em] text-[#2B35AF] sm:text-[11px]">
        {step.label}
      </p>
      <h3 className="mt-1.5 whitespace-pre-line text-lg font-extrabold leading-tight text-[#1A1F5C]">
        {step.title}
      </h3>
      <span
        className="mt-2 block h-[3px] w-9 rounded-full bg-[#FF6B35]"
        aria-hidden="true"
      />
      <p className="mt-2 text-sm leading-relaxed text-[#607089] sm:text-[0.88rem]">
        {step.description}
      </p>
    </div>
  );
}

function StepCard({ step }: { step: ProcessStep }) {
  const imageFirst = step.side === 'left';
  return (
    <div
      className={cn(
        'relative mx-auto grid min-h-[190px] w-full max-w-[560px] overflow-hidden rounded-[1.4rem] border border-[#1A1F5C]/8 bg-white/95 shadow-[0_18px_44px_-26px_rgba(26,31,92,0.28)] backdrop-blur-sm sm:min-h-[200px] lg:mx-0 lg:min-h-[210px] xl:min-h-[220px]',
        'grid-cols-1 sm:grid-cols-[44%_1fr]'
      )}
    >
      {imageFirst ? (
        <>
          <StepImage step={step} />
          <StepText step={step} />
        </>
      ) : (
        <>
          <div className="order-1 sm:order-2">
            <StepImage step={step} />
          </div>
          <div className="order-2 sm:order-1">
            <StepText step={step} />
          </div>
        </>
      )}
    </div>
  );
}

function CenterMedallion({ step }: { step: ProcessStep }) {
  const Icon = step.icon;
  const isSunset = step.iconAccent === 'sunset';
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none relative z-10 grid h-11 w-11 place-items-center rounded-full text-white shadow-[0_10px_22px_-12px_rgba(26,31,92,0.45)] ring-[4px] ring-[#F5ECD7]',
        isSunset ? 'bg-[#FF6B35]' : 'bg-[#1A1F5C]'
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
    </span>
  );
}

/* ─────────────────────────── Section ─────────────────────────── */

export default function ProcessSection() {
  return (
    <section
      id="processus"
      aria-labelledby="processus-title"
      className="relative overflow-hidden bg-[#F5ECD7] px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8 lg:pb-16 lg:pt-10 [scroll-margin-top:6rem]"
    >
      {/* subtle dot grain background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:radial-gradient(circle_at_22%_18%,rgba(26,31,92,0.07)_1px,transparent_1.5px),radial-gradient(circle_at_78%_72%,rgba(255,107,53,0.07)_1px,transparent_1.5px)] [background-size:42px_42px,56px_56px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1360px]">
        {/* ───── Header ───── */}
        <Reveal className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="inline-flex text-base font-extrabold uppercase tracking-[0.18em] text-brand-600 sm:text-lg">
              Parcours Boarding
            </span>
            <Plane
              className="h-3.5 w-3.5 -rotate-12 text-[#2B35AF]"
              aria-hidden="true"
            />
          </div>

          <h2
            id="processus-title"
            className="mt-5 text-[clamp(1.6rem,3.2vw,3.25rem)] font-extrabold leading-tight text-[#1A1F5C]"
          >
            Ton parcours Boarding, étape par étape
          </h2>
          <p className="mx-auto mt-4 max-w-[820px] text-base leading-7 text-[#1A1F5C]/70 sm:text-lg sm:leading-8">
            De la création de ton profil à ton intégration sur place, Boarding
            t’accompagne à chaque étape pour rendre ton départ plus simple, plus
            fluide et plus rassurant.
          </p>
        </Reveal>

        {/* ───── Steps grid ───── */}
        <div className="relative mt-9 sm:mt-10 lg:mt-12">
          {/* central dashed path (desktop only) */}
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="
                M 50 0
                C 56 165, 44 335, 50 500
                C 56 665, 44 835, 50 1000
              "
              stroke="rgba(80, 95, 150, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="3 6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* 6-step alternating timeline: one card per row */}
          <div className="relative flex flex-col gap-y-6 lg:gap-y-10 xl:gap-y-11">
            {STEPS.map((step) => (
              <div
                key={step.index}
                className="grid grid-cols-1 gap-y-4 lg:grid-cols-[minmax(0,1fr)_7.5rem_minmax(0,1fr)] lg:items-center xl:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,1fr)_10rem_minmax(0,1fr)]"
              >
                {/* Left-side step */}
                {step.side === 'left' ? (
                  <Reveal delay={0} className="hidden lg:col-start-1 lg:flex lg:justify-end">
                    <StepCard step={step} />
                  </Reveal>
                ) : (
                  <div className="hidden lg:block" aria-hidden="true" />
                )}

                {/* Center checkpoint */}
                <div className="hidden lg:col-start-2 lg:flex lg:items-center lg:justify-center">
                  <CenterMedallion step={step} />
                </div>

                {/* Right-side step */}
                {step.side === 'right' ? (
                  <Reveal delay={0} className="hidden lg:col-start-3 lg:flex lg:justify-start">
                    <StepCard step={step} />
                  </Reveal>
                ) : (
                  <div className="hidden lg:block" aria-hidden="true" />
                )}

                {/* Mobile single-column card */}
                <Reveal delay={0} className="lg:hidden">
                  <StepCard step={step} />
                </Reveal>
              </div>
            ))}
          </div>

          {/* Mobile vertical dashed spine */}
          <div
            className="pointer-events-none absolute left-[14px] top-0 h-full border-l-2 border-dashed border-[#9498C4]/55 lg:hidden"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
