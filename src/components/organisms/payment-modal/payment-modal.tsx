/**
 * PaymentModal Organism
 *
 * Modal for confirming x402 payment before proceeding with an operation.
 */

'use client';

import { AlertCircle, CheckCircle2, Loader2, Wallet, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { UsdcAmount } from '@/components/atoms/usdc-amount';
import { PaymentCost } from '@/components/molecules/payment-cost';
import { X402_CONFIG } from '@/lib/constants/x402';
import { cn } from '@/lib/utils';
import type { X402PaymentDetails } from '@/types/x402';

export interface PaymentModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Callback when modal is closed */
  onOpenChange: (open: boolean) => void;
  /** x402 payment details from 402 response */
  paymentDetails: X402PaymentDetails | null;
  /** Operation name (e.g., "Compose Team") */
  operationName: string;
  /** User's current USDC balance */
  usdcBalance: bigint | null;
  /** Whether user is connected to wallet */
  isWalletConnected: boolean;
  /** Whether wallet is on correct network */
  isCorrectNetwork: boolean;
  /** Whether payment is being processed */
  isProcessing?: boolean;
  /** Error message if payment failed */
  error?: string | null;
  /** Whether the error is retryable */
  isErrorRetryable?: boolean;
  /** Callback to confirm payment */
  onConfirm: () => void;
  /** Callback to switch network */
  onSwitchNetwork?: () => void;
  /** Callback to connect wallet */
  onConnectWallet?: () => void;
  /** Callback to retry after error */
  onRetry?: () => void;
}

/**
 * Formats bigint USDC balance to number
 */
function formatUsdcBalance(balance: bigint | null): number {
  if (balance === null) return 0;
  return Number(balance) / 10 ** X402_CONFIG.usdcDecimals;
}

/**
 * Get cost from payment details
 */
function getCostFromPaymentDetails(details: X402PaymentDetails | null): number {
  if (!details || !details.accepts?.[0]) return 0;
  const amount = details.accepts[0].maxAmountRequired;
  // Amount is in USDC base units (6 decimals)
  return Number(amount) / 10 ** X402_CONFIG.usdcDecimals;
}

const buttonBaseClasses =
  'inline-flex items-center justify-center w-full px-4 py-3 text-sm font-mono border-2 transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixel-blue-sky)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pixel-black)] disabled:opacity-50 disabled:cursor-not-allowed';

const buttonPrimaryClasses =
  'bg-[var(--pixel-blue-sky)] text-white border-[var(--pixel-blue-sky)] hover:bg-[var(--pixel-blue-sky)]/90';

const buttonOutlineClasses =
  'border-[var(--pixel-gray-600)] bg-transparent text-[var(--pixel-white)] hover:border-[var(--pixel-blue-sky)] hover:text-[var(--pixel-blue-sky)]';

const buttonGhostClasses =
  'border-transparent bg-transparent text-[var(--pixel-gray-400)] hover:bg-[var(--pixel-gray-800)] hover:text-[var(--pixel-white)]';

/** URL to get USDC on Base via Coinbase */
const GET_USDC_URL = 'https://www.coinbase.com/onramp/buy?asset=USDC&chain=base';

/**
 * PaymentModal displays payment confirmation before executing a paid operation.
 */
