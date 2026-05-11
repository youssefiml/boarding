import { Link } from 'react-router-dom';

import boardingLogo from '@/assets/boarding-logo.webp';
import { ROUTES } from '@/app/routes';
import { assetUrl } from '@/lib/asset-url';

interface FooterLink {
  label: string;
  href?: string;
  to?: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const APPOINTMENT_HREF = 'mailto:lagenceboarding@gmail.com?subject=Rendez-vous%20gratuit%20Boarding';
const EMAIL_HREF = 'mailto:lagenceboarding@gmail.com';
const INSTAGRAM_HREF = '#';

const footerColumns: FooterColumn[] = [
  {
    title: 'Concept',
    links: [
      { label: 'Qui sommes-nous ?', href: '#qui-sommes-nous' },
      { label: 'Processus', href: '#processus' },
      { label: 'Destinations', href: '#destinations' },
      { label: 'Offres', href: '#offres' },
    ],
  },
  {
    title: 'Découvrir',
    links: [
      { label: 'Le Maroc', href: '#destinations' },
      { label: 'Témoignages', href: '#temoignages' },
      { label: 'Prendre rendez-vous', href: APPOINTMENT_HREF },
      { label: 'Créer mon profil', to: ROUTES.register },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Email', href: EMAIL_HREF },
      { label: 'Instagram', href: INSTAGRAM_HREF },
      { label: 'Site web', to: ROUTES.root },
      { label: 'Contact', href: '#contact' },
    ],
  },
];

const legalLinks: FooterLink[] = [
  { label: 'Mentions légales', href: '#' },
  { label: 'Politique de confidentialité', href: '#' },
  { label: 'Conditions d’utilisation', href: '#' },
];

const linkClassName =
  'text-sm font-semibold text-[#4c5d76] transition-colors hover:text-[#2557D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5ECD7]';

function FooterItemLink({ link }: { link: FooterLink }) {
  if (link.to) {
    return (
      <Link className={linkClassName} to={link.to}>
        {link.label}
      </Link>
    );
  }

  return (
    <a
      className={linkClassName}
      href={link.href ?? '#'}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noreferrer' : undefined}
    >
      {link.label}
    </a>
  );
}

export function LandingFooter() {
  return (
    <footer id="contact" className="border-t border-[#07182f]/10 bg-[#F5ECD7] py-12 sm:py-14">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,1.82fr)] lg:gap-12">
          <div className="max-w-xl">
            <Link
              to={ROUTES.root}
              className="inline-flex min-w-0 items-center gap-3 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6]/45 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F5ECD7]"
              aria-label="Accueil Boarding"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#d8eaf7]"
                aria-hidden="true"
                style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f4faff 100%)' }}
              >
                <img src={assetUrl(boardingLogo)} alt="" className="h-full w-full object-cover" style={{ objectPosition: '50% 50%', transform: 'scale(1.9)' }} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-base font-extrabold text-[#07182f]">Boarding</span>
                <span className="text-xs font-semibold text-[#5d6f88]">Stage à l’étranger</span>
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#5d6f88]">
              Boarding accompagne les étudiants dans leur recherche de stage à l’étranger avec un parcours clair, humain et guidé.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {footerColumns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[#07182f]">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <FooterItemLink link={link} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#07182f]/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-[#5d6f88]">© 2026 Boarding. Tous droits réservés.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <FooterItemLink link={link} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
