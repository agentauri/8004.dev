import { Sparkles } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';

export interface RelevanceScoreProps {
  /** Score value from 0 to 100 */
  score: number;
  /** Whether to show the percentage label (e.g., "98% match") */
  showLabel?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Optional additional class names */
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    textClass: 'text-[0.625rem]',
    iconSize: 12,
    padding: 'px-2 py-1',
    gap: 'gap-1',
  },
  md: {
    textClass: 'text-[0.75rem]',
    iconSize: 14,
    padding: 'px-3 py-1.5',
    gap: 'gap-1.5',
  },
} as const;

/**
 * RelevanceScore displays a semantic search match score with sparkle icon.
 * Used to show AI/semantic search relevance with a gold glow effect.
 *
 * @example
 * ```tsx
 * <RelevanceScore score={95} />
 * <RelevanceScore score={82} showLabel />
 * <RelevanceScore score={67} size="sm" />
 * ```
 */
export function RelevanceScore({
  score,
  showLabel = false,
  size = 'md',
  className,
}: RelevanceScoreProps): React.JSX.Element {
  const clampedScore = Math.max(0, Math.min(100, score));
  const config = SIZE_CONFIG[size];

  return (
    <span
      className={cn(
        'inline-flex items-center font-[family-name:var(--font-pixel-body)] font-bold uppercase border-2 border-[var(--pixel-gold-coin)] text-[var(--pixel-gold-coin)] shadow-[0_0_8px_var(--glow-gold)] bg-[rgba(252,192,60,0.1)]',
        config.textClass,
        config.padding,
        config.gap,
        className,
      )}
      data-testid="relevance-score"
      data-score={clampedScore}
    >
      <Sparkles size={config.iconSize} aria-hidden="true" />
      <span className="tabular-nums">{clampedScore}%</span>
      {showLabel && <span className="ml-0.5">MATCH</span>}
    </span>
  );
}
