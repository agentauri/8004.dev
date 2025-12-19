import type React from 'react';
import { cn } from '@/lib/utils';

export interface MatchReasonsProps {
  /** List of match reasons */
  reasons: string[];
  /** Optional query for highlighting terms */
  query?: string;
  /** Maximum number of reasons to show before truncating (default: 2) */
  maxVisible?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MatchReasons displays why an agent matched a semantic search query
 * in a comma-separated list with optional truncation.
 */
export function MatchReasons({
  reasons,
  query,
  maxVisible = 2,
  className,
}: MatchReasonsProps): React.JSX.Element | null {
  // Don't render if no reasons
  if (!reasons || reasons.length === 0) {
    return null;
  }

  const visibleReasons = reasons.slice(0, maxVisible);
  const hiddenCount = reasons.length - maxVisible;

  /**
   * Highlights query terms in a reason string
   */
  const highlightQuery = (reason: string): React.ReactNode => {
    if (!query || query.trim() === '') {
      return reason;
    }

    // Split query into terms and create regex for case-insensitive matching
    const terms = query
      .trim()
      .split(/\s+/)
      .filter((term) => term.length > 0);

    // Create regex pattern that matches any of the query terms
    const pattern = new RegExp(
      `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
      'gi',
    );

    const parts = reason.split(pattern);

    return parts.map((part, index) => {
      const isMatch = pattern.test(part);
      pattern.lastIndex = 0; // Reset regex state

      if (isMatch) {
        return (
          <span key={index} className="text-pixel-gold-coin font-medium">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div data-testid="match-reasons" className={cn('text-xs text-pixel-gray-500', className)}>
      <span className="text-pixel-gold-coin">Matched:</span>{' '}
      {visibleReasons.map((reason, index) => (
        <span key={index}>
          {highlightQuery(reason)}
          {index < visibleReasons.length - 1 && ', '}
        </span>
      ))}
      {hiddenCount > 0 && <span className="text-pixel-gray-600"> +{hiddenCount} more</span>}
    </div>
  );
}
