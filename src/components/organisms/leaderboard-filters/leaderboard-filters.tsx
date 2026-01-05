/**
 * LeaderboardFilters organism
 *
 * Sidebar filters for the leaderboard page including period, chain, and protocol filters.
 */

'use client';

import { Filter, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { type ChainId } from '@/components/atoms';
import { ChainSelector, FilterGroup } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { LeaderboardFiltersState, LeaderboardPeriod } from '@/types/leaderboard';

export interface LeaderboardFiltersProps {
  /** Current filter state */
  filters: LeaderboardFiltersState;
  /** Callback when filters change */
  onFiltersChange: (filters: LeaderboardFiltersState) => void;
  /** Total count of results */
  totalCount?: number;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Optional additional class names */
  className?: string;
}

const PERIOD_OPTIONS: { value: LeaderboardPeriod; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '24h', label: 'Last 24 Hours' },
];

const PROTOCOL_OPTIONS = [
  { value: 'mcp' as const, label: 'MCP' },
  { value: 'a2a' as const, label: 'A2A' },
  { value: 'x402' as const, label: 'x402' },
];

export function LeaderboardFilters({
  filters,
  onFiltersChange,
  totalCount,
  isLoading = false,
  className,
}: LeaderboardFiltersProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePeriodChange = (period: LeaderboardPeriod) => {
    onFiltersChange({ ...filters, period });
  };

  const handleChainChange = (chains: ChainId[]) => {
    onFiltersChange({ ...filters, chains });
  };

  const handleProtocolChange = (protocols: ('mcp' | 'a2a' | 'x402')[]) => {
    onFiltersChange({ ...filters, protocols });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      chains: [],
      protocols: [],
      period: 'all',
    });
  };

  const hasActiveFilters =
    filters.chains.length > 0 || filters.protocols.length > 0 || filters.period !== 'all';

  return (
    <div className={cn('space-y-4', className)} data-testid="leaderboard-filters">
      {/* Mobile Filter Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden w-full flex items-center justify-between p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]"
      >
        <span className="flex items-center gap-2 text-[var(--pixel-gray-100)]">
          <Filter size={16} />
          <span className="font-[family-name:var(--font-pixel-body)] text-sm uppercase">
            Filters
          </span>
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 bg-[var(--pixel-blue-sky)] text-[var(--pixel-black)] text-[0.625rem]">
              Active
            </span>
          )}
        </span>
        <span className="text-[var(--pixel-gray-500)]">{isExpanded ? '−' : '+'}</span>
      </button>

      {/* Filters Content */}
      <div
        className={cn(
          'space-y-6 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] p-4',
          'md:block',
          isExpanded ? 'block' : 'hidden',
        )}
      >
        {/* Results Count */}
        {totalCount !== undefined && (
          <div className="pb-4 border-b border-[var(--pixel-gray-700)]">
            <span className="font-[family-name:var(--font-pixel-display)] text-2xl text-[var(--pixel-gray-100)]">
              {isLoading ? '...' : totalCount.toLocaleString()}
            </span>
            <span className="ml-2 text-[var(--pixel-gray-500)] text-xs uppercase">agents</span>
          </div>
        )}

        {/* Period Filter */}
        <div>
          <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase tracking-wider mb-3">
            Time Period
          </h3>
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handlePeriodChange(option.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-[family-name:var(--font-pixel-body)] uppercase tracking-wider',
                  'border-2 transition-all duration-200',
                  filters.period === option.value
                    ? 'border-[var(--pixel-blue-sky)] bg-[var(--pixel-blue-sky)]/20 text-[var(--pixel-blue-sky)]'
                    : 'border-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-500)]',
                )}
                aria-pressed={filters.period === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chain Filter */}
        <div>
          <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase tracking-wider mb-3">
            Chains
          </h3>
          <ChainSelector
            value={filters.chains as ChainId[]}
            onChange={handleChainChange}
          />
        </div>

        {/* Protocol Filter */}
        <FilterGroup
          label="Protocols"
          options={PROTOCOL_OPTIONS}
          selected={filters.protocols}
          onChange={handleProtocolChange}
        />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-[family-name:var(--font-pixel-body)] uppercase tracking-wider text-[var(--pixel-red-fire)] border-2 border-[var(--pixel-red-fire)] hover:bg-[var(--pixel-red-fire)]/20 transition-colors"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
