import type React from 'react';
import { cn } from '@/lib/utils';
import type { EvaluationStatus } from '@/types';

export interface EvaluationStatusBadgeProps {
  /** Evaluation status to display */
  status: EvaluationStatus;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional additional class names */
  className?: string;
}

const STATUS_CONFIG: Record<
  EvaluationStatus,
  { label: string; colorClass: string; glowClass: string; bgClass: string; animate?: boolean }
> = {
  pending: {
    label: 'PENDING',
    colorClass: 'text-[var(--pixel-gold-coin)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-gold)]',
    bgClass: 'bg-[rgba(252,192,60,0.1)]',
  },
  running: {
    label: 'RUNNING',
    colorClass: 'text-[var(--pixel-blue-sky)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-blue)]',
    bgClass: 'bg-[rgba(92,148,252,0.1)]',
    animate: true,
  },
  completed: {
    label: 'COMPLETED',
    colorClass: 'text-[var(--pixel-green-pipe)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-green)]',
    bgClass: 'bg-[rgba(0,216,0,0.1)]',
  },
  failed: {
    label: 'FAILED',
    colorClass: 'text-[var(--pixel-red-fire)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-red)]',
    bgClass: 'bg-[rgba(252,84,84,0.1)]',
  },
};

const SIZE_CLASSES = {
  sm: 'text-[0.5rem] px-1.5 py-0.5',
  md: 'text-[0.625rem] px-2 py-1',
  lg: 'text-[0.75rem] px-3 py-1.5',
};

/**
 * EvaluationStatusBadge displays the current status of an agent evaluation.
 * Uses color-coded badges with glow effects following the retro pixel art design.
 *
 * @example
 * ```tsx
 * <EvaluationStatusBadge status="running" />
 * <EvaluationStatusBadge status="completed" size="lg" />
 * ```
 */
export function EvaluationStatusBadge({
  status,
  size = 'md',
  className,
}: EvaluationStatusBadgeProps): React.JSX.Element {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'badge-pixel font-bold uppercase tracking-wide',
        'border-2 border-current',
        config.colorClass,
        config.glowClass,
        config.bgClass,
        SIZE_CLASSES[size],
        config.animate && 'animate-pulse motion-reduce:animate-none',
        className,
      )}
      data-testid="evaluation-status-badge"
      data-status={status}
    >
      {config.label}
    </span>
  );
}
