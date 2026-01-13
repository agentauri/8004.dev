import { describe, expect, it } from 'vitest';
import {
  createPaymentError,
  getPaymentErrorMessage,
  is402Response,
  isPaymentError,
  isRetryableError,
  PAYMENT_ERROR_CODES,
  PaymentError,
  parse402Response,
} from './x402';

describe('PaymentError', () => {
  describe('constructor', () => {
    it('creates error with message and code', () => {
      const error = new PaymentError('Test error', PAYMENT_ERROR_CODES.PAYMENT_FAILED);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('PAYMENT_FAILED');
      expect(error.name).toBe('PaymentError');
    });

    it('creates error with details', () => {
      const details = { amount: 100 };
      const error = new PaymentError('Test error', PAYMENT_ERROR_CODES.PAYMENT_FAILED, details);
      expect(error.details).toEqual(details);
    });
  });

  describe('isRetryable', () => {
    it('returns true for PAYMENT_TIMEOUT', () => {
      const error = new PaymentError('Timeout', PAYMENT_ERROR_CODES.PAYMENT_TIMEOUT);
      expect(error.isRetryable).toBe(true);
    });

    it('returns true for PAYMENT_FAILED', () => {
      const error = new PaymentError('Failed', PAYMENT_ERROR_CODES.PAYMENT_FAILED);
      expect(error.isRetryable).toBe(true);
    });

    it('returns false for INSUFFICIENT_BALANCE', () => {
      const error = new PaymentError('No balance', PAYMENT_ERROR_CODES.INSUFFICIENT_BALANCE);
      expect(error.isRetryable).toBe(false);
    });

    it('returns false for PAYMENT_REJECTED', () => {
      const error = new PaymentError('Rejected', PAYMENT_ERROR_CODES.PAYMENT_REJECTED);
      expect(error.isRetryable).toBe(false);
    });
  });

  describe('isInsufficientBalance', () => {
    it('returns true for INSUFFICIENT_BALANCE', () => {
      const error = new PaymentError('No balance', PAYMENT_ERROR_CODES.INSUFFICIENT_BALANCE);
      expect(error.isInsufficientBalance).toBe(true);
    });

    it('returns false for other errors', () => {
      const error = new PaymentError('Failed', PAYMENT_ERROR_CODES.PAYMENT_FAILED);
      expect(error.isInsufficientBalance).toBe(false);
    });
  });

  describe('isNetworkMismatch', () => {
    it('returns true for NETWORK_MISMATCH', () => {
      const error = new PaymentError('Wrong network', PAYMENT_ERROR_CODES.NETWORK_MISMATCH);
      expect(error.isNetworkMismatch).toBe(true);
    });

    it('returns false for other errors', () => {
      const error = new PaymentError('Failed', PAYMENT_ERROR_CODES.PAYMENT_FAILED);
      expect(error.isNetworkMismatch).toBe(false);
    });
  });

  describe('isUserRejected', () => {
    it('returns true for PAYMENT_REJECTED', () => {
      const error = new PaymentError('Rejected', PAYMENT_ERROR_CODES.PAYMENT_REJECTED);
      expect(error.isUserRejected).toBe(true);
    });

    it('returns false for other errors', () => {
      const error = new PaymentError('Failed', PAYMENT_ERROR_CODES.PAYMENT_FAILED);
      expect(error.isUserRejected).toBe(false);
    });
  });
});

describe('isPaymentError', () => {
  it('returns true for PaymentError instances', () => {
    const error = new PaymentError('Test', PAYMENT_ERROR_CODES.PAYMENT_FAILED);
    expect(isPaymentError(error)).toBe(true);
  });

  it('returns false for regular Error', () => {
    expect(isPaymentError(new Error('Test'))).toBe(false);
  });

  it('returns false for non-Error values', () => {
    expect(isPaymentError('error')).toBe(false);
    expect(isPaymentError(null)).toBe(false);
    expect(isPaymentError(undefined)).toBe(false);
    expect(isPaymentError({})).toBe(false);
  });
});

