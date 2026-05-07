import {
  BriefcaseBusiness,
  Check,
  Plane,
  Sparkles,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

const BOOKING_HREF = 'mailto:lagenceboarding@gmail.com?subject=RDV%20gratuit%20d%27information%20Boarding';

const includedBaseFeatures = [
  'Stage garanti',
  'Appel avant départ',
  'Guide de destination',
  'Assistance 7j/7',
  'Accès à la communauté',
  'Test de personnalité',
  '100% personnalisable',
] as const;

const serviceFeatures = [
  'Logement garanti',
  'Administratif',
  'Échange monnaie',
  'Transfert aller/retour',
  'Carte promotionnelle',
  '2 cours de langue',
  "Aide pour l'entretien",
  'Guide tour',
  'Welcome pack',
] as const;

const plans = [
  {
    name: 'ECONOMY CLASS',
    price: '€499',
    subtitle: "ÉCONOMIQUE ET INDISPENSABLE - L'essentiel pour ton départ en stage.",
    tone: 'economy',
    recommended: false,
    included: includedBaseFeatures,
    excluded: serviceFeatures,
  },
  {
    name: 'FIRST CLASS',
    price: '€999',
    subtitle: "LE PACK PREMIUM & SÉRÉNITÉ MAXIMALE - L'accompagnement complet pour un départ sans souci.",
    tone: 'business',
    recommended: true,
    included: [...includedBaseFeatures, ...serviceFeatures],
    excluded: [],
  },
  {
    name: 'BUSINESS CLASS',
    price: '€699',
    subtitle: "LE PACK AVANTAGES & ACCOMPAGNEMENT - L'équilibre parfait entre service et prix.",
    tone: 'first',
    recommended: false,
    included: [
      ...includedBaseFeatures,
      'Logement garanti',
      'Administratif',
      'Échange monnaie',
      'Transfert aller/retour',
      'Carte promotionnelle',
    ],
    excluded: ['2 cours de langue', "Aide pour l'entretien", 'Guide tour', 'Welcome pack'],
  },
] as const;

type Plan = (typeof plans)[number];

function BackgroundWatermarks() {
  return (
    <>
      <svg
        className="pointer-events-none absolute right-[-4rem] top-6 h-72 w-72 text-boarding-navy opacity-[0.05]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path d="M100 12 119 74 181 55 136 100 181 145 119 126 100 188 81 126 19 145 64 100 19 55 81 74 100 12Z" stroke="currentColor" strokeWidth="5" />
        <path d="M100 45 113 87 155 100 113 113 100 155 87 113 45 100 87 87 100 45Z" stroke="currentColor" strokeWidth="4" />
        <path d="M100 12v176M12 100h176M36 36l128 128M164 36 36 164" stroke="currentColor" strokeWidth="2" />
      </svg>
      <Sparkles className="pointer-events-none absolute left-[7%] top-28 h-12 w-12 text-boarding-sunset opacity-[0.16]" aria-hidden="true" />
      <Sparkles className="pointer-events-none absolute bottom-[18%] right-[11%] h-10 w-10 text-boarding-blue opacity-[0.12]" aria-hidden="true" />
      <Plane className="pointer-events-none absolute bottom-[31%] left-[3%] h-16 w-16 -rotate-12 text-boarding-navy opacity-[0.045]" aria-hidden="true" />
    </>
  );
}

function CardWatermarks({ dark = false }: { dark?: boolean }) {
  const colorClass = dark ? 'text-white' : 'text-[#1A1F5C]';

  return (
    <>
      <Plane className={cn('pointer-events-none absolute left-5 top-5 h-20 w-20 -rotate-12 opacity-[0.055]', colorClass)} aria-hidden="true" />
      <BriefcaseBusiness className={cn('pointer-events-none absolute bottom-5 right-5 h-24 w-24 rotate-6 opacity-[0.06]', colorClass)} aria-hidden="true" />
    </>
  );
}

function FeatureRow({ label, included, tone }: { label: string; included: boolean; tone: Plan['tone'] }) {
  const isDark = tone === 'economy';
  const checkClass = tone === 'business' ? 'text-[#FF6B35]' : isDark ? 'text-emerald-300' : 'text-emerald-600';
  const xClass = isDark ? 'text-white/35' : 'text-slate-400';

  return (
    <li className={cn('flex items-start gap-3 text-sm font-normal leading-6', included ? (isDark ? 'text-white' : 'text-[#1A1F5C]') : isDark ? 'text-white/42' : 'text-[#1A1F5C]/45')}>
      <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center">
        {included ? <Check className={cn('h-4 w-4 stroke-[2.8]', checkClass)} aria-hidden="true" /> : <X className={cn('h-4 w-4 stroke-[2.5]', xClass)} aria-hidden="true" />}
      </span>
      <span>{label}</span>
    </li>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  const isEconomy = plan.tone === 'economy';
  const isBusiness = plan.tone === 'business';
  const isFirst = plan.tone === 'first';

  return (
    <article
      className={cn(
        'relative flex min-h-full flex-col overflow-hidden rounded-[1.65rem] border p-6 shadow-[0_22px_58px_-34px_rgba(26,31,92,0.55)] transition duration-300 hover:shadow-[0_30px_70px_-34px_rgba(26,31,92,0.65)] sm:p-7',
        isBusiness ? 'hover:lg:-translate-y-4' : 'hover:-translate-y-1',
        isEconomy && 'border-[#1A1F5C] bg-[#1A1F5C] text-white',
        isBusiness && 'border-[#F5ECD7] bg-white text-[#1A1F5C] ring-2 ring-[#FF6B35]/70 lg:-translate-y-3',
        isFirst && 'border-[#D8E0EC] bg-[#E8EDF5] text-[#1A1F5C]'
      )}
    >
      <CardWatermarks dark={isEconomy} />

      {plan.recommended ? (
        <div className="relative z-10 mb-5 flex justify-end">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B35] px-3 py-1 font-mono text-[0.68rem] font-normal uppercase tracking-[0.12em] text-white shadow-[0_12px_26px_-16px_rgba(255,107,53,0.95)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Recommandé
          </span>
        </div>
      ) : null}

      <div className={cn('relative z-10', !plan.recommended && 'pt-8')}>
        <p className={cn('font-mono text-[0.68rem] font-normal uppercase tracking-[0.16em]', isEconomy ? 'text-white/72' : 'text-[#2B35AF]')}>{plan.name}</p>
        <h3 className="mt-3 text-lg font-extrabold leading-tight">{plan.price}</h3>
        <p className={cn('mt-5 min-h-[4.25rem] text-sm font-light uppercase leading-6 tracking-normal', isEconomy ? 'text-white/74' : 'text-[#526988]')}>{plan.subtitle}</p>
      </div>

      <div className={cn('relative z-10 my-7 h-px shrink-0', isEconomy ? 'bg-white/14' : 'bg-[#1A1F5C]/10')} aria-hidden="true" />

      <ul className="relative z-10 grid gap-3">
        {plan.included.map((feature) => (
          <FeatureRow key={`${plan.name}-${feature}`} label={feature} included tone={plan.tone} />
        ))}
        {plan.excluded.map((feature) => (
          <FeatureRow key={`${plan.name}-${feature}`} label={feature} included={false} tone={plan.tone} />
        ))}
      </ul>

      <Button
        asChild
        className={cn(
          'relative z-10 mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl border px-5 text-center text-sm font-bold leading-5 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          isEconomy &&
            'border-white/20 bg-white text-[#1A1F5C] shadow-[0_16px_30px_-20px_rgba(255,255,255,0.45)] hover:bg-[#F8FAFF] focus-visible:ring-white/70 focus-visible:ring-offset-[#1A1F5C]',
          isBusiness &&
            'border-[#FF6B35] bg-[#FF6B35] text-white shadow-[0_20px_36px_-22px_rgba(255,107,53,0.95)] hover:bg-[#ea5f2f] hover:shadow-[0_24px_40px_-20px_rgba(255,107,53,0.9)] focus-visible:ring-[#FF6B35]/70 focus-visible:ring-offset-white',
          isFirst &&
            'border-[#1A1F5C]/10 bg-[#1A1F5C] text-white shadow-[0_20px_36px_-22px_rgba(26,31,92,0.65)] hover:bg-[#242a77] focus-visible:ring-[#1A1F5C]/60 focus-visible:ring-offset-[#E8EDF5]'
        )}
      >
        <a href={BOOKING_HREF}>
          Embarquer maintenant
        </a>
      </Button>
    </article>
  );
}

export function PricingSection() {
  return (
    <section id="offres" aria-labelledby="pricing-title" className="relative overflow-hidden bg-[#F5ECD7] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <BackgroundWatermarks />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="text-center">
          <h2 id="pricing-title" className="mt-2 text-lg font-extrabold leading-tight text-[#1A1F5C]">
            PRICING
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
