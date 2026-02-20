import { useCallback, useEffect, useState } from 'react';

import { matchingApi } from '@/api/modules/matching.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { Badge } from '@/ui/Badge/Badge';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { Input } from '@/ui/Input/Input';
import { Pagination } from '@/ui/Pagination/Pagination';
import { Select } from '@/ui/Select/Select';
import { Skeleton } from '@/ui/Skeleton/Skeleton';
import type { MatchesResponse } from '@/types/api';

function scoreBadgeVariant(score: number): 'success' | 'warning' | 'neutral' {
  if (score >= 85) {
    return 'success';
  }

  if (score >= 65) {
    return 'warning';
  }

  return 'neutral';
}

export function MatchingPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('all');
  const [minScore, setMinScore] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState<MatchesResponse | null>(null);

  const loadMatches = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await matchingApi.listMatches({
        page,
        pageSize: 8,
        search: search.trim() || undefined,
        industry: industry === 'all' ? undefined : industry,
        minScore,
      });

      setResponse(data);
    } catch {
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [industry, minScore, page, search]);

  useEffect(() => {
    void loadMatches();
  }, [loadMatches]);

  return (
    <div>
      <PageHeader
        title="Matching"
        subtitle="Review matched companies, filter opportunities, and prioritize high-fit placements."
      />

      <Card className="mb-5">
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
              const nextValue = Number(event.target.value);
              const safeValue = Number.isNaN(nextValue) ? 0 : Math.max(0, Math.min(100, nextValue));
              setMinScore(safeValue);
              setPage(1);
            }}
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      ) : null}

      {!isLoading && response && response.items.length === 0 ? (
        <EmptyState
          title="No matches for the current filters"
          description="Adjust score or industry filters to reveal more companies."
        />
      ) : null}

      {!isLoading && response && response.items.length > 0 ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {response.items.map((match) => (
              <Card key={match.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="break-words text-lg font-semibold text-slate-900 dark:text-slate-100">{match.companyName}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {match.industry} · {match.location}
                    </p>
                  </div>
                  <Badge variant={scoreBadgeVariant(match.score)}>Score {match.score}</Badge>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">{match.description}</p>
              </Card>
            ))}
          </div>

          <Pagination page={response.page} totalPages={response.totalPages} onPageChange={setPage} />
        </>
      ) : null}

      {!isLoading && !response ? (
        <EmptyState
          title="Unable to load matching data"
          description="Please retry in a few seconds."
          actionLabel="Retry"
          onAction={() => {
            void loadMatches();
          }}
        />
      ) : null}
    </div>
  );
}



