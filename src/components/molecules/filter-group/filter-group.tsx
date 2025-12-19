import type React from 'react';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface FilterOption<T extends string = string> {
  /** Unique value for the option */
  value: T;
  /** Display label */
  label: string;
  /** Optional count to display */
  count?: number;
}

export interface FilterGroupProps<T extends string = string> {
  /** Group label/title */
  label: string;
  /** Available filter options */
  options: FilterOption<T>[];
  /** Currently selected values */
  selected: T[];
  /** Callback when selection changes */
  onChange: (selected: T[]) => void;
  /** Whether to allow multiple selection */
  multiSelect?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * FilterGroup displays a group of toggle-able filter options.
 *
 * @example
 * ```tsx
 * <FilterGroup
 *   label="Status"
 *   options={[
 *     { value: 'active', label: 'Active', count: 42 },
 *     { value: 'inactive', label: 'Inactive', count: 8 },
 *   ]}
 *   selected={['active']}
 *   onChange={setSelected}
 * />
 * ```
 */
export function FilterGroup<T extends string = string>({
  label,
  options,
  selected,
  onChange,
  multiSelect = true,
  className,
}: FilterGroupProps<T>): React.JSX.Element {
  const handleOptionClick = useCallback(
    (value: T) => {
      if (multiSelect) {
        if (selected.includes(value)) {
          onChange(selected.filter((v) => v !== value));
        } else {
          onChange([...selected, value]);
        }
      } else {
        if (selected.includes(value)) {
          onChange([]);
        } else {
          onChange([value]);
        }
      }
    },
    [multiSelect, selected, onChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, value: T) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleOptionClick(value);
      }
    },
    [handleOptionClick],
  );

  return (
    <div className={cn('space-y-3', className)} data-testid="filter-group">
      <span
        className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider"
        id={`filter-group-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {label}
      </span>
      <div
        className="flex flex-wrap gap-2"
        // biome-ignore lint/a11y/useSemanticElements: Using div with role for flexible layout styling
        role="group"
        aria-labelledby={`filter-group-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              className={cn(
                'px-2.5 py-1.5 text-[0.625rem] font-[family-name:var(--font-pixel-body)] uppercase',
                'border transition-colors',
                isSelected
                  ? 'bg-[var(--pixel-primary)] border-[var(--pixel-primary)] text-white'
                  : 'bg-transparent border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)]',
              )}
              aria-pressed={isSelected}
              data-testid={`filter-option-${option.value}`}
            >
              {option.label}
              {option.count !== undefined && (
                <span
                  className={cn(
                    'ml-1.5',
                    isSelected ? 'text-white/70' : 'text-[var(--pixel-gray-500)]',
                  )}
                >
                  ({option.count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
