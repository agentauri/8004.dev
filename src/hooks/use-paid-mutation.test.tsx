import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { X402PaymentDetails } from '@/types/x402';
import { fetchWithPayment, usePaidMutation } from './use-paid-mutation';

describe('usePaidMutation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = () => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
  };

  const mockPaymentDetails: X402PaymentDetails = {
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

  describe('successful mutation', () => {
    it('completes mutation without payment when no 402', async () => {
      const mockMutationFn = vi.fn().mockResolvedValue({ success: true, data: 'result' });

      const { result } = renderHook(
        () =>
          usePaidMutation({
            mutationFn: mockMutationFn,
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        result.current.mutate({ task: 'test' });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockMutationFn).toHaveBeenCalledWith({ task: 'test' });
      expect(result.current.paymentState.paymentRequired).toBe(false);
      expect(result.current.data).toEqual({ success: true, data: 'result' });
    });
  });

  describe('payment required flow', () => {
    it('captures 402 error and sets payment state', async () => {
      const mockMutationFn = vi.fn().mockRejectedValue({
        name: 'PaymentRequiredError',
        paymentDetails: mockPaymentDetails,
      });

      const onPaymentRequired = vi.fn();

      const { result } = renderHook(
        () =>
          usePaidMutation({
            mutationFn: mockMutationFn,
            onPaymentRequired,
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        result.current.mutate({ task: 'test' });
      });

      await waitFor(() => {
        expect(result.current.paymentState.paymentRequired).toBe(true);
      });

      expect(result.current.paymentState.paymentDetails).toEqual(mockPaymentDetails);
      expect(result.current.pendingVariables).toEqual({ task: 'test' });
      expect(onPaymentRequired).toHaveBeenCalledWith(mockPaymentDetails, { task: 'test' });
    });

    it('retries with payment header when confirmPayment is called', async () => {
      const mockMutationFn = vi
        .fn()
        .mockRejectedValueOnce({
          name: 'PaymentRequiredError',
          paymentDetails: mockPaymentDetails,
        })
        .mockResolvedValueOnce({ success: true, data: 'result' });

      const { result } = renderHook(
        () =>
          usePaidMutation({
            mutationFn: mockMutationFn,
          }),
        { wrapper: createWrapper() },
      );

      // First call triggers 402
      await act(async () => {
        result.current.mutate({ task: 'test' });
      });

      await waitFor(() => {
        expect(result.current.paymentState.paymentRequired).toBe(true);
      });

      // Confirm payment
      let confirmResult: unknown;
      await act(async () => {
        confirmResult = await result.current.confirmPayment('signed-payment-header');
      });

      expect(confirmResult).toEqual({ success: true, data: 'result' });
      expect(mockMutationFn).toHaveBeenCalledTimes(2);
      expect(mockMutationFn).toHaveBeenLastCalledWith({ task: 'test' }, 'signed-payment-header');
      expect(result.current.paymentState.paymentRequired).toBe(false);
    });

    it('clears payment state when clearPayment is called', async () => {
      const mockMutationFn = vi.fn().mockRejectedValue({
        name: 'PaymentRequiredError',
        paymentDetails: mockPaymentDetails,
      });

      const { result } = renderHook(
        () =>
          usePaidMutation({
            mutationFn: mockMutationFn,
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        result.current.mutate({ task: 'test' });
      });

      await waitFor(() => {
        expect(result.current.paymentState.paymentRequired).toBe(true);
      });

      act(() => {
        result.current.clearPayment();
      });

      expect(result.current.paymentState.paymentRequired).toBe(false);
      expect(result.current.paymentState.paymentDetails).toBeNull();
      expect(result.current.pendingVariables).toBeNull();
    });

    it('throws error when confirmPayment called without pending variables', async () => {
      const mockMutationFn = vi.fn();

      const { result } = renderHook(
        () =>
          usePaidMutation({
            mutationFn: mockMutationFn,
          }),
        { wrapper: createWrapper() },
      );

      await expect(result.current.confirmPayment('header')).rejects.toThrow(
        'No pending payment to confirm',
      );
    });

    it('sets payment error when confirmPayment fails', async () => {
      const mockMutationFn = vi
        .fn()
        .mockRejectedValueOnce({
          name: 'PaymentRequiredError',
          paymentDetails: mockPaymentDetails,
        })
        .mockRejectedValueOnce(new Error('Payment verification failed'));

      const { result } = renderHook(
        () =>
          usePaidMutation({
            mutationFn: mockMutationFn,
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        result.current.mutate({ task: 'test' });
      });

      await waitFor(() => {
        expect(result.current.paymentState.paymentRequired).toBe(true);
      });

      // Use try-catch to allow state update to complete before checking
      let caughtError: Error | null = null;
      await act(async () => {
        try {
          await result.current.confirmPayment('signed-payment-header');
        } catch (error) {
          caughtError = error as Error;
        }
      });

      expect(caughtError).not.toBeNull();
      expect((caughtError as unknown as Error).message).toBe('Payment verification failed');
      expect(result.current.paymentState.paymentError).toBe('Payment verification failed');
      expect(result.current.paymentState.isPaying).toBe(false);
    });
  });

  describe('non-402 errors', () => {
    it('propagates non-402 errors normally', async () => {
      const mockMutationFn = vi.fn().mockRejectedValue(new Error('Server error'));
      const onError = vi.fn();

      const { result } = renderHook(
        () =>
          usePaidMutation({
            mutationFn: mockMutationFn,
            onError,
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        result.current.mutate({ task: 'test' });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.paymentState.paymentRequired).toBe(false);
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('payment state during payment', () => {
    it('sets isPaying during payment confirmation', async () => {
      let resolvePayment: (value: unknown) => void;
      const paymentPromise = new Promise((resolve) => {
        resolvePayment = resolve;
      });

      const mockMutationFn = vi
        .fn()
        .mockRejectedValueOnce({
          name: 'PaymentRequiredError',
          paymentDetails: mockPaymentDetails,
        })
        .mockImplementationOnce(() => paymentPromise);

      const { result } = renderHook(
        () =>
          usePaidMutation({
            mutationFn: mockMutationFn,
          }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        result.current.mutate({ task: 'test' });
      });

      await waitFor(() => {
        expect(result.current.paymentState.paymentRequired).toBe(true);
      });

      // Start payment without awaiting
      let confirmPromise: Promise<unknown>;
      act(() => {
        confirmPromise = result.current.confirmPayment('header');
      });

      // Check isPaying is true while waiting
      expect(result.current.paymentState.isPaying).toBe(true);

      // Resolve the payment
      await act(async () => {
        resolvePayment!({ success: true });
        await confirmPromise;
      });

      expect(result.current.paymentState.isPaying).toBe(false);
    });
  });
});

describe('fetchWithPayment', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  it('makes a successful request without payment header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: 'result' }),
    });

    const result = await fetchWithPayment('/api/test');

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );
    expect(result).toEqual({ success: true, data: 'result' });
  });

  it('includes X-PAYMENT header when provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });

    await fetchWithPayment('/api/test', { paymentHeader: 'signed-payment' });

    const calledHeaders = mockFetch.mock.calls[0][1].headers;
    expect(calledHeaders.get('X-PAYMENT')).toBe('signed-payment');
  });

  it('throws PaymentRequiredError on 402 response', async () => {
    const paymentDetails: X402PaymentDetails = {
      x402Version: 1,
      accepts: [],
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 402,
      json: () => Promise.resolve(paymentDetails),
    });

    try {
      await fetchWithPayment('/api/test');
      expect.fail('Should have thrown');
    } catch (error) {
      expect((error as Error).name).toBe('PaymentRequiredError');
      expect((error as Error & { paymentDetails: X402PaymentDetails }).paymentDetails).toEqual(
        paymentDetails,
      );
    }
  });

  it('throws error on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Internal server error' }),
    });

    await expect(fetchWithPayment('/api/test')).rejects.toThrow('Internal server error');
  });

  it('preserves other fetch options', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    });

    await fetchWithPayment('/api/test', {
      method: 'POST',
      body: JSON.stringify({ task: 'test' }),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ task: 'test' }),
      }),
    );
  });
});
