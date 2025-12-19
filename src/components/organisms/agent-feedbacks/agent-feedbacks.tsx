'use client';

import { MessageSquare, Loader2 } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { FeedbackEntry } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { AgentFeedback } from '@/types/agent';

export interface AgentFeedbacksProps {
  /** Array of feedback entries */
  feedback: AgentFeedback[];
  /** Total feedback count (may differ from array length if paginated) */
  totalCount?: number;
  /** Whether more feedbacks are available */
  hasMore?: boolean;
  /** Whether feedbacks are loading */
  isLoading?: boolean;
  /** Callback to load more feedbacks */
  onLoadMore?: () => void;
  /** Optional additional class names */
  className?: string;
}

/** Number of feedbacks to show initially */
const INITIAL_DISPLAY_COUNT = 10;
/** Number of feedbacks to add each time "Show More" is clicked */
const LOAD_MORE_COUNT = 10;

/**
 * AgentFeedbacks displays the full feedback list for an agent.
 * Used in the Feedbacks tab of the agent detail page.
 *
 * Features:
 * - Shows all feedbacks (no limit)
 * - Expandable list with "Show More" button
 * - Loading state support
 * - Empty state when no feedbacks
 *
 * @example
 * ```tsx
 * <AgentFeedbacks
 *   feedback={feedbackArray}
 *   totalCount={156}
 *   hasMore={true}
 *   onLoadMore={() => loadNextPage()}
 * />
 * ```
 */
export function AgentFeedbacks({
  feedback,
  totalCount,
  hasMore = false,
  isLoading = false,
  onLoadMore,
  className,
}: AgentFeedbacksProps): React.JSX.Element {
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  const displayedFeedback = feedback.slice(0, displayCount);
  const canShowMore = displayCount < feedback.length || hasMore;
  const hiddenCount = feedback.length - displayCount;
  const actualTotal = totalCount ?? feedback.length;

  const handleShowMore = () => {
    if (displayCount < feedback.length) {
      // Show more from current array
      setDisplayCount((prev) => prev + LOAD_MORE_COUNT);
    } else if (hasMore && onLoadMore) {
      // Load more from server
      onLoadMore();
    }
  };

  // Loading state
  if (isLoading && feedback.length === 0) {
    return (
      <div
        className={cn('space-y-4', className)}
        data-testid="agent-feedbacks"
        data-loading="true"
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[var(--pixel-blue-sky)]" aria-hidden="true" />
          <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)]">
            FEEDBACKS
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-[var(--pixel-blue-sky)] animate-spin" />
        </div>
      </div>
    );
  }

  // Empty state
  if (feedback.length === 0) {
    return (
      <div
        className={cn('space-y-4', className)}
        data-testid="agent-feedbacks"
        data-empty="true"
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[var(--pixel-blue-sky)]" aria-hidden="true" />
          <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)]">
            FEEDBACKS
          </h2>
        </div>
        <div className="p-8 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] text-center">
          <MessageSquare
            size={40}
            className="mx-auto mb-4 text-[var(--pixel-gray-600)]"
            aria-hidden="true"
          />
          <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm">
            No feedback yet
          </p>
          <p className="text-[var(--pixel-gray-500)] text-xs mt-2 max-w-md mx-auto">
            This agent hasn&apos;t received any feedback from users yet.
            Feedback helps the community understand agent quality and reliability.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('space-y-4', className)}
      data-testid="agent-feedbacks"
      data-count={actualTotal}
    >
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[var(--pixel-blue-sky)]" aria-hidden="true" />
          <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)]">
            FEEDBACKS
          </h2>
          <span className="text-[var(--pixel-gray-500)] text-xs font-[family-name:var(--font-pixel-body)]">
            ({actualTotal})
          </span>
        </div>
      </div>

      {/* Feedback list */}
      <div className="space-y-3">
        {displayedFeedback.map((entry) => (
          <FeedbackEntry key={entry.id} feedback={entry} />
        ))}
      </div>

      {/* Show more / Loading more */}
      {canShowMore && (
        <div className="text-center pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-2">
              <Loader2 className="w-4 h-4 text-[var(--pixel-blue-sky)] animate-spin" />
              <span className="text-[var(--pixel-gray-400)] text-xs font-[family-name:var(--font-pixel-body)]">
                Loading more...
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleShowMore}
              className={cn(
                'px-6 py-2.5 text-xs font-[family-name:var(--font-pixel-body)] uppercase tracking-wider',
                'text-[var(--pixel-blue-sky)] bg-transparent border-2 border-[var(--pixel-blue-sky)]',
                'hover:bg-[var(--pixel-blue-sky)] hover:text-[var(--pixel-black)]',
                'transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--pixel-blue-sky)] focus:ring-offset-2 focus:ring-offset-[var(--pixel-black)]',
              )}
              data-testid="load-more-button"
            >
              {hiddenCount > 0
                ? `Show ${Math.min(hiddenCount, LOAD_MORE_COUNT)} more`
                : 'Load more'}
            </button>
          )}
        </div>
      )}

      {/* Showing X of Y indicator */}
      {!canShowMore && actualTotal > INITIAL_DISPLAY_COUNT && (
        <p className="text-center text-[var(--pixel-gray-500)] text-xs pt-2">
          Showing all {actualTotal} feedbacks
        </p>
      )}
    </div>
  );
}
