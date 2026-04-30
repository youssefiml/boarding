import { Button } from '@/ui/Button/Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-5 flex flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-end">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full md:w-auto"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-center text-sm text-slate-600">
        Page {page} of {totalPages}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full md:w-auto"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
