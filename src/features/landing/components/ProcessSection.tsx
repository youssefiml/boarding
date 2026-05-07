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
    label: 'STEP 01',
    title: 'Création du profil',
    description:
      "Commence par créer ton profil en renseignant ton parcours, tes expériences, tes centres d'intérêt ainsi que ta personnalité. Ces informations nous permettent de mieux comprendre qui tu es et de te proposer des opportunités réellement adaptées. Tu peux également ajouter ton CV afin d'enrichir ton profil.",
    side: 'left',
    icon: User,
    iconAccent: 'navy',
    imageKind: 'photo',
    imageSrc: assetUrl(processusPic1),
    imageAlt: 'Étudiante créant son profil sur Boarding',
    sticker: { line1: 'BOARDING PASS', line2: 'PROFILE CREATED' },
  },
  {
    index: 2,
    label: 'STEP 02',
    title: 'Choisis ton pack',
    description:
      "Sélectionne le pack d'accompagnement qui correspond à tes besoins : Economic, Business ou First Class.",
    side: 'right',
    icon: Briefcase,
    iconAccent: 'sunset',
    imageKind: 'pricing',
  },
  {
    index: 3,
    label: 'STEP 03',
    title: 'Matching avec\nles entreprises',
    description:
      "Une fois ton profil complété, notre système te propose rapidement une sélection de trois entreprises en adéquation avec ton profil. Tu peux consulter chaque opportunité, évaluer les compatibilités et choisir celle qui correspond le mieux à tes attentes.",
    side: 'left',
    icon: Users,
    iconAccent: 'navy',
    imageKind: 'matching',
  },
  {
    index: 4,
    label: 'STEP 04',
    title: 'Prise de contact',
    description:
      "Après avoir identifié l'entreprise qui te convient, tu peux directement prendre rendez-vous pour échanger avec elle. L'objectif est de faciliter la mise en relation et de te permettre d'avancer rapidement dans ton processus.",
    side: 'right',
    icon: Calendar,
    iconAccent: 'sunset',
    imageKind: 'meeting',
    imageSrc: assetUrl(processusPic4),
    imageAlt: 'Visioconférence avec une entreprise partenaire',
    sticker: { line1: 'MEETING', line2: 'SCHEDULED' },
  },
  {
    index: 5,
    label: 'STEP 05',
    title: 'Organisation\ndu départ',
    description:
      "En fonction du pack choisi, nous prenons en charge toute la logistique liée à ton arrivée : logement, transfert depuis l'aéroport, accompagnement et conseils pratiques. Tout est pensé pour simplifier ton départ.",
    side: 'left',
    icon: Send,
    iconAccent: 'navy',
    imageKind: 'departure',
    imageSrc: assetUrl(processusPic2),
    imageAlt: 'Préparation des bagages pour le stage à l’étranger',
    sticker: { line1: 'ALL SET', line2: 'FOR TAKE-OFF' },
  },
  {
    index: 6,
    label: 'STEP 06',
    title: 'Intégration sur place',
    description:
      "Tu arrives dans les meilleures conditions, avec un cadre déjà organisé. Tu peux ainsi te concentrer pleinement sur ton stage et ton expérience à l'étranger. Tu rejoins aussi la communauté Boarding pour que tu ne sois pas tout seul.",
    side: 'right',
    icon: Globe,
    iconAccent: 'sunset',
    imageKind: 'photo',
    imageSrc: assetUrl(processusPic3),
    imageAlt: 'Communauté Boarding réunie sur place',
    sticker: { line1: 'WELCOME TO', line2: 'THE BOARDING COMMUNITY' },
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
          ECONOMIC
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
          BUSINESS
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
          FIRST&nbsp;CLASS
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
        <MatchCard name="TechFlow" city="Barcelona" pct={95} hue="orange" />
        <MatchCard name="BlueWave" city="Lisbonne" pct={92} hue="cyan" />
        <MatchCard name="GreenPath" city="Berlin" pct={90} hue="green" />
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
    <div className="relative h-full min-h-[200px] overflow-hidden rounded-[1.5rem] sm:min-h-[220px]">
      {step.imageKind === 'photo' && step.imageSrc && step.imageAlt && (
        <PhotoImage src={step.imageSrc} alt={step.imageAlt} />
      )}
      {step.imageKind === 'pricing' && <PricingMock />}
      {step.imageKind === 'matching' && <MatchingMock />}
      {step.imageKind === 'meeting' && (
        <MeetingMock
          src={step.imageSrc ?? assetUrl(processusPic4)}
          alt={step.imageAlt ?? 'Visioconférence'}
        />
      )}
      {step.imageKind === 'departure' && step.imageSrc && step.imageAlt && (
        <DepartureMock src={step.imageSrc} alt={step.imageAlt} />
      )}

      {step.sticker && <Sticker sticker={step.sticker} />}
    </div>
  );
}

