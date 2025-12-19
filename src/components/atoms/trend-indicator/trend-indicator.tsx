import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface TrendIndicatorProps {
  direction: TrendDirection;
  change?: number;
  size?: 'sm' | 'md';
  className?: string;
}

const TREND_CONFIG = {
  up: {
    icon: TrendingUp,
    colorClass: 'text-[#00D800]',
    label: 'Trending up',
  },
  down: {
    icon: TrendingDown,
    colorClass: 'text-[#FC5454]',
    label: 'Trending down',
  },
  stable: {
    icon: Minus,
    colorClass: 'text-[#888888]',
    label: 'Stable',
  },
} as const;

const SIZE_CONFIG = {
  sm: 14,
  md: 18,
} as const;

function formatChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change}%`;
}

export function TrendIndicator({
  direction,
  change,
  size = 'md',
  className,
}: TrendIndicatorProps): React.JSX.Element {
  const config = TREND_CONFIG[direction];
  const Icon = config.icon;
  const iconSize = SIZE_CONFIG[size];

  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      data-testid="trend-indicator"
      data-direction={direction}
      aria-label={config.label}
    >
      <Icon size={iconSize} className={cn(config.colorClass)} aria-hidden="true" />
      {change !== undefined && (
        <span className={cn('font-mono text-sm', config.colorClass)}>{formatChange(change)}</span>
      )}
    </span>
  );
}
