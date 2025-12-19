'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/** Available sort fields */
export type SortField = 'relevance' | 'name' | 'createdAt' | 'reputation';

/** Sort order */
export type SortOrder = 'asc' | 'desc';

/** Sort option configuration */
export interface SortOption {
  field: SortField;
  label: string;
  defaultOrder: SortOrder;
}

export interface SortSelectorProps {
  /** Currently selected sort field */
  sortBy: SortField;
  /** Current sort order */
  order: SortOrder;
  /** Callback when sort changes */
  onChange: (sortBy: SortField, order: SortOrder) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Optional additional class names */
  className?: string;
}

/** Default sort options */
const SORT_OPTIONS: SortOption[] = [
  { field: 'relevance', label: 'Relevance', defaultOrder: 'desc' },
  { field: 'name', label: 'Name', defaultOrder: 'asc' },
  { field: 'createdAt', label: 'Date', defaultOrder: 'desc' },
  { field: 'reputation', label: 'Reputation', defaultOrder: 'desc' },
];

/**
 * SortSelector provides a dropdown to select sort field and order.
 *
 * @example
 * ```tsx
 * <SortSelector
 *   sortBy="relevance"
 *   order="desc"
 *   onChange={(field, order) => setSorting({ field, order })}
 * />
 * ```
 */
export function SortSelector({
  sortBy,
  order,
  onChange,
  disabled = false,
  className,
}: SortSelectorProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = SORT_OPTIONS.find((opt) => opt.field === sortBy) ?? SORT_OPTIONS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFieldSelect = useCallback(
    (option: SortOption) => {
      // If selecting the same field, toggle order; otherwise use default order
      if (option.field === sortBy) {
        onChange(sortBy, order === 'asc' ? 'desc' : 'asc');
      } else {
        onChange(option.field, option.defaultOrder);
      }
      setIsOpen(false);
    },
    [sortBy, order, onChange],
  );

  const handleOrderToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(sortBy, order === 'asc' ? 'desc' : 'asc');
    },
    [sortBy, order, onChange],
  );

  const OrderIcon = order === 'asc' ? ArrowUp : ArrowDown;

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex', className)}
      data-testid="sort-selector"
    >
      {/* Sort field dropdown trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-3 py-2',
          'bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-600)] border-r-0',
          'text-[0.625rem] font-[family-name:var(--font-pixel-body)] uppercase',
          'text-[var(--pixel-gray-200)]',
          'hover:border-[var(--pixel-gray-500)] transition-colors',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        data-testid="sort-selector-trigger"
      >
        <ArrowUpDown size={12} className="text-[var(--pixel-gray-400)]" aria-hidden="true" />
        <span>Sort: {currentOption.label}</span>
      </button>

      {/* Sort order toggle - separate button */}
      <button
        type="button"
        onClick={handleOrderToggle}
        disabled={disabled}
        className={cn(
          'flex items-center justify-center px-2 py-2',
          'bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-600)]',
          'hover:bg-[var(--pixel-gray-700)] transition-colors',
          'text-[var(--pixel-blue-sky)]',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        aria-label={`Sort ${order === 'asc' ? 'ascending' : 'descending'}, click to toggle`}
        data-testid="sort-order-toggle"
      >
        <OrderIcon size={12} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 mt-1 z-20',
            'min-w-full',
            'bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-600)]',
            'shadow-lg',
          )}
          role="listbox"
          aria-label="Sort options"
          data-testid="sort-selector-dropdown"
        >
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.field === sortBy;
            return (
              <button
                key={option.field}
                type="button"
                onClick={() => handleFieldSelect(option)}
                className={cn(
                  'w-full flex items-center justify-between gap-2 px-3 py-2',
                  'text-[0.625rem] font-[family-name:var(--font-pixel-body)] uppercase',
                  'transition-colors',
                  isSelected
                    ? 'bg-[var(--pixel-blue-sky)] text-white'
                    : 'text-[var(--pixel-gray-300)] hover:bg-[var(--pixel-gray-700)]',
                )}
                role="option"
                aria-selected={isSelected}
                data-testid={`sort-option-${option.field}`}
              >
                <span>{option.label}</span>
                {isSelected && <OrderIcon size={10} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
