'use client';

import { Search, X } from 'lucide-react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

export interface SearchInputProps {
  /** Current search value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when search is submitted (Enter key) */
  onSubmit?: (value: string) => void;
  /** Callback when input is cleared */
  onClear?: () => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Optional additional class names */
  className?: string;
  /** Auto focus on mount */
  autoFocus?: boolean;
}

/**
 * SearchInput is a molecule combining an input field with search icon and clear button.
 *
 * @example
 * ```tsx
 * <SearchInput
 *   placeholder="Search agents..."
 *   onChange={(value) => setQuery(value)}
 *   onSubmit={(value) => handleSearch(value)}
 * />
 * ```
 */
export function SearchInput({
  value: controlledValue,
  placeholder = 'Search...',
  onChange,
  onSubmit,
  onClear,
  disabled = false,
  className,
  autoFocus = false,
}: SearchInputProps): React.JSX.Element {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChange?.('');
    onClear?.();
  }, [isControlled, onChange, onClear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit?.(value);
      }
      if (e.key === 'Escape') {
        handleClear();
      }
    },
    [value, onSubmit, handleClear],
  );

  return (
    <div
      className={cn(
        'relative flex items-center w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      data-testid="search-input"
    >
      {/* Show search icon when empty, X button when has value */}
      {!value ? (
        <Search
          className="absolute left-3 text-[var(--pixel-gray-500)] pointer-events-none"
          size={18}
          aria-hidden="true"
        />
      ) : (
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className={cn(
            'absolute left-1 p-2 min-w-[40px] min-h-[40px] flex items-center justify-center',
            'text-[var(--pixel-gray-500)] hover:text-[var(--pixel-gray-200)]',
            'focus:outline-none focus:text-[var(--pixel-blue-sky)]',
            'transition-colors duration-100',
            disabled && 'cursor-not-allowed',
          )}
          aria-label="Clear search"
          data-testid="search-input-clear"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        // biome-ignore lint/a11y/noAutofocus: Controlled via prop for intentional UX
        autoFocus={autoFocus}
        className={cn(
          'w-full pl-10 pr-4 py-3 min-h-[44px]',
          'bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-600)]',
          'text-[var(--pixel-gray-100)] placeholder:text-[var(--pixel-gray-500)]',
          'font-[family-name:var(--font-pixel-body)] text-sm',
          'focus:outline-none focus:border-[var(--pixel-blue-sky)] focus:shadow-[0_0_12px_var(--glow-blue)]',
          'hover:border-[var(--pixel-gray-500)]',
          'transition-all duration-150',
          disabled && 'cursor-not-allowed',
        )}
        data-testid="search-input-field"
      />
    </div>
  );
}
