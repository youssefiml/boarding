import type { ReactElement } from 'react';

import saraAvatar from '@/assets/Sara.webp';
import { assetUrl } from '@/lib/asset-url';

type IconComponent = ({ className }: { className?: string }) => ReactElement;

interface MissionFeature {
  title: string;
  Icon: IconComponent;
}

interface ValueItem {
  title: string;
  description: string;
  Icon: IconComponent;
}

const missionFeatures: MissionFeature[] = [
  { title: 'Accompagnement de A à Z', Icon: MissionMapIcon },
  { title: 'Expérience humaine à l’international', Icon: MissionGlobeIcon },
  { title: 'Suivi avant, pendant et après le départ', Icon: MissionChecklistIcon },
];

const values: ValueItem[] = [
  {
    title: 'Jeune et accessible',
    description: 'Une plateforme pensée avec les codes de notre génération.',
    Icon: PeopleIcon,
  },
  {
    title: 'Structuré et rassurant',
    description: 'Chaque étape est claire, guidée et organisée.',
    Icon: ChecklistIcon,
  },
  {
    title: 'Ancré dans le réel',
    description: 'On ne vend pas juste un stage, on accompagne une vraie expérience de vie.',
    Icon: GlobeIcon,
  },
  {
    title: 'Humain avant tout',
    description: 'Un membre de l’équipe reste disponible pour accompagner chaque étudiant.',
    Icon: HeartIcon,
  },
];

function MissionFeatureCard({ feature }: { feature: MissionFeature }) {
  const { Icon } = feature;
  return (
    <article className="min-h-[4.6rem] rounded-[1rem] border border-[rgba(218,170,100,0.28)] bg-[rgba(255,255,255,0.78)] px-3 py-3 shadow-[0_12px_26px_-23px_rgba(7,24,47,0.42)]">
      <div className="flex h-full items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(205,163,101,0.28)] bg-[#fff7ea]" aria-hidden="true">
          <Icon className="h-5 w-5" />
        </span>
        <h4 className="text-[0.78rem] font-bold leading-[1.25rem] text-[#142442]">{feature.title}</h4>
      </div>
    </article>
  );
}

