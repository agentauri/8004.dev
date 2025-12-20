import { MessageSquare } from 'lucide-react';
import type React from 'react';
import { FeedbackEntry } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { AgentFeedback } from '@/types/agent';

export interface FeedbackTimelineProps {
  /** Array of feedback entries */
  feedback: AgentFeedback[];
  /** Chain ID for explorer links */
  chainId?: number;
  /** Maximum number of entries to display */
  maxEntries?: number;
  /** Whether to use compact display */
  compact?: boolean;
  /** Whether to show the section header */
  showHeader?: boolean;
  /** Callback when "show more" is clicked */
  onShowMore?: () => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * FeedbackTimeline displays a chronological list of feedback entries.
 *
 * @example
 * ```tsx
 * <FeedbackTimeline
 *   feedback={feedbackArray}
 *   maxEntries={5}
 *   onShowMore={() => loadMoreFeedback()}
 * />
 * ```
 */
export function FeedbackTimeline({
  feedback,
  chainId,
  maxEntries,
  compact = false,
  showHeader = true,
  onShowMore,
  className,
}: FeedbackTimelineProps): React.JSX.Element {
  const displayedFeedback = maxEntries ? feedback.slice(0, maxEntries) : feedback;
  const hasMore = maxEntries ? feedback.length > maxEntries : false;
  const remainingCount = maxEntries ? feedback.length - maxEntries : 0;

  // Empty state
  if (feedback.length === 0) {
    return (
      <section className={cn('', className)} data-testid="feedback-timeline" data-state="empty">
        {showHeader && (
          <h2 className="flex items-center gap-2 font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
            <MessageSquare size={16} className="text-[var(--pixel-blue-text)]" aria-hidden="true" />
            RECENT FEEDBACK
          </h2>
        )}
        <div className="p-6 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] text-center">
          <MessageSquare
            size={32}
            className="mx-auto mb-3 text-[var(--pixel-gray-600)]"
            aria-hidden="true"
          />
          <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm">
            No feedback yet
          </p>
          <p className="text-[var(--pixel-gray-500)] text-[0.625rem] mt-1">
            Feedback will appear here once users rate this agent
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn('', className)}
      data-testid="feedback-timeline"
      data-state="loaded"
      data-count={feedback.length}
    >
      {showHeader && (
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
          <MessageSquare size={16} className="text-[var(--pixel-blue-text)]" aria-hidden="true" />
          RECENT FEEDBACK
          <span className="text-[var(--pixel-gray-500)] text-[0.625rem] font-[family-name:var(--font-pixel-body)]">
            ({feedback.length})
          </span>
        </h2>
      )}

      <div className={cn('space-y-3', compact && 'space-y-2')}>
        {displayedFeedback.map((entry) => (
          <FeedbackEntry key={entry.id} feedback={entry} chainId={chainId} compact={compact} />
        ))}
      </div>

      {hasMore && remainingCount > 0 && (
        <div className="mt-4 text-center">
          {onShowMore ? (
            <button
              type="button"
              onClick={onShowMore}
              className="px-4 py-2 text-[0.75rem] font-[family-name:var(--font-pixel-body)] uppercase
                text-[var(--pixel-blue-text)] bg-transparent border-2 border-[var(--pixel-blue-text)]
                hover:bg-[var(--pixel-blue-text)] hover:text-[var(--pixel-black)] transition-colors"
              data-testid="show-more-button"
            >
              Show {remainingCount} more
            </button>
          ) : (
            <p
              className="text-[0.625rem] text-[var(--pixel-gray-500)] font-[family-name:var(--font-pixel-body)]"
              data-testid="more-count-text"
            >
              +{remainingCount} more feedback entries
            </p>
          )}
        </div>
      )}
    </section>
  );
}