export function PaymentModal({
  open,
  onOpenChange,
  paymentDetails,
  operationName,
  usdcBalance,
  isWalletConnected,
  isCorrectNetwork,
  isProcessing = false,
  error,
  isErrorRetryable = false,
  onConfirm,
  onSwitchNetwork,
  onConnectWallet,
  onRetry,
}: PaymentModalProps): React.JSX.Element | null {
  const cost = getCostFromPaymentDetails(paymentDetails);
  const balance = formatUsdcBalance(usdcBalance);
  const hasInsufficientBalance = balance < cost;

  // Handle escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange, isProcessing]);

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
      if (e.target === e.currentTarget && !isProcessing) {
        onOpenChange(false);
      }
    },
    [onOpenChange, isProcessing],
  );

  if (!open) return null;

  // Determine what action button to show
  const renderActionButton = () => {
    if (!isWalletConnected) {
      return (
        <button
          type="button"
          onClick={onConnectWallet}
          className={cn(buttonBaseClasses, buttonPrimaryClasses)}
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </button>
      );
    }

    if (!isCorrectNetwork) {
      return (
        <button
          type="button"
          onClick={onSwitchNetwork}
          className={cn(buttonBaseClasses, buttonOutlineClasses)}
        >
          Switch to Base Network
        </button>
      );
    }

    if (hasInsufficientBalance) {
      return (
        <button type="button" disabled className={cn(buttonBaseClasses, buttonOutlineClasses)}>
          <AlertCircle className="mr-2 h-4 w-4" />
          Insufficient Balance
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={onConfirm}
        disabled={isProcessing}
        className={cn(buttonBaseClasses, buttonPrimaryClasses)}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirm Payment
          </>
        )}
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      data-testid="payment-modal-backdrop"
      role="presentation"
    >
      <div
        className="relative w-full max-w-md overflow-hidden bg-[var(--pixel-gray-900)] border-2 border-[var(--pixel-gray-700)] shadow-[0_0_30px_rgba(252,192,60,0.2)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        data-testid="payment-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[var(--pixel-gray-700)]">
          <h2
            id="payment-modal-title"
            className="flex items-center gap-2 text-pixel-title text-lg text-[var(--pixel-gold-coin)] uppercase tracking-wider"
          >
            <Wallet className="h-5 w-5" />
            Payment Required
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className="p-2 text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] hover:bg-[var(--pixel-gray-800)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
            data-testid="payment-modal-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-pixel-body text-sm text-[var(--pixel-gray-400)]">
            This operation requires a payment to proceed.
          </p>

          {/* Operation info */}
          <div className="p-4 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]">
            <div className="text-xs text-[var(--pixel-gray-500)] uppercase tracking-wider">
              Operation
            </div>
            <div className="mt-1 font-medium text-[var(--pixel-white)]">{operationName}</div>
          </div>

          {/* Cost display */}
          <div className="flex items-center justify-center p-6 bg-[var(--pixel-gold-coin)]/10 border border-[var(--pixel-gold-coin)]/30">
            <PaymentCost cost={cost} variant="stacked" label="Cost" />
          </div>

          {/* Balance info */}
          {isWalletConnected && isCorrectNetwork && (
            <div className="flex items-center justify-between p-4 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]">
              <span className="text-sm text-[var(--pixel-gray-400)]">Your Balance</span>
              <UsdcAmount
                amount={balance}
                showSymbol
                showToken
                className={cn(hasInsufficientBalance && 'text-[var(--pixel-red-fire)]')}
              />
            </div>
          )}

          {/* Network warning */}
          {isWalletConnected && !isCorrectNetwork && (
            <div className="flex items-center gap-2 p-3 text-sm text-[var(--pixel-red-fire)] bg-[var(--pixel-red-fire)]/10 border border-[var(--pixel-red-fire)]/50">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Please switch to Base network to continue
            </div>
          )}

          {/* Insufficient balance warning */}
          {isWalletConnected && isCorrectNetwork && hasInsufficientBalance && (
            <div className="p-3 text-sm text-[var(--pixel-red-fire)] bg-[var(--pixel-red-fire)]/10 border border-[var(--pixel-red-fire)]/50">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Insufficient USDC balance. You need at least ${cost.toFixed(2)} USDC.
              </div>
              <a
                href={GET_USDC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-[var(--pixel-blue-sky)] hover:text-[var(--pixel-blue-sky)]/80 underline"
                data-testid="get-usdc-link"
              >
                Get USDC on Base
              </a>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 text-sm text-[var(--pixel-red-fire)] bg-[var(--pixel-red-fire)]/10 border border-[var(--pixel-red-fire)]/50">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
              {isErrorRetryable && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-block mt-2 text-[var(--pixel-blue-sky)] hover:text-[var(--pixel-blue-sky)]/80 underline"
                  data-testid="retry-button"
                >
                  Try again
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 space-y-2 border-t-2 border-[var(--pixel-gray-700)]">
          {renderActionButton()}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            className={cn(buttonBaseClasses, buttonGhostClasses)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
