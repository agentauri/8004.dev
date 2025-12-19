import type React from 'react';
import {
  ChainBadge,
  type ChainId,
  StatusBadge,
  type StatusType,
  TrustScore,
} from '@/components/atoms';
import { cn } from '@/lib/utils';

export interface AgentBadgesProps {
  /** Chain ID where the agent is registered */
  chainId: ChainId;
  /** Whether the agent is currently active */
  isActive: boolean;
  /** Whether the agent is verified */
  isVerified?: boolean;
  /** Trust/reputation score (0-100) */
  trustScore?: number;
  /** Number of reputation feedbacks */
  reputationCount?: number;
  /** Whether the agent has supported trust models configured */
  hasSupportedTrust?: boolean;
  /** Supported protocols */
  protocols?: Array<'mcp' | 'a2a' | 'x402'>;
  /** Optional additional class names */
  className?: string;
  /** Layout direction */
  direction?: 'row' | 'column';
}

/**
 * AgentBadges displays a collection of badges for an agent including chain, status, and capabilities.
 *
 * @example
 * ```tsx
 * <AgentBadges
 *   chainId={11155111}
 *   isActive={true}
 *   isVerified={true}
 *   trustScore={85}
 *   protocols={['mcp', 'a2a']}
 * />
 * ```
 */
export function AgentBadges({
  chainId,
  isActive,
  isVerified = false,
  trustScore,
  reputationCount,
  hasSupportedTrust = false,
  protocols = [],
  className,
  direction = 'row',
}: AgentBadgesProps): React.JSX.Element {
  const status: StatusType = isActive ? 'active' : 'inactive';

  return (
    <div
      className={cn(
        'flex gap-2',
        direction === 'column' ? 'flex-col items-start' : 'flex-row flex-wrap items-center',
        className,
      )}
      data-testid="agent-badges"
    >
      <ChainBadge chainId={chainId} />
      <StatusBadge status={status} />
      {isVerified && <StatusBadge status="verified" />}
      {trustScore !== undefined && (
        <TrustScore score={trustScore} count={reputationCount} size="sm" />
      )}
      {hasSupportedTrust && <StatusBadge status="trust" />}
      {protocols.map((protocol) => (
        <StatusBadge key={protocol} status={protocol} />
      ))}
    </div>
  );
}
