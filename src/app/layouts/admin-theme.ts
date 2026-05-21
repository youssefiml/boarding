import { cn } from '@/lib/utils';

type AdminStatusTone = 'emerald' | 'amber' | 'red' | 'slate' | 'blue';

const statusToneClass: Record<AdminStatusTone, string> = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  red: 'border-red-200 bg-red-50 text-red-700',
  slate: 'border-slate-200 bg-slate-100 text-slate-600',
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
};

export const adminTheme = {
  page: 'min-h-full bg-slate-50/80 px-4 py-5 text-slate-950 sm:px-6 lg:px-8',
  pageInner: 'mx-auto w-full max-w-7xl space-y-6',
  card: 'rounded-2xl border border-slate-200 bg-white shadow-sm',
  mutedCard: 'rounded-2xl border border-slate-200 bg-slate-50/80',
  toolbar: 'flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between',
  tableCard: 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
  table: 'min-w-full divide-y divide-slate-200 text-sm',
  tableHead: 'bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-500',
  tableHeaderCell: 'px-4 py-3',
  tableRow: 'transition-colors hover:bg-slate-50/80',
  tableCell: 'px-4 py-4 align-middle text-slate-700',
};

export function adminBadgeClass(tone: AdminStatusTone) {
  return cn(
    'inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
    statusToneClass[tone]
  );
}

export function accountBadgeClass(status?: string | null) {
  const normalized = normalizeStatus(status);

  if (['active', 'actif', 'verified', 'enabled'].includes(normalized)) {
    return adminBadgeClass('emerald');
  }

  if (['pending', 'waiting', 'en_attente', 'incomplete'].includes(normalized)) {
    return adminBadgeClass('amber');
  }

  if (['blocked', 'suspended', 'bloque', 'bloqué', 'disabled'].includes(normalized)) {
    return adminBadgeClass('red');
  }

  return adminBadgeClass('slate');
}

export function paymentBadgeClass(status?: string | null) {
  const normalized = normalizeStatus(status);

  if (['paid', 'validated', 'validé', 'valide', 'success', 'succeeded'].includes(normalized)) {
    return adminBadgeClass('emerald');
  }

  if (['pending', 'waiting', 'processing', 'en_attente'].includes(normalized)) {
    return adminBadgeClass('amber');
  }

  if (['failed', 'rejected', 'refused', 'refusé', 'echec', 'échec'].includes(normalized)) {
    return adminBadgeClass('red');
  }

  return adminBadgeClass('slate');
}

export function appointmentBadgeClass(status?: string | null) {
  const normalized = normalizeStatus(status);

  if (['confirmed', 'confirmé', 'confirme', 'scheduled'].includes(normalized)) {
    return adminBadgeClass('emerald');
  }

  if (['pending', 'waiting', 'en_attente'].includes(normalized)) {
    return adminBadgeClass('amber');
  }

  if (['cancelled', 'canceled', 'annulé', 'annule'].includes(normalized)) {
    return adminBadgeClass('red');
  }

  return adminBadgeClass('slate');
}

export function formatStatusLabel(status?: string | null, fallback = 'Non renseigné') {
  if (!status) {
    return fallback;
  }

  return status
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function formatDateLabel(value?: string | null) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTimeLabel(value?: string | null) {
  if (!value) {
    return 'Aucun';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function normalizeStatus(status?: string | null) {
  return status?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() ?? '';
}