function ValueCard({ item }: { item: ValueItem }) {
  const { Icon } = item;
  return (
    <article className="min-h-[5.75rem] rounded-[1.25rem] border border-[rgba(205,163,101,0.22)] bg-[rgba(255,255,255,0.78)] px-4 py-3.5 shadow-[0_14px_30px_-26px_rgba(7,24,47,0.42)]">
      <div className="flex h-full items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(205,163,101,0.22)] bg-[#fff7ea]" aria-hidden="true">
          <Icon className="h-8 w-8" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[0.96rem] font-extrabold leading-5 text-[#07182f]">{item.title}</h3>
          <p className="mt-1 max-w-[15rem] overflow-hidden text-[0.8rem] leading-[1.25rem] text-[#5f6e86] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export function WhoWeAreSection() {
  return (
    <section id="qui-sommes-nous" className="relative overflow-hidden bg-[#F5ECD7] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20 [scroll-margin-top:6rem]">
      <span id="concept" className="pointer-events-none absolute -top-24" aria-hidden="true" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_18%_14%,rgba(37,99,235,0.09)_1px,transparent_1.5px),radial-gradient(circle_at_84%_72%,rgba(249,115,22,0.09)_1px,transparent_1.5px)] [background-size:46px_46px,58px_58px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1360px]">
        <header className="relative mx-auto max-w-5xl text-center">
          <TravelStampIcon className="pointer-events-none absolute -left-6 -top-8 hidden h-20 w-[110px] opacity-60 xl:block" />
          <SparklesIcon className="pointer-events-none absolute left-10 top-12 hidden h-10 w-10 opacity-65 xl:block" />
          <div className="pointer-events-none absolute -right-2 top-2 hidden xl:block" aria-hidden="true">
            <MapPinRouteDecoration className="h-20 w-[180px] opacity-75" />
          </div>

          <p className="text-[0.9rem] font-extrabold uppercase tracking-[0.3em] text-[#1d67f0]">QUI SOMMES-NOUS ?</p>
          <h2 className="mx-auto mt-5 max-w-5xl text-[clamp(1.6rem,3.2vw,3.25rem)] font-black leading-[1.05] text-[#07182f]">
            Une startup créée par des jeunes, pour des jeunes.
          </h2>
          <p className="mx-auto mt-6 max-w-[860px] text-[1.08rem] leading-8 text-[#607089] sm:text-xl sm:leading-9">
            Boarding accompagne les étudiants de A à Z pour trouver un stage à l’étranger, vivre une vraie expérience sur place et avancer avec plus de confiance.
          </p>
        </header>

        <div className="mt-12 grid items-stretch gap-7 lg:grid-cols-2 xl:gap-8">
          <article className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[rgba(205,163,101,0.22)] bg-[#fffaf0] px-5 py-5 shadow-[0_18px_44px_-34px_rgba(7,24,47,0.45)] sm:px-6 sm:py-6 lg:px-7">
            <div className="relative z-10 flex items-center gap-3">
              <CompassIcon className="h-12 w-12 shrink-0" />
              <h3 className="text-[1.55rem] font-extrabold leading-[1.08] text-[#07182f] sm:text-[1.85rem] lg:text-[2rem]">Notre mission</h3>
            </div>

            <div className="relative z-10 mt-4 max-w-[34rem] space-y-3.5 text-[0.9rem] leading-7 text-[#263954] sm:pr-12">
              <p>
                Boarding est une startup créée par des jeunes, pour des jeunes. Notre mission est de faciliter l’accès aux stages à l’étranger tout en offrant une véritable expérience de vie.
              </p>
              <p>
                Nous accompagnons les étudiants de la recherche de stage jusqu’à leur intégration sur place, en passant par le logement et le suivi tout au long du séjour.
              </p>
              <p>
                Plus qu’une simple plateforme, Boarding est un tremplin pour se découvrir, gagner en confiance et vivre une expérience professionnelle et humaine à l’international.
              </p>
            </div>

            <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">
              {missionFeatures.map((feature) => (
                <MissionFeatureCard key={feature.title} feature={feature} />
              ))}
            </div>

            <GlobePlaneIllustration className="pointer-events-none absolute right-2 top-[5.4rem] hidden h-[215px] w-[245px] opacity-[0.42] sm:block lg:right-3 xl:right-5" />
          </article>

          <article className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[rgba(205,163,101,0.2)] bg-[#fffaf0] px-5 py-5 shadow-[0_18px_44px_-34px_rgba(7,24,47,0.45)] sm:px-6 sm:py-6 lg:px-7">
            <div className="relative z-10 grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-x-4 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-x-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[#F2A15D] bg-[linear-gradient(140deg,#fff7e7_0%,#f4efe5_100%)] p-[3px] sm:h-24 sm:w-24">
                <img
                  src={assetUrl(saraAvatar)}
                  alt="Portrait de Sara El Kasmi, fondatrice de Boarding"
                  className="h-full w-full rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-[1.45rem] font-black leading-[1.08] text-[#07182f] sm:text-[1.72rem] lg:text-[1.88rem]">Mot de la fondatrice</h3>
                <p className="mt-2.5 text-[1rem] font-extrabold leading-none text-[#1d67f0] sm:text-[1.08rem]">Sara El Kasmi</p>
                <p className="mt-1 text-[0.82rem] font-medium leading-5 text-[#50627f] sm:text-[0.88rem]">Fondatrice de Boarding</p>
                <span className="mt-2 block h-[2px] w-9 rounded-full bg-[#f28a3d]" aria-hidden="true" />
              </div>
            </div>

            <div className="relative z-10 mt-4 grid grid-cols-[2.65rem_minmax(0,1fr)] gap-x-2 sm:ml-16 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-3">
              <QuoteIcon className="pointer-events-none mt-[-0.35rem] h-11 w-11 opacity-70 sm:h-12 sm:w-12" />

              <div className="max-w-[33rem] space-y-3.5 text-[0.88rem] leading-[1.65] text-[#263954] sm:text-[0.9rem]">
                <p>
                  Je m’appelle Sara El Kasmi. Au cours de mes études en France, j’ai rapidement constaté une réalité : beaucoup d’étudiants rencontrent des difficultés à trouver un stage, encore plus lorsqu’il s’agit de partir à l’étranger.
                </p>
                <p>
                  C’est après un voyage en Afrique du Sud que j’ai eu un déclic. J’ai compris à quel point une expérience à l’international peut transformer une personne, autant sur le plan professionnel que personnel.
                </p>
                <p>
                  J’ai donc décidé de revenir au Maroc pour créer Boarding. Mon ambition est simple : ne plus laisser les jeunes avancer seuls, et leur offrir l’opportunité de vivre une expérience forte, utile et inoubliable à l’étranger.
                </p>
              </div>
            </div>

            <CityPalmLineArt className="pointer-events-none absolute -bottom-3 right-2 h-[100px] w-[220px] opacity-[0.28] sm:h-[116px] sm:w-[260px]" />
          </article>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => (
            <ValueCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#FFF7EA" stroke="#F2D0A2" strokeWidth="1" />
      <path d="M31.5 15.5 27.1 29c-.2.6-.7 1.1-1.3 1.3l-11.3 4.2 4.2-11.3c.2-.6.7-1.1 1.3-1.3l11.5-6.4Z" fill="#F7FBFF" stroke="#1D67F0" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M20.5 27.5 24 24" stroke="#F97316" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function MissionMapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3.5 6.5 8 4.5l5 2 7.5-3v13l-7.5 3-5-2-4.5 2v-13Z" stroke="#1D67F0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 4.5v13M13 6.5v13" stroke="#1D67F0" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17.7 3.4c0 2.4-2.7 4.9-2.7 4.9s-2.7-2.5-2.7-4.9A2.7 2.7 0 0 1 15 .7a2.7 2.7 0 0 1 2.7 2.7Z" fill="#FFF1E5" stroke="#F97316" strokeWidth="1.4" />
      <circle cx="15" cy="3.4" r=".75" fill="#F97316" />
    </svg>
  );
}

function MissionGlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="#1D67F0" strokeWidth="1.7" />
      <path d="M3.5 12h17M12 3.5c2.6 2.2 3.7 5 3.7 8.5s-1.1 6.3-3.7 8.5M12 3.5c-2.6 2.2-3.7 5-3.7 8.5s1.1 6.3 3.7 8.5" stroke="#1D67F0" strokeWidth="1.55" strokeLinecap="round" />
      <path d="M6 7.2c1.7 1 3.7 1.5 6 1.5s4.3-.5 6-1.5M6 16.8c1.7-1 3.7-1.5 6-1.5s4.3.5 6 1.5" stroke="#F97316" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function MissionChecklistIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="5" y="3.5" width="14" height="17" rx="2.2" stroke="#1D67F0" strokeWidth="1.7" />
      <path d="M9 3.5h6v3H9v-3Z" fill="#FFF7EA" stroke="#1D67F0" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m8.2 11.3 1.5 1.5 3-3.3M8.2 16.1l1.5 1.5 3-3.3" stroke="#F97316" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.7 11.5h2M14.7 16.3h2" stroke="#1D67F0" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="48" cy="48" r="42" fill="#FFF8E8" stroke="#F2D7A6" strokeWidth="2" />
      <circle cx="48" cy="48" r="27" fill="#EFF6FF" stroke="#2563EB" strokeWidth="4" />
      <path d="M21 48h54M48 21c9 8 13 17 13 27S57 67 48 75M48 21c-9 8-13 17-13 27s4 19 13 27" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
      <path d="M28 31c6 4 13 6 20 6s14-2 20-6M28 65c6-4 13-6 20-6s14 2 20 6" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" opacity=".75" />
      <path d="M32 76h32" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ChecklistIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="48" cy="48" r="42" fill="#FFF8E8" stroke="#F2D7A6" strokeWidth="2" />
      <rect x="26" y="18" width="44" height="60" rx="8" fill="white" stroke="#2563EB" strokeWidth="4" />
      <path d="M38 18h20v10H38V18Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="4" strokeLinejoin="round" />
      <path d="M36 42l4 4 8-9M36 58l4 4 8-9" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52 44h10M52 60h10" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="48" cy="48" r="42" fill="#FFF8E8" stroke="#F2D7A6" strokeWidth="2" />
      <circle cx="48" cy="36" r="12" fill="#EFF6FF" stroke="#2563EB" strokeWidth="4" />
      <path d="M27 76v-4c0-12 9-22 21-22s21 10 21 22v4" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
      <circle cx="25" cy="44" r="8" fill="white" stroke="#2563EB" strokeWidth="4" />
      <circle cx="71" cy="44" r="8" fill="white" stroke="#2563EB" strokeWidth="4" />
      <path d="M13 76v-3c0-8 5-15 13-17M83 76v-3c0-8-5-15-13-17" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
      <path d="M76 68l6 6 10-14" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity=".85" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="48" cy="48" r="42" fill="#FFF8E8" stroke="#F2D7A6" strokeWidth="2" />
      <path d="M48 72S24 58 24 39c0-10 8-17 17-17 5 0 9 2 12 6 3-4 7-6 12-6 9 0 17 7 17 17 0 19-24 33-24 33Z" fill="#FFE8D6" stroke="#2563EB" strokeWidth="4" strokeLinejoin="round" />
      <path d="M39 39c3-5 10-5 13 0" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M34 24C22 32 16 43 16 56c0 11 7 18 17 18 9 0 15-6 15-15 0-8-6-14-14-14-2 0-4 .3-5.5 1C30 39 35 33 42 28l-8-4Zm38 0C60 32 54 43 54 56c0 11 7 18 17 18 9 0 15-6 15-15 0-8-6-14-14-14-2 0-4 .3-5.5 1C68 39 73 33 80 28l-8-4Z" fill="#F97316" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M58 12 68 42l30 10-30 10-10 30-10-30-30-10 30-10 10-30Z" fill="#FFF8E8" stroke="#F97316" strokeWidth="4" strokeLinejoin="round" />
      <path d="M98 78 104 94l16 6-16 6-6 16-6-16-16-6 16-6 6-16Z" fill="#EFF6FF" stroke="#2563EB" strokeWidth="4" strokeLinejoin="round" />
      <path d="M24 80 28 91l11 4-11 4-4 11-4-11-11-4 11-4 4-11Z" fill="white" stroke="#F97316" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function TravelStampIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g opacity=".75">
        <circle cx="55" cy="65" r="44" fill="none" stroke="#E9C98F" strokeWidth="3" strokeDasharray="8 5" />
        <circle cx="55" cy="65" r="34" fill="none" stroke="#E9C98F" strokeWidth="2" />
        <path d="M77 47 51 68M77 47l-11 36-15-15-20-8 46-13Z" stroke="#D8B878" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M100 38h64M95 55h70M100 72h64M95 89h70" stroke="#D8B878" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function CityPalmLineArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g opacity=".5" stroke="#C8B28C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 154h320" />
        <path d="M44 154V84h42v70M58 98h14M58 116h14M58 134h14" />
        <path d="M110 154V104h48v50M122 120h24M122 136h24" />
        <path d="M184 154V64l34-30 34 30v90M202 78h32M202 98h32M202 118h32" />
        <path d="M285 154V78" />
        <path d="M285 82c-18-20-36-10-46 2M287 82c19-20 36-10 47 2M285 82c-6-25 10-38 26-43M285 82c6-25-10-38-26-43" />
        <path d="M8 154c34-35 62-35 98 0M126 154c32-30 70-30 101 0" />
      </g>
    </svg>
  );
}

function GlobePlaneIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g opacity=".55">
        <path d="M210 11c22 5 33 25 27 45 18 6 27 24 21 42-8 23-36 27-58 21-30-8-55-28-51-57 4-28 32-57 61-51Z" fill="#EAF1F8" />
        <path d="M221 54 246 70l-26 7 5-11-4-12Z" fill="#1D67F0" opacity=".72" />
        <path d="M219 74c-30 16-18 44 12 38 25-5 27 24 2 33-22 8-47-5-47-5" stroke="#F97316" strokeWidth="1.6" strokeDasharray="6 7" strokeLinecap="round" />
        <path d="M230 96c-7 5-12 10-14 16" stroke="#F97316" strokeWidth="1.4" strokeDasharray="5 7" strokeLinecap="round" />
      </g>

      <g opacity=".5">
        <circle cx="189" cy="168" r="58" fill="#F7FBFF" stroke="#BFD7FF" strokeWidth="1.6" />
        <path d="M131 168h116M189 110c18 17 27 36 27 58s-9 41-27 58M189 110c-18 17-27 36-27 58s9 41 27 58" stroke="#BFD7FF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M146 130c26 11 59 11 86 0M146 206c26-11 59-11 86 0" stroke="#BFD7FF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M145 160c14-8 25-9 38-3 10 4 18 3 28-5 9-7 17-8 27-3M151 183c11-6 20-6 30 0 9 5 18 5 29 0 9-4 18-4 27 1" stroke="#8EA8C7" strokeWidth="1.25" strokeLinecap="round" opacity=".7" />
        <path d="M70 228c36-17 82-17 119 0 23-8 43-8 70 0" stroke="#D9C4A1" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function MapPinRouteDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14 82C57 40 91 103 133 66C175 29 202 71 232 49" stroke="#D7B98D" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 10" />
      <path d="M229 35c0 8-9 16-16 22-7-6-16-14-16-22 0-9 7-16 16-16s16 7 16 16Z" fill="#F5B26F" />
      <circle cx="213" cy="35" r="5" fill="#FFF6E8" />
    </svg>
  );
}
