/**
 * Hook for mutations that require x402 payment.
 *
 * Wraps a mutation with 402 Payment Required handling.
 * When a 402 response is received, the hook provides the payment details
 * and a method to retry with a signed payment.
 */

import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { PaymentMutationState, X402PaymentDetails } from '@/types/x402';

/**
 * Extended mutation options for paid mutations
 */
export interface UsePaidMutationOptions<TData, TError, TVariables, TContext>
  extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> {
  /** The mutation function to execute */
  mutationFn: (variables: TVariables, paymentHeader?: string) => Promise<TData>;
  /** Callback when payment is required */
  onPaymentRequired?: (paymentDetails: X402PaymentDetails, variables: TVariables) => void;
}

/** Mutation options for individual mutate calls */
export interface MutateOptions<TData, TVariables, TContext> {
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => void;
  onError?: (error: Error, variables: TVariables, context: TContext | undefined) => void;
  onSettled?: (
    data: TData | undefined,
    error: Error | null,
    variables: TVariables,
    context: TContext | undefined,
  ) => void;
}

/**
 * Extended mutation result for paid mutations
 */
export interface UsePaidMutationResult<TData, TError, TVariables, TContext>
  extends Omit<UseMutationResult<TData, TError, TVariables, TContext>, 'mutate' | 'mutateAsync'> {
  /** Current payment state */
  paymentState: PaymentMutationState;
  /** Start the mutation (may trigger payment requirement) */
  mutate: (variables: TVariables, options?: MutateOptions<TData, TVariables, TContext>) => void;
  /** Start the mutation and return a promise */
  mutateAsync: (variables: TVariables) => Promise<TData>;
  /** Retry with payment header after user confirms payment */
  confirmPayment: (paymentHeader: string) => Promise<TData>;
  /** Clear the payment requirement state */
  clearPayment: () => void;
  /** The variables that triggered the payment requirement */
  pendingVariables: TVariables | null;
}

/**
 * Check if an error is a 402 Payment Required error
 * This checks the error response structure for x402 payment details
 */
function is402Error(error: unknown): error is { paymentDetails: X402PaymentDetails } {
  if (typeof error !== 'object' || error === null) return false;
  const e = error as Record<string, unknown>;
  if (e.name === 'PaymentRequiredError' && e.paymentDetails) return true;
  // Also check for error responses that contain paymentDetails
  if (e.paymentDetails && typeof e.paymentDetails === 'object') {
    const pd = e.paymentDetails as Record<string, unknown>;
    return typeof pd.x402Version === 'number' && Array.isArray(pd.accepts);
  }
  return false;
}

