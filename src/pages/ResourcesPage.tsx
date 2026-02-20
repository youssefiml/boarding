import { useCallback, useEffect, useState } from 'react';

import { resourcesApi } from '@/api/modules/resources.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { Badge } from '@/ui/Badge/Badge';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { Pagination } from '@/ui/Pagination/Pagination';
import { Select } from '@/ui/Select/Select';
import type { ResourcesResponse } from '@/types/api';
import type { ResourceCategory } from '@/types/domain';

export function ResourcesPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<'all' | ResourceCategory>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState<ResourcesResponse | null>(null);

  const loadResources = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await resourcesApi.listResources({
        page,
        pageSize: 8,
        category,
      });

      setResponse(data);
    } catch {
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [category, page]);

  useEffect(() => {
    void loadResources();
  }, [loadResources]);

  return (
    <div>
      <PageHeader title="Resources" subtitle="Practical guides for housing, language, and local integration." />

      <Card className="mb-5">
        <Select
          label="Category"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value as 'all' | ResourceCategory);
            setPage(1);
          }}
        >
          <option value="all">All categories</option>
          <option value="housing">Housing</option>
          <option value="language">Language</option>
          <option value="local-life">Local life</option>
          <option value="legal">Legal</option>
          <option value="health">Health</option>
        </Select>
      </Card>

      {isLoading ? <p className="text-sm text-slate-500 dark:text-slate-300">Loading resources...</p> : null}

      {!isLoading && response && response.items.length === 0 ? (
        <EmptyState title="No resources found" description="Try another category to discover useful materials." />
      ) : null}

      {!isLoading && response && response.items.length > 0 ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {response.items.map((resource) => (
              <Card key={resource.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="break-words text-lg font-semibold text-slate-900 dark:text-slate-100">{resource.title}</h3>
                  <Badge variant="brand">{resource.category}</Badge>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-200">{resource.excerpt}</p>
                <a
                  className="text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open resource
                </a>
              </Card>
            ))}
          </div>

          <Pagination page={response.page} totalPages={response.totalPages} onPageChange={setPage} />
        </>
      ) : null}

      {!isLoading && !response ? (
        <EmptyState
          title="Unable to load resources"
          description="Please retry in a few seconds."
          actionLabel="Retry"
          onAction={() => {
            void loadResources();
          }}
        />
      ) : null}
    </div>
  );
}


