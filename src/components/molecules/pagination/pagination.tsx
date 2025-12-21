'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type React from 'react';
import { PageSizeSelector } from '@/components/atoms';
import { cn } from '@/lib/utils';

/**
 * Cursor-based pagination props (preferred)
 */
export interface CursorPaginationProps {
  /** Current page number (for display only) */
  pageNumber: number;
  /** Whether there are more results available */
  hasMore: boolean;
  /** Whether there are previous results (pageNumber > 1) */
  hasPrevious: boolean;
  /** Callback when next page is requested */
  onNext: () => void;
  /** Callback when previous page is requested */
  onPrevious: () => void;
  /** @deprecated Use cursor-based props instead */
  currentPage?: never;
  /** @deprecated Use cursor-based props instead */
  totalPages?: never;
  /** @deprecated Use cursor-based props instead */
  onPageChange?: never;
}

/**
 * @deprecated Page-based pagination props - use cursor-based instead
 */
export interface PagePaginationProps {
  /** @deprecated Use pageNumber instead */
  currentPage: number;
  /** @deprecated Total pages is not available with cursor pagination */
  totalPages: number;
  /** @deprecated Use onNext/onPrevious instead */
  onPageChange: (page: number) => void;
  /** Not used with page-based pagination */
  pageNumber?: never;
  /** Not used with page-based pagination */
  hasMore?: never;
  /** Not used with page-based pagination */
  hasPrevious?: never;
  /** Not used with page-based pagination */
  onNext?: never;
  /** Not used with page-based pagination */
  onPrevious?: never;
}

export interface BasePaginationProps {
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

export type PaginationProps = BasePaginationProps & (CursorPaginationProps | PagePaginationProps);

/**
 * Pagination provides navigation controls for paginated content.
 * Supports both cursor-based (preferred) and page-based (legacy) pagination.
 *
 * @example Cursor-based (preferred)
 * ```tsx
 * <Pagination
 *   pageNumber={2}
 *   hasMore={true}
 *   hasPrevious={true}
 *   onNext={() => loadNextPage()}
 *   onPrevious={() => loadPreviousPage()}
 * />
 * ```
 *
 * @example Page-based (legacy)
 * ```tsx
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => setPage(page)}
 * />
 * ```
 */
export function Pagination(props: PaginationProps): React.JSX.Element {
  const { pageSize, onPageSizeChange, isLoading = false, disabled = false, className } = props;

  // Determine if using cursor-based or page-based pagination
  const isCursorBased = 'pageNumber' in props && props.pageNumber !== undefined;

  // Extract values based on pagination type
  const pageNumber = isCursorBased ? props.pageNumber : (props.currentPage ?? 1);
  const totalPages = isCursorBased ? undefined : props.totalPages;
  const hasMore = isCursorBased
    ? props.hasMore
    : (props.currentPage ?? 1) < (props.totalPages ?? 1);
  const hasPrevious = isCursorBased ? props.hasPrevious : (props.currentPage ?? 1) > 1;

  const isDisabled = disabled || isLoading;
  const showPageSizeSelector = pageSize !== undefined && onPageSizeChange !== undefined;

  const handleFirst = () => {
    if (!isDisabled && !isCursorBased && props.onPageChange && hasPrevious) {
      props.onPageChange(1);
    }
  };

  const handlePrevious = () => {
    if (!isDisabled && hasPrevious) {
      if (isCursorBased) {
        props.onPrevious();
      } else if (props.onPageChange) {
        props.onPageChange((props.currentPage ?? 1) - 1);
      }
    }
  };

  const handleNext = () => {
    if (!isDisabled && hasMore) {
      if (isCursorBased) {
        props.onNext();
      } else if (props.onPageChange) {
        props.onPageChange((props.currentPage ?? 1) + 1);
      }
    }
  };

  const handleLast = () => {
    if (!isDisabled && !isCursorBased && props.onPageChange && props.totalPages && hasMore) {
      props.onPageChange(props.totalPages);
    }
  };

  // Don't render if cursor-based with no more pages and on page 1
  // Or if page-based with only one page
  if (isCursorBased) {
    if (pageNumber === 1 && !hasMore) {
      return <div data-testid="pagination" className="hidden" />;
    }
  } else if (totalPages !== undefined && totalPages <= 1) {
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
        {/* First page button - only for page-based pagination */}
        {!isCursorBased && (
          <button
            type="button"
            onClick={handleFirst}
            disabled={!hasPrevious || isDisabled}
            className={cn(
              'p-3 min-w-[44px] min-h-[44px] flex items-center justify-center',
              'border-2 border-[var(--pixel-gray-600)]',
              'bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-200)]',
              'transition-all duration-100',
              hasPrevious && !isDisabled
                ? 'hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] hover:shadow-[0_0_8px_var(--glow-blue-text)]'
                : 'opacity-50 cursor-not-allowed',
            )}
            aria-label="Go to first page"
            data-testid="pagination-first"
          >
            <ChevronsLeft size={18} aria-hidden="true" />
          </button>
        )}

        {/* Previous page button */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={!hasPrevious || isDisabled}
          className={cn(
            'p-3 min-w-[44px] min-h-[44px] flex items-center justify-center',
            'border-2 border-[var(--pixel-gray-600)]',
            'bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-200)]',
            'transition-all duration-100',
            hasPrevious && !isDisabled
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
          {isCursorBased ? (
            // Cursor-based: show just page number
            <>
              <span className="text-[var(--pixel-gray-500)]">Page </span>
              <span className="text-[var(--pixel-blue-text)]">{pageNumber}</span>
            </>
          ) : (
            // Page-based: show X / Y format
            <>
              <span className="text-[var(--pixel-blue-text)]">{pageNumber}</span>
              <span className="text-[var(--pixel-gray-500)]"> / </span>
              <span>{totalPages}</span>
            </>
          )}
        </div>

        {/* Next page button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!hasMore || isDisabled}
          className={cn(
            'p-3 min-w-[44px] min-h-[44px] flex items-center justify-center',
            'border-2 border-[var(--pixel-gray-600)]',
            'bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-200)]',
            'transition-all duration-100',
            hasMore && !isDisabled
              ? 'hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] hover:shadow-[0_0_8px_var(--glow-blue-text)]'
              : 'opacity-50 cursor-not-allowed',
          )}
          aria-label="Go to next page"
          data-testid="pagination-next"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>

        {/* Last page button - only for page-based pagination */}
        {!isCursorBased && (
          <button
            type="button"
            onClick={handleLast}
            disabled={!hasMore || isDisabled}
            className={cn(
              'p-3 min-w-[44px] min-h-[44px] flex items-center justify-center',
              'border-2 border-[var(--pixel-gray-600)]',
              'bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-200)]',
              'transition-all duration-100',
              hasMore && !isDisabled
                ? 'hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] hover:shadow-[0_0_8px_var(--glow-blue-text)]'
                : 'opacity-50 cursor-not-allowed',
            )}
            aria-label="Go to last page"
            data-testid="pagination-last"
          >
            <ChevronsRight size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </nav>
  );
}
