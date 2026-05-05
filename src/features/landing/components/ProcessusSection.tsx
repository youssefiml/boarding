import step1Image from '@/assets/process/step-1.jpg';
import step2Image from '@/assets/process/step-2.jpg';
import step3Image from '@/assets/process/step-3.jpg';
import step4Image from '@/assets/process/step-4.jpg';
import step5Image from '@/assets/process/step-5.jpg';
import step6Image from '@/assets/process/step-6.jpg';
import { Reveal } from '@/features/landing/components/Reveal';
import { cn } from '@/lib/cn';

type ProcessIconKey = 'profile' | 'pack' | 'matching' | 'contact' | 'departure' | 'community';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  iconKey: ProcessIconKey;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: "Création du profil",
    description:
      "Commence par créer ton profil en renseignant ton parcours, tes expériences, tes centres d'intérêt ainsi que ta personnalité. Ces informations nous permettent de mieux comprendre qui tu es et de te proposer des opportunités réellement adaptées. Tu peux également ajouter ton CV afin d'enrichir ton profil.",
    image: step1Image,
    imageAlt: "Étudiants préparant leur projet de stage à l'étranger",
    iconKey: "profile",
  },
  {
    id: 2,
    title: "Choisis ton pack",
    description:
      "Sélectionne le pack d'accompagnement qui correspond à tes besoins : Economic, Business ou First Class.",
    image: step2Image,
    imageAlt: "Étudiants en train de choisir leur accompagnement",
    iconKey: "pack",
  },
  {
    id: 3,
    title: "Matching avec les entreprises",
    description:
      "Une fois ton profil complété, notre système te propose rapidement une sélection de trois entreprises en adéquation avec ton profil. Tu peux consulter chaque opportunité, évaluer les compatibilités et choisir celle qui correspond le mieux à tes attentes.",
    image: step3Image,
    imageAlt: "Groupe d'étudiants collaborant autour d'un ordinateur",
    iconKey: "matching",
  },
  {
    id: 4,
    title: "Prise de contact",
    description:
      "Après avoir identifié l'entreprise qui te convient, tu peux directement prendre rendez-vous pour échanger avec elle. L'objectif est de faciliter la mise en relation et de te permettre d'avancer rapidement dans ton processus.",
    image: step4Image,
    imageAlt: "Étudiants échangeant avant une mise en relation",
    iconKey: "contact",
  },
  {
    id: 5,
    title: "Organisation du départ",
    description:
      "En fonction du pack choisi, nous prenons en charge toute la logistique liée à ton arrivée : logement, transfert depuis l'aéroport, accompagnement et conseils pratiques. Tout est pensé pour simplifier ton départ.",
    image: step5Image,
    imageAlt: "Étudiants préparant leur départ avec des valises",
    iconKey: "departure",
  },
  {
    id: 6,
    title: "Intégration sur place",
    description:
      "Tu arrives dans les meilleures conditions, avec un cadre déjà organisé. Tu peux ainsi te concentrer pleinement sur ton stage et ton expérience à l'étranger. Tu rejoins aussi la communauté Boardi pour ne pas vivre cette expérience seul.",
    image: step6Image,
    imageAlt: "Communauté d'étudiants intégrés sur place",
    iconKey: "community",
  },
];

const processRows = [
  { left: processSteps[0], right: processSteps[1], connectorIcon: 'plane' },
  { left: processSteps[2], right: processSteps[3], connectorIcon: 'search' },
  { left: processSteps[4], right: processSteps[5], connectorIcon: 'bag' },
];

function ProcessIcon({ iconKey }: { iconKey: ProcessIconKey | 'plane' | 'search' | 'bag' }) {
  const cls = 'h-5 w-5';

  // Step icons
  if (iconKey === 'profile') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }

  if (iconKey === 'pack') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9L12 5l6 4v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }

  if (iconKey === 'matching') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }

  if (iconKey === 'contact') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }

  if (iconKey === 'departure') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9l6-6 6 6M6 21h12a2 2 0 0 0 2-2V9M9 21v-6h6v6" />
      </svg>
    );
  }

  if (iconKey === 'community') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  // Connector icons
  if (iconKey === 'plane') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.8 19.2 16 11l3.5-2 1.7 5.4M6.4 18.4l-.8-4.8m2.3-5L7 10 5.1 5.1M6 5l6-1 4 2.18" />
        <path d="M17 10c-.3-1-1.6-2-2.5-2s-2.2 1-2.5 2" />
      </svg>
    );
  }

  if (iconKey === 'search') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    );
  }

  if (iconKey === 'bag') {
    return (
      <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9L6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M6 9h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z" />
        <path d="M9 5v4M15 5v4" />
      </svg>
    );
  }

  return null;
}