/**
 * Hook that wraps a mutation with x402 payment handling.
 *
 * When the mutation fails with a 402 Payment Required response,
 * the hook captures the payment details and provides methods to
 * retry with a payment header.
 *
 * @example
 * ```tsx
 * function ComposeForm() {
 *   const { mutate, paymentState, confirmPayment, clearPayment, pendingVariables } = usePaidMutation({
 *     mutationFn: async (input, paymentHeader) => {
 *       const response = await fetch('/api/compose', {
 *         method: 'POST',
 *         headers: paymentHeader ? { 'X-PAYMENT': paymentHeader } : {},
 *         body: JSON.stringify(input),
 *       });
 *       if (response.status === 402) {
 *         const paymentDetails = await response.json();
 *         throw { name: 'PaymentRequiredError', paymentDetails };
 *       }
 *       return response.json();
 *     },
 *     onPaymentRequired: (details, variables) => {
 *       // Show payment confirmation modal
 *     },
 *   });
 *
 *   const handleSubmit = (task: string) => {
 *     mutate({ task });
 *   };
 *
 *   const handlePaymentConfirm = async (signedPayment: string) => {
 *     await confirmPayment(signedPayment);
 *   };
 *
 *   if (paymentState.paymentRequired) {
 *     return (
 *       <PaymentModal
 *         details={paymentState.paymentDetails}
 *         onConfirm={handlePaymentConfirm}
 *         onCancel={clearPayment}
 *       />
 *     );
 *   }
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function usePaidMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UsePaidMutationOptions<TData, TError, TVariables, TContext>,
): UsePaidMutationResult<TData, TError, TVariables, TContext> {
  const { mutationFn, onPaymentRequired, ...mutationOptions } = options;

  // Track payment state
  const [paymentState, setPaymentState] = useState<PaymentMutationState>({
    paymentRequired: false,
    paymentDetails: null,
    isSigning: false,
    isPaying: false,
    paymentError: null,
  });

  // Track the variables that triggered payment requirement
  const [pendingVariables, setPendingVariables] = useState<TVariables | null>(null);

  // Track the mutate options for the pending call
  const [pendingMutateOptions, setPendingMutateOptions] = useState<MutateOptions<
    TData,
    TVariables,
    TContext
  > | null>(null);

  // Clear payment state
  const clearPayment = useCallback(() => {
    setPaymentState({
      paymentRequired: false,
      paymentDetails: null,
      isSigning: false,
      isPaying: false,
      paymentError: null,
    });
    setPendingVariables(null);
    setPendingMutateOptions(null);
  }, []);

  // Base mutation
  const mutation = useMutation<TData, TError, TVariables, TContext>({
    ...mutationOptions,
    mutationFn: async (variables: TVariables) => {
      // Clear any previous payment state
      clearPayment();
      return mutationFn(variables);
    },
    onError: (error, variables, context) => {
      // Check if this is a 402 Payment Required error
      if (is402Error(error)) {
        const paymentDetails = error.paymentDetails;
        setPaymentState({
          paymentRequired: true,
          paymentDetails,
          isSigning: false,
          isPaying: false,
          paymentError: null,
        });
        setPendingVariables(variables);
        onPaymentRequired?.(paymentDetails, variables);
        return;
      }

      // Pass through to original onError handler
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mutationOptions.onError as any)?.(error, variables, context);
    },
  });

  // Retry mutation with payment header
  const confirmPayment = useCallback(
    async (paymentHeader: string): Promise<TData> => {
      if (!pendingVariables) {
        throw new Error('No pending payment to confirm');
      }

      setPaymentState((prev) => ({
        ...prev,
        isSigning: false,
        isPaying: true,
        paymentError: null,
      }));

      try {
        const result = await mutationFn(pendingVariables, paymentHeader);

        // Get the variables and options before clearing
        const vars = pendingVariables;
        const opts = pendingMutateOptions;

        // Success - clear payment state
        clearPayment();

        // Trigger success callbacks (hook options first, then mutate options)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mutationOptions.onSuccess as any)?.(result, vars, undefined as unknown as TContext);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (opts?.onSuccess as any)?.(result, vars, undefined as unknown as TContext);

        return result;
      } catch (error) {
        // Payment failed
        setPaymentState((prev) => ({
          ...prev,
          isPaying: false,
          paymentError: error instanceof Error ? error.message : 'Payment failed',
        }));
        throw error;
      }
    },
    [pendingVariables, pendingMutateOptions, mutationFn, clearPayment, mutationOptions],
  );

  // Wrap mutate to handle the async part and store options for payment flow
  const wrappedMutate = useCallback(
    (variables: TVariables, options?: MutateOptions<TData, TVariables, TContext>) => {
      // Store the options for use after payment confirmation
      setPendingMutateOptions(options ?? null);
      // Cast to any to bypass type mismatch between our simplified MutateOptions
      // and TanStack Query's more complex signature
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutation.mutate(variables, options as any);
    },
    [mutation],
  );

  // Wrap mutateAsync
  const wrappedMutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      try {
        return await mutation.mutateAsync(variables);
      } catch (error) {
        // If it's a 402, the error has been captured in onError
        // but we still need to throw to indicate the mutation didn't complete
        if (is402Error(error)) {
          throw error;
        }
        throw error;
      }
    },
    [mutation],
  );

  return {
    ...mutation,
    mutate: wrappedMutate,
    mutateAsync: wrappedMutateAsync,
    paymentState,
    confirmPayment,
    clearPayment,
    pendingVariables,
  };
}

/**
 * Helper to create a fetch wrapper that handles 402 responses
 */
export async function fetchWithPayment<T>(
  url: string,
  options: RequestInit & { paymentHeader?: string } = {},
): Promise<T> {
  const { paymentHeader, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  if (paymentHeader) {
    headers.set('X-PAYMENT', paymentHeader);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (response.status === 402) {
    // Throw structured error for 402
    const error = new Error('Payment required') as Error & { paymentDetails: X402PaymentDetails };
    error.name = 'PaymentRequiredError';
    error.paymentDetails = data;
    throw error;
  }

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}
