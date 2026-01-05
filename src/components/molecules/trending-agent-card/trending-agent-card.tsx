/**
 * TrendingAgentCard molecule
 *
 * Compact card for displaying trending agents with score change data.
 * Used in the homepage Trending Section.
 */

import { TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { ChainBadge, type ChainId } from '@/components/atoms';
import { CapabilityTag } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { TrendingAgent } from '@/types/trending';

/** Supported chain IDs for type narrowing */
const SUPPORTED_CHAIN_IDS = new Set<number>([11155111, 84532, 80002]);

function isValidChainId(chainId: number): chainId is ChainId {
  return SUPPORTED_CHAIN_IDS.has(chainId);
}

export interface TrendingAgentCardProps {
  /** Trending agent data */
  agent: TrendingAgent;
  /** Rank position (1-indexed) */
  rank: number;
  /** Optional additional class names */
  className?: string;
}

/**
 * Get rank badge styling based on position
 */
function getRankStyle(rank: number): { color: string; glow: string } {
  switch (rank) {
    case 1:
      return {
        color: 'text-[var(--pixel-gold-coin)]',
        glow: 'shadow-[0_0_8px_var(--glow-gold)]',
      };
    case 2:
      return {
        color: 'text-[var(--pixel-gray-200)]',
        glow: 'shadow-[0_0_8px_rgba(200,200,200,0.4)]',
      };
    case 3:
      return {
        color: 'text-[#CD7F32]',
        glow: 'shadow-[0_0_8px_rgba(205,127,50,0.4)]',
      };
    default:
      return {
        color: 'text-[var(--pixel-gray-400)]',
        glow: '',
      };
  }
}

/**
 * Format score change with sign and "pts" suffix
 */
function formatScoreChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change} pts`;
}

export function TrendingAgentCard({
  agent,
  rank,
  className,
}: TrendingAgentCardProps): React.JSX.Element {
  const rankStyle = getRankStyle(rank);
  const TrendIcon = agent.trend === 'down' ? TrendingDown : TrendingUp;
  const trendColor =
    agent.trend === 'down' ? 'text-[var(--pixel-red-fire)]' : 'text-[var(--pixel-green-pipe)]';

  return (
    <Link
      href={`/agent/${agent.id}`}
      className={cn(
        'block p-4 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]',
        'hover:border-[var(--pixel-blue-sky)] hover:shadow-[0_0_12px_var(--glow-blue)]',
        'transition-all duration-200',
        className,
      )}
      data-testid="trending-agent-card"
    >
      {/* Header: Rank + Name */}
      <div className="flex items-start gap-3 mb-3">
        {/* Rank Badge */}
        <div
          className={cn(
            'flex-shrink-0 w-8 h-8 flex items-center justify-center',
            'font-[family-name:var(--font-pixel-display)] text-lg',
            rankStyle.color,
            rankStyle.glow,
          )}
          aria-label={`Rank ${rank}`}
        >
          #{rank}
        </div>

        {/* Agent Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] truncate">
            {agent.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {isValidChainId(agent.chainId) && (
              <ChainBadge chainId={agent.chainId} className="text-[0.5rem] px-1 py-0.5" />
            )}
            {agent.isActive && (
              <span className="px-1.5 py-0.5 bg-[var(--pixel-green-pipe)]/20 text-[var(--pixel-green-pipe)] text-[0.625rem] uppercase tracking-wider font-[family-name:var(--font-pixel-body)]">
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Score + Trend */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-pixel-display)] text-xl text-[var(--pixel-gray-100)]">
            {agent.currentScore}
          </span>
          <span className="text-[var(--pixel-gray-500)] text-xs uppercase tracking-wider">
            score
          </span>
        </div>

        {/* Trend Indicator */}
        <div className={cn('flex items-center gap-1', trendColor)}>
          <TrendIcon size={16} aria-hidden="true" />
          <span className="font-mono text-sm">{formatScoreChange(agent.scoreChange)}</span>
        </div>
      </div>

      {/* Protocol Badges */}
      {(agent.hasMcp || agent.hasA2a || agent.x402Support) && (
        <div className="flex flex-wrap gap-1.5">
          {agent.hasMcp && <CapabilityTag type="mcp" />}
          {agent.hasA2a && <CapabilityTag type="a2a" />}
          {agent.x402Support && <CapabilityTag type="x402" />}
        </div>
      )}
    </Link>
  );
}
