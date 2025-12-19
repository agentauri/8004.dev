import { Star } from 'lucide-react';
import type React from 'react';
import { ReputationDistribution } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { AgentReputation } from '@/types/agent';

export interface ReputationSectionProps {
  /** Reputation data */
  reputation?: AgentReputation;
  /** Whether to show the section header */
  showHeader?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * ReputationSection displays the full reputation metrics for an agent,
 * including average score, rating count, and distribution breakdown.
 *
 * @example
 * ```tsx
 * <ReputationSection
 *   reputation={{
 *     count: 42,
 *     averageScore: 85,
 *     distribution: { low: 5, medium: 10, high: 27 },
 *   }}
 * />
 * ```
 */
export function ReputationSection({
  reputation,
  showHeader = true,
  className,
}: ReputationSectionProps): React.JSX.Element {
  // No reputation data
  if (!reputation || reputation.count === 0) {
    return (
      <section className={cn('', className)} data-testid="reputation-section" data-state="empty">
        {showHeader && (
          <h2 className="flex items-center gap-2 font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
            <Star size={16} className="text-[var(--pixel-gold-coin)]" aria-hidden="true" />
            REPUTATION
          </h2>
        )}
        <div className="p-6 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] text-center">
          <Star
            size={32}
            className="mx-auto mb-3 text-[var(--pixel-gray-600)]"
            aria-hidden="true"
          />
          <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm">
            No ratings yet
          </p>
          <p className="text-[var(--pixel-gray-500)] text-[0.625rem] mt-1">
            Be the first to rate this agent
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={cn('', className)} data-testid="reputation-section" data-state="loaded">
      {showHeader && (
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
          <Star size={16} className="text-[var(--pixel-gold-coin)]" aria-hidden="true" />
          REPUTATION
        </h2>
      )}
      <ReputationDistribution
        averageScore={reputation.averageScore}
        count={reputation.count}
        distribution={reputation.distribution}
      />
    </section>
  );
}
