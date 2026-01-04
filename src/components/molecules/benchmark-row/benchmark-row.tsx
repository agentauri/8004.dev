'use client';

import type React from 'react';
import { useState } from 'react';
import { getScoreLevel } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { BenchmarkResult } from '@/types';

export interface BenchmarkRowProps {
  /** Benchmark result data */
  benchmark: BenchmarkResult;
  /** Whether to show expandable details section */
  showDetails?: boolean;
  /** Optional additional class names */
  className?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  safety: '🛡',
  capability: '⚡',
  reliability: '🔒',
  performance: '🚀',
};

const SCORE_CONFIG = {
  low: {
    colorClass: 'text-[var(--pixel-red-fire)]',
    fillClass: 'bg-[var(--pixel-red-fire)]',
    glowClass: 'shadow-[0_0_4px_var(--glow-red)]',
  },
  medium: {
    colorClass: 'text-[var(--pixel-gold-coin)]',
    fillClass: 'bg-[var(--pixel-gold-coin)]',
    glowClass: 'shadow-[0_0_4px_var(--glow-gold)]',
  },
  high: {
    colorClass: 'text-[var(--pixel-green-pipe)]',
    fillClass: 'bg-[var(--pixel-green-pipe)]',
    glowClass: 'shadow-[0_0_4px_var(--glow-green)]',
  },
};

/**
 * BenchmarkRow displays a single benchmark result with name, score bar, and max score.
 * Optionally includes an expandable details section.
 *
 * @example
 * ```tsx
 * <BenchmarkRow
 *   benchmark={{
 *     name: 'Input Validation',
 *     category: 'safety',
 *     score: 85,
 *     maxScore: 100,
 *     details: 'Passed all input validation tests.',
 *   }}
 *   showDetails
 * />
 * ```
 */
export function BenchmarkRow({
  benchmark,
  showDetails = false,
  className,
}: BenchmarkRowProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);

  const percentage = benchmark.maxScore > 0 ? (benchmark.score / benchmark.maxScore) * 100 : 0;
  const level = getScoreLevel(percentage);
  const config = SCORE_CONFIG[level];
  const icon = CATEGORY_ICONS[benchmark.category] || '📊';

  const hasDetails = showDetails && benchmark.details;

  return (
    <div
      className={cn(
        'bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]',
        'transition-all duration-200 motion-reduce:transition-none',
        hasDetails && 'cursor-pointer hover:border-[var(--pixel-gray-600)]',
        className,
      )}
      data-testid="benchmark-row"
      data-category={benchmark.category}
      onClick={hasDetails ? () => setIsExpanded(!isExpanded) : undefined}
      onKeyDown={
        hasDetails
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }
            }
          : undefined
      }
      role={hasDetails ? 'button' : undefined}
      tabIndex={hasDetails ? 0 : undefined}
      aria-expanded={hasDetails ? isExpanded : undefined}
    >
      <div className="p-3">
        <div className="flex items-center gap-3">
          {/* Category icon */}
          <span className="text-base" aria-hidden="true">
            {icon}
          </span>

          {/* Name and progress */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span
                className="font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wide text-[var(--pixel-gray-200)] truncate"
                title={benchmark.name}
              >
                {benchmark.name}
              </span>
              <span
                className={cn('font-bold text-[0.625rem] tabular-nums', config.colorClass)}
                data-testid="benchmark-score"
              >
                {benchmark.score}/{benchmark.maxScore}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-[var(--pixel-gray-700)] w-full">
              <div
                className={cn(
                  'h-full transition-all duration-300 motion-reduce:transition-none',
                  config.fillClass,
                  config.glowClass,
                )}
                style={{ width: `${percentage}%` }}
                data-testid="benchmark-fill"
              />
            </div>
          </div>

          {/* Expand indicator */}
          {hasDetails && (
            <span
              className={cn(
                'text-[var(--pixel-gray-400)] text-sm transition-transform duration-200 motion-reduce:transition-none',
                isExpanded && 'rotate-180',
              )}
              aria-hidden="true"
            >
              ▼
            </span>
          )}
        </div>
      </div>

      {/* Expandable details */}
      {hasDetails && isExpanded && (
        <div
          className="px-3 pb-3 pt-0 border-t border-[var(--pixel-gray-700)]"
          data-testid="benchmark-details"
        >
          <p className="text-[0.6875rem] text-[var(--pixel-gray-400)] font-mono leading-relaxed mt-2">
            {benchmark.details}
          </p>
        </div>
      )}
    </div>
  );
}
