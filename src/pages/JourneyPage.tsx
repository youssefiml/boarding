import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { appointmentsApi } from '@/api/modules/appointments.api';
import { journeyApi } from '@/api/modules/journey.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { ROUTES } from '@/app/routes';
import { Badge } from '@/ui/Badge/Badge';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { ProgressBar } from '@/ui/ProgressBar/ProgressBar';
import { Skeleton } from '@/ui/Skeleton/Skeleton';
import { cn } from '@/lib/cn';
import { formatDate, formatDateTime } from '@/lib/date';
import type { Appointment, JourneyMilestone } from '@/types/domain';

type JourneyActionTarget = 'profile' | 'matching' | 'appointments' | 'resources' | 'dashboard';

type MilestoneAction = {
  label: string;
  target: JourneyActionTarget;
};

type MilestoneMeta = {
  advisorNote: string;
  documents: string[];
  actions: MilestoneAction[];
};

const stagePipeline = ['Account', 'Profile', 'Matching', 'Interview', 'Placement'] as const;

const milestoneStatusLabel: Record<JourneyMilestone['status'], string> = {
  done: 'Done',
  current: 'Current',
  upcoming: 'Upcoming',
};

function milestoneVariant(status: JourneyMilestone['status']): 'success' | 'brand' | 'neutral' {
  if (status === 'done') {
    return 'success';
  }

  if (status === 'current') {
    return 'brand';
  }

  return 'neutral';
}

function inferStageIndex(milestoneTitle: string) {
  const title = milestoneTitle.toLowerCase();

  if (title.includes('account')) {
    return 0;
  }

  if (title.includes('profile')) {
    return 1;
  }

  if (title.includes('matching')) {
    return 2;
  }

  if (title.includes('interview')) {
    return 3;
  }

  if (title.includes('placement') || title.includes('confirmed')) {
    return 4;
  }

  return 0;
}

function profileProgressPercent(milestones: JourneyMilestone[]) {
  if (milestones.length === 0) {
    return 0;
  }

  const doneCount = milestones.filter((item) => item.status === 'done').length;
  const currentCount = milestones.filter((item) => item.status === 'current').length;
  const weighted = doneCount + currentCount * 0.6;

  return Math.max(0, Math.min(100, Math.round((weighted / milestones.length) * 100)));
}

function getRouteForTarget(target: JourneyActionTarget) {
  if (target === 'profile') {
    return ROUTES.profile;
  }

  if (target === 'matching') {
    return ROUTES.matching;
  }

  if (target === 'appointments') {
    return ROUTES.appointments;
  }

  if (target === 'resources') {
    return ROUTES.resources;
  }

  return ROUTES.dashboard;
}

function getMilestoneMeta(milestone: JourneyMilestone): MilestoneMeta {
  const title = milestone.title.toLowerCase();

  if (title.includes('account')) {
    return {
      advisorNote: 'Account setup is validated. Continue with profile completion to unlock matching.',
      documents: ['Identity details confirmed'],
      actions: [{ label: 'Review profile', target: 'profile' }],
    };
  }

  if (title.includes('profile')) {
    return {
      advisorNote: 'Your advisor reviewed profile quality and requested final detail refinement.',
      documents: ['Profile form submitted', 'Resume metadata synced'],
      actions: [
        { label: 'View feedback', target: 'profile' },
        { label: 'Improve profile', target: 'profile' },
      ],
    };
  }

  if (title.includes('matching')) {
    return {
      advisorNote: 'Company matching is ongoing. Better preferences improve match precision.',
      documents: ['Availability form completed', 'Industry preferences submitted'],
      actions: [
        { label: 'Update preferences', target: 'profile' },
        { label: 'View matches', target: 'matching' },
      ],
    };
  }

  if (title.includes('interview')) {
    return {
      advisorNote: 'Interview stage is close. Prepare concise examples and documents.',
      documents: ['Interview preparation checklist', 'Language certificate', 'Updated resume'],
      actions: [
        { label: 'View matches', target: 'matching' },
        { label: 'Prepare documents', target: 'resources' },
        { label: 'Book preparation call', target: 'appointments' },
      ],
    };
  }

  return {
    advisorNote: 'Placement stage guidance is available in your dashboard and advisor updates.',
    documents: ['Placement confirmation pack'],
    actions: [
      { label: 'Open dashboard', target: 'dashboard' },
      { label: 'Review resources', target: 'resources' },
    ],
  };
}

