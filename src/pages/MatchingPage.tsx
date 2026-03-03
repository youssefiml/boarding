
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { matchingApi } from '@/api/modules/matching.api';
import { profileApi } from '@/api/modules/profile.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { ROUTES } from '@/app/routes';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { Input } from '@/ui/Input/Input';
import { Pagination } from '@/ui/Pagination/Pagination';
import { Select } from '@/ui/Select/Select';
import { Skeleton } from '@/ui/Skeleton/Skeleton';
import { cn } from '@/lib/cn';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useAuthStore } from '@/stores/auth.store';
import type { ProfileResponse } from '@/types/api';
import type { CompanyMatch } from '@/types/domain';

type SortKey = 'score' | 'location' | 'industry' | 'recent';
type QuickChip = 'all' | 'above80' | 'remote' | 'visa' | 'housing';

interface Insight {
  summary: string;
  reasons: string[];
  remote: boolean;
  visa: boolean;
  housing: boolean;
  duration: string;
  language: string;
  support: string;
  recent: number;
}

interface EnhancedMatch {
  match: CompanyMatch;
  insight: Insight;
}

const CHIP_LABELS: Record<QuickChip, string> = {
  all: 'All',
  above80: 'Above 80',
  remote: 'Remote friendly',
  visa: 'Visa supported',
  housing: 'With housing',
};

const PRESET: Record<string, Partial<Insight>> = {
  'match-1': {
    summary: 'Strong language alignment and internship duration match.',
    reasons: ['German B1 language alignment', 'Hospitality internship fit', '6 month availability match'],
    remote: false,
    visa: true,
    housing: true,
    duration: '6 months',
    language: 'English + German',
    support: 'Visa and housing support',
  },
  'match-2': {
    summary: 'Operational communication fit with healthcare workflows.',
    reasons: ['Healthcare preference alignment', 'Clear communication profile', 'Structured onboarding support'],
    remote: false,
    visa: true,
    housing: false,
    duration: '4 to 6 months',
    language: 'English + French',
    support: 'Visa support available',
  },
  'match-3': {
    summary: 'Process-oriented placement with mentor support.',
    reasons: ['Manufacturing track alignment', 'Adaptability and workflow fit', 'Mentorship support included'],
    remote: false,
    visa: false,
    housing: false,
    duration: '3 to 6 months',
    language: 'English',
    support: 'Mentorship onboarding',
  },
  'match-4': {
    summary: 'Technical profile fit with high placement readiness.',
    reasons: ['IT profile alignment', 'High language compatibility', 'Fast placement readiness'],
    remote: true,
    visa: true,
    housing: false,
    duration: '6 months',
    language: 'English',
    support: 'Remote onboarding support',
  },
};

