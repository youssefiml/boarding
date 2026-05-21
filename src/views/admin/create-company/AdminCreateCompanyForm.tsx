import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { adminApi } from '@/api/modules/admin.api';
import { adminTheme } from '@/app/layouts/admin-theme';
import { AdminPageHeader } from '@/app/layouts/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { BoardingInput, BoardingSection, BoardingTextarea } from '@/components/forms/boarding-form-ui';
import type { AdminCompany, AdminCompanyPayload } from '@/types/api';

type CompanyFormMode = 'create' | 'edit';

interface AdminCreateCompanyFormProps {
  mode: CompanyFormMode;
  companyId?: string;
}

interface CompanyFormState {
  name: string;
  sector: string;
  city: string;
  location: string;
  description: string;
  studentCapacity: string;
  idealDuration: string;
  periods: string;
  skills: string;
  requirements: string;
  cultureTags: string;
  internshipNeeds: string;
}

const cityOptions = ['Casablanca', 'Marrakech'] as const;

const emptyState: CompanyFormState = {
  name: '',
  sector: '',
  city: 'Casablanca',
  location: '',
  description: '',
  studentCapacity: '',
  idealDuration: '',
  periods: '',
  skills: '',
  requirements: '',
  cultureTags: '',
  internshipNeeds: '',
};

export function AdminCreateCompanyForm({ mode, companyId }: AdminCreateCompanyFormProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<CompanyFormState>(emptyState);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = mode === 'edit';

  const loadCompany = useCallback(async () => {
    if (!isEdit || !companyId) {
      return;
    }

    setIsLoading(true);

    try {
      const company = await adminApi.getCompany(companyId);
      setForm(companyToForm(company));
    } catch {
      toast.error("Impossible de charger l'entreprise.");
    } finally {
      setIsLoading(false);
    }
  }, [companyId, isEdit]);

  useEffect(() => {
    void loadCompany();
  }, [loadCompany]);

  const header = useMemo(
    () => ({
      title: isEdit ? "Modifier l'entreprise" : 'Nouvelle entreprise',
      subtitle: 'Renseignez les informations utilisées par le moteur de matching.',
    }),
    [isEdit]
  );

  function updateField(field: keyof CompanyFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = formToPayload(form);

      if (isEdit && companyId) {
        await adminApi.updateCompany(companyId, payload);
        toast.success('Entreprise mise à jour.');
      } else {
        await adminApi.createCompany(payload);
        toast.success('Entreprise créée.');
      }

      navigate(-1);
    } catch {
      toast.error("Impossible d'enregistrer l'entreprise.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={adminTheme.page}>
      <div className={adminTheme.pageInner}>
        <AdminPageHeader
          title={header.title}
          subtitle={header.subtitle}
          actions={
            <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => navigate(-1)}>
              <ArrowLeft className="size-4" />
              Annuler
            </Button>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-52 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-52 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <BoardingSection title="Informations générales" description="Identité et localisation de l'entreprise partenaire.">
              <BoardingInput
                label="Nom de l'entreprise"
                value={form.name}
                required
                onChange={(event) => updateField('name', event.target.value)}
              />
              <BoardingInput label="Secteur" value={form.sector} onChange={(event) => updateField('sector', event.target.value)} />
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-800">Ville</span>
                <select
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <span className="block text-xs leading-5 text-slate-500">MVP Boarding : Casablanca et Marrakech uniquement.</span>
              </label>
              <BoardingInput label="Lieu de stage" value={form.location} onChange={(event) => updateField('location', event.target.value)} />
            </BoardingSection>

            <BoardingSection title="Profil de l'entreprise" description="Contexte utilisé pour aider l'équipe Boarding à qualifier le matching.">
              <div className="md:col-span-2">
                <BoardingTextarea label="Description" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
              </div>
              <BoardingInput
                label="Compétences recherchées"
                helper="Séparez les compétences par des virgules."
                value={form.skills}
                onChange={(event) => updateField('skills', event.target.value)}
              />
              <BoardingInput
                label="Culture / tags"
                helper="Exemple : startup, francophone, terrain."
                value={form.cultureTags}
                onChange={(event) => updateField('cultureTags', event.target.value)}
              />
            </BoardingSection>

            <BoardingSection title="Critères de stage" description="Besoins opérationnels et prérequis attendus.">
              <div className="md:col-span-2">
                <BoardingTextarea
                  label="Besoins en stage"
                  value={form.internshipNeeds}
                  onChange={(event) => updateField('internshipNeeds', event.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <BoardingTextarea label="Prérequis" value={form.requirements} onChange={(event) => updateField('requirements', event.target.value)} />
              </div>
            </BoardingSection>

            <BoardingSection title="Capacité & périodes" description="Cadre pratique pour piloter les opportunités disponibles.">
              <BoardingInput
                label="Capacité étudiants"
                inputMode="numeric"
                type="number"
                min="0"
                value={form.studentCapacity}
                onChange={(event) => updateField('studentCapacity', event.target.value)}
              />
              <BoardingInput
                label="Durée idéale"
                placeholder="Exemple : 3 à 6 mois"
                value={form.idealDuration}
                onChange={(event) => updateField('idealDuration', event.target.value)}
              />
              <div className="md:col-span-2">
                <BoardingInput
                  label="Périodes"
                  helper="Séparez les périodes par des virgules."
                  value={form.periods}
                  onChange={(event) => updateField('periods', event.target.value)}
                />
              </div>
            </BoardingSection>

            <div className="sticky bottom-4 z-10 flex flex-col-reverse gap-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" className="h-10 rounded-xl" onClick={() => navigate(-1)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" className="h-10 rounded-xl bg-slate-950 text-white hover:bg-slate-800" disabled={isSubmitting}>
                <Save className="size-4" />
                {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

function companyToForm(company: AdminCompany): CompanyFormState {
  return {
    name: company.name ?? '',
    sector: company.sector ?? '',
    city: cityOptions.includes(company.city as (typeof cityOptions)[number]) ? company.city ?? 'Casablanca' : 'Casablanca',
    location: company.location ?? '',
    description: company.description ?? '',
    studentCapacity: company.studentCapacity != null ? String(company.studentCapacity) : '',
    idealDuration: company.idealDuration ?? '',
    periods: company.periods?.join(', ') ?? '',
    skills: company.skills?.join(', ') ?? '',
    requirements: company.requirements ?? '',
    cultureTags: company.cultureTags?.join(', ') ?? '',
    internshipNeeds: company.internshipNeeds ?? '',
  };
}

function formToPayload(form: CompanyFormState): AdminCompanyPayload {
  const capacity = Number(form.studentCapacity);
  const hasCapacity = form.studentCapacity.trim().length > 0;

  return {
    name: form.name.trim(),
    sector: nullableText(form.sector),
    city: form.city,
    location: nullableText(form.location),
    description: nullableText(form.description),
    studentCapacity: hasCapacity && Number.isFinite(capacity) && capacity >= 0 ? capacity : undefined,
    idealDuration: nullableText(form.idealDuration),
    periods: csvToList(form.periods),
    skills: csvToList(form.skills),
    requirements: nullableText(form.requirements),
    cultureTags: csvToList(form.cultureTags),
    internshipNeeds: nullableText(form.internshipNeeds),
  };
}

function nullableText(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function csvToList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
