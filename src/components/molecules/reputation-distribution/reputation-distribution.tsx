import type React from 'react';
import { DistributionBar, TrustScore } from '@/components/atoms';
import { cn } from '@/lib/utils';

export interface ReputationDistributionProps {
  /** Average reputation score (0-100) */
  averageScore: number;
  /** Total number of ratings */
  count: number;
  /** Distribution of scores */
  distribution: {
    low: number;
    medium: number;
    high: number;
  };
  /** Whether to show detailed breakdown */
  showDetails?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * ReputationDistribution displays reputation metrics including average score,
 * total count, and score distribution in a styled container.
 *
 * @example
 * ```tsx
 * <ReputationDistribution
 *   averageScore={85}
 *   count={42}
 *   distribution={{ low: 5, medium: 10, high: 27 }}
 * />
 * ```
 */
export function ReputationDistribution({
  averageScore,
  count,
  distribution,
  showDetails = true,
  className,
}: ReputationDistributionProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="reputation-distribution"
    >
      {/* Header with score and count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <TrustScore score={averageScore} size="lg" />
        </div>
        <div className="text-right">
          <span
            className="text-2xl font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-white)]"
            data-testid="rating-count"
          >
            {count}
          </span>
          <span className="block text-[0.625rem] font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-400)] uppercase">
            Ratings
          </span>
        </div>
      </div>

      {/* Distribution bar */}
      <DistributionBar
        low={distribution.low}
        medium={distribution.medium}
        high={distribution.high}
        size="lg"
        showLabels={showDetails}
      />

      {/* Detailed breakdown */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-[var(--pixel-gray-700)]">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div data-testid="detail-low">
              <span className="block text-lg font-[family-name:var(--font-pixel-heading)] text-[var(--trust-low)]">
                {distribution.low}
              </span>
              <span className="text-[0.5rem] font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-400)] uppercase">
                Low (0-39)
              </span>
            </div>
            <div data-testid="detail-medium">
              <span className="block text-lg font-[family-name:var(--font-pixel-heading)] text-[var(--trust-med)]">
                {distribution.medium}
              </span>
              <span className="text-[0.5rem] font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-400)] uppercase">
                Med (40-69)
              </span>
            </div>
            <div data-testid="detail-high">
              <span className="block text-lg font-[family-name:var(--font-pixel-heading)] text-[var(--trust-high)]">
                {distribution.high}
              </span>
              <span className="text-[0.5rem] font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-400)] uppercase">
                High (70-100)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
