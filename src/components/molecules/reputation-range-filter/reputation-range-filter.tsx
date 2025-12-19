import type React from 'react';
import { RangeSlider } from '@/components/atoms';
import { cn } from '@/lib/utils';

export interface ReputationRangeFilterProps {
  /** Minimum reputation value (0-100) */
  minValue: number;
  /** Maximum reputation value (0-100) */
  maxValue: number;
  /** Callback when values change */
  onChange: (minValue: number, maxValue: number) => void;
  /** Step increment (default: 5) */
  step?: number;
  /** Whether the filter is disabled */
  disabled?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * ReputationRangeFilter provides a labeled range slider for filtering by reputation score.
 *
 * @example
 * ```tsx
 * <ReputationRangeFilter
 *   minValue={20}
 *   maxValue={100}
 *   onChange={(min, max) => setRange({ min, max })}
 * />
 * ```
 */
export function ReputationRangeFilter({
  minValue,
  maxValue,
  onChange,
  step = 5,
  disabled = false,
  className,
}: ReputationRangeFilterProps): React.JSX.Element {
  return (
    <div
      className={cn('space-y-2', className)}
      data-testid="reputation-range-filter"
      data-disabled={disabled}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-[0.625rem] font-[family-name:var(--font-pixel-body)] uppercase',
            'text-[var(--pixel-gray-400)]',
          )}
          data-testid="reputation-range-label"
        >
          Reputation
        </span>
        <span
          className={cn(
            'text-[0.625rem] font-[family-name:var(--font-pixel-body)]',
            'text-[var(--pixel-blue-sky)]',
          )}
          data-testid="reputation-range-value"
        >
          {minValue} - {maxValue}
        </span>
      </div>

      {/* Slider */}
      <RangeSlider
        min={0}
        max={100}
        minValue={minValue}
        maxValue={maxValue}
        onChange={onChange}
        step={step}
        disabled={disabled}
        ariaLabel="Filter by reputation score"
      />

      {/* Scale markers */}
      <div className="flex justify-between">
        <span
          className={cn(
            'text-[0.5rem] font-[family-name:var(--font-pixel-body)]',
            'text-[var(--pixel-gray-500)]',
          )}
          data-testid="scale-min"
        >
          0
        </span>
        <span
          className={cn(
            'text-[0.5rem] font-[family-name:var(--font-pixel-body)]',
            'text-[var(--pixel-gray-500)]',
          )}
          data-testid="scale-mid"
        >
          50
        </span>
        <span
          className={cn(
            'text-[0.5rem] font-[family-name:var(--font-pixel-body)]',
            'text-[var(--pixel-gray-500)]',
          )}
          data-testid="scale-max"
        >
          100
        </span>
      </div>
    </div>
  );
}