function StepText({ step }: { step: ProcessStep }) {
  return (
    <div className="flex h-full flex-col justify-center px-5 py-5 sm:px-6 sm:py-6">
      <p className="font-mono text-[10px] font-normal uppercase tracking-[0.22em] text-[#2B35AF] sm:text-[11px]">
        {step.label}
      </p>
      <h3 className="mt-2 whitespace-pre-line text-lg font-extrabold leading-tight text-[#1A1F5C]">
        {step.title}
      </h3>
      <span
        className="mt-3 block h-[3px] w-9 rounded-full bg-[#FF6B35]"
        aria-hidden="true"
      />
      <p className="mt-3 text-[0.82rem] leading-[1.55] text-[#1A1F5C]/70 sm:text-[0.9rem]">
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
        'relative grid overflow-hidden rounded-[1.75rem] border border-[#1A1F5C]/8 bg-white/95 shadow-[0_24px_56px_-30px_rgba(26,31,92,0.32)] backdrop-blur-sm',
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

function CenterMedallion({
  step,
  topPercent,
}: {
  step: ProcessStep;
  topPercent: number;
}) {
  const Icon = step.icon;
  const isSunset = step.iconAccent === 'sunset';
  return (
    <div
      className="pointer-events-none absolute left-1/2 z-10 hidden -translate-x-1/2 lg:block"
      style={{ top: `${topPercent}%` }}
      aria-hidden="true"
    >
      <span
        className={cn(
          'grid h-12 w-12 place-items-center rounded-full text-white shadow-[0_14px_28px_-12px_rgba(26,31,92,0.55)] ring-[5px] ring-[#F5ECD7]',
          isSunset ? 'bg-[#FF6B35]' : 'bg-[#1A1F5C]'
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}

/* ─────────────────────────── Section ─────────────────────────── */

const LEFT_STEPS = STEPS.filter((step) => step.side === 'left');
const RIGHT_STEPS = STEPS.filter((step) => step.side === 'right');

// Vertical positions (% of steps grid height) for the 6 medallions.
// Computed so each medallion sits between its row's left and right cards.
const MEDALLION_POSITIONS = [9, 23.5, 41.5, 56, 74, 89];

export default function ProcessSection() {
  return (
    <section
      id="processus"
      aria-labelledby="processus-title"
      className="relative overflow-hidden bg-[#F5ECD7] px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8 lg:pb-24 lg:pt-12 [scroll-margin-top:6rem]"
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
            <span
              className="hidden h-px w-12 border-t border-dashed border-[#2B35AF]/45 sm:inline-block"
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] font-normal uppercase tracking-[0.3em] text-[#2B35AF] sm:text-xs">
              Boarding Journey
            </span>
            <Plane
              className="h-3.5 w-3.5 -rotate-12 text-[#2B35AF]"
              aria-hidden="true"
            />
            <span
              className="hidden h-px w-12 border-t border-dashed border-[#2B35AF]/45 sm:inline-block"
              aria-hidden="true"
            />
          </div>

          <h2
            id="processus-title"
            className="mt-5 text-lg font-extrabold leading-tight text-[#1A1F5C]"
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
        <div className="relative mt-14 sm:mt-16 lg:mt-20">
          {/* central serpentine dashed path (desktop only) */}
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="
                M 50 10
                C 64 90,  36 170, 50 250
                C 64 330, 36 410, 50 490
                C 64 570, 36 660, 50 740
                C 64 820, 36 900, 50 990
              "
              stroke="#9498C4"
              strokeOpacity="0.7"
              strokeWidth="1.4"
              strokeDasharray="4 7"
              strokeLinecap="round"
            />
          </svg>

          {/* Two-column staircase: left col (01,03,05) and right col (02,04,06) offset down */}
          <div className="relative grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-0 xl:gap-x-28">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-y-16 lg:gap-y-28">
              {LEFT_STEPS.map((step) => (
                <Reveal key={step.index} delay={0} className="block">
                  <StepCard step={step} />
                </Reveal>
              ))}
            </div>

            {/* RIGHT COLUMN — staircase offset on desktop */}
            <div className="flex flex-col gap-y-16 lg:gap-y-28 lg:pt-32">
              {RIGHT_STEPS.map((step) => (
                <Reveal key={step.index} delay={0} className="block">
                  <StepCard step={step} />
                </Reveal>
              ))}
            </div>

            {/* Medallions positioned along the central path */}
            {STEPS.map((step, i) => (
              <CenterMedallion
                key={step.index}
                step={step}
                topPercent={MEDALLION_POSITIONS[i] ?? 50}
              />
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
