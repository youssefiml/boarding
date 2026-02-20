import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { dashboardApi } from '@/api/modules/dashboard.api';
import { matchingApi } from '@/api/modules/matching.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { ROUTES } from '@/app/routes';
import { formatDateTime } from '@/lib/date';
import type { CompanyMatch, DashboardSummary } from '@/types/domain';
import { Badge } from '@/ui/Badge/Badge';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
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

function scoreBadgeVariant(score: number): 'success' | 'warning' | 'neutral' {
  if (score >= 85) {
    return 'success';
  }

  if (score >= 65) {
    return 'warning';
  }

  return 'neutral';
}

const matchStatusLabel: Record<CompanyMatch['status'], string> = {
  new: 'New',
  reviewed: 'Reviewed',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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

  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
}

function toAreaPath(points: ChartPoint[], chartHeight: number) {
  if (points.length === 0) {
    return '';
  }

  const first = points[0];
  const last = points[points.length - 1];
  return `${toLinePath(points)} L ${last.x} ${chartHeight} L ${first.x} ${chartHeight} Z`;
}

export function DashboardPage() {
  const navigate = useNavigate();
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

      setTopMatches(activeMatches.slice(0, 4));
      setScoreBands({
        high: activeMatches.filter((match) => match.score >= 85).length,
        medium: activeMatches.filter((match) => match.score >= 70 && match.score < 85).length,
        developing: activeMatches.filter((match) => match.score < 70).length,
      });
    } else {
      setTopMatches([]);
      setScoreBands({
        high: 0,
        medium: 0,
        developing: 0,
      });
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

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Track your progress, strongest matches, and next moves." />
        <div className="space-y-4">
          <Skeleton className="h-64 sm:h-72" />
          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
          <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="Track your progress, strongest matches, and next moves." />
        <EmptyState
          title="We could not load dashboard data"
          description="Please retry in a few seconds."
          actionLabel="Retry"
          onAction={() => {
            void loadDashboard();
          }}
        />
      </div>
    );
  }

  const featuredMatch = topMatches[0] ?? null;
  const actionCount = summary.upcomingActions.length;
  const totalTrackedMatches = scoreBands.high + scoreBands.medium + scoreBands.developing;
  const highFitShare = totalTrackedMatches > 0 ? Math.round((scoreBands.high / totalTrackedMatches) * 100) : 0;
  const midFitShare = totalTrackedMatches > 0 ? Math.round((scoreBands.medium / totalTrackedMatches) * 100) : 0;
  const developingShare = totalTrackedMatches > 0 ? Math.round((scoreBands.developing / totalTrackedMatches) * 100) : 0;

  const momentumSeries = [
    clamp(summary.profileCompletion - 22, 18, 94),
    clamp(summary.profileCompletion - 10 + scoreBands.medium * 6, 22, 97),
    clamp(summary.profileCompletion - 4 + scoreBands.high * 4, 24, 99),
    clamp(summary.profileCompletion + scoreBands.high * 7, 28, 100),
    clamp(summary.profileCompletion + summary.matchCount * 4 - actionCount * 6, 24, 100),
    clamp(summary.profileCompletion + summary.matchCount * 5 - actionCount * 3 + 8, 28, 100),
  ];

  const chartWidth = 560;
  const chartHeight = 220;
  const momentumPoints = buildChartPoints(momentumSeries, chartWidth, chartHeight);
  const momentumLinePath = toLinePath(momentumPoints);
  const momentumAreaPath = toAreaPath(momentumPoints, chartHeight);

  const quickTiles = [
    {
      key: 'readiness',
      label: 'Profile readiness',
      value: `${summary.profileCompletion}%`,
      helper:
        summary.profileCompletion >= 80
          ? 'You are close to full placement readiness.'
          : 'Complete remaining profile details to boost matching.',
      progress: summary.profileCompletion,
      tone: 'brand' as const,
    },
    {
      key: 'matches',
      label: 'Active matches',
      value: String(summary.matchCount),
      helper: `${scoreBands.high} high-fit opportunities in the latest scan.`,
      progress: clamp(summary.matchCount * 18, 10, 100),
      tone: 'accent' as const,
    },
    {
      key: 'actions',
      label: 'Pending actions',
      value: String(actionCount),
      helper:
        actionCount > 0
          ? `${actionCount} action${actionCount > 1 ? 's' : ''} to keep momentum this week.`
          : 'No blockers right now. Keep the pace.',
      progress: clamp(100 - actionCount * 20, 16, 100),
      tone: 'slate' as const,
    },
    {
      key: 'confidence',
      label: 'High-fit share',
      value: `${highFitShare}%`,
      helper: featuredMatch
        ? `${featuredMatch.companyName} is leading with score ${featuredMatch.score}.`
        : 'New recommendations will appear as your profile evolves.',
      progress: highFitShare,
      tone: 'brand' as const,
    },
  ];

  const phaseLabels = ['Profile setup', 'Match scan', 'Coach review', 'Interview prep', 'Employer signal', 'Placement ready'];

  const distributionRows = [
    {
      key: 'high',
      label: 'High fit (85+)',
      count: scoreBands.high,
      share: highFitShare,
      barClass: 'from-brand-500 to-brand-600',
    },
    {
      key: 'medium',
      label: 'Solid fit (70-84)',
      count: scoreBands.medium,
      share: midFitShare,
      barClass: 'from-accent-500 to-accent-600',
    },
    {
      key: 'developing',
      label: 'Developing fit (<70)',
      count: scoreBands.developing,
      share: developingShare,
      barClass: 'from-slate-500 to-slate-600',
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        subtitle="A live placement command center built from your current profile, matches, and next actions."
        action={
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              navigate(ROUTES.matching);
            }}
          >
            Explore matches
          </Button>
        }
      />

      <Card className="relative overflow-hidden border-brand-100 bg-gradient-to-br from-white via-brand-50/70 to-accent-50/70 dark:from-slate-900 dark:via-brand-500/10 dark:to-accent-500/10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-300/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-accent-300/35 blur-3xl" />

        <div className="relative grid gap-5 xl:grid-cols-[1.1fr_1fr]">
          <section className="min-w-0">
            <Badge variant="brand">Placement command center</Badge>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {featuredMatch ? featuredMatch.companyName : 'Your placement pipeline is active'}
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {featuredMatch
                ? `${featuredMatch.industry} - ${featuredMatch.location}`
                : 'Update your profile and preferences to improve company fit quality.'}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {featuredMatch
                ? featuredMatch.description
                : 'Use this dashboard to prioritize the next actions that unlock higher quality opportunities.'}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-white/85 dark:bg-slate-900/75 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Next priority</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{summary.nextStep}</p>
              </article>

              <article className="rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-white/85 dark:bg-slate-900/75 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Upcoming session</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                  {summary.nextAppointment ? summary.nextAppointment.title : 'No session scheduled'}
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {summary.nextAppointment
                    ? formatDateTime(summary.nextAppointment.date)
                    : 'Schedule one from the appointments page.'}
                </p>
              </article>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  navigate(ROUTES.matching);
                }}
              >
                View matching companies
              </Button>
              <Button
                className="w-full sm:w-auto"
                variant="secondary"
                onClick={() => {
                  navigate(ROUTES.journey);
                }}
              >
                Open action timeline
              </Button>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            {quickTiles.map((tile, index) => {
              const shellClass =
                tile.tone === 'brand'
                  ? 'border-brand-100 bg-white/90 dark:bg-slate-900/80'
                  : tile.tone === 'accent'
                    ? 'border-accent-100 bg-white/90 dark:bg-slate-900/80'
                    : 'border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80';

              const meterClass =
                tile.tone === 'brand'
                  ? 'from-brand-500 to-brand-600'
                  : tile.tone === 'accent'
                    ? 'from-accent-500 to-accent-600'
                    : 'from-slate-500 to-slate-600';

              return (
                <article
                  key={tile.key}
                  className={`rounded-2xl border p-4 shadow-sm backdrop-blur-sm animate-fade-in-up ${shellClass}`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{tile.label}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tile.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{tile.helper}</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                    <span
                      className={`block h-2 rounded-full bg-gradient-to-r ${meterClass}`}
                      style={{ width: `${clamp(tile.progress, 0, 100)}%` }}
                    />
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card className="animate-fade-in-up">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Momentum timeline</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Six-step projection based on readiness, fit quality, and open actions.</p>
            </div>
            <Badge variant={actionCount === 0 ? 'success' : actionCount <= 2 ? 'warning' : 'neutral'}>
              {actionCount === 0 ? 'On schedule' : `${actionCount} pending action${actionCount > 1 ? 's' : ''}`}
            </Badge>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/70 p-3 sm:p-4">
            <div className="relative h-56 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 pb-2 pt-5 sm:px-4">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="dashboardMomentumStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2868f0" />
                    <stop offset="100%" stopColor="#1d9e90" />
                  </linearGradient>
                  <linearGradient id="dashboardMomentumArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(40, 104, 240, 0.28)" />
                    <stop offset="100%" stopColor="rgba(40, 104, 240, 0.03)" />
                  </linearGradient>
                </defs>

                {[20, 40, 60, 80].map((level) => {
                  const y = chartHeight - (level / 100) * chartHeight;

                  return (
                    <line
                      key={level}
                      x1="0"
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="rgba(148, 163, 184, 0.32)"
                      strokeDasharray="4 6"
                    />
                  );
                })}

                <path d={momentumAreaPath} fill="url(#dashboardMomentumArea)" />
                <path
                  d={momentumLinePath}
                  fill="none"
                  stroke="url(#dashboardMomentumStroke)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {momentumPoints.map((point, index) => (
                  <circle
                    key={`momentum-${index + 1}`}
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#2868f0"
                    strokeWidth="2.5"
                  />
                ))}
              </svg>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {phaseLabels.map((label, index) => (
                <div key={label} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Step {index + 1}</p>
                  <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in-up">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Fit distribution</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Current quality mix across the latest non-rejected matches.</p>
          </div>

          <div className="mt-5 flex justify-center">
            <div className="relative h-52 w-52">
              <div className="absolute inset-4 rotate-45 rounded-[2rem] border border-brand-200 bg-brand-100/45" />
              <div className="absolute inset-12 rotate-45 rounded-[1.5rem] border border-accent-200 bg-accent-100/45" />
              <div className="absolute inset-20 rotate-45 rounded-[1rem] border border-slate-300 bg-slate-100 dark:bg-slate-700/70" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/85 px-5 py-4 text-center shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Lead score</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {featuredMatch ? featuredMatch.score : summary.profileCompletion}
                  </p>
                </div>
              </div>

              <span className="absolute left-1/2 top-0 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                readiness
              </span>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                fit
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                depth
              </span>
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                pace
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {distributionRows.map((row) => (
              <div key={row.key}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <p className="font-medium text-slate-700 dark:text-slate-200">{row.label}</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{row.count}</p>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <span
                    className={`block h-2 rounded-full bg-gradient-to-r ${row.barClass}`}
                    style={{ width: `${clamp(row.share, 0, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            className="mt-5 w-full"
            variant="secondary"
            onClick={() => {
              navigate(ROUTES.matching);
            }}
          >
            Open match board
          </Button>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="animate-fade-in-up">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Action queue</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">The next tasks with the highest impact on placement speed.</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                navigate(ROUTES.journey);
              }}
            >
              View journey timeline
            </Button>
          </div>

          {actionCount > 0 ? (
            <ol className="mt-4 space-y-3">
              {summary.upcomingActions.map((action, index) => (
                <li
                  key={`${action}-${index + 1}`}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/65 p-3"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{action}</p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                      {index === 0
                        ? 'Prioritize this now to keep your interview pipeline active.'
                        : index === 1
                          ? 'Completing this soon improves your readiness score.'
                          : 'Queue this right after the first two tasks.'}
                    </p>
                  </div>
                  <Badge variant={index === 0 ? 'warning' : 'neutral'}>{index === 0 ? 'Now' : 'Queued'}</Badge>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm font-medium text-emerald-800">
              No pending actions. Keep your profile updated to maintain this pace.
            </p>
          )}
        </Card>

        <Card className="animate-fade-in-up">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Top company stack</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Best-scoring opportunities from the latest ranking pass.</p>
          </div>

          {topMatches.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {topMatches.map((match, index) => (
                <li key={match.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/65 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{match.companyName}</p>
                      <p className="truncate text-xs text-slate-600 dark:text-slate-300">
                        {match.industry} - {match.location}
                      </p>
                    </div>
                    <Badge variant={scoreBadgeVariant(match.score)}>Score {match.score}</Badge>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <span
                      className="block h-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                      style={{ width: `${clamp(match.score, 0, 100)}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Status: {matchStatusLabel[match.status]}</span>
                    <span>Rank #{index + 1}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">No company recommendations yet.</p>
          )}

          <Button
            className="mt-5 w-full"
            variant="outline"
            onClick={() => {
              navigate(ROUTES.matching);
            }}
          >
            See all matches
          </Button>

          <Button
            className="mt-3 w-full"
            variant="secondary"
            onClick={() => {
              navigate(ROUTES.appointments);
            }}
          >
            Manage appointments
          </Button>
        </Card>
      </div>
    </div>
  );
}




