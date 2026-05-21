import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarCheck, CreditCard, Mail, MoreVertical, RefreshCw, Trash2, UserRound, Users } from 'lucide-react';
import toast from 'react-hot-toast';

import { adminApi } from '@/api/modules/admin.api';
import {
  accountBadgeClass,
  adminBadgeClass,
  adminTheme,
  formatDateTimeLabel,
  formatStatusLabel,
  paymentBadgeClass,
} from '@/app/layouts/admin-theme';
import { AdminPageHeader } from '@/app/layouts/AdminPageHeader';
import { useAdminSearch } from '@/app/layouts/admin-search-context';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { AdminTable } from '@/components/admin/admin-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { AdminStudentProfile } from '@/types/api';

export function AdminBackofficePage() {
  const { debouncedSearch } = useAdminSearch();
  const [students, setStudents] = useState<AdminStudentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentToDelete, setStudentToDelete] = useState<AdminStudentProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadStudents = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await adminApi.listStudents({ search: debouncedSearch });
      setStudents(result);
    } catch {
      toast.error('Impossible de charger les profils étudiants.');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  const stats = useMemo(
    () => [
      {
        label: 'Étudiants',
        value: students.length,
        icon: Users,
        helper: 'Profils suivis',
      },
      {
        label: 'Comptes actifs',
        value: students.filter((student) => normalizeStatus(student.accountStatus) === 'active' || normalizeStatus(student.accountStatus) === 'actif').length,
        icon: UserRound,
        helper: 'Accès opérationnels',
      },
      {
        label: 'Paiements validés',
        value: students.filter((student) => ['paid', 'validated', 'valide', 'validé'].includes(normalizeStatus(student.latestPayment?.status))).length,
        icon: CreditCard,
        helper: 'Statuts confirmés',
      },
      {
        label: 'Rendez-vous à venir',
        value: students.filter((student) => Boolean(student.nextRelevantAppointment?.date)).length,
        icon: CalendarCheck,
        helper: 'Prochaines actions',
      },
    ],
    [students]
  );

  async function confirmDelete() {
    if (!studentToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await adminApi.deleteStudentProfile(studentToDelete.id);
      toast.success('Profil étudiant supprimé.');
      setStudentToDelete(null);
      await loadStudents();
    } catch {
      toast.error('Impossible de supprimer ce profil.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className={adminTheme.page}>
      <div className={adminTheme.pageInner}>
        <AdminPageHeader
          title="Profils étudiants"
          subtitle="Suivez les dossiers étudiants, les paiements et les prochains rendez-vous."
          actions={
            <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => void loadStudents()}>
              <RefreshCw className="size-4" />
              Rafraîchir
            </Button>
          }
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <article key={item.label} className={cn(adminTheme.card, 'p-5')}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.helper}</p>
                </div>
                <span className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <item.icon className="size-5" />
                </span>
              </div>
            </article>
          ))}
        </section>

        <AdminTable
          rows={students}
          isLoading={isLoading}
          getRowKey={(student) => student.id}
          emptyState={<AdminEmptyState title="Aucun résultat" description="Aucun profil étudiant ne correspond à votre recherche." />}
          columns={[
            {
              key: 'profile',
              label: 'Profil',
              render: (student) => <AvatarCell student={student} />,
            },
            {
              key: 'email',
              label: 'E-mail',
              render: (student) => (
                <span className="inline-flex max-w-[220px] items-center gap-2 truncate text-slate-600">
                  <Mail className="size-4 text-slate-400" />
                  <span className="truncate">{student.email ?? '—'}</span>
                </span>
              ),
            },
            {
              key: 'account',
              label: 'Compte',
              render: (student) => <span className={accountBadgeClass(student.accountStatus)}>{formatStatusLabel(student.accountStatus, 'Non renseigné')}</span>,
            },
            {
              key: 'payment',
              label: 'Paiement',
              render: (student) => (
                <span className={paymentBadgeClass(student.latestPayment?.status)}>
                  {formatStatusLabel(student.latestPayment?.status, 'Aucun paiement')}
                </span>
              ),
            },
            {
              key: 'contact',
              label: 'Contact',
              render: (student) => <span className={adminBadgeClass('slate')}>{formatStatusLabel(student.contactStatus, 'Non renseigné')}</span>,
            },
            {
              key: 'questionnaire',
              label: 'Questionnaire',
              render: (student) => <span className={adminBadgeClass('blue')}>{formatStatusLabel(student.questionnaireStatus, 'Non renseigné')}</span>,
            },
            {
              key: 'nextAppointment',
              label: 'Prochain RDV',
              className: 'min-w-44',
              render: (student) => (
                <div className="space-y-1">
                  <p className="font-medium text-slate-800">{formatDateTimeLabel(student.nextRelevantAppointment?.date)}</p>
                  <p className="text-xs text-slate-500">{student.nextRelevantAppointment?.title ?? 'Aucun rendez-vous'}</p>
                </div>
              ),
            },
            {
              key: 'actions',
              label: 'Actions',
              className: 'text-right',
              headerClassName: 'text-right',
              render: (student) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Actions pour ${profileSummary(student)}`}>
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem>Voir</DropdownMenuItem>
                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => setStudentToDelete(student)}>
                      <Trash2 className="size-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            },
          ]}
        />

        <AdminConfirmDialog
          open={Boolean(studentToDelete)}
          title="Supprimer ce profil étudiant ?"
          description="Cette action supprimera le profil sélectionné. La confirmation évite les erreurs de manipulation."
          isLoading={isDeleting}
          onOpenChange={(open) => {
            if (!open) {
              setStudentToDelete(null);
            }
          }}
          onConfirm={() => void confirmDelete()}
        />
      </div>
    </main>
  );
}

function AvatarCell({ student }: { student: AdminStudentProfile }) {
  return (
    <div className="flex min-w-56 items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {initials(student)}
      </span>
      <div>
        <p className="font-semibold text-slate-950">{profileSummary(student)}</p>
        <p className="text-xs text-slate-500">ID {student.id}</p>
      </div>
    </div>
  );
}

function AdminEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Users className="size-5" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function profileSummary(student: AdminStudentProfile) {
  const explicitName = student.fullName?.trim();

  if (explicitName) {
    return explicitName;
  }

  const name = [student.firstName, student.lastName].filter(Boolean).join(' ').trim();
  return name || student.email || 'Profil étudiant';
}

function initials(student: AdminStudentProfile) {
  return profileSummary(student)
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join('');
}

function normalizeStatus(status?: string | null) {
  return status?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() ?? '';
}
