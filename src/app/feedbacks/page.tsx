/**
 * Global Feedbacks Page
 *
 * Displays all feedbacks across agents with filtering and pagination.
 */

'use client';

import { MessageSquare } from 'lucide-react';
import { useCallback, useState } from 'react';
import { FeedbackFeed, FeedbackFilters } from '@/components/organisms';
import { useInfiniteGlobalFeedbacks } from '@/hooks';
import type { GlobalFeedbackFilters } from '@/types/feedback';

const DEFAULT_FILTERS: GlobalFeedbackFilters = {
  chains: [],
  scoreCategory: undefined,
};

export default function FeedbacksPage() {
  const [filters, setFilters] = useState<GlobalFeedbackFilters>(DEFAULT_FILTERS);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteGlobalFeedbacks({
      ...filters,
      limit: 20,
    });

  // Flatten paginated feedbacks
  const feedbacks = data?.pages.flatMap((page) => page.feedbacks) ?? [];
  const stats = data?.pages[0]?.stats;

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-pixel-grid">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-[var(--pixel-blue-sky)]" aria-hidden="true" />
            <h1 className="font-[family-name:var(--font-pixel-display)] text-2xl md:text-3xl text-[var(--pixel-gray-100)]">
              Global Feedbacks
            </h1>
          </div>
          <p className="text-[var(--pixel-gray-400)] max-w-2xl">
            Browse all on-chain feedbacks submitted for agents across all supported chains.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar Filters */}
          <aside>
            <FeedbackFilters
              filters={filters}
              onFiltersChange={setFilters}
              stats={stats}
              isLoading={isLoading}
            />
          </aside>

          {/* Feedback Feed */}
          <main>
            <FeedbackFeed
              feedbacks={feedbacks}
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
