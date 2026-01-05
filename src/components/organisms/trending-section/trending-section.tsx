/**
 * TrendingSection organism
 *
 * Displays agents with the highest reputation growth over a selected time period.
 * Features period selector and auto-refresh every 5 minutes.
 */

'use client';

import { Flame, RefreshCw } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { TrendingAgentCard } from '@/components/molecules';
import { useTrending } from '@/hooks';
import { cn } from '@/lib/utils';
import type { TrendingPeriod } from '@/types/trending';

export interface TrendingSectionProps {
  /** Initial time period for trending calculation */
  initialPeriod?: TrendingPeriod;
  /** Number of agents to display (max 10) */
  limit?: number;
  /** Optional additional class names */
  className?: string;
}

const PERIOD_OPTIONS: { value: TrendingPeriod; label: string }[] = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
];

/**
 * Loading skeleton for trending cards
 */
function TrendingCardSkeleton(): React.JSX.Element {
  return (
    <div
      className="p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] animate-pulse"
      data-testid="trending-card-skeleton"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-[var(--pixel-gray-700)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[var(--pixel-gray-700)] w-3/4" />
          <div className="h-3 bg-[var(--pixel-gray-700)] w-1/2" />
        </div>
      </div>
      <div className="flex justify-between mb-3">
        <div className="h-6 bg-[var(--pixel-gray-700)] w-16" />
        <div className="h-5 bg-[var(--pixel-gray-700)] w-20" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 bg-[var(--pixel-gray-700)] w-12" />
        <div className="h-5 bg-[var(--pixel-gray-700)] w-12" />
      </div>
    </div>
  );
}

export function TrendingSection({
  initialPeriod = '7d',
  limit = 5,
  className,
}: TrendingSectionProps): React.JSX.Element {
  const [period, setPeriod] = useState<TrendingPeriod>(initialPeriod);
  const { data, isLoading, error, isFetching, refetch } = useTrending({ period, limit });

  return (
    <section className={cn('w-full', className)} data-testid="trending-section">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Flame className="w-6 h-6 text-[var(--pixel-red-fire)]" aria-hidden="true" />
          <h2 className="font-[family-name:var(--font-pixel-heading)] text-xl text-[var(--pixel-gray-100)]">
            Trending Agents
          </h2>
          {isFetching && !isLoading && (
            <RefreshCw
              className="w-4 h-4 text-[var(--pixel-gray-500)] animate-spin"
              aria-label="Refreshing"
            />
          )}
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[var(--pixel-gray-500)] text-xs uppercase tracking-wider mr-2">
            Period:
          </span>
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              className={cn(
                'px-3 py-1.5 text-xs font-[family-name:var(--font-pixel-body)] uppercase tracking-wider',
                'border-2 transition-all duration-200',
                period === option.value
                  ? 'border-[var(--pixel-blue-sky)] bg-[var(--pixel-blue-sky)]/20 text-[var(--pixel-blue-sky)] shadow-[0_0_8px_var(--glow-blue)]'
                  : 'border-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-500)] hover:text-[var(--pixel-gray-200)]',
              )}
              aria-pressed={period === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div
          className="p-6 border-2 border-[var(--pixel-red-fire)] bg-[var(--pixel-red-fire)]/10 text-center"
          role="alert"
        >
          <p className="text-[var(--pixel-red-fire)] font-[family-name:var(--font-pixel-body)] mb-4">
            Failed to load trending agents
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-[family-name:var(--font-pixel-body)] uppercase tracking-wider border-2 border-[var(--pixel-red-fire)] text-[var(--pixel-red-fire)] hover:bg-[var(--pixel-red-fire)]/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: limit }).map((_, index) => (
            <TrendingCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && data?.agents.length === 0 && (
        <div className="p-8 border-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-dark)] text-center">
          <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)]">
            No trending agents found for the selected period.
          </p>
        </div>
      )}

      {/* Agents Grid */}
      {!isLoading && !error && data && data.agents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {data.agents.map((agent, index) => (
            <TrendingAgentCard key={agent.id} agent={agent} rank={index + 1} />
          ))}
        </div>
      )}

      {/* Last Updated Timestamp */}
      {data?.generatedAt && (
        <p className="mt-4 text-xs text-[var(--pixel-gray-500)] text-right font-mono">
          Updated: {new Date(data.generatedAt).toLocaleTimeString()}
        </p>
      )}
    </section>
  );
}
