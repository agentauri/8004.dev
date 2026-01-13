/**
 * ConnectWalletButton Molecule
 *
 * Button for connecting/disconnecting wallet with status display.
 */

'use client';

import { ChevronDown, LogOut, Wallet } from 'lucide-react';
import { WalletStatus } from '@/components/atoms/wallet-status';
import { cn } from '@/lib/utils';

export interface ConnectWalletButtonProps {
  /** Wallet address when connected */
  address: `0x${string}` | null;
  /** Connection status */
  status: 'disconnected' | 'connecting' | 'reconnecting' | 'connected';
  /** Whether on correct network */
  isCorrectNetwork?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

const variantClasses = {
  default:
    'bg-[var(--pixel-blue-sky)] text-white hover:bg-[var(--pixel-blue-sky)]/90 border-2 border-[var(--pixel-blue-sky)]',
  outline:
    'border-2 border-[var(--pixel-gray-600)] bg-transparent text-[var(--pixel-white)] hover:border-[var(--pixel-blue-sky)] hover:text-[var(--pixel-blue-sky)]',
  ghost:
    'border-2 border-transparent bg-transparent text-[var(--pixel-gray-400)] hover:bg-[var(--pixel-gray-800)] hover:text-[var(--pixel-white)]',
};

/**
 * ConnectWalletButton provides a complete wallet connection interface.
 * Shows "Connect Wallet" when disconnected, or address + disconnect when connected.
 *
 * @example
 * ```tsx
 * <ConnectWalletButton
 *   address={null}
 *   status="disconnected"
 *   onClick={openWalletModal}
 * />
 * ```
 */
export function ConnectWalletButton({
  address,
  status,
  isCorrectNetwork = true,
  onClick,
  disabled = false,
  className,
  variant = 'outline',
  size = 'md',
}: ConnectWalletButtonProps): React.JSX.Element {
  const isConnecting = status === 'connecting' || status === 'reconnecting';
  const isConnected = status === 'connected';

  const baseClasses =
    'inline-flex items-center justify-center font-mono transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixel-blue-sky)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pixel-black)] disabled:opacity-50 disabled:cursor-not-allowed';

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          !isCorrectNetwork && 'border-[var(--pixel-red-fire)]',
          className,
        )}
      >
        <WalletStatus
          address={address}
          status={status}
          isCorrectNetwork={isCorrectNetwork}
          className="text-inherit"
        />
        <ChevronDown className="ml-2 h-4 w-4 text-[var(--pixel-gray-400)]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isConnecting}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isConnecting && 'animate-pulse',
        className,
      )}
    >
      <Wallet className="mr-2 h-4 w-4" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  );
}

/**
 * Disconnect button shown in wallet dropdown
 */
export interface DisconnectButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function DisconnectButton({
  onClick,
  disabled = false,
  className,
}: DisconnectButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center w-full px-4 py-2 text-sm font-mono',
        'text-[var(--pixel-red-fire)] hover:bg-[var(--pixel-red-fire)]/10',
        'transition-colors duration-100',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Disconnect</span>
    </button>
  );
}
