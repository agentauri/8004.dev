/**
 * Hooks for team composition with TanStack Query
 *
 * Provides a mutation hook for composing teams and a query hook
 * for fetching existing team compositions.
 */

import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { TeamComposition } from '@/types/agent';
import type { X402PaymentDetails } from '@/types/x402';
import { type UsePaidMutationResult, usePaidMutation } from './use-paid-mutation';

/** Input for composing a new team */
export interface ComposeTeamInput {
  /** Task description to compose a team for */
  task: string;
  /** Maximum number of team members (2-10, default: 5) */
  maxTeamSize?: number;
  /** Required capabilities for team members (mcp, a2a, x402) */
  requiredCapabilities?: string[];
}

/** Options for the useTeamComposition hook */
export interface UseTeamCompositionOptions {
  /** Whether the query is enabled (default: true) */
  enabled?: boolean;
}

/**
 * Compose a team via API (supports x402 payment)
 */
async function composeTeam(
  input: ComposeTeamInput,
  paymentHeader?: string,
): Promise<TeamComposition> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (paymentHeader) {
    headers['X-PAYMENT'] = paymentHeader;
  }

  const response = await fetch('/api/compose', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
  const json = await response.json();

  // Handle 402 Payment Required
  if (response.status === 402) {
    const error = new Error('Payment required') as Error & {
      paymentDetails: X402PaymentDetails;
    };
    error.name = 'PaymentRequiredError';
    error.paymentDetails = json;
    throw error;
  }

  if (!json.success) {
    throw new Error(json.error || 'Failed to compose team');
  }

  // Map createdAt to Date object
  return {
    ...json.data,
    createdAt: new Date(json.data.createdAt),
  } as TeamComposition;
}

/**
 * Fetch a team composition by ID
 */
async function fetchTeamComposition(id: string): Promise<TeamComposition | null> {
  const response = await fetch(`/api/compose/${id}`);
  const json = await response.json();

  if (!json.success) {
    if (json.code === 'COMPOSITION_NOT_FOUND') {
      return null;
    }
    throw new Error(json.error || 'Failed to fetch team composition');
  }

  // Map createdAt to Date object
  return {
    ...json.data,
    createdAt: new Date(json.data.createdAt),
  } as TeamComposition;
}

/**
 * Hook to compose a new team for a task
 *
 * Uses TanStack Query mutation for optimistic updates and error handling.
 *
 * @returns TanStack Query mutation result with compose function
 *
 * @example
 * ```tsx
 * const { mutate, isPending, error, data } = useComposeTeam();
 *
 * // Compose a team with default settings
 * mutate({ task: 'Build a smart contract auditor' });
 *
 * // Compose a team with specific requirements
 * mutate({
 *   task: 'Create a multi-agent code review system',
 *   maxTeamSize: 4,
 *   requiredCapabilities: ['mcp', 'a2a'],
 * });
 * ```
 */
export function useComposeTeam(): UseMutationResult<TeamComposition, Error, ComposeTeamInput> {
  const queryClient = useQueryClient();

  return useMutation<TeamComposition, Error, ComposeTeamInput>({
    mutationFn: (input) => composeTeam(input),
    onSuccess: (data) => {
      // Cache the new composition
      queryClient.setQueryData(queryKeys.composition(data.id), data);

      // Invalidate teams list to include the new composition
      queryClient.invalidateQueries({ queryKey: queryKeys.teams() });
    },
  });
}

/**
 * Hook to compose a new team with x402 payment support
 *
 * Uses usePaidMutation to handle 402 Payment Required responses.
 * When a 402 is received, the hook captures the payment details
 * and provides methods to confirm payment and retry.
 *
 * @returns Extended mutation result with payment state and confirmation methods
 *
 * @example
 * ```tsx
 * const {
 *   mutate,
 *   isPending,
 *   paymentState,
 *   confirmPayment,
 *   clearPayment,
 * } = usePaidComposeTeam();
 *
 * // Start composition (may trigger payment requirement)
 * mutate({ task: 'Build a smart contract auditor' });
 *
 * // If payment is required
 * if (paymentState.paymentRequired) {
 *   // Show payment modal, get signature, then:
 *   await confirmPayment(signedPaymentHeader);
 * }
 * ```
 */
export function usePaidComposeTeam(): UsePaidMutationResult<
  TeamComposition,
  Error,
  ComposeTeamInput,
  unknown
> {
  const queryClient = useQueryClient();

  return usePaidMutation<TeamComposition, Error, ComposeTeamInput, unknown>({
    mutationFn: composeTeam,
    onSuccess: (data) => {
      // Cache the new composition
      queryClient.setQueryData(queryKeys.composition(data.id), data);

      // Invalidate teams list to include the new composition
      queryClient.invalidateQueries({ queryKey: queryKeys.teams() });
    },
  });
}

/**
 * Hook to fetch an existing team composition by ID
 *
 * @param id - Team composition ID
 * @param options - Query options
 * @returns TanStack Query result with team composition or null if not found
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useTeamComposition('comp-123');
 *
 * if (data) {
 *   console.log(data.fitnessScore, data.team);
 * }
 * ```
 */
export function useTeamComposition(
  id: string,
  options: UseTeamCompositionOptions = {},
): UseQueryResult<TeamComposition | null, Error> {
  const { enabled = true } = options;

  return useQuery<TeamComposition | null, Error>({
    queryKey: queryKeys.composition(id),
    queryFn: () => fetchTeamComposition(id),
    enabled: enabled && Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes - compositions don't change
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
