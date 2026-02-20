import '@/styles/ui/Pagination/Pagination.css';
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
    <div className="pagination">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="pagination__button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="pagination__counter">
        Page {page} of {totalPages}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="pagination__button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}