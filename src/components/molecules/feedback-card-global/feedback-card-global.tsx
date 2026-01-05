/**
 * FeedbackCardGlobal molecule
 *
 * Displays a single feedback entry with agent link and score badge.
 * Used in the global feedbacks feed.
 */

import { Calendar, ExternalLink, ThumbsDown, ThumbsUp, Minus } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { type ChainId, ChainBadge, TrustScore, CopyButton } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { GlobalFeedback, FeedbackScoreCategory } from '@/types/feedback';

export interface FeedbackCardGlobalProps {
  /** Feedback data */
  feedback: GlobalFeedback;
  /** Optional additional class names */
  className?: string;
}

/** Supported chain IDs for type narrowing */
const SUPPORTED_CHAIN_IDS = new Set<number>([11155111, 84532, 80002]);

function isValidChainId(chainId: number): chainId is ChainId {
  return SUPPORTED_CHAIN_IDS.has(chainId);
}

/**
 * Get score category styling
 */
function getScoreCategoryStyle(score: number): {
  category: FeedbackScoreCategory;
  color: string;
  bgColor: string;
  icon: typeof ThumbsUp;
} {
  if (score >= 70) {
    return {
      category: 'positive',
      color: 'text-[var(--pixel-green-pipe)]',
      bgColor: 'bg-[var(--pixel-green-pipe)]/20',
      icon: ThumbsUp,
    };
  }
  if (score >= 40) {
    return {
      category: 'neutral',
      color: 'text-[var(--pixel-gold-coin)]',
      bgColor: 'bg-[var(--pixel-gold-coin)]/20',
      icon: Minus,
    };
  }
  return {
    category: 'negative',
    color: 'text-[var(--pixel-red-fire)]',
    bgColor: 'bg-[var(--pixel-red-fire)]/20',
    icon: ThumbsDown,
  };
}

/**
 * Format timestamp to relative time or date
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return 'Just now';
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Truncate address for display
 */
function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function FeedbackCardGlobal({
  feedback,
  className,
}: FeedbackCardGlobalProps): React.JSX.Element {
  const scoreStyle = getScoreCategoryStyle(feedback.score);
  const ScoreIcon = scoreStyle.icon;

  return (
    <article
      className={cn(
        'p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]',
        'hover:border-[var(--pixel-gray-600)] transition-colors',
        className,
      )}
      data-testid="feedback-card-global"
    >
      {/* Header: Score + Agent Link */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Score Badge */}
        <div className={cn('flex items-center gap-2 px-3 py-1.5', scoreStyle.bgColor)}>
          <ScoreIcon size={16} className={scoreStyle.color} aria-hidden="true" />
          <span className={cn('font-[family-name:var(--font-pixel-display)] text-lg', scoreStyle.color)}>
            {feedback.score}
          </span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1 text-[var(--pixel-gray-500)]">
          <Calendar size={12} aria-hidden="true" />
          <time
            dateTime={feedback.timestamp}
            className="text-[0.625rem] font-mono"
          >
            {formatTimestamp(feedback.timestamp)}
          </time>
        </div>
      </div>

      {/* Agent Info */}
      <div className="mb-3">
        <Link
          href={`/agent/${feedback.agentId}`}
          className="group inline-flex items-center gap-2"
        >
          <span className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] group-hover:text-[var(--pixel-blue-sky)] transition-colors">
            {feedback.agentName}
          </span>
          <ExternalLink
            size={12}
            className="text-[var(--pixel-gray-500)] group-hover:text-[var(--pixel-blue-sky)]"
            aria-hidden="true"
          />
        </Link>
        <div className="flex items-center gap-2 mt-1">
          {isValidChainId(feedback.agentChainId) && (
            <ChainBadge chainId={feedback.agentChainId} className="text-[0.5rem] px-1 py-0.5" />
          )}
        </div>
      </div>

      {/* Tags */}
      {feedback.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {feedback.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[0.625rem] text-[var(--pixel-gray-400)] bg-[var(--pixel-gray-800)] uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Context */}
      {feedback.context && (
        <p className="text-sm text-[var(--pixel-gray-300)] mb-3 line-clamp-2">
          {feedback.context}
        </p>
      )}

      {/* Footer: Submitter */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--pixel-gray-700)]">
        <div className="flex items-center gap-2">
          <span className="text-[0.625rem] text-[var(--pixel-gray-500)] uppercase">From:</span>
          <span className="font-mono text-xs text-[var(--pixel-gray-400)]">
            {truncateAddress(feedback.submitter)}
          </span>
          <CopyButton text={feedback.submitter} size="sm" />
        </div>

        {feedback.transactionHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${feedback.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.625rem] text-[var(--pixel-blue-sky)] hover:underline"
          >
            View tx
          </a>
        )}
      </div>
    </article>
  );
}
