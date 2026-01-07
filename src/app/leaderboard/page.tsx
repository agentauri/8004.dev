/**
 * Leaderboard Page
 *
 * Displays agents ranked by reputation score with filtering and pagination.
 */

'use client';

import { Trophy } from 'lucide-react';
import { useCallback, useState } from 'react';
import { PageHeader } from '@/components/molecules';
import { LeaderboardFilters, LeaderboardTable } from '@/components/organisms';
import { useInfiniteLeaderboard } from '@/hooks';
import type { LeaderboardFiltersState, LeaderboardPeriod } from '@/types/leaderboard';

const DEFAULT_FILTERS: LeaderboardFiltersState = {
  chains: [],
  protocols: [],
  period: 'all',
};

export default function LeaderboardPage() {
  const [filters, setFilters] = useState<LeaderboardFiltersState>(DEFAULT_FILTERS);

  // Build query params from filters
  const queryParams = {
    period: filters.period as LeaderboardPeriod,
    chains: filters.chains.length > 0 ? filters.chains : undefined,
    mcp: filters.protocols.includes('mcp') ? true : undefined,
    a2a: filters.protocols.includes('a2a') ? true : undefined,
    x402: filters.protocols.includes('x402') ? true : undefined,
    limit: 20,
  };

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteLeaderboard(queryParams);

  // Flatten paginated entries
  const entries = data?.pages.flatMap((page) => page.entries) ?? [];
  const totalCount = data?.pages[0]?.total ?? 0;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-pixel-grid">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <PageHeader
          title="Leaderboard"
          description="Top agents ranked by reputation score. Filter by chain, protocol support, and time period."
          icon={Trophy}
          glow="gold"
          className="mb-8"
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar Filters */}
          <aside>
            <LeaderboardFilters
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={totalCount}
              isLoading={isLoading}
            />
          </aside>

          {/* Leaderboard Table */}
          <main>
            <LeaderboardTable
              entries={entries}
              isLoading={isLoading}
              error={error?.message}
              onLoadMore={handleLoadMore}
              hasMore={hasNextPage}
              isLoadingMore={isFetchingNextPage}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
