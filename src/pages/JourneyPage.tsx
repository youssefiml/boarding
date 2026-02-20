import { useCallback, useEffect, useMemo, useState } from 'react';

import { journeyApi } from '@/api/modules/journey.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { Badge } from '@/ui/Badge/Badge';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { formatDate } from '@/lib/date';
import type { JourneyMilestone } from '@/types/domain';

function milestoneVariant(status: JourneyMilestone['status']): 'success' | 'brand' | 'neutral' {
  if (status === 'done') {
    return 'success';
  }

  if (status === 'current') {
    return 'brand';
  }

  return 'neutral';
}

const milestoneStatusLabel: Record<JourneyMilestone['status'], string> = {
  done: 'Done',
  current: 'Current',
  upcoming: 'Upcoming',
};

export function JourneyPage() {
  const [milestones, setMilestones] = useState<JourneyMilestone[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadJourney = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await journeyApi.listMilestones();
      setMilestones(response.milestones);
    } catch {
      setMilestones(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJourney();
  }, [loadJourney]);

  const sortedMilestones = useMemo(() => {
    if (!milestones) {
      return null;
    }

    return [...milestones].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
  }, [milestones]);

  return (
    <div>
      <PageHeader title="Journey" subtitle="Visual timeline of your onboarding and placement milestones." />

      <Card>
        {isLoading ? <p className="text-sm text-slate-500 dark:text-slate-300">Loading journey...</p> : null}

        {!isLoading && sortedMilestones && sortedMilestones.length === 0 ? (
          <EmptyState
            title="No milestones yet"
            description="Milestones appear as soon as the agency schedules your journey steps."
          />
        ) : null}

        {!isLoading && sortedMilestones && sortedMilestones.length > 0 ? (
          <ol className="relative ml-2 border-l border-slate-200 pl-6 dark:border-slate-700">
            {sortedMilestones.map((milestone) => (
              <li key={milestone.id} className="mb-8 last:mb-0">
                <span className="absolute -left-[9px] mt-2 h-4 w-4 rounded-full border-2 border-white bg-brand-500 dark:border-slate-900" />
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/65">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{milestone.title}</h3>
                    <Badge variant={milestoneVariant(milestone.status)}>{milestoneStatusLabel[milestone.status]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatDate(milestone.date)}</p>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{milestone.description}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        {!isLoading && !sortedMilestones ? (
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
    </div>
  );
}


