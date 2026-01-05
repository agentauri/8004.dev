/**
 * LeaderboardTable organism
 *
 * Displays the full leaderboard with header and rows.
 */

import { Trophy } from 'lucide-react';
import type React from 'react';
import { LeaderboardRow } from '@/components/molecules/leaderboard-row';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types/leaderboard';

export interface LeaderboardTableProps {
  /** Leaderboard entries to display */
  entries: LeaderboardEntry[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Callback for load more */
  onLoadMore?: () => void;
  /** Whether more entries are available */
  hasMore?: boolean;
  /** Whether loading more */
  isLoadingMore?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * Loading skeleton for leaderboard rows
 */
function LeaderboardRowSkeleton(): React.JSX.Element {
  return (
    <div
      className="grid grid-cols-[4rem_1fr_auto] md:grid-cols-[4rem_1fr_8rem_6rem_auto] gap-4 items-center p-4 border-b border-[var(--pixel-gray-700)] animate-pulse"
      data-testid="leaderboard-row-skeleton"
    >
      <div className="w-12 h-12 bg-[var(--pixel-gray-700)]" />
      <div className="space-y-2">
        <div className="h-4 bg-[var(--pixel-gray-700)] w-32" />
        <div className="h-3 bg-[var(--pixel-gray-700)] w-24" />
      </div>
      <div className="hidden md:block h-4 bg-[var(--pixel-gray-700)] w-12" />
      <div className="hidden md:block h-4 bg-[var(--pixel-gray-700)] w-8" />
      <div className="h-6 bg-[var(--pixel-gray-700)] w-12" />
    </div>
  );
}

export function LeaderboardTable({
  entries,
  isLoading = false,
  error,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  className,
}: LeaderboardTableProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="leaderboard-table"
    >
      {/* Table Header */}
      <div className="grid grid-cols-[4rem_1fr_auto] md:grid-cols-[4rem_1fr_8rem_6rem_auto] gap-4 items-center p-4 border-b-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-800)]">
        <div className="text-[0.625rem] text-[var(--pixel-gray-500)] uppercase tracking-wider">
          Rank
        </div>
        <div className="text-[0.625rem] text-[var(--pixel-gray-500)] uppercase tracking-wider">
          Agent
        </div>
        <div className="hidden md:block text-[0.625rem] text-[var(--pixel-gray-500)] uppercase tracking-wider text-right">
          Feedbacks
        </div>
        <div className="hidden md:block text-[0.625rem] text-[var(--pixel-gray-500)] uppercase tracking-wider text-right">
          Trend
        </div>
        <div className="text-[0.625rem] text-[var(--pixel-gray-500)] uppercase tracking-wider text-right">
          Score
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-8 text-center border-b border-[var(--pixel-gray-700)]" role="alert">
          <p className="text-[var(--pixel-red-fire)] font-[family-name:var(--font-pixel-body)]">
            {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <LeaderboardRowSkeleton key={`skeleton-${index}`} />
        ))}

      {/* Empty State */}
      {!isLoading && !error && entries.length === 0 && (
        <div className="p-12 text-center">
          <Trophy
            className="w-12 h-12 mx-auto mb-4 text-[var(--pixel-gray-600)]"
            aria-hidden="true"
          />
          <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)]">
            No agents found matching your filters.
          </p>
        </div>
      )}

      {/* Entries */}
      {!isLoading && !error && entries.length > 0 && (
        <>
          {entries.map((entry) => (
            <LeaderboardRow key={entry.agentId} entry={entry} />
          ))}

          {/* Load More */}
          {hasMore && onLoadMore && (
            <div className="p-4 text-center">
              <button
                type="button"
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className={cn(
                  'px-6 py-2 text-sm font-[family-name:var(--font-pixel-body)] uppercase tracking-wider',
                  'border-2 border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-sky)]',
                  'hover:bg-[var(--pixel-blue-sky)]/20 transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              >
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
