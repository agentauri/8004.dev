import type React from 'react';
import { ScoreGauge } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { EvaluationScores as EvaluationScoresType } from '@/types';

export interface EvaluationScoresProps {
  /** Score values for each category */
  scores: EvaluationScoresType;
  /** Layout direction */
  layout?: 'horizontal' | 'grid';
  /** Size variant */
  size?: 'sm' | 'md';
  /** Optional additional class names */
  className?: string;
}

const SCORE_LABELS: Record<keyof EvaluationScoresType, string> = {
  safety: 'Safety',
  capability: 'Capability',
  reliability: 'Reliability',
  performance: 'Performance',
};

/**
 * EvaluationScores displays all four benchmark category scores in a grid or row layout.
 * Uses ScoreGauge components to show visual progress bars for each category.
 *
 * @example
 * ```tsx
 * <EvaluationScores
 *   scores={{ safety: 95, capability: 78, reliability: 82, performance: 65 }}
 *   layout="grid"
 * />
 * ```
 */
export function EvaluationScores({
  scores,
  layout = 'grid',
  size = 'md',
  className,
}: EvaluationScoresProps): React.JSX.Element {
  const scoreEntries = Object.entries(scores) as Array<[keyof EvaluationScoresType, number]>;

  return (
    <div
      className={cn(
        layout === 'grid'
          ? 'grid grid-cols-2 gap-3 md:gap-4'
          : 'flex flex-row gap-4 overflow-x-auto',
        className,
      )}
      data-testid="evaluation-scores"
      data-layout={layout}
    >
      {scoreEntries.map(([category, score]) => (
        <ScoreGauge
          key={category}
          score={score}
          label={SCORE_LABELS[category]}
          size={size}
          className={layout === 'horizontal' ? 'min-w-[120px] flex-shrink-0' : ''}
        />
      ))}
    </div>
  );
}
