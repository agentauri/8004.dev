/**
 * WalletModal Organism
 *
 * Modal for selecting a wallet provider to connect.
 */

'use client';

import { ExternalLink, Wallet, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { WalletStatus } from '@/components/atoms/wallet-status';
import { DisconnectButton } from '@/components/molecules/connect-wallet-button';
import { cn } from '@/lib/utils';

export interface WalletConnector {
  /** Unique connector ID */
  id: string;
  /** Display name */
  name: string;
  /** Optional icon URL */
  icon?: string;
}

export interface WalletModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal is closed */
  onOpenChange: (open: boolean) => void;
  /** Available wallet connectors */
  connectors: readonly WalletConnector[];
  /** Current wallet address (if connected) */
  address: `0x${string}` | null;
  /** Connection status */
  status: 'disconnected' | 'connecting' | 'reconnecting' | 'connected';
  /** Whether on correct network */
  isCorrectNetwork?: boolean;
  /** Callback when a connector is selected */
  onConnect: (connectorId: string) => void;
  /** Callback to disconnect */
  onDisconnect: () => void;
  /** Callback to switch network */
  onSwitchNetwork?: () => void;
}

/**
 * Get icon for known wallet types
 */
function getWalletIcon(connectorId: string): string | null {
  const icons: Record<string, string> = {
    injected: '🦊',
    metaMask: '🦊',
    coinbaseWallet: '📱',
    coinbaseWalletSDK: '📱',
    walletConnect: '🔗',
  };
  return icons[connectorId] || null;
}

const buttonBaseClasses =
  'inline-flex items-center justify-start w-full px-4 py-3 text-sm font-mono border-2 transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixel-blue-sky)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pixel-black)] disabled:opacity-50 disabled:cursor-not-allowed';

const buttonOutlineClasses =
  'border-[var(--pixel-gray-600)] bg-transparent text-[var(--pixel-white)] hover:border-[var(--pixel-blue-sky)] hover:text-[var(--pixel-blue-sky)]';

/**
 * WalletModal provides a UI for selecting and managing wallet connections.
 */
export function WalletModal({
  open,
  onOpenChange,
  connectors,
  address,
  status,
  isCorrectNetwork = true,
  onConnect,
  onDisconnect,
  onSwitchNetwork,
}: WalletModalProps): React.JSX.Element | null {
  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting' || status === 'reconnecting';

  // Handle escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onOpenChange(false);
      }
    },
    [onOpenChange],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      data-testid="wallet-modal-backdrop"
      role="presentation"
    >
      <div
        className="relative w-full max-w-md overflow-hidden bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] shadow-[0_0_30px_rgba(92,148,252,0.2)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        data-testid="wallet-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[var(--pixel-gray-700)]">
          <h2
            id="wallet-modal-title"
            className="flex items-center gap-2 text-pixel-title text-lg text-[var(--pixel-blue-text)] uppercase tracking-wider"
          >
            <Wallet className="h-5 w-5" />
            {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-2 text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] hover:bg-[var(--pixel-gray-800)] transition-colors"
            aria-label="Close modal"
            data-testid="wallet-modal-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-pixel-body text-sm text-[var(--pixel-gray-400)]">
            {isConnected ? 'Manage your wallet connection' : 'Choose a wallet provider to connect'}
          </p>

          {/* Connected state */}
          {isConnected && address && (
            <div className="space-y-4">
              {/* Wallet info */}
              <div className="p-4 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--pixel-gray-400)]">Connected Address</span>
                  <WalletStatus
                    address={address}
                    status={status}
                    isCorrectNetwork={isCorrectNetwork}
                  />
                </div>
              </div>

              {/* Network warning */}
              {!isCorrectNetwork && onSwitchNetwork && (
                <div className="space-y-2">
                  <div className="text-sm text-[var(--pixel-red-fire)]">
                    Please switch to Base network for payments
                  </div>
                  <button
                    type="button"
                    onClick={onSwitchNetwork}
                    className={cn(buttonBaseClasses, buttonOutlineClasses, 'justify-center')}
                  >
                    Switch to Base
                  </button>
                </div>
              )}

              {/* View on explorer */}
              <button
                type="button"
                onClick={() => window.open(`https://basescan.org/address/${address}`, '_blank')}
                className={cn(buttonBaseClasses, buttonOutlineClasses, 'justify-center')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on BaseScan
              </button>

              {/* Disconnect */}
              <DisconnectButton onClick={onDisconnect} className="w-full" />
            </div>
          )}

          {/* Disconnected state - show connector options */}
          {!isConnected && (
            <div className="space-y-2">
              {connectors.map((connector) => {
                const icon = getWalletIcon(connector.id);
                return (
                  <button
                    key={connector.id}
                    type="button"
                    onClick={() => onConnect(connector.id)}
                    disabled={isConnecting}
                    className={cn(
                      buttonBaseClasses,
                      buttonOutlineClasses,
                      isConnecting && 'animate-pulse',
                    )}
                  >
                    {icon && <span className="mr-2 text-lg">{icon}</span>}
                    <span>{connector.name}</span>
                    {isConnecting && (
                      <span className="ml-auto text-xs text-[var(--pixel-gray-500)]">
                        Connecting...
                      </span>
                    )}
                  </button>
                );
              })}

              {connectors.length === 0 && (
                <div className="text-center text-sm text-[var(--pixel-gray-400)] py-4">
                  No wallet providers detected. Please install MetaMask or another Web3 wallet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
