'use client';

import { type JSX, useCallback, useState } from 'react';
import { PixelExplorer, RefreshIndicator } from '@/components/atoms';
import { Badge } from '@/components/atoms/badge';
import { Pagination, type SortField, type SortOrder, SortSelector } from '@/components/molecules';
import { cn } from '@/lib/utils';
import { AgentCard, type AgentCardAgent } from '../agent-card';

export interface StreamProgress {
  /** Number of results received so far */
  current: number;
  /** Expected total number of results (null if unknown) */
  expected: number | null;
}

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
  // Streaming support props
  /** Whether results are being streamed */
  isStreaming?: boolean;
  /** Progress of the streaming operation */
  streamProgress?: StreamProgress;
  /** HyDE (Hypothetical Document Embeddings) expanded query */
  hydeQuery?: string | null;
  /** Callback to stop the streaming operation */
  onStopStream?: () => void;
  /** Index of the newest result for animation (optional) */
  newestResultIndex?: number;
}

/**
 * StreamingIndicator displays the live streaming status and progress.
 */
function StreamingIndicator({
  progress,
  onStop,
}: {
  progress?: StreamProgress;
  onStop?: () => void;
}): JSX.Element {
  return (
    <div className="flex items-center gap-3 flex-wrap" data-testid="streaming-indicator">
      <Badge
        variant="default"
        className="animate-pulse bg-[var(--pixel-green-pipe)] border-[var(--pixel-green-pipe)]"
        data-testid="streaming-badge"
      >
        <span className="inline-block animate-bounce mr-1">●</span>
        LIVE
      </Badge>
      <span
        className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-xs uppercase"
        data-testid="streaming-text"
      >
        Streaming results
        <span className="inline-flex w-6">
          <span className="animate-pulse">.</span>
          <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>
            .
          </span>
          <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>
            .
          </span>
        </span>
      </span>
      {progress && progress.expected !== null && (
        <div className="flex items-center gap-2" data-testid="streaming-progress">
          <div className="w-24 h-2 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)] overflow-hidden">
            <div
              className="h-full bg-[var(--pixel-blue-sky)] transition-all duration-300"
              style={{
                width: `${Math.min((progress.current / progress.expected) * 100, 100)}%`,
              }}
            />
          </div>
          <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-mono)] text-xs">
            {progress.current}/{progress.expected}
          </span>
        </div>
      )}
      {onStop && (
        <button
          type="button"
          onClick={onStop}
          className="px-3 py-1 text-xs font-[family-name:var(--font-pixel-body)] uppercase tracking-wider bg-[var(--pixel-red-fire)] text-[var(--pixel-white)] hover:bg-[var(--pixel-red-fire)]/80 transition-colors border-2 border-[var(--pixel-red-fire)]"
          data-testid="streaming-stop-button"
        >
          Stop
        </button>
      )}
    </div>
  );
}

/**
 * HydeQueryDisplay shows the expanded semantic query used for search.
 */
function HydeQueryDisplay({ query }: { query: string }): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="border-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-800)]"
      data-testid="hyde-query-display"
    >
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-[var(--pixel-gray-700)]/30 transition-colors"
        aria-expanded={isExpanded}
        data-testid="hyde-query-toggle"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[var(--pixel-blue-sky)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-xs uppercase">
            AI-Expanded Query
          </span>
        </div>
        <svg
          className={cn(
            'w-4 h-4 text-[var(--pixel-gray-400)] transition-transform duration-200',
            isExpanded && 'rotate-180',
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div
          className="px-4 py-3 border-t border-[var(--pixel-gray-700)] bg-[var(--pixel-black)]"
          data-testid="hyde-query-content"
        >
          <p className="text-[var(--pixel-gray-200)] font-[family-name:var(--font-mono)] text-sm leading-relaxed whitespace-pre-wrap">
            {query}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * SearchResults displays a grid of agent cards with loading and empty states.
 * Supports streaming results with progressive rendering and animations.
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
 *
 * @example Streaming
 * ```tsx
 * <SearchResults
 *   agents={streamingAgents}
 *   isStreaming={true}
 *   streamProgress={{ current: 5, expected: 10 }}
 *   hydeQuery="AI agent for code review..."
 *   onStopStream={() => stopStream()}
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
  // Streaming props
  isStreaming = false,
  streamProgress,
  hydeQuery,
  onStopStream,
  newestResultIndex,
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

  if (isLoading && !isStreaming) {
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

  if (agents.length === 0 && !isStreaming) {
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

  const showPagination = (isCursorBased || isPageBased) && !isStreaming;

  // Determine the state for data-state attribute
  const dataState = isStreaming ? 'streaming' : 'success';

  return (
    <div className={cn('space-y-6', className)} data-testid="search-results" data-state={dataState}>
      {/* HyDE Query Display */}
      {hydeQuery && <HydeQueryDisplay query={hydeQuery} />}

      {/* Header with count, streaming indicator, and sort */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {isStreaming ? (
            <StreamingIndicator progress={streamProgress} onStop={onStopStream} />
          ) : (
            <>
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
            </>
          )}
        </div>
        {onSortChange && !isStreaming && (
          <SortSelector
            sortBy={sortBy}
            order={sortOrder}
            onChange={onSortChange}
            disabled={isLoading}
          />
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="search-results-grid">
        {agents.map((agent, index) => {
          const isNewest = newestResultIndex !== undefined && index === newestResultIndex;
          const isRecentlyAdded = isStreaming && index === agents.length - 1;

          return (
            <div
              key={agent.id}
              className={cn(
                // Base transition for smooth animations
                'motion-safe:transition-all motion-safe:duration-300',
                // Streaming fade-in animation
                isStreaming && 'motion-safe:animate-stream-in',
                // Newest result glow effect
                (isNewest || isRecentlyAdded) && 'motion-safe:animate-newest-glow',
              )}
              style={
                isStreaming
                  ? {
                      // Stagger animation for visual effect
                      animationDelay: `${Math.min(index * 50, 200)}ms`,
                    }
                  : undefined
              }
            >
              <AgentCard
                agent={agent}
                onClick={onAgentClick ? () => handleAgentClick(agent) : undefined}
              />
            </div>
          );
        })}
      </div>

      {/* Streaming: Show skeleton for incoming results */}
      {isStreaming &&
        streamProgress &&
        streamProgress.expected !== null &&
        streamProgress.current < streamProgress.expected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="streaming-skeletons">
            {Array.from({
              length: Math.min(streamProgress.expected - streamProgress.current, 2),
            }).map((_, idx) => (
              <div
                key={`streaming-skeleton-${idx}`}
                className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] border-dashed animate-pulse opacity-50"
                data-testid="streaming-skeleton"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[var(--pixel-gray-700)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--pixel-gray-700)] w-2/3" />
                    <div className="h-3 bg-[var(--pixel-gray-700)] w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
