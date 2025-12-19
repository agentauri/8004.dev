'use client';

import dynamic from 'next/dynamic';
import type React from 'react';
import type { SortField, SortOrder } from '@/components/molecules';
import { SearchBar, type SearchFiltersState } from '@/components/organisms';
import type { AgentCardAgent } from '@/components/organisms/agent-card';
import { MobileFilterSheet } from '@/components/organisms/mobile-filter-sheet';
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
  /** Current page number (1-indexed) */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
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
  pageSize,
  onPageSizeChange,
  sortBy,
  sortOrder,
  onSortChange,
  isRefreshing,
  lastUpdated,
  onManualRefresh,
  className,
}: ExploreTemplateProps): React.JSX.Element {
  return (
    <div className={cn('flex min-h-full', className)} data-testid="explore-template">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside
        className="hidden md:block w-64 shrink-0 sticky top-0 h-screen overflow-y-auto p-4 lg:p-6 border-r border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-900)]"
        data-testid="explore-sidebar"
      >
        <SearchFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          counts={filterCounts}
          disabled={isLoading}
        />
      </aside>

      <main className="flex-1 p-4 md:p-6 lg:p-8" data-testid="explore-main">
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
              disabled={isLoading}
            />
          </div>

          <div className="mb-6 md:mb-8">
            <SearchBar
              query={query}
              onQueryChange={onQueryChange}
              onSubmit={onSearch}
              isLoading={isLoading}
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
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={onSortChange}
            isRefreshing={isRefreshing}
            lastUpdated={lastUpdated}
            onManualRefresh={onManualRefresh}
          />
        </div>
      </main>
    </div>
  );
}
