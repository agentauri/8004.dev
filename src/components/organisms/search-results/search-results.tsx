import { type JSX, useCallback } from 'react';
import { PixelExplorer, RefreshIndicator } from '@/components/atoms';
import { Pagination, type SortField, type SortOrder, SortSelector } from '@/components/molecules';
import { cn } from '@/lib/utils';
import { AgentCard, type AgentCardAgent } from '../agent-card';

export interface SearchResultsProps {
  /** List of agents to display */
  agents: AgentCardAgent[];
  /** Whether results are loading */
  isLoading?: boolean;
  /** Error message if search failed */
  error?: string;
  /** Total number of results (for pagination info) */
  totalCount?: number;
  /** Message to show when no results found */
  emptyMessage?: string;
  /** Callback when an agent card is clicked */
  onAgentClick?: (agent: AgentCardAgent) => void;
  /**
   * @deprecated Use pageNumber instead for cursor-based pagination
   * Current page number (1-indexed)
   */
  currentPage?: number;
  /**
   * @deprecated Total pages is not available with cursor-based pagination
   * Total number of pages
   */
  totalPages?: number;
  /**
   * @deprecated Use onNext/onPrevious for cursor-based pagination
   * Callback when page changes
   */
  onPageChange?: (page: number) => void;
  /** Current page number for cursor-based pagination */
  pageNumber?: number;
  /** Whether there are more results available */
  hasMore?: boolean;
  /** Callback when next page is requested */
  onNext?: () => void;
  /** Callback when previous page is requested */
  onPrevious?: () => void;
  /** Current page size */
  pageSize?: number;
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void;
  /** Current sort field */
  sortBy?: SortField;
  /** Current sort order */
  sortOrder?: SortOrder;
  /** Callback when sort changes */
  onSortChange?: (sortBy: SortField, order: SortOrder) => void;
  /** Whether data is currently refreshing */
  isRefreshing?: boolean;
  /** Timestamp of last data update */
  lastUpdated?: Date;
  /** Callback to manually refresh data */
  onManualRefresh?: () => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * SearchResults displays a grid of agent cards with loading and empty states.
 *
 * @example
 * ```tsx
 * <SearchResults
 *   agents={agents}
 *   isLoading={isLoading}
 *   error={error}
 *   totalCount={100}
 * />
 * ```
 */
export function SearchResults({
  agents,
  isLoading = false,
  error,
  totalCount,
  emptyMessage = 'No agents found matching your search.',
  onAgentClick,
  currentPage,
  totalPages,
  onPageChange,
  pageNumber,
  hasMore,
  onNext,
  onPrevious,
  pageSize,
  onPageSizeChange,
  sortBy = 'relevance',
  sortOrder = 'desc',
  onSortChange,
  isRefreshing,
  lastUpdated,
  onManualRefresh,
  className,
}: SearchResultsProps): JSX.Element {
  // Memoize the click handler to prevent re-renders of AgentCard
  const handleAgentClick = useCallback(
    (agent: AgentCardAgent) => {
      onAgentClick?.(agent);
    },
    [onAgentClick],
  );

  if (error) {
    return (
      <div
        className={cn('text-center py-16', className)}
        data-testid="search-results"
        data-state="error"
      >
        <div className="flex justify-center mb-6">
          <PixelExplorer size="lg" animation="float" />
        </div>
        <p className="text-[var(--pixel-destructive)] font-[family-name:var(--font-pixel-body)] text-sm mb-4">
          {error}
        </p>
        {onManualRefresh && (
          <button
            type="button"
            onClick={onManualRefresh}
            className="px-4 py-2 text-xs font-[family-name:var(--font-pixel-body)] uppercase tracking-wider bg-[var(--pixel-blue-sky)] text-[var(--pixel-black)] hover:bg-[var(--pixel-blue-sky)]/80 transition-colors"
            data-testid="search-retry-button"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)} data-testid="search-results" data-state="loading">
        <div className="flex justify-center">
          <PixelExplorer size="lg" animation="search" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4'].map((id) => (
            <div
              key={id}
              className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] animate-pulse"
              data-testid="search-result-skeleton"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--pixel-gray-700)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--pixel-gray-700)] w-2/3" />
                  <div className="h-3 bg-[var(--pixel-gray-700)] w-1/3" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-[var(--pixel-gray-700)] w-full" />
                <div className="h-3 bg-[var(--pixel-gray-700)] w-4/5" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-5 bg-[var(--pixel-gray-700)] w-16" />
                <div className="h-5 bg-[var(--pixel-gray-700)] w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div
        className={cn('text-center py-16', className)}
        data-testid="search-results"
        data-state="empty"
      >
        <div className="flex justify-center mb-6">
          <PixelExplorer size="lg" animation="float" />
        </div>
        <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }

  // Determine pagination mode: cursor-based (preferred) or page-based (legacy)
  const isCursorBased =
    pageNumber !== undefined && onNext !== undefined && onPrevious !== undefined;
  const isPageBased =
    currentPage !== undefined &&
    totalPages !== undefined &&
    totalPages > 1 &&
    onPageChange !== undefined;

  const showPagination = isCursorBased || isPageBased;

  return (
    <div className={cn('space-y-6', className)} data-testid="search-results" data-state="success">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {totalCount !== undefined && (
            <p
              className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-xs uppercase"
              data-testid="search-results-count"
            >
              {totalCount} agent{totalCount !== 1 ? 's' : ''} found
            </p>
          )}
          {onManualRefresh && (
            <RefreshIndicator
              isRefreshing={isRefreshing ?? false}
              lastUpdated={lastUpdated}
              onManualRefresh={onManualRefresh}
            />
          )}
        </div>
        {onSortChange && (
          <SortSelector
            sortBy={sortBy}
            order={sortOrder}
            onChange={onSortChange}
            disabled={isLoading}
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="search-results-grid">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onClick={onAgentClick ? () => handleAgentClick(agent) : undefined}
          />
        ))}
      </div>
      {showPagination && (
        <div className="pt-4" data-testid="search-results-pagination">
          {isCursorBased ? (
            <Pagination
              pageNumber={pageNumber}
              hasMore={hasMore ?? false}
              hasPrevious={pageNumber > 1}
              onNext={onNext}
              onPrevious={onPrevious}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
              isLoading={isLoading}
            />
          ) : (
            <Pagination
              currentPage={currentPage!}
              totalPages={totalPages!}
              onPageChange={onPageChange!}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
              isLoading={isLoading}
            />
          )}
        </div>
      )}
    </div>
  );
}
