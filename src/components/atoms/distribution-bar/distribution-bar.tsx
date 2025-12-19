import type React from 'react';
import { cn } from '@/lib/utils';

export interface DistributionBarProps {
  /** Low score count (0-39) */
  low: number;
  /** Medium score count (40-69) */
  medium: number;
  /** High score count (70-100) */
  high: number;
  /** Whether to show segment labels */
  showLabels?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional additional class names */
  className?: string;
}

const SIZE_CONFIG = {
  sm: { height: 'h-2', fontSize: 'text-[0.5rem]' },
  md: { height: 'h-3', fontSize: 'text-[0.625rem]' },
  lg: { height: 'h-4', fontSize: 'text-[0.75rem]' },
};

/**
 * DistributionBar displays a horizontal bar showing the distribution of
 * reputation scores across low, medium, and high categories.
 *
 * @example
 * ```tsx
 * <DistributionBar low={10} medium={25} high={65} />
 * <DistributionBar low={5} medium={15} high={80} showLabels={false} />
 * ```
 */
export function DistributionBar({
  low,
  medium,
  high,
  showLabels = true,
  size = 'md',
  className,
}: DistributionBarProps): React.JSX.Element {
  const total = low + medium + high;

  // Calculate percentages (handle zero total case)
  const lowPercent = total > 0 ? (low / total) * 100 : 0;
  const mediumPercent = total > 0 ? (medium / total) * 100 : 0;
  const highPercent = total > 0 ? (high / total) * 100 : 0;

  const sizeConfig = SIZE_CONFIG[size];

  // Don't render anything if total is zero
  if (total === 0) {
    return (
      <div className={cn('w-full', className)} data-testid="distribution-bar" data-total="0">
        <div
          className={cn(
            'w-full rounded-sm overflow-hidden bg-[var(--pixel-gray-700)]',
            sizeConfig.height,
          )}
        >
          <div className="h-full w-full flex items-center justify-center">
            <span className={cn('text-[var(--pixel-gray-500)]', sizeConfig.fontSize)}>No data</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('w-full', className)}
      data-testid="distribution-bar"
      data-total={total}
      data-low={low}
      data-medium={medium}
      data-high={high}
    >
      <div
        className={cn('w-full rounded-sm overflow-hidden flex', sizeConfig.height)}
        role="img"
        aria-label={`Distribution: ${low} low, ${medium} medium, ${high} high out of ${total} total`}
      >
        {/* Low segment */}
        {lowPercent > 0 && (
          <div
            className="h-full bg-[var(--trust-low)] transition-all duration-200"
            style={{ width: `${lowPercent}%` }}
            data-segment="low"
          />
        )}

        {/* Medium segment */}
        {mediumPercent > 0 && (
          <div
            className="h-full bg-[var(--trust-med)] transition-all duration-200"
            style={{ width: `${mediumPercent}%` }}
            data-segment="medium"
          />
        )}

        {/* High segment */}
        {highPercent > 0 && (
          <div
            className="h-full bg-[var(--trust-high)] transition-all duration-200"
            style={{ width: `${highPercent}%` }}
            data-segment="high"
          />
        )}
      </div>

      {/* Labels */}
      {showLabels && (
        <div
          className={cn(
            'flex items-center gap-3 mt-1.5 font-[family-name:var(--font-pixel-body)]',
            sizeConfig.fontSize,
          )}
        >
          <span className="text-[var(--trust-low)] whitespace-nowrap" data-label="low">
            {low} LOW
          </span>
          <span className="text-[var(--trust-med)] whitespace-nowrap" data-label="medium">
            {medium} MED
          </span>
          <span className="text-[var(--trust-high)] whitespace-nowrap" data-label="high">
            {high} HIGH
          </span>
        </div>
      )}
    </div>
  );
}
