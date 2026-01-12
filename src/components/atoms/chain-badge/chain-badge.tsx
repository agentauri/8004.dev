import type React from 'react';
import { getChainConfig, SUPPORTED_CHAIN_IDS } from '@/lib/constants/chains';
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

/**
 * Styling configuration for chain badges.
 * Uses CSS variables from the design system for consistent theming.
 * Chain names and data come from the centralized chains.ts config.
 */
const CHAIN_STYLING: Record<ChainId, { colorClass: string; glowClass: string }> = {
  11155111: {
    colorClass: 'text-[var(--chain-sepolia-text)] border-[var(--chain-sepolia)]',
    glowClass: 'shadow-[0_0_8px_var(--chain-glow-sepolia)]',
  },
  84532: {
    colorClass: 'text-[var(--chain-base-text)] border-[var(--chain-base)]',
    glowClass: 'shadow-[0_0_8px_var(--chain-glow-base)]',
  },
  80002: {
    colorClass: 'text-[var(--chain-polygon-text)] border-[var(--chain-polygon)]',
    glowClass: 'shadow-[0_0_8px_var(--chain-glow-polygon)]',
  },
};

/** Check if a chain ID is supported */
function isSupportedChainId(chainId: number): chainId is ChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}

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
  // Get chain data from centralized config
  const chainData = getChainConfig(chainId);
  const styling = isSupportedChainId(chainId) ? CHAIN_STYLING[chainId] : null;

  if (!chainData || !styling) {
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
      className={cn('badge-pixel', styling.colorClass, styling.glowClass, className)}
      data-testid="chain-badge"
      data-chain={chainId}
    >
      {showFullName ? chainData.name : chainData.shortName.toUpperCase()}
    </span>
  );
}
