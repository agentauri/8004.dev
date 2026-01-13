'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { SearchFiltersState } from '@/components/organisms/search-filters';
import { SearchFilters } from '@/components/organisms/search-filters';
import { cn } from '@/lib/utils';

export interface MobileFilterSheetProps {
  /** Current filter state */
  filters: SearchFiltersState;
  /** Callback when filters change */
  onFiltersChange: (filters: SearchFiltersState) => void;
  /** Filter counts for badges */
  counts?: {
    active?: number;
    inactive?: number;
    mcp?: number;
    a2a?: number;
    x402?: number;
  };
  /** Whether the filters are disabled */
  disabled?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * MobileFilterSheet provides a bottom sheet UI for filters on mobile devices.
 * It displays a trigger button that opens a full-height bottom sheet with all filters.
 *
 * @example
 * ```tsx
 * <MobileFilterSheet
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   counts={filterCounts}
 * />
 * ```
 */
export function MobileFilterSheet({
  filters,
  onFiltersChange,
  counts,
  disabled = false,
  className,
}: MobileFilterSheetProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  // Count active filters for badge
  const activeFilterCount = [
    filters.status.length > 0 ? 1 : 0,
    filters.protocols.length > 0 ? 1 : 0,
    filters.chains.length > 0 ? 1 : 0,
    filters.skills.length > 0 ? 1 : 0,
    filters.domains.length > 0 ? 1 : 0,
    filters.minReputation > 0 || filters.maxReputation < 100 ? 1 : 0,
    // Trust Score Filters
    filters.minTrustScore > 0 || filters.maxTrustScore < 100 ? 1 : 0,
    // Curation Filters
    filters.isCurated ? 1 : 0,
    filters.curatedBy !== '' ? 1 : 0,
    // Endpoint Filters
    filters.hasEmail ? 1 : 0,
    filters.hasOasfEndpoint ? 1 : 0,
    // Reachability Filters
    filters.hasRecentReachability ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    },
    [isOpen],
  );

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className={className} data-testid="mobile-filter-sheet">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          'flex items-center gap-2 px-4 py-3',
          'bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]',
          'text-[var(--pixel-gray-200)] text-sm',
          'min-h-[44px]',
          'transition-colors',
          'hover:bg-[var(--pixel-gray-700)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--pixel-blue-sky)]',
          disabled && 'opacity-50 pointer-events-none',
        )}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        data-testid="mobile-filter-sheet-trigger"
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span
            className="bg-[var(--pixel-blue-sky)] text-white text-xs px-2 py-0.5 rounded-full"
            data-testid="mobile-filter-sheet-count"
          >
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
          onClick={handleClose}
          aria-hidden="true"
          data-testid="mobile-filter-sheet-backdrop"
        />
      )}

      {/* Bottom Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter options"
        className={cn(
          'fixed inset-x-0 bottom-0 z-50',
          'bg-[var(--pixel-gray-900)] border-t border-[var(--pixel-gray-700)]',
          'rounded-t-2xl max-h-[85vh]',
          'flex flex-col',
          'transform transition-transform duration-300 ease-out',
          isOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none',
        )}
        data-testid="mobile-filter-sheet-panel"
      >
        {/* Handle */}
        <div className="flex justify-center py-3 shrink-0">
          <div className="w-12 h-1 bg-[var(--pixel-gray-600)] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-[var(--pixel-gray-700)] shrink-0">
          <h2 className="text-lg font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)]">
            Filters
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'p-2 min-w-[44px] min-h-[44px]',
              'flex items-center justify-center',
              'rounded-lg',
              'hover:bg-[var(--pixel-gray-800)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--pixel-blue-sky)]',
            )}
            aria-label="Close filters"
            data-testid="mobile-filter-sheet-close"
          >
            <X size={24} className="text-[var(--pixel-gray-400)]" />
          </button>
        </div>

        {/* Filters Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4" data-testid="mobile-filter-sheet-content">
          <SearchFilters
            filters={filters}
            onFiltersChange={onFiltersChange}
            counts={counts}
            disabled={disabled}
          />
        </div>

        {/* Apply Button (sticky bottom) */}
        <div className="shrink-0 p-4 bg-[var(--pixel-gray-900)] border-t border-[var(--pixel-gray-700)]">
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'w-full py-3 px-4',
              'bg-[var(--pixel-blue-sky)] text-white',
              'font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider',
              'min-h-[44px]',
              'transition-colors',
              'hover:bg-[var(--pixel-blue-sky)]/90',
              'focus:outline-none focus:ring-2 focus:ring-[var(--pixel-blue-sky)] focus:ring-offset-2 focus:ring-offset-[var(--pixel-gray-900)]',
            )}
            data-testid="mobile-filter-sheet-apply"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
