/**
 * FeedbackFeed organism
 *
 * Displays a paginated feed of global feedbacks.
 */

import { MessageSquare } from 'lucide-react';
import type React from 'react';
import { FeedbackCardGlobal } from '@/components/molecules/feedback-card-global';
import { cn } from '@/lib/utils';
import type { GlobalFeedback } from '@/types/feedback';

export interface FeedbackFeedProps {
  /** Feedbacks to display */
  feedbacks: GlobalFeedback[];
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
 * Loading skeleton for feedback cards
 */
function FeedbackCardSkeleton(): React.JSX.Element {
  return (
    <div
      className="p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] animate-pulse"
      data-testid="feedback-card-skeleton"
    >
      <div className="flex justify-between mb-3">
        <div className="h-8 w-16 bg-[var(--pixel-gray-700)]" />
        <div className="h-4 w-20 bg-[var(--pixel-gray-700)]" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 w-32 bg-[var(--pixel-gray-700)]" />
        <div className="h-3 w-24 bg-[var(--pixel-gray-700)]" />
      </div>
      <div className="flex gap-1.5 mb-3">
        <div className="h-5 w-16 bg-[var(--pixel-gray-700)]" />
        <div className="h-5 w-20 bg-[var(--pixel-gray-700)]" />
      </div>
      <div className="h-4 w-full bg-[var(--pixel-gray-700)]" />
    </div>
  );
}

export function FeedbackFeed({
  feedbacks,
  isLoading = false,
  error,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  className,
}: FeedbackFeedProps): React.JSX.Element {
  return (
    <div className={cn('space-y-4', className)} data-testid="feedback-feed">
      {/* Error State */}
      {error && (
        <div
          className="p-6 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-red-fire)] text-center"
          role="alert"
        >
          <p className="text-[var(--pixel-red-fire)] font-[family-name:var(--font-pixel-body)]">
            {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <FeedbackCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && feedbacks.length === 0 && (
        <div className="p-12 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] text-center">
          <MessageSquare
            className="w-12 h-12 mx-auto mb-4 text-[var(--pixel-gray-600)]"
            aria-hidden="true"
          />
          <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)]">
            No feedbacks found matching your filters.
          </p>
        </div>
      )}

      {/* Feedbacks */}
      {!isLoading && !error && feedbacks.length > 0 && (
        <>
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <FeedbackCardGlobal key={feedback.id} feedback={feedback} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && onLoadMore && (
            <div className="text-center pt-4">
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
