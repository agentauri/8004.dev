import Link from 'next/link';
import type React from 'react';
import { memo } from 'react';
import { EvaluationStatusBadge } from '@/components/atoms';
import { EvaluationScores } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { Evaluation } from '@/types';

export interface EvaluationCardProps {
  /** Evaluation data */
  evaluation: Evaluation;
  /** Optional click handler (if not using Link) */
  onClick?: () => void;
  /** Whether to show the agent link */
  showAgent?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * Formats a date for display
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
 * EvaluationCard displays a summary of an agent evaluation.
 * Shows status badge, overall score, category scores, and timestamp.
 *
 * @example
 * ```tsx
 * <EvaluationCard
 *   evaluation={{
 *     id: 'eval-123',
 *     agentId: '11155111:456',
 *     status: 'completed',
 *     scores: { safety: 95, capability: 78, reliability: 82, performance: 65 },
 *     benchmarks: [],
 *     createdAt: new Date(),
 *     completedAt: new Date(),
 *   }}
 *   showAgent
 * />
 * ```
 */
export const EvaluationCard = memo(function EvaluationCard({
  evaluation,
  onClick,
  showAgent = false,
  className,
}: EvaluationCardProps): React.JSX.Element {
  const overallScore = calculateOverallScore(evaluation.scores);
  const isComplete = evaluation.status === 'completed';

  const cardContent = (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)] text-sm truncate">
            Evaluation #{evaluation.id.slice(0, 8)}
          </h3>
          {showAgent && (
            <Link
              href={`/agent/${evaluation.agentId}`}
              className="text-[0.6875rem] text-[var(--pixel-blue-sky)] hover:underline font-mono mt-1 block"
              onClick={(e) => e.stopPropagation()}
            >
              Agent: {evaluation.agentId}
            </Link>
          )}
        </div>
        <EvaluationStatusBadge status={evaluation.status} size="sm" />
      </div>

      {/* Overall Score */}
      {isComplete && (
        <div className="mb-4 text-center py-3 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]">
          <span className="font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wide text-[var(--pixel-gray-400)] block mb-1">
            Overall Score
          </span>
          <span
            className={cn(
              'font-[family-name:var(--font-pixel-display)] text-2xl tabular-nums',
              overallScore >= 80
                ? 'text-[var(--pixel-green-pipe)]'
                : overallScore >= 50
                  ? 'text-[var(--pixel-gold-coin)]'
                  : 'text-[var(--pixel-red-fire)]',
            )}
            data-testid="overall-score"
          >
            {overallScore}
          </span>
        </div>
      )}

      {/* Category Scores */}
      {isComplete && (
        <div className="mb-4">
          <EvaluationScores scores={evaluation.scores} layout="grid" size="sm" />
        </div>
      )}

      {/* Pending/Running message */}
      {!isComplete && (
        <div className="mb-4 py-6 text-center">
          <span className="font-mono text-sm text-[var(--pixel-gray-400)]">
            {evaluation.status === 'pending'
              ? 'Evaluation queued...'
              : evaluation.status === 'running'
                ? 'Evaluation in progress...'
                : 'Evaluation failed.'}
          </span>
        </div>
      )}

      {/* Timestamps */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--pixel-gray-700)]">
        <span className="text-[0.625rem] text-[var(--pixel-gray-500)] font-mono">
          Created: {formatDate(evaluation.createdAt)}
        </span>
        {evaluation.completedAt && (
          <span className="text-[0.625rem] text-[var(--pixel-gray-500)] font-mono">
            Completed: {formatDate(evaluation.completedAt)}
          </span>
        )}
      </div>
    </>
  );

  const cardClasses = cn(
    'block p-4 border-2 transition-all cursor-pointer bg-[var(--pixel-gray-dark)]',
    'hover:translate-y-[-2px] hover:border-[var(--pixel-blue-sky)]',
    'hover:shadow-[0_0_12px_var(--glow-blue)]',
    'border-[var(--pixel-gray-700)]',
    className,
  );

  if (onClick) {
    return (
      <div
        className={cardClasses}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        data-testid="evaluation-card"
        data-evaluation-id={evaluation.id}
        data-status={evaluation.status}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div
      className={cardClasses}
      data-testid="evaluation-card"
      data-evaluation-id={evaluation.id}
      data-status={evaluation.status}
    >
      {cardContent}
    </div>
  );
});
