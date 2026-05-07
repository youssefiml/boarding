import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { journeyApi } from '@/api/modules/journey.api';
import { resourcesApi } from '@/api/modules/resources.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { ROUTES } from '@/app/routes';
import { Badge } from '@/ui/Badge/Badge';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { Input } from '@/ui/Input/Input';
import { ProgressBar } from '@/ui/ProgressBar/ProgressBar';
import { Skeleton } from '@/ui/Skeleton/Skeleton';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/date';
import type { JourneyMilestone, ResourceCategory, ResourceItem } from '@/types/domain';

type ViewMode = 'all' | 'saved';
type JourneyStage = 'onboarding' | 'matching' | 'interview' | 'placement';

type ResourceMeta = {
  readTime: number;
  updatedAt: string;
  hasDownload: boolean;
  hasChecklist: boolean;
  required: boolean;
  checklistItems: string[];
  stageTargets: JourneyStage[];
};

type ResourceWithMeta = {
  resource: ResourceItem;
  meta: ResourceMeta;
};

type CategoryFilter = 'all' | ResourceCategory;

const STORAGE_KEYS = {
  saved: 'boarding-saved-resources',
  checklist: 'boarding-resource-checklist-progress',
} as const;

const categoryMeta: Record<ResourceCategory, { label: string; icon: string }> = {
  housing: { label: 'Housing', icon: 'H' },
  language: { label: 'Language', icon: 'L' },
  legal: { label: 'Legal', icon: 'G' },
  health: { label: 'Health', icon: '+' },
  'local-life': { label: 'Local life', icon: 'C' },
};

const categoryFilters: Array<{ id: CategoryFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'housing', label: 'Housing' },
  { id: 'language', label: 'Language' },
  { id: 'legal', label: 'Legal' },
  { id: 'health', label: 'Health' },
  { id: 'local-life', label: 'Local life' },
];

const resourceMetaOverrides: Record<string, Partial<ResourceMeta>> = {
  'resource-1': {
    readTime: 7,
    updatedAt: '2026-02-20',
    hasChecklist: true,
    hasDownload: true,
    required: true,
    checklistItems: ['Review lease requirements', 'Verify utility setup', 'Prepare first-week budget'],
    stageTargets: ['onboarding', 'matching'],
  },
  'resource-2': {
    readTime: 5,
    updatedAt: '2026-02-16',
    hasChecklist: true,
    hasDownload: false,
    required: false,
    checklistItems: ['Practice interview greetings', 'Memorize workplace vocabulary', 'Prepare follow-up phrases'],
    stageTargets: ['matching', 'interview'],
  },
  'resource-3': {
    readTime: 6,
    updatedAt: '2026-02-12',
    hasChecklist: true,
    hasDownload: false,
    required: false,
    checklistItems: ['Set up transport card', 'Choose phone provider', 'Register local address process'],
    stageTargets: ['placement'],
  },
  'resource-4': {
    readTime: 9,
    updatedAt: '2026-02-21',
    hasChecklist: true,
    hasDownload: true,
    required: true,
    checklistItems: ['Confirm visa validity', 'Check insurance coverage', 'Review contract clauses'],
    stageTargets: ['onboarding', 'matching', 'interview'],
  },
  'resource-5': {
    readTime: 4,
    updatedAt: '2026-02-10',
    hasChecklist: true,
    hasDownload: true,
    required: false,
    checklistItems: ['Save emergency contacts', 'Locate nearby clinic', 'Understand reimbursement process'],
    stageTargets: ['interview', 'placement'],
  },
};

const defaultMeta: ResourceMeta = {
  readTime: 6,
  updatedAt: '2026-02-01',
  hasDownload: false,
  hasChecklist: false,
  required: false,
  checklistItems: ['Read full guide', 'Review advisor recommendations'],
  stageTargets: ['onboarding'],
};

