import type { ReactNode } from 'react';

import { adminTheme } from '@/app/layouts/admin-theme';
import { cn } from '@/lib/utils';

interface AdminTableColumn<T> {
  key: string;
  label: string;
  className?: string;
  headerClassName?: string;
  render: (row: T) => ReactNode;
}

interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyState: ReactNode;
  isLoading?: boolean;
}

export function AdminTable<T>({ columns, rows, getRowKey, emptyState, isLoading = false }: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className={adminTheme.tableCard} aria-live="polite">
        <div className="space-y-3 p-4">
          <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return <div className={cn(adminTheme.tableCard, 'p-8')}>{emptyState}</div>;
  }

  return (
    <div className={adminTheme.tableCard}>
      <div className="overflow-x-auto">
        <table className={adminTheme.table}>
          <thead className={adminTheme.tableHead}>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className={cn(adminTheme.tableHeaderCell, column.headerClassName)}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row) => (
              <tr key={getRowKey(row)} className={adminTheme.tableRow}>
                {columns.map((column) => (
                  <td key={column.key} className={cn(adminTheme.tableCell, column.className)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