function relatedAppointmentsForMilestone(milestone: JourneyMilestone, appointments: Appointment[]) {
  const title = milestone.title.toLowerCase();

  if (title.includes('interview')) {
    return appointments
      .filter((item) => item.type === 'interview' && item.status === 'scheduled')
      .slice(0, 2);
  }

  if (title.includes('matching') || title.includes('profile')) {
    return appointments
      .filter((item) => item.type !== 'interview' && item.status === 'scheduled')
      .slice(0, 2);
  }

  return appointments.filter((item) => item.status === 'scheduled').slice(0, 2);
}

export function JourneyPage() {
  const navigate = useNavigate();

  const [milestones, setMilestones] = useState<JourneyMilestone[] | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);
  const [recentlyCompletedIds, setRecentlyCompletedIds] = useState<string[]>([]);

  const completionTimerRef = useRef<number | null>(null);
  const previousStatusRef = useRef<Record<string, JourneyMilestone['status']> | null>(null);

  const loadJourney = useCallback(async () => {
    setIsLoading(true);

    try {
      const [journeyData, appointmentData] = await Promise.all([
        journeyApi.listMilestones(),
        appointmentsApi.listAppointments({ page: 1, pageSize: 30 }),
      ]);

      const orderedMilestones = [...journeyData.milestones].sort(
        (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime()
      );

      setMilestones(orderedMilestones);
      setAppointments(appointmentData.items);

      const defaultExpanded =
        orderedMilestones.find((item) => item.status === 'current')?.id ??
        orderedMilestones.find((item) => item.status === 'upcoming')?.id ??
        orderedMilestones[orderedMilestones.length - 1]?.id ??
        null;

      setExpandedMilestoneId((current) => current ?? defaultExpanded);

      if (previousStatusRef.current) {
        const newlyCompleted = orderedMilestones
          .filter((item) => item.status === 'done' && previousStatusRef.current?.[item.id] !== 'done')
          .map((item) => item.id);

        if (newlyCompleted.length > 0) {
          setRecentlyCompletedIds(newlyCompleted);

          if (completionTimerRef.current) {
            window.clearTimeout(completionTimerRef.current);
          }

          completionTimerRef.current = window.setTimeout(() => {
            setRecentlyCompletedIds([]);
          }, 2800);
        }
      }

      previousStatusRef.current = Object.fromEntries(orderedMilestones.map((item) => [item.id, item.status]));
    } catch {
      setMilestones(null);
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJourney();
  }, [loadJourney]);

  useEffect(() => {
    return () => {
      if (completionTimerRef.current) {
        window.clearTimeout(completionTimerRef.current);
      }
    };
  }, []);

  const currentMilestone = useMemo(() => {
    if (!milestones || milestones.length === 0) {
      return null;
    }

    return (
      milestones.find((item) => item.status === 'current') ??
      milestones.find((item) => item.status === 'upcoming') ??
      milestones[milestones.length - 1]
    );
  }, [milestones]);

  const nextMilestone = useMemo(() => {
    if (!milestones || milestones.length === 0) {
      return null;
    }

    return milestones.find((item) => item.status === 'upcoming') ?? null;
  }, [milestones]);

  const stageIndex = useMemo(() => {
    if (!currentMilestone) {
      return 0;
    }

    return inferStageIndex(currentMilestone.title);
  }, [currentMilestone]);

  const stageNumber = stageIndex + 1;

  const progressPercent = useMemo(() => {
    if (!milestones) {
      return 0;
    }

    return profileProgressPercent(milestones);
  }, [milestones]);

  const summaryAction = useMemo(() => {
    if (stageIndex <= 1) {
      return {
        label: 'Improve profile',
        target: 'profile' as JourneyActionTarget,
      };
    }

    if (stageIndex === 2) {
      return {
        label: 'Prepare for interviews',
        target: 'appointments' as JourneyActionTarget,
      };
    }

    if (stageIndex === 3) {
      return {
        label: 'Book preparation call',
        target: 'appointments' as JourneyActionTarget,
      };
    }

    return {
      label: 'Open dashboard',
      target: 'dashboard' as JourneyActionTarget,
    };
  }, [stageIndex]);

  const currentMeta = useMemo(() => {
    if (!currentMilestone) {
      return null;
    }

    return getMilestoneMeta(currentMilestone);
  }, [currentMilestone]);

  const nextStepChecklist = useMemo(() => {
    if (!currentMilestone || !currentMeta) {
      return [];
    }

    const actionLabels = currentMeta.actions.slice(0, 2).map((item) => item.label);
    const docLabels = currentMeta.documents.slice(0, 2);

    return [...docLabels, ...actionLabels].slice(0, 4);
  }, [currentMeta, currentMilestone]);

  const handleAction = useCallback(
    (target: JourneyActionTarget) => {
      navigate(getRouteForTarget(target));
    },
    [navigate]
  );

  const handleSummaryAction = useCallback(() => {
    handleAction(summaryAction.target);
    toast.success('Next journey action opened.');
  }, [handleAction, summaryAction.target]);

  return (
    <div>
      <PageHeader title="Journey" subtitle="Track where you stand, what comes next, and the actions that keep momentum." />

      <div className="space-y-4 pb-24 sm:pb-0">
        <Card className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-600">Placement progress</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Stage {stageNumber} of {stagePipeline.length}</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {currentMilestone ? currentMilestone.title : 'Waiting for journey milestones'}
              </p>
            </div>

            <div className="w-full sm:w-auto sm:min-w-[240px]">
              <Button className="w-full sm:w-auto" type="button" onClick={handleSummaryAction}>
                {summaryAction.label}
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">
                <span>{progressPercent}% complete</span>
                <span>{nextMilestone ? `Next: ${formatDate(nextMilestone.date)}` : 'Final stage in view'}</span>
              </div>
              <ProgressBar value={progressPercent} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">Next milestone</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {nextMilestone ? nextMilestone.title : 'Placement confirmation'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {nextMilestone ? formatDate(nextMilestone.date) : 'Stay ready for advisor updates.'}
              </p>
            </div>
          </div>

          <div className="mt-5 hidden sm:block">
            <div className="relative">
              <span className="absolute left-0 right-0 top-4 h-px bg-slate-300 dark:bg-slate-700" aria-hidden />
              <ol className="relative grid grid-cols-5 gap-2">
                {stagePipeline.map((stage, index) => {
                  const isDone = index < stageIndex;
                  const isCurrent = index === stageIndex;

                  return (
                    <li key={stage} className="text-center">
                      <span
                        className={cn(
                          'mx-auto grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-semibold',
                          isDone
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : isCurrent
                              ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/20 dark:text-brand-100'
                              : 'border-slate-300 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400'
                        )}
                      >
                        {isDone ? (
                          <span className="h-2.5 w-1.5 -translate-y-[1px] rotate-45 border-b-2 border-r-2 border-current" aria-hidden />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <p className={cn('mt-2 text-xs font-semibold uppercase tracking-[0.08em]', isCurrent ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400')}>
                        {stage}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="p-4 sm:p-5">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
              </div>
            ) : null}

            {!isLoading && milestones && milestones.length === 0 ? (
              <EmptyState
                title="No milestones yet"
                description="Milestones appear as soon as your agency configures your journey stages."
              />
            ) : null}

            {!isLoading && milestones && milestones.length > 0 ? (
              <ol className="space-y-5">
                {milestones.map((milestone, index) => {
                  const isExpanded = expandedMilestoneId === milestone.id;
                  const isDone = milestone.status === 'done';
                  const isCurrent = milestone.status === 'current';
                  const milestoneMeta = getMilestoneMeta(milestone);
                  const relatedAppointments = relatedAppointmentsForMilestone(milestone, appointments);
                  const isRecentlyCompleted = recentlyCompletedIds.includes(milestone.id);

                  return (
                    <li key={milestone.id} className="relative pl-10">
                      {index < milestones.length - 1 ? (
                        <span
                          className={cn(
                            'absolute left-[14px] top-8 h-[calc(100%-0.5rem)] w-[2px]',
                            isDone
                              ? 'bg-emerald-400/90 dark:bg-emerald-500/70'
                              : isCurrent
                                ? 'bg-gradient-to-b from-brand-500 to-slate-300 dark:to-slate-700'
                                : 'bg-slate-300 dark:bg-slate-700'
                          )}
                          aria-hidden
                        />
                      ) : null}

                      <span
                        className={cn(
                          'absolute left-0 top-1 grid h-7 w-7 place-items-center rounded-full border-2',
                          isDone
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : isCurrent
                              ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/20 dark:text-brand-100'
                              : 'border-slate-300 bg-white text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400'
                        )}
                        aria-hidden
                      >
                        {isDone ? <span className="h-2.5 w-1.5 -translate-y-[1px] rotate-45 border-b-2 border-r-2 border-current" /> : index + 1}
                      </span>

                      <article
                        className={cn(
                          'rounded-xl border bg-white/95 p-4 transition-all dark:bg-slate-900/75',
                          isDone
                            ? 'border-emerald-200/90 opacity-95 dark:border-emerald-500/40'
                            : isCurrent
                              ? 'border-brand-300 border-l-4 shadow-sm dark:border-brand-400/70'
                              : 'border-slate-200 dark:border-slate-700',
                          isRecentlyCompleted ? 'ring-2 ring-emerald-300 dark:ring-emerald-500/50 animate-pulse' : ''
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{milestone.title}</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatDate(milestone.date)}</p>
                          </div>
                          <Badge variant={milestoneVariant(milestone.status)}>{milestoneStatusLabel[milestone.status]}</Badge>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{milestone.description}</p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {milestoneMeta.actions.map((action) => (
                            <Button
                              key={`${milestone.id}-${action.label}`}
                              type="button"
                              size="sm"
                              variant={isCurrent ? 'outline' : 'ghost'}
                              onClick={() => handleAction(action.target)}
                            >
                              {action.label}
                            </Button>
                          ))}

                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setExpandedMilestoneId((current) => (current === milestone.id ? null : milestone.id));
                            }}
                          >
                            {isExpanded ? 'Hide details' : 'View details'}
                          </Button>
                        </div>

                        {isExpanded ? (
                          <div className="mt-3 space-y-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">What happened</p>
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{milestone.description}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">Advisor notes</p>
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{milestoneMeta.advisorNote}</p>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">Documents</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {milestoneMeta.documents.map((document) => (
                                  <span
                                    key={`${milestone.id}-${document}`}
                                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  >
                                    {document}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300">Related appointments</p>
                              {relatedAppointments.length === 0 ? (
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">No related appointments yet.</p>
                              ) : (
                                <div className="mt-2 space-y-2">
                                  {relatedAppointments.map((appointment) => (
                                    <div
                                      key={`${milestone.id}-${appointment.id}`}
                                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800/75"
                                    >
                                      <p className="font-semibold text-slate-900 dark:text-slate-100">{appointment.title}</p>
                                      <p className="text-xs text-slate-600 dark:text-slate-300">{formatDateTime(appointment.date)}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </article>
                    </li>
                  );
                })}
              </ol>
            ) : null}

            {!isLoading && !milestones ? (
              <EmptyState
                title="Unable to load journey"
                description="Please retry in a few seconds."
                actionLabel="Retry"
                onAction={() => {
                  void loadJourney();
                }}
              />
            ) : null}
          </Card>

          <aside className="hidden xl:block">
            <Card className="p-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">What you need to do</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Focus on the next actions to keep placement momentum and avoid delays.
              </p>

              {nextStepChecklist.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {nextStepChecklist.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800/75 dark:text-slate-200"
                    >
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-500 dark:bg-brand-400" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Select a current stage to see your next tasks.</p>
              )}

              <Button
                className="mt-4 w-full"
                type="button"
                onClick={handleSummaryAction}
              >
                {summaryAction.label}
              </Button>
            </Card>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 py-3 shadow-lg backdrop-blur sm:hidden dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto w-full max-w-[720px]">
          <Button className="w-full" type="button" onClick={handleSummaryAction}>
            {summaryAction.label}
          </Button>
        </div>
      </div>
    </div>
  );
}

