
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { dashboardApi } from '@/api/modules/dashboard.api';
import { matchingApi } from '@/api/modules/matching.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { ROUTES } from '@/app/routes';
import { cn } from '@/lib/cn';
import { formatDateTime } from '@/lib/date';
import type { CompanyMatch, DashboardSummary } from '@/types/domain';
import { Badge } from '@/ui/Badge/Badge';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { ProgressBar } from '@/ui/ProgressBar/ProgressBar';
import { Skeleton } from '@/ui/Skeleton/Skeleton';

interface ScoreBands {
  high: number;
  medium: number;
  developing: number;
}

interface ChartPoint {
  x: number;
  y: number;
}

interface PipelineStep {
  id: string;
  title: string;
}

interface PriorityItem {
  title: string;
  minutes: number;
  helper: string;
}

const pipelineSteps: PipelineStep[] = [
  { id: 'profile', title: 'Profile' },
  { id: 'match', title: 'Match scan' },
  { id: 'review', title: 'Coach review' },
  { id: 'prep', title: 'Interview prep' },
  { id: 'signal', title: 'Employer signal' },
  { id: 'ready', title: 'Placement ready' },
];

const stageLabels = [
  'Profile setup in progress',
  'Profile strengthening',
  'Matching in progress',
  'Interview preparation',
  'Employer signaling',
  'Placement ready',
] as const;

const actionMinutePresets = [5, 8, 12, 15, 18] as const;

const statusLabelByMatch: Record<CompanyMatch['status'], string> = {
  new: 'New',
  reviewed: 'Reviewed',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toTitleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
}

function scoreBadgeVariant(score: number): 'success' | 'warning' | 'neutral' {
  if (score >= 90) {
    return 'success';
  }

  if (score >= 75) {
    return 'warning';
  }

  return 'neutral';
}

function deriveStage(profileCompletion: number, matchCount: number, actionCount: number, highFitShare: number) {
  if (profileCompletion < 50) {
    return 1;
  }

  if (profileCompletion < 70 || matchCount === 0) {
    return 2;
  }

  if (actionCount >= 3) {
    return 3;
  }

  if (actionCount > 0) {
    return 4;
  }

  if (highFitShare >= 40) {
    return 6;
  }

  return 5;
}

function resolveActionRoute(actionText: string) {
  if (/availability|profile|resume|certificate|language/i.test(actionText)) {
    return ROUTES.profile;
  }

  if (/interview|appointment|session/i.test(actionText)) {
    return ROUTES.appointments;
  }

  if (/match|company|opportunit/i.test(actionText)) {
    return ROUTES.matching;
  }

  return ROUTES.journey;
}

function getPrimaryAction(summary: DashboardSummary) {
  if (/availability/i.test(summary.nextStep)) {
    return 'Complete interview availability';
  }

  if (summary.upcomingActions[0]) {
    return summary.upcomingActions[0];
  }

  return summary.nextStep;
}

function toPriorityList(actions: string[]) {
  if (actions.length === 0) {
    return [
      {
        title: 'Review profile readiness',
        minutes: 5,
        helper: 'Confirm profile details are complete before your next scan.',
      },
      {
        title: 'Explore top company matches',
        minutes: 8,
        helper: 'Shortlist the strongest options for your next interview request.',
      },
    ] satisfies PriorityItem[];
  }

  return actions.slice(0, 4).map((title, index) => ({
    title,
    minutes: actionMinutePresets[index] ?? 20,
    helper:
      index === 0
        ? 'Highest impact task for today.'
        : index === 1
          ? 'Completing this improves matching quality.'
          : 'Queue this after the higher-priority tasks.',
  }));
}

function buildMomentumSeries(
  profileCompletion: number,
  matchCount: number,
  highFitShare: number,
  actionCount: number,
  leadScore: number
) {
  return [
    clamp(profileCompletion - 18, 20, 96),
    clamp(profileCompletion - 8 + matchCount * 3, 24, 98),
    clamp(profileCompletion + highFitShare * 0.2, 26, 99),
    clamp(profileCompletion + matchCount * 5 - actionCount * 7, 22, 100),
    clamp(leadScore, 24, 100),
    clamp(leadScore + 6 - actionCount * 2, 26, 100),
  ];
}

