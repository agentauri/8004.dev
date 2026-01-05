/**
 * FeedbackFilters organism
 *
 * Sidebar filters for the feedbacks page including score category, chain filters.
 */

'use client';

import { Filter, Minus, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import type { ChainId } from '@/components/atoms';
import { ChainSelector } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { FeedbackScoreCategory, FeedbackStats, GlobalFeedbackFilters } from '@/types/feedback';

export interface FeedbackFiltersProps {
  /** Current filter state */
  filters: GlobalFeedbackFilters;
  /** Callback when filters change */
  onFiltersChange: (filters: GlobalFeedbackFilters) => void;
  /** Aggregated statistics */
  stats?: FeedbackStats;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Optional additional class names */
  className?: string;
}

const CATEGORY_OPTIONS: {
  value: FeedbackScoreCategory | undefined;
  label: string;
  icon: typeof ThumbsUp;
  color: string;
}[] = [
  { value: undefined, label: 'All', icon: Filter, color: 'text-[var(--pixel-gray-400)]' },
  { value: 'positive', label: 'Positive', icon: ThumbsUp, color: 'text-[var(--pixel-green-pipe)]' },
  { value: 'neutral', label: 'Neutral', icon: Minus, color: 'text-[var(--pixel-gold-coin)]' },
  { value: 'negative', label: 'Negative', icon: ThumbsDown, color: 'text-[var(--pixel-red-fire)]' },
];

export function FeedbackFilters({
  filters,
  onFiltersChange,
  stats,
  isLoading = false,
  className,
}: FeedbackFiltersProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryChange = (category: FeedbackScoreCategory | undefined) => {
    onFiltersChange({ ...filters, scoreCategory: category });
  };

  const handleChainChange = (chains: ChainId[]) => {
    onFiltersChange({ ...filters, chains });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      chains: [],
      scoreCategory: undefined,
    });
  };

  const hasActiveFilters =
    (filters.chains && filters.chains.length > 0) || filters.scoreCategory !== undefined;

  return (
    <div className={cn('space-y-4', className)} data-testid="feedback-filters">
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
        {/* Stats Summary */}
        {stats && (
          <div className="pb-4 border-b border-[var(--pixel-gray-700)]">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-[family-name:var(--font-pixel-display)] text-2xl text-[var(--pixel-gray-100)]">
                  {isLoading ? '...' : stats.total.toLocaleString()}
                </span>
                <span className="ml-2 text-[var(--pixel-gray-500)] text-xs uppercase">total</span>
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <ThumbsUp size={12} className="text-[var(--pixel-green-pipe)]" />
                  <span className="text-[var(--pixel-gray-400)]">{stats.positive}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Minus size={12} className="text-[var(--pixel-gold-coin)]" />
                  <span className="text-[var(--pixel-gray-400)]">{stats.neutral}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsDown size={12} className="text-[var(--pixel-red-fire)]" />
                  <span className="text-[var(--pixel-gray-400)]">{stats.negative}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Score Category Filter */}
        <div>
          <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase tracking-wider mb-3">
            Score Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = filters.scoreCategory === option.value;
              return (
                <button
                  key={option.value ?? 'all'}
                  type="button"
                  onClick={() => handleCategoryChange(option.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-xs font-[family-name:var(--font-pixel-body)] uppercase tracking-wider',
                    'border-2 transition-all duration-200',
                    isSelected
                      ? 'border-[var(--pixel-blue-sky)] bg-[var(--pixel-blue-sky)]/20 text-[var(--pixel-blue-sky)]'
                      : 'border-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-500)]',
                  )}
                  aria-pressed={isSelected}
                >
                  <Icon
                    size={12}
                    className={isSelected ? 'text-[var(--pixel-blue-sky)]' : option.color}
                  />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chain Filter */}
        <div>
          <h3 className="text-[var(--pixel-gray-400)] text-xs uppercase tracking-wider mb-3">
            Chains
          </h3>
          <ChainSelector value={(filters.chains ?? []) as ChainId[]} onChange={handleChainChange} />
        </div>

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
