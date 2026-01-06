'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type React from 'react';
import {
  CompareBar,
  type CompareBarAgent,
  type SortField,
  type SortOrder,
} from '@/components/molecules';
import { Header, SearchBar, type SearchFiltersState } from '@/components/organisms';
import type { AgentCardAgent } from '@/components/organisms/agent-card';
import { MobileFilterSheet } from '@/components/organisms/mobile-filter-sheet';
import type { StreamProgress } from '@/components/organisms/search-results';
import { cn } from '@/lib/utils';
import { FiltersSkeleton } from './filters-skeleton';
import { ResultsSkeleton } from './results-skeleton';

// Lazy load heavy components to reduce initial bundle size
const SearchFilters = dynamic(
  () => import('@/components/organisms/search-filters').then((mod) => mod.SearchFilters),
  { ssr: false, loading: () => <FiltersSkeleton /> },
);

const SearchResults = dynamic(
  () => import('@/components/organisms/search-results').then((mod) => mod.SearchResults),
  { ssr: false, loading: () => <ResultsSkeleton /> },
);

export interface ExploreTemplateProps {
  /** Current search query */
  query: string;
  /** Callback when query changes */
  onQueryChange: (query: string) => void;
  /** Callback when search is submitted */
  onSearch: (query: string) => void;
  /** Current filter state */
  filters: SearchFiltersState;
  /** Callback when filters change */
  onFiltersChange: (filters: SearchFiltersState) => void;
  /** Search results */
  agents: AgentCardAgent[];
  /** Total count of results */
  totalCount?: number;
  /** Whether search is loading */
  isLoading?: boolean;
  /** Error message if search failed */
  error?: string;
  /** Filter counts */
  filterCounts?: {
    active?: number;
    inactive?: number;
    mcp?: number;
    a2a?: number;
    x402?: number;
  };
  /** Callback when an agent is clicked */
  onAgentClick?: (agent: AgentCardAgent) => void;
  /**
   * @deprecated Use pageNumber for cursor-based pagination
   * Current page number (1-indexed)
   */
  currentPage?: number;
  /**
   * @deprecated Total pages not available with cursor-based pagination
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
  /** Whether to show the compose team button */
  showComposeButton?: boolean;
  // Agent comparison props
  /** Agents selected for comparison */
  compareAgents?: CompareBarAgent[];
  /** URL for the compare page */
  compareUrl?: string;
  /** Callback when an agent is removed from comparison */
  onRemoveCompareAgent?: (agentId: string) => void;
  /** Callback to clear all compared agents */
  onClearCompareAgents?: () => void;
}

/**
 * ExploreTemplate provides the layout for the agent exploration page.
 *
 * @example
 * ```tsx
 * <ExploreTemplate
 *   query={query}
 *   onQueryChange={setQuery}
 *   onSearch={handleSearch}
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   agents={agents}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function ExploreTemplate({
  query,
  onQueryChange,
  onSearch,
  filters,
  onFiltersChange,
  agents,
  totalCount,
  isLoading = false,
  error,
  filterCounts,
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
  sortBy,
  sortOrder,
  onSortChange,
  isRefreshing,
  lastUpdated,
  onManualRefresh,
  className,
  // Streaming props
  isStreaming,
  streamProgress,
  hydeQuery,
  onStopStream,
  showComposeButton = false,
  // Compare props
  compareAgents,
  compareUrl,
  onRemoveCompareAgent,
  onClearCompareAgents,
}: ExploreTemplateProps): React.JSX.Element {
  return (
    <div className={cn('flex flex-col h-screen', className)} data-testid="explore-template">
      <Header />
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar - hidden on mobile */}
        <aside
          className="hidden md:block w-64 shrink-0 h-full overflow-y-auto p-4 lg:p-6 border-r border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-900)]"
          data-testid="explore-sidebar"
        >
          <SearchFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            counts={filterCounts}
            disabled={isLoading || isStreaming}
          />
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto" data-testid="explore-main">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)] text-xl md:text-2xl mb-6 md:mb-8">
              EXPLORE AGENTS
            </h1>

            {/* Mobile Filter Button - visible only on mobile */}
            <div className="md:hidden mb-4">
              <MobileFilterSheet
                filters={filters}
                onFiltersChange={onFiltersChange}
                counts={filterCounts}
                disabled={isLoading || isStreaming}
              />
            </div>

            <div className="mb-6 md:mb-8">
              <SearchBar
                query={query}
                onQueryChange={onQueryChange}
                onSubmit={onSearch}
                isLoading={isLoading || isStreaming}
                autoFocus
              />
            </div>

            <SearchResults
              agents={agents}
              totalCount={totalCount}
              isLoading={isLoading}
              error={error}
              onAgentClick={onAgentClick}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              pageNumber={pageNumber}
              hasMore={hasMore}
              onNext={onNext}
              onPrevious={onPrevious}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onSortChange}
              isRefreshing={isRefreshing}
              lastUpdated={lastUpdated}
              onManualRefresh={onManualRefresh}
              // Streaming props
              isStreaming={isStreaming}
              streamProgress={streamProgress}
              hydeQuery={hydeQuery}
              onStopStream={onStopStream}
            />

            {/* Compose Team Button */}
            {showComposeButton && agents && agents.length > 0 && !isLoading && !isStreaming && (
              <div className="mt-6 flex justify-center" data-testid="compose-team-section">
                <Link
                  href={`/compose?agents=${agents
                    .slice(0, 5)
                    .map((a) => a.id)
                    .join(',')}`}
                  className="px-6 py-3 text-sm font-[family-name:var(--font-pixel-body)] uppercase tracking-wider bg-[var(--pixel-gray-800)] text-[var(--pixel-gold-coin)] border-2 border-[var(--pixel-gold-coin)] hover:bg-[var(--pixel-gold-coin)] hover:text-[var(--pixel-black)] transition-colors"
                  data-testid="compose-team-button"
                >
                  Compose Team from Results
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Compare Bar */}
      {compareAgents &&
        compareAgents.length > 0 &&
        onRemoveCompareAgent &&
        onClearCompareAgents &&
        compareUrl && (
          <CompareBar
            agents={compareAgents}
            onRemove={onRemoveCompareAgent}
            onClearAll={onClearCompareAgents}
            compareUrl={compareUrl}
          />
        )}
    </div>
  );
}