function ProcessStepImage({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[40px]">
      {/* Decorative background blob */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[40px] opacity-40"
        style={{
          background: 'radial-gradient(circle at 30% 50%, rgba(43, 126, 255, 0.15) 0%, rgba(245, 236, 215, 0.1) 70%)',
        }}
        aria-hidden="true"
      />

      <img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />

      {/* Soft shadow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[40px]"
        style={{
          boxShadow: 'inset 0 0 40px rgba(24, 43, 84, 0.08), 0 18px 45px rgba(24, 43, 84, 0.16)',
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function ProcessStepPanel({
  step,
}: {
  step: ProcessStep;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-[28px] border border-[rgba(20,35,60,0.08)] bg-[rgba(255,255,255,0.88)] p-8 shadow-[0_8px_32px_rgba(24,43,84,0.12)]',
        'md:p-7'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1d4fd0] to-[#2868f0] text-base font-bold text-white shadow-[0_12px_32px_rgba(43,126,255,0.28)]">
          {String(step.id).padStart(2, '0')}
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <h3 className="text-xl font-bold leading-[1.2] text-[#081f3d] md:text-lg">
            {step.title}
          </h3>
        </div>
      </div>
      <p className="text-base leading-[1.7] text-[#63728a] md:text-sm">
        {step.description}
      </p>
    </div>
  );
}

function ConnectorColumn({ iconKey }: { iconKey: string }) {
  return (
    <div className="hidden flex-col items-center justify-between md:flex md:min-h-[420px]">
      {/* Top node */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[rgba(58,96,184,0.25)] bg-[rgba(255,255,255,0.55)]"
        style={{
          boxShadow: '0 0 16px rgba(43, 126, 255, 0.15)',
        }}
      >
        <div className="h-3 w-3 rounded-full bg-[#1d4fd0]" />
      </div>

      {/* Center icon */}
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-[rgba(58,96,184,0.2)] text-[#1d4fd0]"
        style={{
          background: 'rgba(245, 236, 215, 0.5)',
        }}
      >
        <ProcessIcon iconKey={iconKey as any} />
      </div>

      {/* Bottom node */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[rgba(58,96,184,0.25)] bg-[rgba(255,255,255,0.55)]"
        style={{
          boxShadow: '0 0 16px rgba(43, 126, 255, 0.15)',
        }}
      >
        <div className="h-3 w-3 rounded-full bg-[#1d4fd0]" />
      </div>
    </div>
  );
}

function ProcessStepPair({
  left,
  right,
  connectorIcon,
  rowIndex,
}: {
  left: ProcessStep;
  right: ProcessStep;
  connectorIcon: string;
  rowIndex: number;
}) {
  return (
    <Reveal
      as="div"
      className="grid gap-8 md:grid-cols-[1fr_120px_1fr] md:items-start lg:gap-12 xl:gap-16"
      delay={rowIndex * 120}
    >
      {/* Left step - image and panel */}
      <div className="flex flex-col gap-6">
        <ProcessStepImage image={left.image} alt={left.imageAlt} />
        <ProcessStepPanel step={left} />
      </div>

      {/* Center connector - hidden on mobile */}
      <div className="hidden md:flex">
        <ConnectorColumn iconKey={connectorIcon} />
      </div>

      {/* Right step - panel and image, stacked on mobile */}
      <div className="flex flex-col gap-6">
        <ProcessStepImage image={right.image} alt={right.imageAlt} />
        <ProcessStepPanel step={right} />
      </div>
    </Reveal>
  );
}

function ProcessFooterPill() {
  return (
    <Reveal className="mx-auto mt-20 flex max-w-[620px] items-center justify-center rounded-full bg-[rgba(29,79,208,0.08)] px-8 py-4 text-center">
      <p className="text-base font-semibold text-[#1d4fd0]">
        Un accompagnement humain, du premier clic jusqu&apos;à ton intégration.
      </p>
    </Reveal>
  );
}

export function ProcessusSection() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#F5ECD7] px-5 py-24 sm:px-8 md:py-28 lg:px-10 lg:py-[110px]"
      id="processus"
      aria-labelledby="processus-title"
    >
      {/* Subtle decorative background elements */}
      <div
        className="pointer-events-none absolute left-[5%] top-[8%] -z-10 h-64 w-64 rounded-full opacity-[0.15]"
        style={{
          background: 'radial-gradient(circle, rgba(29,79,208,0.4), transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-[8%] bottom-[12%] -z-10 h-80 w-80 rounded-full opacity-[0.1]"
        style={{
          background: 'radial-gradient(circle, rgba(43,126,255,0.3), transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <Reveal className="mb-6 text-center">
          <span className="inline-flex text-sm font-extrabold uppercase tracking-[0.18em] text-[#1d4fd0]">
            Processus
          </span>
        </Reveal>

        <Reveal className="mx-auto max-w-[900px] text-center" delay={80}>
          <h2
            id="processus-title"
            className="font-display text-[clamp(40px,5vw,72px)] font-bold leading-[1.05] text-[#081f3d]"
          >
            De ton profil à ton intégration sur place
          </h2>
        </Reveal>

        <Reveal className="mx-auto mt-6 max-w-[720px] text-center" delay={160}>
          <p className="text-lg leading-[1.75] text-[#63728a] md:text-base">
            Un parcours clair, humain et structuré pour t'aider à trouver ton stage à l'étranger, avec un accompagnement concret à chaque étape.
          </p>
        </Reveal>

        {/* Process rows */}
        <div className="mt-20 flex flex-col gap-20 md:gap-24 lg:gap-32">
          {processRows.map((row, rowIndex) => (
            <ProcessStepPair
              key={`row-${rowIndex}`}
              left={row.left}
              right={row.right}
              connectorIcon={row.connectorIcon}
              rowIndex={rowIndex}
            />
          ))}
        </div>

        {/* Footer pill */}
        <ProcessFooterPill />
      </div>
    </section>
  );
}
