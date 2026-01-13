/**
 * WalletStatus Atom
 *
 * Displays wallet connection status with truncated address.
 * Shows different states: disconnected, connecting, connected.
 */

import type React from 'react';
import { cn } from '@/lib/utils';

export interface WalletStatusProps {
  /** Wallet address (0x...) */
  address: `0x${string}` | null;
  /** Connection status */
  status: 'disconnected' | 'connecting' | 'reconnecting' | 'connected';
  /** Whether wallet is on correct network */
  isCorrectNetwork?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Truncates an Ethereum address to show first 6 and last 4 characters
 */
function truncateAddress(address: string): string {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * WalletStatus displays the current wallet connection state.
 *
 * @example
 * ```tsx
 * <WalletStatus
 *   address="0x1234567890abcdef1234567890abcdef12345678"
 *   status="connected"
 *   isCorrectNetwork={true}
 * />
 * ```
 */
export function WalletStatus({
  address,
  status,
  isCorrectNetwork = true,
  className,
}: WalletStatusProps): React.JSX.Element {
  const isConnecting = status === 'connecting' || status === 'reconnecting';

  if (status === 'disconnected') {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-pixel-gray-400', className)}>
        <span className="h-2 w-2 rounded-full bg-pixel-gray-500" />
        <span className="font-mono">Disconnected</span>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-pixel-gold-coin', className)}>
        <span className="h-2 w-2 animate-pulse rounded-full bg-pixel-gold-coin" />
        <span className="font-mono">Connecting...</span>
      </div>
    );
  }

  // Connected
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm',
        isCorrectNetwork ? 'text-pixel-green-pipe' : 'text-pixel-red-fire',
        className,
      )}
    >
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          isCorrectNetwork ? 'bg-pixel-green-pipe' : 'bg-pixel-red-fire',
        )}
      />
      <span className="font-mono">{address ? truncateAddress(address) : 'Connected'}</span>
      {!isCorrectNetwork && <span className="text-xs text-pixel-red-fire">(Wrong Network)</span>}
    </div>
  );
}