function getResourceMeta(resource: ResourceItem): ResourceMeta {
  const override = resourceMetaOverrides[resource.id] ?? {};

  const inferredTargets: JourneyStage[] = resource.category === 'legal' || resource.category === 'housing'
    ? ['onboarding', 'matching']
    : resource.category === 'language'
      ? ['matching', 'interview']
      : resource.category === 'health'
        ? ['interview', 'placement']
        : ['placement'];

  return {
    ...defaultMeta,
    ...override,
    stageTargets: override.stageTargets ?? inferredTargets,
    hasChecklist: override.hasChecklist ?? true,
    checklistItems: override.checklistItems ?? defaultMeta.checklistItems,
  };
}

function inferJourneyStage(milestones: JourneyMilestone[]) {
  const current = milestones.find((item) => item.status === 'current') ?? milestones.find((item) => item.status === 'upcoming') ?? null;

  if (!current) {
    return 'onboarding' as JourneyStage;
  }

  const title = current.title.toLowerCase();

  if (title.includes('matching')) {
    return 'matching' as JourneyStage;
  }

  if (title.includes('interview')) {
    return 'interview' as JourneyStage;
  }

  if (title.includes('placement')) {
    return 'placement' as JourneyStage;
  }

  return 'onboarding' as JourneyStage;
}

function getNextActions(stage: JourneyStage) {
  if (stage === 'matching') {
    return ['Review top 3 matches', 'Update profile preferences', 'Prepare interview availability'];
  }

  if (stage === 'interview') {
    return ['Finalize interview answers', 'Confirm schedule availability', 'Prepare required documents'];
  }

  if (stage === 'placement') {
    return ['Review local life checklist', 'Check health and insurance setup', 'Track onboarding milestones'];
  }

  return ['Complete profile details', 'Upload required documents', 'Read legal and housing essentials'];
}

function daysUntil(value: string) {
  const now = new Date();
  const target = new Date(value);

  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function safeParseArray(value: string | null): string[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }

    return [];
  } catch {
    return [];
  }
}

function safeParseChecklist(value: string | null): Record<string, string[]> {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);

    if (typeof parsed !== 'object' || parsed === null) {
      return {};
    }

    const entries = Object.entries(parsed).map(([key, raw]) => {
      if (!Array.isArray(raw)) {
        return [key, []] as const;
      }

      return [
        key,
        raw.filter((item): item is string => typeof item === 'string'),
      ] as const;
    });

    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

function matchesSearch(item: ResourceWithMeta, query: string) {
  if (!query.trim()) {
    return true;
  }

  const needle = query.trim().toLowerCase();
  const haystack = `${item.resource.title} ${item.resource.excerpt} ${categoryMeta[item.resource.category].label}`.toLowerCase();

  return haystack.includes(needle);
}

