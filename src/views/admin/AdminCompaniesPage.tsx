import { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, MapPin, MoreVertical, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { adminApi } from '@/api/modules/admin.api';
import { ROUTES } from '@/app/routes';
import { adminBadgeClass, adminTheme, formatDateLabel } from '@/app/layouts/admin-theme';
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
import type { AdminCompany } from '@/types/api';

export function AdminCompaniesPage() {
  const navigate = useNavigate();
  const { debouncedSearch } = useAdminSearch();
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyToDelete, setCompanyToDelete] = useState<AdminCompany | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCompanies = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await adminApi.listCompanies({ search: debouncedSearch });
      setCompanies(result);
    } catch {
      toast.error('Impossible de charger les entreprises partenaires.');
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    void loadCompanies();
  }, [loadCompanies]);

  const stats = useMemo(
    () => ({
      totalCapacity: companies.reduce((sum, company) => sum + (company.studentCapacity ?? 0), 0),
      totalInternships: companies.reduce((sum, company) => sum + (company.internshipCount ?? 0), 0),
    }),
    [companies]
  );

  async function confirmDelete() {
    if (!companyToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await adminApi.deleteCompany(companyToDelete.id);
      toast.success('Entreprise supprimée.');
      setCompanyToDelete(null);
      await loadCompanies();
    } catch {
      toast.error('Impossible de supprimer cette entreprise.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className={adminTheme.page}>
      <div className={adminTheme.pageInner}>
        <AdminPageHeader title="Entreprises partenaires" subtitle="Gérez les entreprises marocaines utilisées pour le matching étudiant." />

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['Entreprises', companies.length, 'Partenaires enregistrés'],
            ['Capacité', stats.totalCapacity, 'Places potentielles'],
            ['Stages', stats.totalInternships, 'Offres rattachées'],
          ].map(([label, value, helper]) => (
            <article key={label} className={cn(adminTheme.card, 'p-5')}>
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{helper}</p>
            </article>
          ))}
        </section>

        <div className={adminTheme.toolbar}>
          <p className="text-sm text-slate-600">Casablanca et Marrakech uniquement pour le MVP.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => void loadCompanies()}>
              <RefreshCw className="size-4" />
              Rafraîchir
            </Button>
            <Button type="button" className="h-10 rounded-xl bg-slate-950 text-white hover:bg-slate-800" onClick={() => navigate(ROUTES.adminCompanyCreate)}>
              <Plus className="size-4" />
              Nouvelle entreprise
            </Button>
          </div>
        </div>

        <AdminTable
          rows={companies}
          isLoading={isLoading}
          getRowKey={(company) => company.id}
          emptyState={
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Building2 className="size-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">Aucune entreprise partenaire</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Ajoutez une première entreprise pour commencer à alimenter le matching.</p>
              <Button type="button" className="mt-5 h-10 rounded-xl bg-slate-950 text-white hover:bg-slate-800" onClick={() => navigate(ROUTES.adminCompanyCreate)}>
                <Plus className="size-4" />
                Nouvelle entreprise
              </Button>
            </div>
          }
          columns={[
            {
              key: 'company',
              label: 'Entreprise',
              render: (company) => (
                <div className="min-w-56">
                  <p className="font-semibold text-slate-950">{company.name}</p>
                  {company.description ? <p className="mt-1 line-clamp-1 text-xs text-slate-500">{company.description}</p> : null}
                </div>
              ),
            },
            {
              key: 'sector',
              label: 'Secteur',
              render: (company) => <span className={adminBadgeClass('blue')}>{company.sector ?? 'Non renseigné'}</span>,
            },
            {
              key: 'location',
              label: 'Lieu de stage',
              render: (company) => (
                <span className="inline-flex min-w-40 items-center gap-2 text-slate-700">
                  <MapPin className="size-4 text-slate-400" />
                  {company.location ?? company.city ?? '—'}
                </span>
              ),
            },
            {
              key: 'capacity',
              label: 'Capacité',
              render: (company) => <Metric value={company.studentCapacity ?? 0} label="étudiants" />,
            },
            {
              key: 'internships',
              label: 'Stages',
              render: (company) => <Metric value={company.internshipCount ?? 0} label="offres" />,
            },
            {
              key: 'duration',
              label: 'Durée',
              render: (company) => <span className="text-slate-700">{company.idealDuration ?? '—'}</span>,
            },
            {
              key: 'periods',
              label: 'Périodes',
              render: (company) => (
                <div className="flex min-w-44 flex-wrap gap-1.5">
                  {(company.periods?.length ? company.periods : ['Non renseigné']).slice(0, 3).map((period) => (
                    <span key={period} className={adminBadgeClass('slate')}>
                      {period}
                    </span>
                  ))}
                </div>
              ),
            },
            {
              key: 'createdAt',
              label: 'Création',
              render: (company) => formatDateLabel(company.createdAt),
            },
            {
              key: 'actions',
              label: 'Actions',
              className: 'text-right',
              headerClassName: 'text-right',
              render: (company) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Actions pour ${company.name}`}>
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onSelect={() => navigate(ROUTES.adminCompanyEdit(company.id))}>
                      <Pencil className="size-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => setCompanyToDelete(company)}>
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
          open={Boolean(companyToDelete)}
          title="Supprimer cette entreprise ?"
          description="Les informations de cette entreprise partenaire ne seront plus disponibles dans le backoffice."
          isLoading={isDeleting}
          onOpenChange={(open) => {
            if (!open) {
              setCompanyToDelete(null);
            }
          }}
          onConfirm={() => void confirmDelete()}
        />
      </div>
    </main>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-semibold text-slate-950">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
