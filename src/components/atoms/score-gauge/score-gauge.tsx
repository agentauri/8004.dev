import type React from 'react';
import { cn } from '@/lib/utils';

export type ScoreLevel = 'low' | 'medium' | 'high';

export interface ScoreGaugeProps {
  /** Score value from 0 to 100 */
  score: number;
  /** Label for the gauge */
  label: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the numeric value */
  showValue?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * Determines score level based on value
 */
export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

const SCORE_CONFIG: Record<
  ScoreLevel,
  { colorClass: string; glowClass: string; fillClass: string }
> = {
  low: {
    colorClass: 'text-[var(--pixel-red-fire)]',
    glowClass: 'shadow-[0_0_6px_var(--glow-red)]',
    fillClass: 'bg-[var(--pixel-red-fire)]',
  },
  medium: {
    colorClass: 'text-[var(--pixel-gold-coin)]',
    glowClass: 'shadow-[0_0_6px_var(--glow-gold)]',
    fillClass: 'bg-[var(--pixel-gold-coin)]',
  },
  high: {
    colorClass: 'text-[var(--pixel-green-pipe)]',
    glowClass: 'shadow-[0_0_6px_var(--glow-green)]',
    fillClass: 'bg-[var(--pixel-green-pipe)]',
  },
};

const SIZE_CLASSES = {
  sm: {
    container: 'gap-1',
    label: 'text-[0.5rem]',
    bar: 'h-1.5',
    value: 'text-[0.5rem]',
  },
  md: {
    container: 'gap-1.5',
    label: 'text-[0.625rem]',
    bar: 'h-2',
    value: 'text-[0.625rem]',
  },
  lg: {
    container: 'gap-2',
    label: 'text-[0.75rem]',
    bar: 'h-3',
    value: 'text-[0.75rem]',
  },
};

/**
 * ScoreGauge displays a score with a retro-style progress bar and label.
 * Color-coded based on score level: green (80-100), yellow (50-79), red (0-49).
 *
 * @example
 * ```tsx
 * <ScoreGauge score={85} label="Safety" />
 * <ScoreGauge score={45} label="Performance" showValue={false} />
 * ```
 */
export function ScoreGauge({
  score,
  label,
  size = 'md',
  showValue = true,
  className,
}: ScoreGaugeProps): React.JSX.Element {
  const clampedScore = Math.max(0, Math.min(100, score));
  const level = getScoreLevel(clampedScore);
  const config = SCORE_CONFIG[level];
  const sizeConfig = SIZE_CLASSES[size];

  return (
    <div
      className={cn('flex flex-col', sizeConfig.container, className)}
      data-testid="score-gauge"
      data-level={level}
      data-score={clampedScore}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'font-[family-name:var(--font-pixel-body)] uppercase tracking-wide',
            'text-[var(--pixel-gray-200)]',
            sizeConfig.label,
          )}
        >
          {label}
        </span>
        {showValue && (
          <span
            className={cn('font-bold tabular-nums', config.colorClass, sizeConfig.value)}
            data-testid="score-value"
          >
            {clampedScore}
          </span>
        )}
      </div>
      <div
        className={cn(
          'w-full bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]',
          sizeConfig.bar,
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 motion-reduce:transition-none',
            config.fillClass,
            config.glowClass,
          )}
          style={{ width: `${clampedScore}%` }}
          data-testid="score-fill"
        />
      </div>
    </div>
  );
}
