import type React from 'react';
import { cn } from '@/lib/utils';

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;

export interface PageSizeSelectorProps {
  /** Current page size value */
  value: number;
  /** Callback when page size changes */
  onChange: (size: number) => void;
  /** Available page size options */
  options?: readonly number[];
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * PageSizeSelector allows users to select how many items to display per page.
 *
 * @example
 * ```tsx
 * <PageSizeSelector
 *   value={20}
 *   onChange={(size) => setPageSize(size)}
 * />
 * ```
 */
export function PageSizeSelector({
  value,
  onChange,
  options = DEFAULT_PAGE_SIZE_OPTIONS,
  disabled = false,
  className,
}: PageSizeSelectorProps): React.JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(newSize)) {
      onChange(newSize);
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2',
        'text-[var(--pixel-gray-400)] text-xs',
        'font-[family-name:var(--font-pixel-body)]',
        className,
      )}
      data-testid="page-size-selector"
    >
      <span className="uppercase">Show</span>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-600)]',
          'text-[var(--pixel-gray-100)] text-xs px-2 py-1',
          'font-[family-name:var(--font-pixel-body)]',
          'focus:outline-none focus:border-[var(--pixel-blue-sky)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'cursor-pointer',
        )}
        data-testid="page-size-select"
        aria-label="Items per page"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span className="uppercase">per page</span>
    </div>
  );
}
