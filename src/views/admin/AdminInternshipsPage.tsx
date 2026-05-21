import { useCallback, useEffect, useState } from 'react';
import { BriefcaseBusiness, Eye, MapPin, MoreVertical, RefreshCw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { adminApi } from '@/api/modules/admin.api';
import { adminBadgeClass, adminTheme, formatDateLabel } from '@/app/layouts/admin-theme';
import { AdminPageHeader } from '@/app/layouts/AdminPageHeader';
import { useAdminSearch } from '@/app/layouts/admin-search-context';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { AdminDialog } from '@/components/admin/AdminDialog';
import { AdminTable } from '@/components/admin/admin-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AdminInternshipOffer } from '@/types/api';

export function AdminInternshipsPage() {
  const { debouncedSearch } = useAdminSearch();
  const [internships, setInternships] = useState<AdminInternshipOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<AdminInternshipOffer | null>(null);
  const [offerToDelete, setOfferToDelete] = useState<AdminInternshipOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadInternships = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await adminApi.listInternships({ search: debouncedSearch });
      setInternships(result);
    } catch {
      toast.error('Impossible de charger les offres de stage.');
      setInternships([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    void loadInternships();
  }, [loadInternships]);

  async function confirmDelete() {
    if (!offerToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await adminApi.deleteInternship(offerToDelete.id);
      toast.success('Offre de stage supprimée.');
      setOfferToDelete(null);
      await loadInternships();
    } catch {
      toast.error('Impossible de supprimer cette offre.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className={adminTheme.page}>
      <div className={adminTheme.pageInner}>
        <AdminPageHeader
          title="Offres de stage"
          subtitle="Consultez les stages rattachés aux entreprises partenaires."
          actions={
            <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => void loadInternships()}>
              <RefreshCw className="size-4" />
              Rafraîchir
            </Button>
          }
        />

        <AdminTable
          rows={internships}
          isLoading={isLoading}
          getRowKey={(offer) => offer.id}
          emptyState={
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <BriefcaseBusiness className="size-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">Aucune offre de stage</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Les offres créées depuis les entreprises partenaires apparaîtront ici.</p>
            </div>
          }
          columns={[
            {
              key: 'title',
              label: 'Stage',
              render: (offer) => (
                <div className="min-w-64">
                  <p className="font-semibold text-slate-950">{offer.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{companyName(offer)}</p>
                </div>
              ),
            },
            {
              key: 'company',
              label: 'Entreprise',
              render: (offer) => <span className="font-medium text-slate-800">{companyName(offer)}</span>,
            },
            {
              key: 'sector',
              label: 'Secteur',
              render: (offer) => <span className={adminBadgeClass('blue')}>{offer.sector ?? offer.company?.sector ?? 'Non renseigné'}</span>,
            },
            {
              key: 'domain',
              label: 'Domaine',
              render: (offer) => <span className={adminBadgeClass('slate')}>{offer.domain ?? 'Non renseigné'}</span>,
            },
            {
              key: 'location',
              label: 'Lieu',
              render: (offer) => (
                <span className="inline-flex min-w-36 items-center gap-2 text-slate-700">
                  <MapPin className="size-4 text-slate-400" />
                  {offer.location ?? offer.company?.location ?? offer.company?.city ?? '—'}
                </span>
              ),
            },
            {
              key: 'missions',
              label: 'Missions',
              render: (offer) => <p className="line-clamp-2 min-w-72 leading-6 text-slate-600">{offer.missions ?? '—'}</p>,
            },
            {
              key: 'createdAt',
              label: 'Création',
              render: (offer) => formatDateLabel(offer.createdAt),
            },
            {
              key: 'actions',
              label: 'Actions',
              className: 'text-right',
              headerClassName: 'text-right',
              render: (offer) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Actions pour ${offer.title}`}>
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onSelect={() => setSelectedOffer(offer)}>
                      <Eye className="size-4" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onSelect={() => setOfferToDelete(offer)}>
                      <Trash2 className="size-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ),
            },
          ]}
        />

        <InternshipDetailsDialog offer={selectedOffer} onOpenChange={(open) => !open && setSelectedOffer(null)} />
        <AdminConfirmDialog
          open={Boolean(offerToDelete)}
          title="Supprimer cette offre de stage ?"
          description="Cette offre ne sera plus visible dans le backoffice."
          isLoading={isDeleting}
          onOpenChange={(open) => {
            if (!open) {
              setOfferToDelete(null);
            }
          }}
          onConfirm={() => void confirmDelete()}
        />
      </div>
    </main>
  );
}

function InternshipDetailsDialog({ offer, onOpenChange }: { offer: AdminInternshipOffer | null; onOpenChange: (open: boolean) => void }) {
  return (
    <AdminDialog
      open={Boolean(offer)}
      title={offer?.title ?? 'Offre de stage'}
      description="Vue détaillée de l'opportunité."
      onOpenChange={onOpenChange}
    >
      {offer ? (
        <div className="space-y-4">
          <DetailSection title="Informations du stage">
            <DetailItem label="Domaine" value={offer.domain} />
            <DetailItem label="Lieu" value={offer.location ?? offer.company?.location ?? offer.company?.city} />
            <DetailItem label="Création" value={formatDateLabel(offer.createdAt)} />
          </DetailSection>
          <DetailSection title="Entreprise">
            <DetailItem label="Nom" value={companyName(offer)} />
            <DetailItem label="Secteur" value={offer.sector ?? offer.company?.sector} />
          </DetailSection>
          <DetailSection title="Missions">
            <p className="text-sm leading-7 text-slate-700">{offer.missions ?? 'Non renseigné'}</p>
          </DetailSection>
          <DetailSection title="Critères">
            <p className="text-sm leading-7 text-slate-700">{offer.criteria ?? 'Non renseigné'}</p>
          </DetailSection>
        </div>
      ) : null}
    </AdminDialog>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value ?? 'Non renseigné'}</p>
    </div>
  );
}

function companyName(offer: AdminInternshipOffer) {
  return offer.companyName ?? offer.company?.name ?? 'Entreprise non renseignée';
}
