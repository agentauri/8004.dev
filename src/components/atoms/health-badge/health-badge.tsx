import { Activity } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';

export type HealthLevel = 'poor' | 'fair' | 'good';

export interface HealthBadgeProps {
  /** Health score from 0 to 100 */
  score: number;
  /** Whether to show the numeric score */
  showScore?: boolean;
  /** Whether to show the icon */
  showIcon?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * Determines health level based on score
 */
export function getHealthLevel(score: number): HealthLevel {
  if (score >= 80) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

const HEALTH_CONFIG: Record<
  HealthLevel,
  { label: string; colorClass: string; glowClass: string }
> = {
  poor: {
    label: 'POOR',
    colorClass: 'text-[var(--pixel-red-fire)] border-[var(--pixel-red-fire)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-red)]',
  },
  fair: {
    label: 'FAIR',
    colorClass: 'text-[var(--pixel-gold-coin)] border-[var(--pixel-gold-coin)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-gold)]',
  },
  good: {
    label: 'GOOD',
    colorClass: 'text-[var(--pixel-green-pipe)] border-[var(--pixel-green-pipe)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-green)]',
  },
};

/**
 * HealthBadge displays an agent's health score with color-coded level indicator.
 *
 * @example
 * ```tsx
 * <HealthBadge score={85} />
 * <HealthBadge score={50} showScore />
 * <HealthBadge score={25} showIcon={false} />
 * ```
 */
export function HealthBadge({
  score,
  showScore = true,
  showIcon = true,
  className,
}: HealthBadgeProps): React.JSX.Element {
  const clampedScore = Math.max(0, Math.min(100, score));
  const level = getHealthLevel(clampedScore);
  const config = HEALTH_CONFIG[level];

  return (
    <span
      className={cn(
        'badge-pixel font-bold',
        config.colorClass,
        config.glowClass,
        className,
      )}
      data-testid="health-badge"
      data-level={level}
      data-score={clampedScore}
      title={`Health Score: ${clampedScore}/100`}
    >
      {showIcon && <Activity size={12} aria-hidden="true" className="shrink-0" />}
      {showScore && <span className="tabular-nums">{clampedScore}</span>}
      <span>{config.label}</span>
    </span>
  );
}
