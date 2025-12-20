'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type React from 'react';
import { PageSizeSelector } from '@/components/atoms';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Current page size (optional - shows page size selector if provided) */
  pageSize?: number;
  /** Callback when page size changes (required if pageSize is provided) */
  onPageSizeChange?: (size: number) => void;
  /** Whether pagination is loading */
  isLoading?: boolean;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * Pagination provides navigation controls for paginated content.
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => setPage(page)}
 * />
 * ```
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  isLoading = false,
  disabled = false,
  className,
}: PaginationProps): React.JSX.Element {
  const isDisabled = disabled || isLoading;
  const showPageSizeSelector = pageSize !== undefined && onPageSizeChange !== undefined;
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handleFirst = () => {
    if (canGoPrevious && !isDisabled) {
      onPageChange(1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious && !isDisabled) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext && !isDisabled) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLast = () => {
    if (canGoNext && !isDisabled) {
      onPageChange(totalPages);
    }
  };

  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return <div data-testid="pagination" className="hidden" />;
  }

  return (
    <nav
      className={cn(
        'flex items-center gap-2',
        showPageSizeSelector ? 'justify-between' : 'justify-center',
        className,
      )}
      aria-label="Pagination"
      data-testid="pagination"
    >
      {/* Page size selector (left side) */}
      {showPageSizeSelector && (
        <PageSizeSelector value={pageSize} onChange={onPageSizeChange} disabled={isDisabled} />
      )}

      {/* Navigation controls */}
      <div className="flex items-center gap-2">
        {/* First page button */}
        <button
          type="button"
          onClick={handleFirst}
          disabled={!canGoPrevious || isDisabled}
          className={cn(
            'p-3 min-w-[44px] min-h-[44px] flex items-center justify-center',
            'border-2 border-[var(--pixel-gray-600)]',
            'bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-200)]',
            'transition-all duration-100',
            canGoPrevious && !isDisabled
              ? 'hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] hover:shadow-[0_0_8px_var(--glow-blue-text)]'
              : 'opacity-50 cursor-not-allowed',
          )}
          aria-label="Go to first page"
          data-testid="pagination-first"
        >
          <ChevronsLeft size={18} aria-hidden="true" />
        </button>

        {/* Previous page button */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={!canGoPrevious || isDisabled}
          className={cn(
            'p-3 min-w-[44px] min-h-[44px] flex items-center justify-center',
            'border-2 border-[var(--pixel-gray-600)]',
            'bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-200)]',
            'transition-all duration-100',
            canGoPrevious && !isDisabled
              ? 'hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] hover:shadow-[0_0_8px_var(--glow-blue-text)]'
              : 'opacity-50 cursor-not-allowed',
          )}
          aria-label="Go to previous page"
          data-testid="pagination-previous"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        {/* Page indicator */}
        <div
          className={cn(
            'px-4 py-2 min-h-[44px] flex items-center',
            'border-2 border-[var(--pixel-gray-600)]',
            'bg-[var(--pixel-gray-dark)]',
            'font-[family-name:var(--font-pixel-body)] text-xs',
            'text-[var(--pixel-gray-200)]',
            isLoading && 'opacity-50',
          )}
          data-testid="pagination-info"
        >
          <span className="text-[var(--pixel-blue-text)]">{currentPage}</span>
          <span className="text-[var(--pixel-gray-500)]"> / </span>
          <span>{totalPages}</span>
        </div>

        {/* Next page button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext || isDisabled}
          className={cn(
            'p-3 min-w-[44px] min-h-[44px] flex items-center justify-center',
            'border-2 border-[var(--pixel-gray-600)]',
            'bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-200)]',
            'transition-all duration-100',
            canGoNext && !isDisabled
              ? 'hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] hover:shadow-[0_0_8px_var(--glow-blue-text)]'
              : 'opacity-50 cursor-not-allowed',
          )}
          aria-label="Go to next page"
          data-testid="pagination-next"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>

        {/* Last page button */}
        <button
          type="button"
          onClick={handleLast}
          disabled={!canGoNext || isDisabled}
          className={cn(
            'p-3 min-w-[44px] min-h-[44px] flex items-center justify-center',
            'border-2 border-[var(--pixel-gray-600)]',
            'bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-200)]',
            'transition-all duration-100',
            canGoNext && !isDisabled
              ? 'hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] hover:shadow-[0_0_8px_var(--glow-blue-text)]'
              : 'opacity-50 cursor-not-allowed',
          )}
          aria-label="Go to last page"
          data-testid="pagination-last"
        >
          <ChevronsRight size={18} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
