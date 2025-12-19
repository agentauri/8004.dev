import type React from 'react';
import { SearchInput } from '@/components/molecules';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  /** Current search query */
  query?: string;
  /** Callback when query changes */
  onQueryChange?: (query: string) => void;
  /** Callback when search is submitted */
  onSubmit?: (query: string) => void;
  /** Whether search is loading */
  isLoading?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to auto-focus on mount */
  autoFocus?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * SearchBar provides the main search interface for agents.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   query={searchQuery}
 *   onQueryChange={setSearchQuery}
 *   onSubmit={handleSearch}
 *   isLoading={isSearching}
 * />
 * ```
 */
export function SearchBar({
  query = '',
  onQueryChange,
  onSubmit,
  isLoading = false,
  placeholder = 'Search agents by name, description, or address...',
  autoFocus = false,
  className,
}: SearchBarProps): React.JSX.Element {
  const handleChange = (value: string) => {
    onQueryChange?.(value);
  };

  const handleSubmit = (value: string) => {
    onSubmit?.(value);
  };

  const handleClear = () => {
    onQueryChange?.('');
    onSubmit?.('');
  };

  return (
    <div className={cn('w-full', className)} data-testid="search-bar">
      <SearchInput
        value={query}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClear={handleClear}
        placeholder={placeholder}
        disabled={isLoading}
        autoFocus={autoFocus}
        className="w-full"
      />
      {isLoading && (
        <div
          className="mt-3 text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-xs animate-pulse"
          data-testid="search-loading"
        >
          Searching...
        </div>
      )}
    </div>
  );
}
