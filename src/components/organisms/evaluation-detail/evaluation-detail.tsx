import type React from 'react';
import { EvaluationStatusBadge, ScoreGauge } from '@/components/atoms';
import { BenchmarkRow, EvaluationScores } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { BenchmarkCategory, Evaluation } from '@/types';

export interface EvaluationDetailProps {
  /** Evaluation data */
  evaluation: Evaluation;
  /** Optional close handler */
  onClose?: () => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * Formats a date for display
 */
function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

/**
 * Calculates the overall score from individual category scores
 */
function calculateOverallScore(scores: Evaluation['scores']): number {
  const { safety, capability, reliability, performance } = scores;
  return Math.round((safety + capability + reliability + performance) / 4);
}

/**
 * Groups benchmarks by category
 */
function groupBenchmarksByCategory(
  benchmarks: Evaluation['benchmarks'],
): Record<BenchmarkCategory, Evaluation['benchmarks']> {
  const groups: Record<BenchmarkCategory, Evaluation['benchmarks']> = {
    safety: [],
    capability: [],
    reliability: [],
    performance: [],
  };

  for (const benchmark of benchmarks) {
    groups[benchmark.category].push(benchmark);
  }

  return groups;
}

const CATEGORY_LABELS: Record<BenchmarkCategory, string> = {
  safety: 'Safety',
  capability: 'Capability',
  reliability: 'Reliability',
  performance: 'Performance',
};

/**
 * EvaluationDetail displays a full evaluation view with all benchmarks and score breakdowns.
 * Shows timeline from creation to completion and detailed results by category.
 *
 * @example
 * ```tsx
 * <EvaluationDetail
 *   evaluation={evaluation}
 *   onClose={() => setShowDetail(false)}
 * />
 * ```
 */
export function EvaluationDetail({
  evaluation,
  onClose,
  className,
}: EvaluationDetailProps): React.JSX.Element {
  const overallScore = calculateOverallScore(evaluation.scores);
  const isComplete = evaluation.status === 'completed';
  const benchmarkGroups = groupBenchmarksByCategory(evaluation.benchmarks);
  const categories: BenchmarkCategory[] = ['safety', 'capability', 'reliability', 'performance'];

  return (
    <div
      className={cn(
        'bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="evaluation-detail"
      data-evaluation-id={evaluation.id}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-4 border-b border-[var(--pixel-gray-700)]">
        <div className="flex-1 min-w-0">
          <h2 className="font-[family-name:var(--font-pixel-heading)] text-lg text-[var(--pixel-gray-100)]">
            Evaluation Results
          </h2>
          <p className="text-[0.75rem] text-[var(--pixel-gray-400)] font-mono mt-1">
            ID: {evaluation.id}
          </p>
          <p className="text-[0.75rem] text-[var(--pixel-gray-400)] font-mono">
            Agent: {evaluation.agentId}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <EvaluationStatusBadge status={evaluation.status} />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'w-8 h-8 flex items-center justify-center',
                'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)]',
                'border border-[var(--pixel-gray-700)] hover:border-[var(--pixel-gray-600)]',
                'transition-colors',
              )}
              aria-label="Close evaluation detail"
              data-testid="close-button"
            >
              X
            </button>
          )}
        </div>
      </div>

      {/* Overall Score Section */}
      {isComplete && (
        <div className="p-4 border-b border-[var(--pixel-gray-700)]">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wide text-[var(--pixel-gray-400)] block mb-2">
                Overall Score
              </span>
              <span
                className={cn(
                  'font-[family-name:var(--font-pixel-display)] text-4xl tabular-nums',
                  overallScore >= 80
                    ? 'text-[var(--pixel-green-pipe)] text-shadow-[0_0_12px_var(--glow-green)]'
                    : overallScore >= 50
                      ? 'text-[var(--pixel-gold-coin)] text-shadow-[0_0_12px_var(--glow-gold)]'
                      : 'text-[var(--pixel-red-fire)] text-shadow-[0_0_12px_var(--glow-red)]',
                )}
                data-testid="overall-score"
              >
                {overallScore}
              </span>
            </div>
            <div className="flex-1">
              <EvaluationScores scores={evaluation.scores} layout="grid" />
            </div>
          </div>
        </div>
      )}

      {/* Timeline Section */}
      <div className="p-4 border-b border-[var(--pixel-gray-700)]">
        <h3 className="font-[family-name:var(--font-pixel-body)] text-[0.75rem] uppercase tracking-wide text-[var(--pixel-gray-200)] mb-3">
          Timeline
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[var(--pixel-blue-sky)] rounded-full" />
            <span className="text-[0.75rem] text-[var(--pixel-gray-400)] font-mono">
              Created: {formatDateTime(evaluation.createdAt)}
            </span>
          </div>
          {evaluation.completedAt && (
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  evaluation.status === 'completed'
                    ? 'bg-[var(--pixel-green-pipe)]'
                    : 'bg-[var(--pixel-red-fire)]',
                )}
              />
              <span className="text-[0.75rem] text-[var(--pixel-gray-400)] font-mono">
                {evaluation.status === 'completed' ? 'Completed' : 'Failed'}:{' '}
                {formatDateTime(evaluation.completedAt)}
              </span>
            </div>
          )}
          {!evaluation.completedAt && evaluation.status === 'running' && (
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[var(--pixel-blue-sky)] rounded-full animate-pulse" />
              <span className="text-[0.75rem] text-[var(--pixel-gray-400)] font-mono">
                Running...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Benchmark Results Section */}
      {isComplete && evaluation.benchmarks.length > 0 && (
        <div className="p-4">
          <h3 className="font-[family-name:var(--font-pixel-body)] text-[0.75rem] uppercase tracking-wide text-[var(--pixel-gray-200)] mb-4">
            Benchmark Results
          </h3>

          <div className="space-y-6">
            {categories.map((category) => {
              const benchmarks = benchmarkGroups[category];
              if (benchmarks.length === 0) return null;

              return (
                <div key={category} data-testid={`benchmark-category-${category}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-[family-name:var(--font-pixel-body)] text-[0.6875rem] uppercase tracking-wide text-[var(--pixel-gray-300)]">
                      {CATEGORY_LABELS[category]}
                    </span>
                    <ScoreGauge
                      score={evaluation.scores[category]}
                      label=""
                      size="sm"
                      showValue={false}
                      className="flex-1 max-w-[100px]"
                    />
                    <span className="text-[0.6875rem] font-mono text-[var(--pixel-gray-400)]">
                      {evaluation.scores[category]}/100
                    </span>
                  </div>
                  <div className="space-y-2">
                    {benchmarks.map((benchmark, index) => (
                      <BenchmarkRow
                        key={`${benchmark.name}-${index}`}
                        benchmark={benchmark}
                        showDetails
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state for no benchmarks */}
      {isComplete && evaluation.benchmarks.length === 0 && (
        <div className="p-8 text-center">
          <span className="text-[var(--pixel-gray-400)] font-mono text-sm">
            No detailed benchmark results available.
          </span>
        </div>
      )}

      {/* Pending/Running/Failed state */}
      {!isComplete && (
        <div className="p-8 text-center">
          <span className="text-[var(--pixel-gray-400)] font-mono text-sm">
            {evaluation.status === 'pending'
              ? 'Evaluation is queued and will begin shortly...'
              : evaluation.status === 'running'
                ? 'Evaluation is in progress. Results will appear here when complete.'
                : 'Evaluation failed. Please check the logs or try again.'}
          </span>
        </div>
      )}
    </div>
  );
}
