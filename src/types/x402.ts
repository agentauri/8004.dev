/**
 * x402 Payment Protocol Types
 *
 * Type definitions for the x402 payment protocol integration.
 * @see https://x402.org
 */

/**
 * Single payment option accepted by the server
 */
export interface X402PaymentOption {
  /** Payment scheme (e.g., "exact") */
  scheme: string;
  /** Network identifier (e.g., "base-mainnet" or "eip155:8453") */
  network: string;
  /** Maximum amount required in smallest units (e.g., "50000" for 0.05 USDC) */
  maxAmountRequired: string;
  /** Asset contract address */
  asset: string;
  /** Recipient address */
  payTo: string;
  /** Resource being paid for (optional) */
  resource?: string;
  /** Description of the operation (optional) */
  description?: string;
  /** MIME type of the response (optional) */
  mimeType?: string;
  /** Maximum timeout in seconds (optional) */
  maxTimeoutSeconds?: number;
}

/**
 * Error information in a 402 response
 */
export interface X402Error {
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
}

/**
 * Response from server when payment is required (HTTP 402)
 */
export interface X402PaymentDetails {
  /** x402 protocol version */
  x402Version: number;
  /** Array of accepted payment options */
  accepts: X402PaymentOption[];
  /** Error information (optional) */
  error?: X402Error;
}

/**
 * Signed payment receipt to be sent in X-PAYMENT header
 */
export interface X402PaymentReceipt {
  /** Base64-encoded signed payment receipt */
  header: string;
}

/**
 * Wallet connection status
 */
export type WalletConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Wallet state
 */
export interface WalletState {
  /** Current connection status */
  status: WalletConnectionStatus;
  /** Connected wallet address (null if not connected) */
  address: `0x${string}` | null;
  /** Chain ID of connected network (null if not connected) */
  chainId: number | null;
  /** Whether wallet is on the correct network (Base mainnet) */
  isCorrectNetwork: boolean;
  /** USDC balance in micro-units (null if not connected or loading) */
  usdcBalance: bigint | null;
  /** Error message if any */
  error: string | null;
}

/**
 * Payment mutation state
 */
export interface PaymentMutationState {
  /** Whether payment is required (got 402 response) */
  paymentRequired: boolean;
  /** Payment details from 402 response */
  paymentDetails: X402PaymentDetails | null;
  /** Whether payment is being signed */
  isSigning: boolean;
  /** Whether request with payment is in progress */
  isPaying: boolean;
  /** Payment error if any */
  paymentError: string | null;
}

/**
 * Error codes for payment-related errors
 */
export const PAYMENT_ERROR_CODES = {
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  PAYMENT_REJECTED: 'PAYMENT_REJECTED',
  NETWORK_MISMATCH: 'NETWORK_MISMATCH',
  PAYMENT_TIMEOUT: 'PAYMENT_TIMEOUT',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
} as const;

export type PaymentErrorCode = (typeof PAYMENT_ERROR_CODES)[keyof typeof PAYMENT_ERROR_CODES];

/**
 * Custom error for payment-related failures
 */
export class PaymentError extends Error {
  constructor(
    message: string,
    public code: PaymentErrorCode,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'PaymentError';
  }

  /**
   * Check if this error is retryable (transient error)
   */
  get isRetryable(): boolean {
    return (
      this.code === PAYMENT_ERROR_CODES.PAYMENT_TIMEOUT ||
      this.code === PAYMENT_ERROR_CODES.PAYMENT_FAILED
    );
  }

  /**
   * Check if this error is due to insufficient balance
   */
  get isInsufficientBalance(): boolean {
    return this.code === PAYMENT_ERROR_CODES.INSUFFICIENT_BALANCE;
  }

  /**
   * Check if this error is due to network mismatch
   */
  get isNetworkMismatch(): boolean {
    return this.code === PAYMENT_ERROR_CODES.NETWORK_MISMATCH;
  }

  /**
   * Check if this error is due to user rejection
   */
  get isUserRejected(): boolean {
    return this.code === PAYMENT_ERROR_CODES.PAYMENT_REJECTED;
  }
}

/**
 * Check if an error is a PaymentError
 */
export function isPaymentError(error: unknown): error is PaymentError {
  return error instanceof PaymentError;
}

/**
 * Create a PaymentError from an error message and code
 */
export function createPaymentError(code: PaymentErrorCode, details?: unknown): PaymentError {
  const messages: Record<PaymentErrorCode, string> = {
    [PAYMENT_ERROR_CODES.INSUFFICIENT_BALANCE]:
      'Insufficient USDC balance to complete this payment',
    [PAYMENT_ERROR_CODES.PAYMENT_REJECTED]: 'Payment was rejected by the user',
    [PAYMENT_ERROR_CODES.NETWORK_MISMATCH]: 'Please switch to Base network to continue',
    [PAYMENT_ERROR_CODES.PAYMENT_TIMEOUT]: 'Payment request timed out. Please try again',
    [PAYMENT_ERROR_CODES.PAYMENT_FAILED]: 'Payment failed. Please try again',
    [PAYMENT_ERROR_CODES.WALLET_NOT_CONNECTED]: 'Please connect your wallet to continue',
  };
  return new PaymentError(messages[code], code, details);
}

/**
 * Check if an error is retryable (transient error)
 */
export function isRetryableError(error: unknown): boolean {
  if (isPaymentError(error)) {
    return error.isRetryable;
  }
  // Check for generic network/timeout errors
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('timeout') ||
      message.includes('network') ||
      message.includes('failed to fetch')
    );
  }
  return false;
}

/**
 * Get user-friendly error message for a payment error
 */
export function getPaymentErrorMessage(error: unknown): string {
  if (isPaymentError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

/**
 * Check if a response is a 402 Payment Required response
 */
export function is402Response(response: Response): boolean {
  return response.status === 402;
}

/**
 * Parse 402 response body to X402PaymentDetails
 */
export async function parse402Response(response: Response): Promise<X402PaymentDetails> {
  if (!is402Response(response)) {
    throw new Error('Response is not a 402 Payment Required');
  }
  const data = await response.json();
  if (!data.x402Version || !Array.isArray(data.accepts)) {
    throw new Error('Invalid x402 response format');
  }
  return data as X402PaymentDetails;
}