export function ResourcesPage() {
  const navigate = useNavigate();

  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [journeyMilestones, setJourneyMilestones] = useState<JourneyMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
  const [checklistProgress, setChecklistProgress] = useState<Record<string, string[]>>({});
  const [previewResourceId, setPreviewResourceId] = useState<string | null>(null);
  const [hasListRevealPlayed, setHasListRevealPlayed] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);

    try {
      const [resourceData, journeyData] = await Promise.all([
        resourcesApi.listResources({ page: 1, pageSize: 60 }),
        journeyApi.listMilestones(),
      ]);

      setResources(resourceData.items);
      setJourneyMilestones(
        [...journeyData.milestones].sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
      );
    } catch {
      setResources([]);
      setJourneyMilestones([]);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setSavedResourceIds(safeParseArray(window.localStorage.getItem(STORAGE_KEYS.saved)));
    setChecklistProgress(safeParseChecklist(window.localStorage.getItem(STORAGE_KEYS.checklist)));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.saved, JSON.stringify(savedResourceIds));
  }, [savedResourceIds]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.checklist, JSON.stringify(checklistProgress));
  }, [checklistProgress]);

  useEffect(() => {
    if (isLoading || loadError || hasListRevealPlayed) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setHasListRevealPlayed(true);
    }, 280);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [hasListRevealPlayed, isLoading, loadError]);

  const currentStage = useMemo(() => inferJourneyStage(journeyMilestones), [journeyMilestones]);

  const nextMilestone = useMemo(() => {
    return journeyMilestones.find((item) => item.status === 'upcoming') ?? null;
  }, [journeyMilestones]);

  const allResources = useMemo<ResourceWithMeta[]>(() => {
    return resources.map((resource) => ({
      resource,
      meta: getResourceMeta(resource),
    }));
  }, [resources]);

  const recommendedResourceIds = useMemo(() => {
    const recommended = new Set<string>();

    allResources.forEach((item) => {
      if (item.meta.stageTargets.includes(currentStage)) {
        recommended.add(item.resource.id);
      }

      if (currentStage === 'matching' && /german|berlin|housing/i.test(item.resource.title)) {
        recommended.add(item.resource.id);
      }

      if (currentStage === 'interview' && /checklist|legal|language|interview/i.test(item.resource.title)) {
        recommended.add(item.resource.id);
      }
    });

    return recommended;
  }, [allResources, currentStage]);

  const visibleResources = useMemo(() => {
    return allResources
      .filter((item) => (categoryFilter === 'all' ? true : item.resource.category === categoryFilter))
      .filter((item) => matchesSearch(item, searchQuery))
      .filter((item) => (viewMode === 'saved' ? savedResourceIds.includes(item.resource.id) : true));
  }, [allResources, categoryFilter, savedResourceIds, searchQuery, viewMode]);

  const essentialResources = useMemo(() => {
    const byPriority = visibleResources
      .filter((item) => item.meta.required || item.resource.category === 'legal' || item.resource.category === 'housing')
      .sort((left, right) => Number(right.meta.required) - Number(left.meta.required));

    return byPriority.slice(0, 3);
  }, [visibleResources]);

  const remainingResources = useMemo(() => {
    const essentialIds = new Set(essentialResources.map((item) => item.resource.id));
    return visibleResources.filter((item) => !essentialIds.has(item.resource.id));
  }, [essentialResources, visibleResources]);

  const emergencyResources = useMemo(() => {
    return remainingResources.filter((item) => {
      return item.resource.category === 'health' || /emergency|urgent|insurance|legal/i.test(item.resource.title);
    });
  }, [remainingResources]);

  const duringInternshipResources = useMemo(() => {
    const emergencyIds = new Set(emergencyResources.map((item) => item.resource.id));
    return remainingResources.filter((item) => !emergencyIds.has(item.resource.id));
  }, [emergencyResources, remainingResources]);

  const previewResource = useMemo(() => {
    if (!previewResourceId) {
      return null;
    }

    return allResources.find((item) => item.resource.id === previewResourceId) ?? null;
  }, [allResources, previewResourceId]);

  const previewChecklistProgress = useMemo(() => {
    if (!previewResource) {
      return 0;
    }

    const checked = checklistProgress[previewResource.resource.id] ?? [];
    const total = previewResource.meta.checklistItems.length;

    if (total === 0) {
      return 0;
    }

    return Math.round((checked.length / total) * 100);
  }, [checklistProgress, previewResource]);

  const recommendedResources = useMemo(() => {
    return allResources
      .filter((item) => recommendedResourceIds.has(item.resource.id))
      .slice(0, 4);
  }, [allResources, recommendedResourceIds]);

  const nextActionItems = useMemo(() => getNextActions(currentStage), [currentStage]);

  const toggleSavedResource = useCallback((resourceId: string) => {
    setSavedResourceIds((current) => {
      if (current.includes(resourceId)) {
        return current.filter((id) => id !== resourceId);
      }

      return [...current, resourceId];
    });
  }, []);

  const toggleChecklistItem = useCallback((resourceId: string, item: string) => {
    setChecklistProgress((current) => {
      const existing = current[resourceId] ?? [];

      if (existing.includes(item)) {
        return {
          ...current,
          [resourceId]: existing.filter((value) => value !== item),
        };
      }

      return {
        ...current,
        [resourceId]: [...existing, item],
      };
    });
  }, []);

  const openGuide = useCallback((resource: ResourceItem) => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  }, []);

  const openDownload = useCallback((resource: ResourceItem) => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
    toast.success('Guide download started.');
  }, []);

  const resourceCountLabel = viewMode === 'saved' ? `${savedResourceIds.length} saved` : `${visibleResources.length} guides`;

  return (
    <div>
      <PageHeader
        title="Resources"
        subtitle="Solve practical placement questions quickly with prioritized guides and checklists."
        action={
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800/70">
              <button
                type="button"
                onClick={() => setViewMode('all')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition',
                  viewMode === 'all'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setViewMode('saved')}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition',
                  viewMode === 'saved'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'
                )}
              >
                Saved
              </button>
            </div>
            <span className="inline-flex min-h-9 items-center rounded-full border border-slate-300/85 bg-white/75 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:border-slate-600/85 dark:bg-slate-800/85 dark:text-slate-200">
              {resourceCountLabel}
            </span>
          </div>
        }
      />

      <Card className="mb-4 p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <Input
            label="Search resources"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            placeholder="Search housing, visa, health, contracts..."
          />

          <Button type="button" variant="outline" className="md:hidden" onClick={() => setMobileFiltersOpen(true)}>
            Filters
          </Button>
        </div>

        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
          {categoryFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setCategoryFilter(filter.id)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
                categoryFilter === filter.id
                  ? 'border-brand-400 bg-brand-100 text-brand-800 dark:border-brand-400/75 dark:bg-brand-500/20 dark:text-brand-100'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-5">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
              <Skeleton className="h-36 rounded-xl" />
            </div>
          ) : null}

          {!isLoading && loadError ? (
            <EmptyState
              title="Unable to load resources"
              description="Please retry in a few seconds."
              actionLabel="Retry"
              onAction={() => {
                void loadData();
              }}
            />
          ) : null}

          {!isLoading && !loadError && visibleResources.length === 0 ? (
            <EmptyState
              title={viewMode === 'saved' ? 'No saved resources yet' : 'No resources found'}
              description={
                viewMode === 'saved'
                  ? 'Bookmark useful guides to access them quickly later.'
                  : 'Try another keyword or category filter.'
              }
              actionLabel="Reset filters"
              onAction={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setViewMode('all');
              }}
            />
          ) : null}

          {!isLoading && !loadError && visibleResources.length > 0 ? (
            <>
              <section className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Essential before departure</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Critical checklists to secure legal, housing, and onboarding readiness.</p>
                  </div>
                </div>

                {essentialResources.length === 0 ? (
                  <Card className="p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">No essential resources match current filters.</p>
                  </Card>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {essentialResources.map((item, index) => {
                      const isSaved = savedResourceIds.includes(item.resource.id);
                      const isRecommended = recommendedResourceIds.has(item.resource.id);
                      const category = categoryMeta[item.resource.category];

                      return (
                        <article
                          key={item.resource.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setPreviewResourceId(item.resource.id)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setPreviewResourceId(item.resource.id);
                            }
                          }}
                          className={cn(
                            'min-w-0 cursor-pointer rounded-xl border border-brand-200 bg-brand-50/50 p-4 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-brand-400/40 dark:bg-brand-500/10',
                            !hasListRevealPlayed && 'motion-list-reveal'
                          )}
                          style={!hasListRevealPlayed ? ({ '--motion-delay': `${Math.min(index, 5) * 40}ms` } as CSSProperties) : undefined}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-brand-300 bg-white text-xs font-semibold text-brand-700 dark:border-brand-400/60 dark:bg-slate-900 dark:text-brand-200">
                                {category.icon}
                              </span>
                              <Badge variant="brand">{category.label}</Badge>
                              {item.meta.required ? <Badge variant="warning">Required</Badge> : null}
                              {isRecommended ? <Badge variant="success">Recommended for you</Badge> : null}
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleSavedResource(item.resource.id);
                              }}
                              className="shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100"
                            >
                              {isSaved ? 'Saved' : 'Save'}
                            </button>
                          </div>

                          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{item.resource.title}</h3>
                          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{item.resource.excerpt}</p>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <span className="rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900/80">{item.meta.readTime} min read</span>
                            <span className="rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900/80">Updated {formatDate(item.meta.updatedAt)}</span>
                            {item.meta.hasChecklist ? <span className="rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900/80">Checklist included</span> : null}
                            {item.meta.hasDownload ? <span className="rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900/80">Download available</span> : null}
                          </div>

                          <p className="mt-3 text-sm font-semibold text-brand-700 dark:text-brand-300">View guide</p>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">During internship</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Daily guidance to stay organized and confident after arrival.</p>
                </div>

                {duringInternshipResources.length === 0 ? (
                  <Card className="p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">No resources in this section for current filters.</p>
                  </Card>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {duringInternshipResources.map((item, index) => {
                      const category = categoryMeta[item.resource.category];
                      const isSaved = savedResourceIds.includes(item.resource.id);
                      const isRecommended = recommendedResourceIds.has(item.resource.id);

                      return (
                        <article
                          key={item.resource.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setPreviewResourceId(item.resource.id)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setPreviewResourceId(item.resource.id);
                            }
                          }}
                          className={cn(
                            'min-w-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-[1px] hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/85',
                            !hasListRevealPlayed && 'motion-list-reveal'
                          )}
                          style={!hasListRevealPlayed ? ({ '--motion-delay': `${Math.min(index, 5) * 40}ms` } as CSSProperties) : undefined}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                                {category.icon}
                              </span>
                              <Badge variant="neutral">{category.label}</Badge>
                              {isRecommended ? <Badge variant="success">Recommended for you</Badge> : null}
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleSavedResource(item.resource.id);
                              }}
                              className="shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100"
                            >
                              {isSaved ? 'Saved' : 'Save'}
                            </button>
                          </div>

                          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{item.resource.title}</h3>
                          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{item.resource.excerpt}</p>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/80">{item.meta.readTime} min read</span>
                            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/80">Updated {formatDate(item.meta.updatedAt)}</span>
                            {item.meta.hasChecklist ? <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/80">Checklist included</span> : null}
                          </div>

                          <p className="mt-3 text-sm font-semibold text-brand-700 dark:text-brand-300">View guide</p>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Emergency and support</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Fast access resources for urgent health and compliance questions.</p>
                </div>

                {emergencyResources.length === 0 ? (
                  <Card className="p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">No emergency resources available for this filter.</p>
                  </Card>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {emergencyResources.map((item, index) => {
                      const category = categoryMeta[item.resource.category];
                      const isSaved = savedResourceIds.includes(item.resource.id);

                      return (
                        <article
                          key={item.resource.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setPreviewResourceId(item.resource.id)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setPreviewResourceId(item.resource.id);
                            }
                          }}
                          className={cn(
                            'min-w-0 cursor-pointer rounded-xl border border-rose-200 bg-rose-50/30 p-4 transition hover:-translate-y-[1px] hover:shadow-sm dark:border-rose-500/35 dark:bg-rose-500/10',
                            !hasListRevealPlayed && 'motion-list-reveal'
                          )}
                          style={!hasListRevealPlayed ? ({ '--motion-delay': `${Math.min(index, 5) * 40}ms` } as CSSProperties) : undefined}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-300 bg-white text-xs font-semibold text-rose-700 dark:border-rose-400/55 dark:bg-slate-900 dark:text-rose-200">
                                {category.icon}
                              </span>
                              <Badge variant="warning">{category.label}</Badge>
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleSavedResource(item.resource.id);
                              }}
                              className="shrink-0 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100"
                            >
                              {isSaved ? 'Saved' : 'Save'}
                            </button>
                          </div>

                          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{item.resource.title}</h3>
                          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{item.resource.excerpt}</p>

                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <span className="rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900/80">{item.meta.readTime} min read</span>
                            <span className="rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900/80">Updated {formatDate(item.meta.updatedAt)}</span>
                            {item.meta.hasDownload ? <span className="rounded-md border border-slate-200 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-900/80">Download available</span> : null}
                          </div>

                          <p className="mt-3 text-sm font-semibold text-rose-700 dark:text-rose-200">View guide</p>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>

        <aside className="hidden xl:block">
          <Card className="sticky top-24 p-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Recommended for you</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {nextMilestone
                ? `Next milestone in ${daysUntil(nextMilestone.date) ?? 0} day(s): ${nextMilestone.title}`
                : 'No upcoming milestone yet. Stay prepared with core guides.'}
            </p>

            {recommendedResources.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {recommendedResources.map((item) => (
                  <li key={item.resource.id}>
                    <button
                      type="button"
                      onClick={() => setPreviewResourceId(item.resource.id)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.resource.title}</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{categoryMeta[item.resource.category].label}  -  {item.meta.readTime} min</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">No personalized recommendations yet.</p>
            )}

            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Your next actions</h3>
              <ul className="mt-2 space-y-2">
                {nextActionItems.map((action) => (
                  <li
                    key={action}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                  >
                    {action}
                  </li>
                ))}
              </ul>

              <div className="mt-3 grid gap-2">
                <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.journey)}>
                  Open journey
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(ROUTES.matching)}>
                  View matches
                </Button>
              </div>
            </div>
          </Card>
        </aside>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            className="motion-backdrop-enter absolute inset-0 bg-slate-950/60"
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
          />

          <div className="motion-drawer-enter absolute inset-x-0 bottom-0 max-h-[78vh] overflow-y-auto rounded-t-2xl border border-slate-700 bg-slate-900 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-100">Filters</h2>
              <Button type="button" variant="ghost" size="sm" onClick={() => setMobileFiltersOpen(false)}>
                Close
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-300">View</p>
                <div className="mt-2 inline-flex rounded-xl border border-slate-700 bg-slate-800 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('all')}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition',
                      viewMode === 'all' ? 'bg-slate-700 text-slate-100' : 'text-slate-300'
                    )}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('saved')}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition',
                      viewMode === 'saved' ? 'bg-slate-700 text-slate-100' : 'text-slate-300'
                    )}
                  >
                    Saved
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-300">Category</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categoryFilters.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(filter.id);
                        setMobileFiltersOpen(false);
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition',
                        categoryFilter === filter.id
                          ? 'border-brand-400 bg-brand-500/20 text-brand-100'
                          : 'border-slate-600 bg-slate-900 text-slate-300'
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {previewResource ? (
        <div className="fixed inset-0 z-[60] p-3 md:p-4" role="dialog" aria-modal="true" aria-label="Resource preview">
          <button
            type="button"
            className="motion-backdrop-enter absolute inset-0 bg-slate-950/70"
            onClick={() => setPreviewResourceId(null)}
            aria-label="Close resource preview"
          />

          <div className="app-modal-panel motion-modal-enter relative mx-auto mt-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:mt-8 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Badge variant="brand">{categoryMeta[previewResource.resource.category].label}</Badge>
                  {recommendedResourceIds.has(previewResource.resource.id) ? <Badge variant="success">Recommended for you</Badge> : null}
                </div>
                <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{previewResource.resource.title}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{previewResource.resource.excerpt}</p>
              </div>

              <Button type="button" variant="ghost" size="sm" onClick={() => setPreviewResourceId(null)}>
                Close
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/70">{previewResource.meta.readTime} min read</span>
              <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/70">Updated {formatDate(previewResource.meta.updatedAt)}</span>
              {previewResource.meta.hasDownload ? <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/70">Downloadable PDF</span> : null}
              {previewResource.meta.hasChecklist ? <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800/70">Checklist included</span> : null}
            </div>

            {previewResource.meta.hasChecklist ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Action checklist</p>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{previewChecklistProgress}% done</span>
                </div>
                <ProgressBar className="mt-2" value={previewChecklistProgress} />

                <ul className="mt-3 space-y-2">
                  {previewResource.meta.checklistItems.map((item) => {
                    const checked = (checklistProgress[previewResource.resource.id] ?? []).includes(item);

                    return (
                      <li key={`${previewResource.resource.id}-${item}`}>
                        <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleChecklistItem(previewResource.resource.id, item)}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                          />
                          <span>{item}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => toggleSavedResource(previewResource.resource.id)}
              >
                {savedResourceIds.includes(previewResource.resource.id) ? 'Saved' : 'Save resource'}
              </Button>

              {previewResource.meta.hasDownload ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => openDownload(previewResource.resource)}
                >
                  Download PDF
                </Button>
              ) : null}

              <Button type="button" onClick={() => openGuide(previewResource.resource)}>
                View guide
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