describe('createPaymentError', () => {
  it('creates error with predefined message for INSUFFICIENT_BALANCE', () => {
    const error = createPaymentError(PAYMENT_ERROR_CODES.INSUFFICIENT_BALANCE);
    expect(error.code).toBe('INSUFFICIENT_BALANCE');
    expect(error.message).toContain('Insufficient USDC balance');
  });

  it('creates error with predefined message for PAYMENT_REJECTED', () => {
    const error = createPaymentError(PAYMENT_ERROR_CODES.PAYMENT_REJECTED);
    expect(error.code).toBe('PAYMENT_REJECTED');
    expect(error.message).toContain('rejected');
  });

  it('creates error with predefined message for NETWORK_MISMATCH', () => {
    const error = createPaymentError(PAYMENT_ERROR_CODES.NETWORK_MISMATCH);
    expect(error.code).toBe('NETWORK_MISMATCH');
    expect(error.message).toContain('Base network');
  });

  it('creates error with predefined message for PAYMENT_TIMEOUT', () => {
    const error = createPaymentError(PAYMENT_ERROR_CODES.PAYMENT_TIMEOUT);
    expect(error.code).toBe('PAYMENT_TIMEOUT');
    expect(error.message).toContain('timed out');
  });

  it('creates error with predefined message for PAYMENT_FAILED', () => {
    const error = createPaymentError(PAYMENT_ERROR_CODES.PAYMENT_FAILED);
    expect(error.code).toBe('PAYMENT_FAILED');
    expect(error.message).toContain('failed');
  });

  it('creates error with predefined message for WALLET_NOT_CONNECTED', () => {
    const error = createPaymentError(PAYMENT_ERROR_CODES.WALLET_NOT_CONNECTED);
    expect(error.code).toBe('WALLET_NOT_CONNECTED');
    expect(error.message).toContain('connect your wallet');
  });

  it('includes details when provided', () => {
    const details = { reason: 'test' };
    const error = createPaymentError(PAYMENT_ERROR_CODES.PAYMENT_FAILED, details);
    expect(error.details).toEqual(details);
  });
});

describe('isRetryableError', () => {
  it('returns true for retryable PaymentError', () => {
    const error = new PaymentError('Timeout', PAYMENT_ERROR_CODES.PAYMENT_TIMEOUT);
    expect(isRetryableError(error)).toBe(true);
  });

  it('returns false for non-retryable PaymentError', () => {
    const error = new PaymentError('Rejected', PAYMENT_ERROR_CODES.PAYMENT_REJECTED);
    expect(isRetryableError(error)).toBe(false);
  });

  it('returns true for errors with timeout in message', () => {
    const error = new Error('Request timeout after 30s');
    expect(isRetryableError(error)).toBe(true);
  });

  it('returns true for errors with network in message', () => {
    const error = new Error('Network connection error');
    expect(isRetryableError(error)).toBe(true);
  });

  it('returns true for errors with failed to fetch in message', () => {
    const error = new Error('Failed to fetch');
    expect(isRetryableError(error)).toBe(true);
  });

  it('returns false for regular errors without retryable keywords', () => {
    const error = new Error('User denied transaction');
    expect(isRetryableError(error)).toBe(false);
  });

  it('returns false for non-Error values', () => {
    expect(isRetryableError('error')).toBe(false);
    expect(isRetryableError(null)).toBe(false);
    expect(isRetryableError(undefined)).toBe(false);
  });
});

describe('getPaymentErrorMessage', () => {
  it('returns message from PaymentError', () => {
    const error = new PaymentError('Custom message', PAYMENT_ERROR_CODES.PAYMENT_FAILED);
    expect(getPaymentErrorMessage(error)).toBe('Custom message');
  });

  it('returns message from regular Error', () => {
    const error = new Error('Regular error');
    expect(getPaymentErrorMessage(error)).toBe('Regular error');
  });

  it('returns default message for unknown values', () => {
    expect(getPaymentErrorMessage('string')).toBe('An unknown error occurred');
    expect(getPaymentErrorMessage(null)).toBe('An unknown error occurred');
    expect(getPaymentErrorMessage(undefined)).toBe('An unknown error occurred');
    expect(getPaymentErrorMessage({})).toBe('An unknown error occurred');
  });
});

describe('is402Response', () => {
  it('returns true for response with status 402', () => {
    const response = { status: 402 } as Response;
    expect(is402Response(response)).toBe(true);
  });

  it('returns false for other status codes', () => {
    expect(is402Response({ status: 200 } as Response)).toBe(false);
    expect(is402Response({ status: 401 } as Response)).toBe(false);
    expect(is402Response({ status: 500 } as Response)).toBe(false);
  });
});

describe('parse402Response', () => {
  it('throws for non-402 response', async () => {
    const response = { status: 200 } as Response;
    await expect(parse402Response(response)).rejects.toThrow(
      'Response is not a 402 Payment Required',
    );
  });

  it('throws for invalid x402 format', async () => {
    const response = {
      status: 402,
      json: async () => ({ invalid: 'data' }),
    } as unknown as Response;
    await expect(parse402Response(response)).rejects.toThrow('Invalid x402 response format');
  });

  it('parses valid x402 response', async () => {
    const paymentDetails = {
      x402Version: 1,
      accepts: [
        {
          scheme: 'exact',
          network: 'eip155:8453',
          maxAmountRequired: '50000',
          asset: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          payTo: '0x0FF5A2766Aad32ee5AeEFbDa903e8dC3F6A64B7D',
        },
      ],
    };
    const response = {
      status: 402,
      json: async () => paymentDetails,
    } as unknown as Response;
    const result = await parse402Response(response);
    expect(result).toEqual(paymentDetails);
  });
});
