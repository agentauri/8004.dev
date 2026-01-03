/**
 * Hooks for fetching and managing agent evaluations with TanStack Query
 *
 * Provides query hooks for listing and fetching evaluations, as well as
 * a mutation hook for creating new evaluations.
 */

import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { Evaluation, EvaluationStatus } from '@/types/agent';

/** Options for the useEvaluations hook */
export interface UseEvaluationsOptions {
  /** Filter evaluations by status */
  status?: EvaluationStatus;
  /** Maximum number of evaluations to return (default: 20) */
  limit?: number;
  /** Whether the query is enabled (default: true) */
  enabled?: boolean;
}

/** Options for the useEvaluation hook */
export interface UseEvaluationOptions {
  /** Whether the query is enabled (default: true) */
  enabled?: boolean;
}

/** Options for the useAgentEvaluations hook */
export interface UseAgentEvaluationsOptions {
  /** Whether the query is enabled (default: true) */
  enabled?: boolean;
}

/** Input for creating a new evaluation */
export interface CreateEvaluationInput {
  /** Agent ID in format "chainId:tokenId" */
  agentId: string;
  /** Optional list of specific benchmarks to run */
  benchmarks?: string[];
}

/**
 * Fetch evaluations list from API
 */
async function fetchEvaluations(options: {
  status?: EvaluationStatus;
  limit: number;
}): Promise<Evaluation[]> {
  const params = new URLSearchParams();

  if (options.status) {
    params.set('status', options.status);
  }
  params.set('limit', String(options.limit));

  const response = await fetch(`/api/evaluations?${params.toString()}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch evaluations');
  }

  return json.data as Evaluation[];
}

/**
 * Fetch a single evaluation by ID
 */
async function fetchEvaluation(id: string): Promise<Evaluation | null> {
  const response = await fetch(`/api/evaluations/${id}`);
  const json = await response.json();

  if (!json.success) {
    if (json.code === 'EVALUATION_NOT_FOUND') {
      return null;
    }
    throw new Error(json.error || 'Failed to fetch evaluation');
  }

  return json.data as Evaluation;
}

/**
 * Fetch evaluations for a specific agent
 */
async function fetchAgentEvaluations(agentId: string): Promise<Evaluation[]> {
  const response = await fetch(`/api/agents/${agentId}/evaluations`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch agent evaluations');
  }

  return json.data as Evaluation[];
}

/**
 * Create a new evaluation via API
 */
async function createEvaluation(input: CreateEvaluationInput): Promise<Evaluation> {
  const response = await fetch('/api/evaluations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to create evaluation');
  }

  return json.data as Evaluation;
}

/**
 * Hook to fetch a list of evaluations with optional filtering
 *
 * @param options - Query options including status filter and limit
 * @returns TanStack Query result with evaluations array
 *
 * @example
 * ```tsx
 * // Fetch all evaluations
 * const { data, isLoading } = useEvaluations();
 *
 * // Fetch only pending evaluations
 * const { data } = useEvaluations({ status: 'pending', limit: 10 });
 * ```
 */
export function useEvaluations(
  options: UseEvaluationsOptions = {},
): UseQueryResult<Evaluation[], Error> {
  const { status, limit = 20, enabled = true } = options;

  return useQuery<Evaluation[], Error>({
    queryKey: status ? queryKeys.evaluationsByStatus(status) : queryKeys.evaluations(),
    queryFn: () => fetchEvaluations({ status, limit }),
    enabled,
    staleTime: 30 * 1000, // 30 seconds - evaluations can change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single evaluation by ID
 *
 * @param id - Evaluation ID
 * @param options - Query options
 * @returns TanStack Query result with evaluation or null if not found
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useEvaluation('eval-123');
 *
 * if (data) {
 *   console.log(data.status, data.scores);
 * }
 * ```
 */
export function useEvaluation(
  id: string,
  options: UseEvaluationOptions = {},
): UseQueryResult<Evaluation | null, Error> {
  const { enabled = true } = options;

  return useQuery<Evaluation | null, Error>({
    queryKey: queryKeys.evaluation(id),
    queryFn: () => fetchEvaluation(id),
    enabled: enabled && Boolean(id),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
  });
}

/**
 * Hook to fetch evaluations for a specific agent
 *
 * @param agentId - Agent ID in format "chainId:tokenId"
 * @param options - Query options
 * @returns TanStack Query result with evaluations array for the agent
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useAgentEvaluations('11155111:123');
 *
 * if (data) {
 *   data.forEach(evaluation => {
 *     console.log(evaluation.status, evaluation.scores.safety);
 *   });
 * }
 * ```
 */
export function useAgentEvaluations(
  agentId: string,
  options: UseAgentEvaluationsOptions = {},
): UseQueryResult<Evaluation[], Error> {
  const { enabled = true } = options;

  return useQuery<Evaluation[], Error>({
    queryKey: queryKeys.agentEvaluations(agentId),
    queryFn: () => fetchAgentEvaluations(agentId),
    enabled: enabled && Boolean(agentId),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true,
  });
}

/**
 * Hook to create a new evaluation for an agent
 *
 * Automatically invalidates relevant queries on success to refresh data.
 *
 * @returns TanStack Query mutation result with create function
 *
 * @example
 * ```tsx
 * const { mutate, isPending, error } = useCreateEvaluation();
 *
 * // Create evaluation with default benchmarks
 * mutate({ agentId: '11155111:123' });
 *
 * // Create evaluation with specific benchmarks
 * mutate({
 *   agentId: '11155111:123',
 *   benchmarks: ['safety-basic', 'capability-code'],
 * });
 * ```
 */
export function useCreateEvaluation(): UseMutationResult<Evaluation, Error, CreateEvaluationInput> {
  const queryClient = useQueryClient();

  return useMutation<Evaluation, Error, CreateEvaluationInput>({
    mutationFn: createEvaluation,
    onSuccess: (data) => {
      // Invalidate evaluations list to include the new evaluation
      queryClient.invalidateQueries({ queryKey: queryKeys.evaluations() });

      // Invalidate agent-specific evaluations
      queryClient.invalidateQueries({
        queryKey: queryKeys.agentEvaluations(data.agentId),
      });
    },
  });
}
