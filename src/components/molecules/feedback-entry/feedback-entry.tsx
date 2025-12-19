import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, MessageSquare } from 'lucide-react';
import type React from 'react';
import { FeedbackTags, TrustScore } from '@/components/atoms';
import { getExplorerTxUrl } from '@/lib/constants/chains';
import { cn } from '@/lib/utils';
import type { AgentFeedback } from '@/types/agent';

export interface FeedbackEntryProps {
  /** Feedback data */
  feedback: AgentFeedback;
  /** Chain ID for explorer links (required for transaction hash links) */
  chainId?: number;
  /** Whether to show full details or compact view */
  compact?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * Truncates an Ethereum address for display
 */
function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats a timestamp into a relative time string
 */
function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown';
  }
}

/**
 * FeedbackEntry displays a single feedback item with score, tags, context, and metadata.
 *
 * @example
 * ```tsx
 * <FeedbackEntry
 *   feedback={{
 *     id: '1',
 *     score: 85,
 *     tags: ['reliable', 'fast'],
 *     context: 'Great agent for trading tasks',
 *     submitter: '0x1234...5678',
 *     timestamp: '2024-01-15T10:30:00Z',
 *   }}
 * />
 * ```
 */
export function FeedbackEntry({
  feedback,
  chainId,
  compact = false,
  className,
}: FeedbackEntryProps): React.JSX.Element {
  const { id, score, tags, context, feedbackUri, submitter, timestamp, transactionHash } =
    feedback;

  // Build transaction explorer URL if available
  const txExplorerUrl =
    transactionHash && chainId ? getExplorerTxUrl(chainId, transactionHash) : undefined;

  return (
    <div
      className={cn(
        'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]',
        'hover:border-[var(--pixel-gray-600)] transition-colors',
        className,
      )}
      data-testid="feedback-entry"
      data-feedback-id={id}
    >
      {/* Header with score and timestamp */}
      <div className="flex items-center justify-between mb-3">
        <TrustScore score={score} size={compact ? 'sm' : 'md'} />
        <div className="flex items-center gap-2 text-[0.625rem] text-[var(--pixel-gray-400)]">
          <span
            className="font-[family-name:var(--font-mono)]"
            title={submitter}
            data-testid="submitter-address"
          >
            {truncateAddress(submitter)}
          </span>
          <span className="text-[var(--pixel-gray-600)]">•</span>
          <time dateTime={timestamp} data-testid="feedback-timestamp">
            {formatTimestamp(timestamp)}
          </time>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-3">
          <FeedbackTags
            tags={tags}
            size={compact ? 'sm' : 'md'}
            maxTags={compact ? 3 : undefined}
          />
        </div>
      )}

      {/* Context/Comment */}
      {context && !compact && (
        <div className="mb-3">
          <div className="flex items-start gap-2">
            <MessageSquare
              size={14}
              className="text-[var(--pixel-gray-500)] mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <p
              className="text-sm text-[var(--pixel-gray-300)] leading-relaxed"
              data-testid="feedback-context"
            >
              {context}
            </p>
          </div>
        </div>
      )}

      {/* External links */}
      {(feedbackUri || txExplorerUrl) && !compact && (
        <div className="pt-2 border-t border-[var(--pixel-gray-700)] flex flex-wrap gap-3">
          {feedbackUri && (
            <a
              href={feedbackUri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[0.625rem] text-[var(--pixel-blue-sky)] hover:underline font-[family-name:var(--font-pixel-body)]"
              data-testid="feedback-uri-link"
            >
              <ExternalLink size={12} aria-hidden="true" />
              View full feedback
            </a>
          )}
          {txExplorerUrl && (
            <a
              href={txExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[0.625rem] text-[var(--pixel-green-pipe)] hover:underline font-[family-name:var(--font-pixel-body)]"
              data-testid="tx-explorer-link"
            >
              <ExternalLink size={12} aria-hidden="true" />
              View on Explorer
            </a>
          )}
        </div>
      )}
    </div>
  );
}
