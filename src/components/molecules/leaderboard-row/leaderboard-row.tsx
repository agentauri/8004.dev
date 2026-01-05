/**
 * LeaderboardRow molecule
 *
 * Displays a single row in the leaderboard table with rank, agent info, and score.
 */

import { TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { ChainBadge, type ChainId } from '@/components/atoms';
import { CapabilityTag } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types/leaderboard';

export interface LeaderboardRowProps {
  /** Leaderboard entry data */
  entry: LeaderboardEntry;
  /** Optional additional class names */
  className?: string;
}

/** Supported chain IDs for type narrowing */
const SUPPORTED_CHAIN_IDS = new Set<number>([11155111, 84532, 80002]);

function isValidChainId(chainId: number): chainId is ChainId {
  return SUPPORTED_CHAIN_IDS.has(chainId);
}

/**
 * Get rank badge styling based on position
 */
function getRankStyle(rank: number): { bg: string; text: string; glow: string } {
  switch (rank) {
    case 1:
      return {
        bg: 'bg-[var(--pixel-gold-coin)]/20',
        text: 'text-[var(--pixel-gold-coin)]',
        glow: 'shadow-[0_0_8px_var(--glow-gold)]',
      };
    case 2:
      return {
        bg: 'bg-[var(--pixel-gray-200)]/20',
        text: 'text-[var(--pixel-gray-200)]',
        glow: 'shadow-[0_0_8px_rgba(200,200,200,0.4)]',
      };
    case 3:
      return {
        bg: 'bg-[#CD7F32]/20',
        text: 'text-[#CD7F32]',
        glow: 'shadow-[0_0_8px_rgba(205,127,50,0.4)]',
      };
    default:
      return {
        bg: 'bg-[var(--pixel-gray-800)]',
        text: 'text-[var(--pixel-gray-400)]',
        glow: '',
      };
  }
}

export function LeaderboardRow({ entry, className }: LeaderboardRowProps): React.JSX.Element {
  const rankStyle = getRankStyle(entry.rank);
  const TrendIcon = entry.trend === 'down' ? TrendingDown : TrendingUp;
  const trendColor =
    entry.trend === 'down'
      ? 'text-[var(--pixel-red-fire)]'
      : entry.trend === 'up'
        ? 'text-[var(--pixel-green-pipe)]'
        : 'text-[var(--pixel-gray-500)]';

  return (
    <Link
      href={`/agent/${entry.agentId}`}
      className={cn(
        'grid grid-cols-[4rem_1fr_auto] md:grid-cols-[4rem_1fr_8rem_6rem_auto] gap-4 items-center',
        'p-4 border-b border-[var(--pixel-gray-700)]',
        'hover:bg-[var(--pixel-gray-800)] transition-colors',
        className,
      )}
      data-testid="leaderboard-row"
      data-rank={entry.rank}
    >
      {/* Rank */}
      <div
        className={cn(
          'flex items-center justify-center w-12 h-12',
          'font-[family-name:var(--font-pixel-display)] text-lg',
          rankStyle.bg,
          rankStyle.text,
          rankStyle.glow,
        )}
        aria-label={`Rank ${entry.rank}`}
      >
        #{entry.rank}
      </div>

      {/* Agent Info */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] truncate">
            {entry.name}
          </h3>
          {entry.active && (
            <span className="px-1.5 py-0.5 bg-[var(--pixel-green-pipe)]/20 text-[var(--pixel-green-pipe)] text-[0.5rem] uppercase tracking-wider font-[family-name:var(--font-pixel-body)]">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isValidChainId(entry.chainId) && (
            <ChainBadge chainId={entry.chainId} className="text-[0.5rem] px-1 py-0.5" />
          )}
          {entry.hasMcp && <CapabilityTag type="mcp" />}
          {entry.hasA2a && <CapabilityTag type="a2a" />}
          {entry.x402Support && <CapabilityTag type="x402" />}
        </div>
      </div>

      {/* Feedback Count - Hidden on mobile */}
      <div className="hidden md:flex flex-col items-end">
        <span className="font-mono text-sm text-[var(--pixel-gray-100)]">
          {entry.feedbackCount}
        </span>
        <span className="text-[0.625rem] text-[var(--pixel-gray-500)] uppercase">feedbacks</span>
      </div>

      {/* Trend - Hidden on mobile */}
      <div className={cn('hidden md:flex items-center justify-end gap-1', trendColor)}>
        <TrendIcon size={14} aria-hidden="true" />
        <span className="font-mono text-xs">{entry.trend === 'stable' ? '—' : entry.trend}</span>
      </div>

      {/* Score */}
      <div className="flex flex-col items-end">
        <span className="font-[family-name:var(--font-pixel-display)] text-xl text-[var(--pixel-gray-100)]">
          {entry.score}
        </span>
        <span className="text-[0.625rem] text-[var(--pixel-gray-500)] uppercase">score</span>
      </div>
    </Link>
  );
}