function buildChartPoints(values: number[], width: number, height: number): ChartPoint[] {
  if (values.length === 0) {
    return [];
  }

  if (values.length === 1) {
    return [{ x: width / 2, y: height - (clamp(values[0], 0, 100) / 100) * height }];
  }

  const step = width / (values.length - 1);

  return values.map((value, index) => ({
    x: Number((index * step).toFixed(2)),
    y: Number((height - (clamp(value, 0, 100) / 100) * height).toFixed(2)),
  }));
}

function toLinePath(points: ChartPoint[]) {
  if (points.length === 0) {
    return '';
  }

  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function toAreaPath(points: ChartPoint[], chartHeight: number) {
  if (points.length === 0) {
    return '';
  }

  const first = points[0];
  const last = points[points.length - 1];
  return `${toLinePath(points)} L ${last.x} ${chartHeight} L ${first.x} ${chartHeight} Z`;
}

function mobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
}

export function DashboardPage() {
  const navigate = useNavigate();

  const [isMobileView, setIsMobileView] = useState(() => mobileViewport());
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [topMatches, setTopMatches] = useState<CompanyMatch[]>([]);
  const [scoreBands, setScoreBands] = useState<ScoreBands>({
    high: 0,
    medium: 0,
    developing: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);

    const [summaryResult, matchesResult] = await Promise.allSettled([
      dashboardApi.getSummary(),
      matchingApi.listMatches({
        page: 1,
        pageSize: 18,
      }),
    ]);

    if (summaryResult.status === 'fulfilled') {
      setSummary(summaryResult.value);
    } else {
      setSummary(null);
    }

    if (matchesResult.status === 'fulfilled') {
      const activeMatches = matchesResult.value.items
        .filter((match) => match.status !== 'rejected')
        .sort((left, right) => right.score - left.score);

      setTopMatches(activeMatches.slice(0, 5));
      setScoreBands({
        high: activeMatches.filter((match) => match.score >= 85).length,
        medium: activeMatches.filter((match) => match.score >= 70 && match.score < 85).length,
        developing: activeMatches.filter((match) => match.score < 70).length,
      });
    } else {
      setTopMatches([]);
      setScoreBands({ high: 0, medium: 0, developing: 0 });
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void loadDashboard();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [loadDashboard]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const media = window.matchMedia('(max-width: 767px)');
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobileView(event.matches);
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Your placement control tower with clear next actions." />
        <div className="space-y-4">
          <Skeleton className="h-56" />
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Your placement control tower with clear next actions." />
        <EmptyState
          title="Dashboard is temporarily unavailable"
          description="Retry in a few seconds to reload your status and priorities."
          actionLabel="Retry"
          onAction={() => {
            void loadDashboard();
          }}
        />
      </div>
    );
  }

  const featuredMatch = topMatches[0] ?? null;
  const additionalMatches = topMatches.slice(1, 4);
  const actionCount = summary.upcomingActions.length;

  const totalTrackedMatches = scoreBands.high + scoreBands.medium + scoreBands.developing;
  const highFitShare = totalTrackedMatches > 0 ? Math.round((scoreBands.high / totalTrackedMatches) * 100) : 0;

  const profileReadiness = clamp(summary.profileCompletion, 0, 100);
  const fitScore = featuredMatch ? clamp(featuredMatch.score, 0, 100) : clamp(profileReadiness + 10, 20, 95);
  const paceScore = clamp(72 + summary.matchCount * 4 - actionCount * 9, 25, 96);
  const depthScore = clamp(36 + scoreBands.high * 14 + scoreBands.medium * 5, 20, 96);
  const leadScore = Math.round((profileReadiness + fitScore + paceScore + depthScore) / 4);

  const currentStage = deriveStage(profileReadiness, summary.matchCount, actionCount, highFitShare);
  const stageLabel = stageLabels[currentStage - 1];
  const stageProgress = Math.round((currentStage / pipelineSteps.length) * 100);

  const nextMilestone = summary.nextAppointment
    ? `${summary.nextAppointment.title} on ${formatDateTime(summary.nextAppointment.date)}`
    : `${pipelineSteps[Math.min(currentStage, pipelineSteps.length - 1)].title} milestone`;

  const primaryAction = getPrimaryAction(summary);
  const primaryActionRoute = resolveActionRoute(primaryAction);

  const recommendationPotential = clamp(
    highFitShare + Math.round((100 - profileReadiness) / 6) + (scoreBands.high === 0 ? 6 : 2),
    highFitShare,
    95
  );

  const todayPriorities = toPriorityList(summary.upcomingActions);
  const visiblePriorities = isMobileView ? todayPriorities.slice(0, 2) : todayPriorities;
  const weeklyFocus =
    currentStage <= 2 ? 'Complete profile quality checkpoints' : currentStage <= 4 ? 'Interview preparation' : 'Employer engagement';

  const momentumSeries = buildMomentumSeries(profileReadiness, summary.matchCount, highFitShare, actionCount, leadScore);

  const chartWidth = 560;
  const chartHeight = 140;
  const chartPoints = buildChartPoints(momentumSeries, chartWidth, chartHeight);
  const momentumLinePath = toLinePath(chartPoints);
  const momentumAreaPath = toAreaPath(chartPoints, chartHeight);

  const snapshotCards = [
    {
      id: 'readiness',
      label: 'Profile readiness',
      value: `${profileReadiness}%`,
      helper: profileReadiness >= 80 ? 'Strong completion level' : 'Complete pending profile details',
      valueClass: 'text-slate-900 dark:text-slate-100',
    },
    {
      id: 'matches',
      label: 'Active matches',
      value: String(summary.matchCount),
      helper: `${scoreBands.high} high-fit opportunities`,
      valueClass: 'text-slate-900 dark:text-slate-100',
    },
    {
      id: 'high-fit',
      label: 'High-fit count',
      value: String(scoreBands.high),
      helper: `${highFitShare}% of tracked matches`,
      valueClass: 'text-slate-900 dark:text-slate-100',
    },
  ] as const;

  const qualityRows = [
    { id: 'readiness', label: 'Readiness', value: profileReadiness, bar: 'bg-gradient-to-r from-sky-500 to-sky-600' },
    { id: 'fit', label: 'Fit', value: fitScore, bar: 'bg-gradient-to-r from-emerald-500 to-emerald-600' },
    { id: 'pace', label: 'Pace', value: paceScore, bar: 'bg-gradient-to-r from-amber-500 to-amber-600' },
    { id: 'depth', label: 'Depth', value: depthScore, bar: 'bg-gradient-to-r from-slate-500 to-slate-600' },
  ] as const;

  return (
    <div className="space-y-4">
      <PageHeader title="Dashboard" subtitle="Know where you stand, what matters today, and what to do next." />

      <Card className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-600">Placement status</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{stageLabel}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Stage {currentStage} of {pipelineSteps.length}</p>
          </div>
          <Badge variant={actionCount === 0 ? 'success' : actionCount <= 2 ? 'warning' : 'neutral'}>
            {actionCount === 0 ? 'No blockers' : `${actionCount} action${actionCount > 1 ? 's' : ''} pending`}
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Profile readiness</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{profileReadiness}%</p>
            <ProgressBar className="mt-2" value={profileReadiness} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Next milestone</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{nextMilestone}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">This week focus: {weeklyFocus}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              navigate(primaryActionRoute);
            }}
          >
            {primaryAction}
          </Button>
          <button
            type="button"
            className={cn(
              'text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200',
              isMobileView ? 'hidden' : 'inline-flex'
            )}
            onClick={() => {
              navigate(ROUTES.matching);
            }}
          >
            Explore matches
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          If you complete profile updates and upload language proof, your high-fit share could increase to about {recommendationPotential}%.
        </p>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Today&apos;s priorities</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Focus on the next actions with highest placement impact.</p>
          </div>
          {!isMobileView ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                navigate(ROUTES.journey);
              }}
            >
              Open journey
            </Button>
          ) : null}
        </div>

        <ol className="mt-4 space-y-3">
          {visiblePriorities.map((item, index) => {
            const isPrimary = index === 0;

            return (
              <li
                key={`${item.title}-${index + 1}`}
                className={cn(
                  'rounded-xl border p-3',
                  isPrimary
                    ? 'border-brand-300 bg-brand-50 dark:border-brand-400/55 dark:bg-brand-500/10'
                    : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/65'
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  <span className="inline-flex min-h-7 items-center rounded-full border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    {item.minutes} min
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.helper}</p>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top match</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Prioritized opportunity based on your current readiness and fit signals.</p>
          </div>
          {featuredMatch ? <Badge variant={scoreBadgeVariant(featuredMatch.score)}>Score {featuredMatch.score}</Badge> : null}
        </div>

        {featuredMatch ? (
          <>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/65">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{featuredMatch.companyName}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {toTitleCase(featuredMatch.industry)} - {featuredMatch.location}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{featuredMatch.description}</p>

              <Button
                className="mt-4"
                onClick={() => {
                  navigate(ROUTES.matching);
                }}
              >
                Request interview
              </Button>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Other strong matches</p>
              {additionalMatches.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {additionalMatches.map((match, index) => (
                    <li key={match.id} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/80">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{match.companyName}</p>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">#{index + 2}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {toTitleCase(match.industry)} - {match.location} - {statusLabelByMatch[match.status]}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">No additional high-fit matches yet.</p>
              )}
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">No active company matches yet. Complete profile actions to unlock recommendations.</p>
        )}
      </Card>

      {!isMobileView ? (
        <>
          <Card className="p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Performance snapshot</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Compact view of readiness and current match quality.</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {snapshotCards.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/65">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">{item.label}</p>
                  <p className={cn('mt-1 text-2xl font-bold tracking-tight', item.valueClass)}>{item.value}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{item.helper}</p>
                </article>
              ))}
            </div>
          </Card>

          <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
            <Card className="p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Placement pipeline</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Guided six-step journey to placement readiness.</p>
              <ProgressBar className="mt-3" value={stageProgress} />

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
                {pipelineSteps.map((step, index) => {
                  const stepNumber = index + 1;
                  const isCurrent = stepNumber === currentStage;
                  const isDone = stepNumber < currentStage;

                  return (
                    <article
                      key={step.id}
                      className={cn(
                        'rounded-xl border px-2 py-3 text-center',
                        isCurrent
                          ? 'border-brand-400 bg-brand-50 dark:border-brand-400/65 dark:bg-brand-500/10'
                          : isDone
                            ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/45 dark:bg-emerald-500/10'
                            : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/65'
                      )}
                      aria-current={isCurrent ? 'step' : undefined}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">Step {stepNumber}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-900 dark:text-slate-100">{step.title}</p>
                    </article>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/65">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Momentum trend (secondary insight)</p>
                <div className="mt-2 h-32 overflow-hidden rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full" preserveAspectRatio="none" aria-hidden>
                    <defs>
                      <linearGradient id="dashboardTrendStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2868f0" />
                        <stop offset="100%" stopColor="#1d9e90" />
                      </linearGradient>
                      <linearGradient id="dashboardTrendArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(40, 104, 240, 0.24)" />
                        <stop offset="100%" stopColor="rgba(40, 104, 240, 0.04)" />
                      </linearGradient>
                    </defs>

                    {[25, 50, 75].map((level) => {
                      const y = chartHeight - (level / 100) * chartHeight;
                      return <line key={level} x1="0" y1={y} x2={chartWidth} y2={y} stroke="rgba(148, 163, 184, 0.24)" strokeDasharray="3 5" />;
                    })}

                    <path d={momentumAreaPath} fill="url(#dashboardTrendArea)" />
                    <path d={momentumLinePath} fill="none" stroke="url(#dashboardTrendStroke)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {chartPoints.map((point, index) => (
                      <circle key={`trend-${index + 1}`} cx={point.x} cy={point.y} r="4" fill="#ffffff" stroke="#2868f0" strokeWidth="2" />
                    ))}
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quality breakdown</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Simplified quality signals behind your lead score.</p>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/65">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Lead score</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{leadScore}</p>
              </div>

              <div className="mt-4 space-y-3">
                {qualityRows.map((row) => (
                  <div key={row.id}>
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-medium text-slate-700 dark:text-slate-200">{row.label}</p>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{row.value}</p>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                      <span className={`block h-2 rounded-full ${row.bar}`} style={{ width: `${clamp(row.value, 0, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/65 dark:text-slate-300">
                This week recommendation: <span className="font-semibold text-slate-900 dark:text-slate-100">{weeklyFocus}</span>.
              </p>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}

