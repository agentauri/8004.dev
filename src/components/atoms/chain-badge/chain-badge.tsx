import type React from 'react';
import { cn } from '@/lib/utils';

export type ChainId = 11155111 | 84532 | 80002;

export interface ChainBadgeProps {
  /** The chain ID to display */
  chainId: ChainId;
  /** Optional additional class names */
  className?: string;
  /** Show the full chain name instead of short name */
  showFullName?: boolean;
}

const CHAIN_CONFIG: Record<
  ChainId,
  { name: string; shortName: string; colorClass: string; glowClass: string }
> = {
  11155111: {
    name: 'Ethereum Sepolia',
    shortName: 'SEPOLIA',
    colorClass: 'text-[var(--chain-sepolia)] border-[var(--chain-sepolia)]',
    glowClass: 'shadow-[0_0_8px_var(--chain-glow-sepolia)]',
  },
  84532: {
    name: 'Base Sepolia',
    shortName: 'BASE',
    colorClass: 'text-[var(--chain-base)] border-[var(--chain-base)]',
    glowClass: 'shadow-[0_0_8px_var(--chain-glow-base)]',
  },
  80002: {
    name: 'Polygon Amoy',
    shortName: 'POLYGON',
    colorClass: 'text-[var(--chain-polygon)] border-[var(--chain-polygon)]',
    glowClass: 'shadow-[0_0_8px_var(--chain-glow-polygon)]',
  },
};

/**
 * ChainBadge displays a blockchain network identifier with chain-specific colors and glow effects.
 *
 * @example
 * ```tsx
 * <ChainBadge chainId={11155111} />
 * <ChainBadge chainId={84532} showFullName />
 * ```
 */
export function ChainBadge({
  chainId,
  className,
  showFullName = false,
}: ChainBadgeProps): React.JSX.Element {
  const config = CHAIN_CONFIG[chainId];

  if (!config) {
    return (
      <span
        className={cn(
          'badge-pixel text-[var(--pixel-gray-400)] border-[var(--pixel-gray-400)]',
          className,
        )}
        data-testid="chain-badge"
        data-chain="unknown"
      >
        UNKNOWN
      </span>
    );
  }

  return (
    <span
      className={cn('badge-pixel', config.colorClass, config.glowClass, className)}
      data-testid="chain-badge"
      data-chain={chainId}
    >
      {showFullName ? config.name : config.shortName}
    </span>
  );
}
