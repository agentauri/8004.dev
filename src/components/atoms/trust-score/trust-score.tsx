import type React from 'react';
import { cn } from '@/lib/utils';

export type TrustLevel = 'low' | 'medium' | 'high';

export interface TrustScoreProps {
  /** Score value from 0 to 100 */
  score: number;
  /** Whether to show the numeric score */
  showScore?: boolean;
  /** Number of reputation feedbacks (displayed in parentheses) */
  count?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional additional class names */
  className?: string;
}

/**
 * Determines trust level based on score
 */
export function getTrustLevel(score: number): TrustLevel {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

const TRUST_CONFIG: Record<
  TrustLevel,
  { label: string; colorClass: string; glowClass: string; bgClass: string }
> = {
  low: {
    label: 'LOW',
    colorClass: 'text-[var(--trust-low)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-red)]',
    bgClass: 'bg-[rgba(252,84,84,0.1)]',
  },
  medium: {
    label: 'MED',
    colorClass: 'text-[var(--trust-med)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-gold)]',
    bgClass: 'bg-[rgba(252,192,60,0.1)]',
  },
  high: {
    label: 'HIGH',
    colorClass: 'text-[var(--trust-high)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-green)]',
    bgClass: 'bg-[rgba(0,216,0,0.1)]',
  },
};

const SIZE_CLASSES = {
  sm: 'text-[0.5rem] px-1.5 py-0.5',
  md: '', // Uses badge-pixel defaults
  lg: 'text-[0.75rem] px-3 py-1.5',
};

/**
 * TrustScore displays a reputation score with color-coded trust level indicator.
 *
 * @example
 * ```tsx
 * <TrustScore score={85} />
 * <TrustScore score={50} showScore />
 * <TrustScore score={25} size="lg" />
 * ```
 */
export function TrustScore({
  score,
  showScore = true,
  count,
  size = 'md',
  className,
}: TrustScoreProps): React.JSX.Element {
  const clampedScore = Math.max(0, Math.min(100, score));
  const level = getTrustLevel(clampedScore);
  const config = TRUST_CONFIG[level];

  return (
    <span
      className={cn(
        'badge-pixel font-bold',
        config.colorClass,
        config.glowClass,
        config.bgClass,
        SIZE_CLASSES[size],
        className,
      )}
      data-testid="trust-score"
      data-level={level}
      data-score={clampedScore}
    >
      {showScore && <span className="tabular-nums">{clampedScore}</span>}
      <span>{config.label}</span>
      {count !== undefined && count > 0 && (
        <span className="opacity-70 tabular-nums">({count})</span>
      )}
    </span>
  );
}