function titleCase(value: string) {
  return value
    .split(/[-\s]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function scoreTone(score: number) {
  if (score >= 90) {
    return { bar: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' };
  }

  if (score >= 75) {
    return { bar: 'bg-sky-500', text: 'text-sky-700 dark:text-sky-300' };
  }

  if (score >= 60) {
    return { bar: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' };
  }

  return { bar: 'bg-slate-400', text: 'text-slate-600 dark:text-slate-300' };
}

function makeInsight(match: CompanyMatch, index: number): Insight {
  const preset = PRESET[match.id];

  return {
    summary: preset?.summary ?? `${titleCase(match.industry)} alignment with your profile and timeline.`,
    reasons: preset?.reasons ?? [`${titleCase(match.industry)} fit`, `Score ${match.score}% profile alignment`, 'Location preference compatibility'],
    remote: preset?.remote ?? /\bit\b|digital|software/i.test(match.industry),
    visa: preset?.visa ?? match.score >= 72,
    housing: preset?.housing ?? /hospitality|healthcare/i.test(match.industry),
    duration: preset?.duration ?? (match.score >= 85 ? '6 months' : '3 to 6 months'),
    language: preset?.language ?? (match.industry === 'hospitality' ? 'English + basic German' : 'English'),
    support: preset?.support ?? (match.score >= 80 ? 'Priority onboarding' : 'Standard onboarding'),
    recent: index,
  };
}

function ScoreBar({ score }: { score: number }) {
  const tone = scoreTone(score);

  return (
    <div className="w-full space-y-1 sm:min-w-[132px] sm:w-auto">
      <div className="flex items-center justify-between text-xs">
        <span className={cn('font-semibold', tone.text)}>{score}%</span>
        <span className="text-slate-500 dark:text-slate-400">match</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
        <span className={cn('block h-full rounded-full transition-all duration-300', tone.bar)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function MatchingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('all');
  const [minScore, setMinScore] = useState(50);
  const [sortBy, setSortBy] = useState<SortKey>('score');
  const [quickChip, setQuickChip] = useState<QuickChip>('all');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [matches, setMatches] = useState<CompanyMatch[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [profileSummary, setProfileSummary] = useState<ProfileResponse | null>(null);
  const requestIdRef = useRef(0);
  const debouncedSearch = useDebouncedValue(search, 220);
  const isSearchSettling = debouncedSearch.trim() !== search.trim();

  const profileStrength = user?.profileCompletion ?? profileSummary?.completion ?? 72;

  const loadMatches = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setLoadError(false);

    try {
      const data = await matchingApi.listMatches({
        page: 1,
        pageSize: 60,
        search: debouncedSearch.trim() || undefined,
        industry: industry === 'all' ? undefined : industry,
        minScore,
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      setMatches(data.items);
    } catch {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setMatches([]);
      setLoadError(true);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [debouncedSearch, industry, minScore]);

  useEffect(() => {
    void loadMatches();
  }, [loadMatches]);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const profile = await profileApi.getProfile();
        if (!cancelled) {
          setProfileSummary(profile);
        }
      } catch {
        if (!cancelled) {
          setProfileSummary(null);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const available = new Set(matches.map((match) => match.id));
    setSavedIds((current) => current.filter((id) => available.has(id)));
    setCompareIds((current) => current.filter((id) => available.has(id)));
  }, [matches]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCompareOpen(false);
        setIsMobileFilterOpen(false);
      }
    };

    if (isCompareOpen || isMobileFilterOpen) {
      window.addEventListener('keydown', onEscape);
    }

    return () => {
      window.removeEventListener('keydown', onEscape);
    };
  }, [isCompareOpen, isMobileFilterOpen]);

  const enhanced = useMemo<EnhancedMatch[]>(() => {
    return matches.map((match, index) => ({
      match,
      insight: makeInsight(match, index),
    }));
  }, [matches]);

  const filtered = useMemo(() => {
    const byChip = enhanced.filter((item) => {
      if (quickChip === 'above80') {
        return item.match.score >= 80;
      }

      if (quickChip === 'remote') {
        return item.insight.remote;
      }

      if (quickChip === 'visa') {
        return item.insight.visa;
      }

      if (quickChip === 'housing') {
        return item.insight.housing;
      }

      return true;
    });

    const sorted = [...byChip];
    sorted.sort((left, right) => {
      if (sortBy === 'location') {
        return left.match.location.localeCompare(right.match.location);
      }

      if (sortBy === 'industry') {
        return left.match.industry.localeCompare(right.match.industry);
      }

      if (sortBy === 'recent') {
        return left.insight.recent - right.insight.recent;
      }

      return right.match.score - left.match.score;
    });

    return sorted;
  }, [enhanced, quickChip, sortBy]);

  const topMatch = filtered[0]?.match;
  const featured = filtered.filter((item) => item.match.score >= 85).slice(0, 3);
  const featuredIds = new Set(featured.map((item) => item.match.id));
  const regular = filtered.filter((item) => !featuredIds.has(item.match.id));

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(regular.length / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const regularPage = regular.slice((safePage - 1) * pageSize, safePage * pageSize);

  const selectedForCompare = filtered.filter((item) => compareIds.includes(item.match.id));

  const strengths = useMemo(() => {
    if (!profileSummary) {
      return ['English communication confidence', 'Goal-oriented profile setup', '6 month internship availability'];
    }

    const values: string[] = [];

    if (profileSummary.languages.trim()) {
      const firstLanguage = profileSummary.languages.split(',')[0]?.trim() || profileSummary.languages.trim();
      values.push(`${firstLanguage} communication strength`);
    }

    if (profileSummary.fieldOfStudy.trim()) {
      values.push(`${profileSummary.fieldOfStudy} background`);
    }

    if (profileSummary.preferredIndustry.trim()) {
      values.push(`${titleCase(profileSummary.preferredIndustry)} interest alignment`);
    }

    if (profileSummary.housingSupportNeeded) {
      values.push('Clear housing support requirement');
    }

    return values.slice(0, 4);
  }, [profileSummary]);

  const weakPoints = useMemo(() => {
    if (!profileSummary) {
      return ['No German certificate listed yet', 'Hospitality experience not explicit', 'Profile summary can be more specific'];
    }

    const values: string[] = [];

    if (!profileSummary.resumeFileName) {
      values.push('Resume not uploaded');
    }

    if (!/german/i.test(profileSummary.languages)) {
      values.push('No German certificate listed yet');
    }

    if (profileSummary.bio.trim().length < 90) {
      values.push('Profile summary can be more specific');
    }

    if (values.length === 0) {
      values.push('Profile is strong, keep details updated');
    }

    return values.slice(0, 4);
  }, [profileSummary]);

  const toggleSave = useCallback((matchId: string) => {
    setSavedIds((current) => (current.includes(matchId) ? current.filter((id) => id !== matchId) : [...current, matchId]));
  }, []);

  const toggleCompare = useCallback((matchId: string) => {
    setCompareIds((current) => {
      if (current.includes(matchId)) {
        return current.filter((id) => id !== matchId);
      }

      if (current.length >= 3) {
        toast('Select up to 3 companies for comparison.');
        return current;
      }

      return [...current, matchId];
    });
  }, []);

  const openCompare = useCallback(() => {
    if (compareIds.length < 2) {
      toast('Select at least 2 companies to compare.');
      return;
    }

    setIsCompareOpen(true);
  }, [compareIds.length]);

  const goToProfile = useCallback(() => {
    navigate(ROUTES.profile);
  }, [navigate]);

  const requestInterview = useCallback(() => {
    navigate(ROUTES.appointments);
    toast.success('Go ahead and request your interview from appointments.');
  }, [navigate]);

  const showView = useCallback(() => {
    toast('Detailed company view is coming soon.');
  }, []);

  const filters = (closeOnSelect = false) => (
    <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Company name"
        />

        <Select
          label="Industry"
          value={industry}
          onChange={(event) => {
            setIndustry(event.target.value);
            setPage(1);
          }}
        >
          <option value="all">All industries</option>
          <option value="hospitality">Hospitality</option>
          <option value="it">IT</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="healthcare">Healthcare</option>
        </Select>

        <Input
          label="Min score"
          type="number"
          min={0}
          max={100}
          value={minScore}
          onChange={(event) => {
            const next = Number(event.target.value);
            const safe = Number.isNaN(next) ? 0 : Math.max(0, Math.min(100, next));
            setMinScore(safe);
            setPage(1);
          }}
        />

        <Select
          label="Sort by"
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value as SortKey);
            setPage(1);
          }}
        >
          <option value="score">Highest score</option>
          <option value="location">Location</option>
          <option value="industry">Industry</option>
          <option value="recent">Recently added</option>
        </Select>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(CHIP_LABELS) as QuickChip[]).map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              setQuickChip(chip);
              setPage(1);
              if (closeOnSelect) {
                setIsMobileFilterOpen(false);
              }
            }}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
              quickChip === chip
                ? 'border-brand-400 bg-brand-100 text-brand-800 dark:border-brand-400/75 dark:bg-brand-500/20 dark:text-brand-100'
                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100'
            )}
          >
            {CHIP_LABELS[chip]}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div>
      <PageHeader
        title="Matching"
        subtitle="Prioritize high-fit placements and compare opportunities with clear reasoning."
        action={
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
            <span className="inline-flex min-h-9 items-center rounded-full border border-slate-300/85 bg-white/75 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:border-slate-600/85 dark:bg-slate-800/85 dark:text-slate-200">
              Profile strength: {profileStrength}%
            </span>

            <span className="hidden min-h-9 items-center rounded-full border border-slate-300/85 bg-white/75 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:border-slate-600/85 dark:bg-slate-800/85 dark:text-slate-200 lg:inline-flex">
              Top match: {topMatch ? topMatch.companyName : 'Pending'}
            </span>

            <Button type="button" variant="secondary" className="hidden sm:inline-flex" onClick={goToProfile}>
              Improve profile
            </Button>

            <Button type="button" variant="outline" className="hidden sm:inline-flex" onClick={openCompare}>
              Compare ({compareIds.length})
            </Button>

            <Button type="button" variant="outline" className="w-full sm:hidden" onClick={() => setIsMobileFilterOpen(true)}>
              Filters
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-5">
        <div>
          <div className="mb-4 hidden gap-3 md:grid lg:grid-cols-3">
            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">Profile match score</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{profileStrength}%</p>
              <div className="mt-3">
                <ScoreBar score={profileStrength} />
              </div>
            </Card>

            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">Top match</p>
              <p className="mt-2 line-clamp-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {topMatch ? topMatch.companyName : 'No strong match yet'}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{topMatch ? topMatch.location : 'Update your profile to unlock better fits.'}</p>
            </Card>

            <Card className="p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">Decision actions</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{savedIds.length} saved  -  {compareIds.length} comparing</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Select 2 to 3 companies and run compare.</p>
            </Card>
          </div>

          <div className="sticky top-20 z-20 mb-4 hidden sm:block">
            <Card className="p-4">
              {filters()}
              {isSearchSettling ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">Updating results...</p> : null}
            </Card>
          </div>

          {isLoading ? (
            <div className="space-y-5">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
            </div>
          ) : null}

          {!isLoading && loadError ? (
            <EmptyState
              title="Unable to load matching data"
              description="Please retry in a few seconds."
              actionLabel="Retry"
              onAction={() => {
                void loadMatches();
              }}
            />
          ) : null}

          {!isLoading && !loadError ? (
            <div className="space-y-5">
              <section>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top matches</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">High-priority companies with strongest profile alignment.</p>
                </div>

                {featured.length === 0 ? (
                  <Card className="p-4">
                    <EmptyState
                      title="No strong matches found"
                      description="Lower min score or improve profile details to unlock better opportunities."
                      actionLabel="Improve profile"
                      onAction={goToProfile}
                    />
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {featured.map((item) => {
                      const isSaved = savedIds.includes(item.match.id);
                      const isCompared = compareIds.includes(item.match.id);

                      return (
                        <Card key={item.match.id} className="p-4 transition-shadow duration-200 hover:shadow-md dark:hover:shadow-none">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700 dark:text-brand-300">Featured match</p>
                              <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{item.match.companyName}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-300">{item.match.location}  -  {titleCase(item.match.industry)}</p>
                            </div>

                            <div className="flex items-start gap-3">
                              <ScoreBar score={item.match.score} />
                              <label className="hidden cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-600 sm:inline-flex dark:border-slate-600 dark:text-slate-200">
                                <input
                                  type="checkbox"
                                  className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                  checked={isCompared}
                                  onChange={() => toggleCompare(item.match.id)}
                                />
                                Compare
                              </label>
                            </div>
                          </div>

                          <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{item.insight.summary}</p>

                          <div className="mt-3 grid gap-2 sm:grid-cols-3">
                            {item.insight.reasons.slice(0, 3).map((reason) => (
                              <div
                                key={`${item.match.id}-${reason}`}
                                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
                              >
                                {reason}
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button type="button" size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={showView}>
                              View
                            </Button>
                            <Button type="button" size="sm" className="flex-1 sm:flex-none" onClick={requestInterview}>
                              Request interview
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={isSaved ? 'secondary' : 'ghost'}
                              className={cn('hidden transition-transform duration-150 sm:inline-flex', isSaved ? 'scale-105' : '')}
                              onClick={() => toggleSave(item.match.id)}
                            >
                              {isSaved ? 'Saved' : 'Save'}
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </section>

              <section>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">All matches</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Secondary opportunities to keep momentum.</p>
                </div>

                {regular.length === 0 ? (
                  <Card className="p-4">
                    <EmptyState
                      title="No matches for the current filters"
                      description="Adjust filters or switch to All to reveal more companies."
                      actionLabel="Reset quick filter"
                      onAction={() => {
                        setQuickChip('all');
                        setPage(1);
                      }}
                    />
                  </Card>
                ) : (
                  <>
                    <div className="grid gap-3 lg:grid-cols-2">
                      {regularPage.map((item) => {
                        const isSaved = savedIds.includes(item.match.id);
                        const isCompared = compareIds.includes(item.match.id);

                        return (
                          <Card key={item.match.id} className="p-4 transition-shadow duration-200 hover:shadow-md dark:hover:shadow-none">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.match.companyName}</h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.match.location}  -  {titleCase(item.match.industry)}</p>
                              </div>

                              <label className="hidden cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 sm:inline-flex dark:border-slate-600 dark:text-slate-200">
                                <input
                                  type="checkbox"
                                  className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                  checked={isCompared}
                                  onChange={() => toggleCompare(item.match.id)}
                                />
                                Compare
                              </label>
                            </div>

                            <div className="mt-3">
                              <ScoreBar score={item.match.score} />
                            </div>

                            <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">{item.insight.summary}</p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <Button type="button" variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={showView}>
                                View
                              </Button>
                              <Button
                                type="button"
                                variant={isSaved ? 'secondary' : 'ghost'}
                                size="sm"
                                className={cn('hidden transition-transform duration-150 sm:inline-flex', isSaved ? 'scale-105' : '')}
                                onClick={() => toggleSave(item.match.id)}
                              >
                                {isSaved ? 'Saved' : 'Save'}
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>

                    <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
                  </>
                )}
              </section>
            </div>
          ) : null}
        </div>

        <div className="hidden self-start xl:sticky xl:top-24 xl:block">
          <Card className="p-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile match summary</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Transparent signals that influence your match quality.</p>

            <div className="mt-4">
              <ScoreBar score={profileStrength} />
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">Your strengths</h3>
                <ul className="mt-2 space-y-2">
                  {strengths.map((item) => (
                    <li key={item} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">Weak points</h3>
                <ul className="mt-2 space-y-2">
                  {weakPoints.map((item) => (
                    <li key={item} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Button className="mt-4 w-full" type="button" variant="secondary" onClick={goToProfile}>
              Improve profile
            </Button>
          </Card>
        </div>
      </div>

      {isMobileFilterOpen ? (
        <div className="fixed inset-0 z-50 sm:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60"
            onClick={() => setIsMobileFilterOpen(false)}
            aria-label="Close filters"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl border border-slate-700 bg-slate-900 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-100">Filters</h2>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsMobileFilterOpen(false)}>
                Close
              </Button>
            </div>
            {filters(true)}
          </div>
        </div>
      ) : null}

      {isCompareOpen ? (
        <div className="fixed inset-0 z-[60] p-3 sm:p-4" role="dialog" aria-modal="true" aria-label="Compare matches">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/70"
            onClick={() => setIsCompareOpen(false)}
            aria-label="Close comparison"
          />

          <div className="app-modal-panel app-modal-panel--wide relative mx-auto mt-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:mt-6 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Compare matches</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">Choose the strongest path based on score and support signals.</p>
              </div>

              <Button type="button" variant="ghost" size="sm" onClick={() => setIsCompareOpen(false)}>
                Close
              </Button>
            </div>

            <div className="app-scroll-x rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">Company</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">Score</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">Location</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">Duration</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">Language</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200">Support</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {selectedForCompare.map((item) => (
                    <tr key={item.match.id} className="bg-white dark:bg-slate-900">
                      <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">{item.match.companyName}</td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.match.score}%</td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.match.location}</td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.insight.duration}</td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.insight.language}</td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.insight.support}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="secondary" onClick={requestInterview}>
                Request interview
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsCompareOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
