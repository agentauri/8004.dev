import type React from 'react';
import { useState } from 'react';
import { ToggleSwitch } from '@/components/atoms';
import { cn } from '@/lib/utils';

export type FilterMode = 'AND' | 'OR';

export interface FilterModeToggleProps {
  /** Current filter mode */
  value: FilterMode;
  /** Callback when mode changes */
  onChange: (mode: FilterMode) => void;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * FilterModeToggle provides a toggle switch for AND/OR filter modes with an explanatory tooltip.
 *
 * @example
 * ```tsx
 * <FilterModeToggle
 *   value="AND"
 *   onChange={(mode) => setFilterMode(mode)}
 * />
 * ```
 */
export function FilterModeToggle({
  value,
  onChange,
  disabled = false,
  className,
}: FilterModeToggleProps): React.JSX.Element {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (isOr: boolean) => {
    onChange(isOr ? 'OR' : 'AND');
  };

  return (
    <div
      className={cn('relative inline-flex items-center gap-2', className)}
      data-testid="filter-mode-toggle"
    >
      <ToggleSwitch
        leftLabel="AND"
        rightLabel="OR"
        value={value === 'OR'}
        onChange={handleChange}
        disabled={disabled}
        ariaLabel="Filter mode: AND matches all criteria, OR matches any criteria"
        size="sm"
      />

      {/* Info icon with tooltip */}
      <button
        type="button"
        className={cn(
          'w-4 h-4 flex items-center justify-center',
          'text-[0.625rem] font-[family-name:var(--font-pixel-body)]',
          'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-blue-text)]',
          'border border-[var(--pixel-gray-600)] hover:border-[var(--pixel-blue-sky)]',
          'rounded-full transition-colors',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        onMouseEnter={() => !disabled && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => !disabled && setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label="Filter mode information"
        data-testid="filter-mode-info"
        disabled={disabled}
      >
        ?
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={cn(
            'absolute left-full ml-2 top-1/2 -translate-y-1/2 z-10',
            'px-3 py-2 min-w-[200px]',
            'bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-600)]',
            'shadow-lg',
          )}
          data-testid="filter-mode-tooltip"
          role="tooltip"
        >
          <div className="text-[0.625rem] font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-200)]">
            <p className="mb-1">
              <span className="text-[var(--pixel-blue-text)]">AND</span>: Results match <em>all</em>{' '}
              selected filters
            </p>
            <p>
              <span className="text-[var(--pixel-blue-text)]">OR</span>: Results match <em>any</em>{' '}
              selected filter
            </p>
          </div>
          {/* Tooltip arrow */}
          <div
            className={cn(
              'absolute right-full top-1/2 -translate-y-1/2',
              'w-0 h-0',
              'border-t-[6px] border-t-transparent',
              'border-r-[6px] border-r-[var(--pixel-gray-600)]',
              'border-b-[6px] border-b-transparent',
            )}
          />
        </div>
      )}
    </div>
  );
}
