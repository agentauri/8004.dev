import type React from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  /** Label describing the statistic */
  label: string;
  /** Primary numeric value */
  value: number;
  /** Optional secondary value (e.g., "/ 2704 total") */
  subValue?: string;
  /** Optional accent color for the card border/glow */
  color?: string;
  /** Whether the card is in loading state */
  isLoading?: boolean;
  /** Size variant for the card */
  size?: 'default' | 'large';
  /** Optional additional class names */
  className?: string;
}

/**
 * StatCard displays a single statistic with optional styling and loading state.
 *
 * @example
 * ```tsx
 * <StatCard label="Active Agents" value={1523} subValue="/ 2704 total" />
 * <StatCard label="Sepolia" value={985} color="#fc5454" isLoading={false} />
 * ```
 */
export function StatCard({
  label,
  value,
  subValue,
  color,
  isLoading = false,
  size = 'default',
  className,
}: StatCardProps): React.JSX.Element {
  if (isLoading) {
    return (
      <div
        className={cn(
          'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] animate-pulse',
          className,
        )}
        data-testid="stat-card"
        data-loading="true"
      >
        <div className="h-3 bg-[var(--pixel-gray-700)] w-1/2 mb-3" />
        <div className="h-8 bg-[var(--pixel-gray-700)] w-3/4" />
      </div>
    );
  }

  const borderStyle = color ? { borderColor: color } : undefined;
  const glowStyle = color ? { boxShadow: `0 0 20px ${color}40` } : undefined;

  return (
    <div
      className={cn(
        'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] transition-all',
        color && 'hover:scale-[1.02]',
        className,
      )}
      style={{ ...borderStyle, ...glowStyle }}
      data-testid="stat-card"
      data-loading="false"
    >
      <p
        className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider mb-2"
        data-testid="stat-card-label"
      >
        {label}
      </p>
      <div className="flex flex-col">
        <span
          className={cn(
            'font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)]',
            size === 'large' ? 'text-3xl md:text-4xl' : 'text-2xl',
          )}
          style={color ? { color } : undefined}
          data-testid="stat-card-value"
        >
          {value.toLocaleString()}
        </span>
        {subValue && (
          <span
            className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm mt-1"
            data-testid="stat-card-subvalue"
          >
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
}
