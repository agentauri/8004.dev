import type React from 'react';
import { PixelExplorer } from '@/components/atoms';
import { StatCard } from '@/components/molecules';
import { CHAINS } from '@/lib/constants/chains';
import { cn } from '@/lib/utils';

export interface ChainStat {
  chainId: number;
  name: string;
  /** All agents on this chain (including without metadata) */
  total: number;
  /** Agents with metadata on this chain */
  withMetadata: number;
  /** Active agents with metadata on this chain */
  active: number;
}

export interface PlatformStats {
  /** All agents registered on-chain (including those without metadata) */
  totalAgents: number;
  /** Agents with metadata (registrationFile) */
  withMetadata: number;
  /** Active agents with metadata */
  activeAgents: number;
  chainBreakdown: ChainStat[];
}

export interface StatsGridProps {
  /** Platform statistics data */
  stats?: PlatformStats;
  /** Whether the stats are loading */
  isLoading?: boolean;
  /** Error message if stats failed to load */
  error?: string;
  /** Optional additional class names */
  className?: string;
}

/**
 * StatsGrid displays platform statistics in a grid of cards.
 *
 * @example
 * ```tsx
 * <StatsGrid stats={stats} isLoading={false} />
 * ```
 */
export function StatsGrid({
  stats,
  isLoading = false,
  error,
  className,
}: StatsGridProps): React.JSX.Element {
  if (error) {
    return (
      <div
        className={cn('text-center py-8', className)}
        data-testid="stats-grid"
        data-state="error"
      >
        <p className="text-[var(--pixel-destructive)] font-[family-name:var(--font-pixel-body)] text-sm">
          {error}
        </p>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className={cn('space-y-4', className)} data-testid="stats-grid" data-state="loading">
        <div className="flex justify-center">
          <PixelExplorer size="sm" animation="bounce" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Agents" value={0} isLoading />
          <StatCard label="Sepolia" value={0} isLoading />
          <StatCard label="Base" value={0} isLoading />
          <StatCard label="Polygon" value={0} isLoading />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}
      data-testid="stats-grid"
      data-state="success"
    >
      <StatCard
        label="Total Agents"
        value={stats.totalAgents}
        subValue={`${stats.activeAgents.toLocaleString()} active`}
        color="#00D800"
      />
      {stats.chainBreakdown.map((chain) => {
        const chainConfig = CHAINS[chain.chainId];
        return (
          <StatCard
            key={chain.chainId}
            label={chain.name}
            value={chain.total}
            subValue={`${chain.active.toLocaleString()} active`}
            color={chainConfig?.color}
          />
        );
      })}
    </div>
  );
}
