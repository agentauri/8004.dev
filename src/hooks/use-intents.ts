/**
 * Hooks for fetching and managing intent templates with TanStack Query
 *
 * Provides query hooks for listing and fetching intent templates, as well as
 * a mutation hook for matching agents to template roles.
 */

import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { IntentTemplate } from '@/types/agent';

/** Options for the useIntents hook */
export interface UseIntentsOptions {
  /** Filter templates by category */
  category?: string;
  /** Maximum number of templates to return (default: 20) */
  limit?: number;
  /** Whether the query is enabled (default: true) */
  enabled?: boolean;
}

/** Options for the useIntent hook */
export interface UseIntentOptions {
  /** Whether the query is enabled (default: true) */
  enabled?: boolean;
}

interface FetchIntentsOptions {
  category?: string;
  limit: number;
}

/**
 * Fetch intent templates list from API
 */
async function fetchIntents(options: FetchIntentsOptions): Promise<IntentTemplate[]> {
  const params = new URLSearchParams();

  if (options.category) {
    params.set('category', options.category);
  }
  params.set('limit', String(options.limit));

  const response = await fetch(`/api/intents?${params.toString()}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch intent templates');
  }

  return json.data as IntentTemplate[];
}

/**
 * Fetch a single intent template by ID
 */
async function fetchIntent(id: string): Promise<IntentTemplate | null> {
  const response = await fetch(`/api/intents/${id}`);
  const json = await response.json();

  if (!json.success) {
    if (json.code === 'INTENT_NOT_FOUND') {
      return null;
    }
    throw new Error(json.error || 'Failed to fetch intent template');
  }

  return json.data as IntentTemplate;
}

/**
 * Match agents to intent template roles
 */
async function matchIntentAgents(id: string): Promise<IntentTemplate> {
  const response = await fetch(`/api/intents/${id}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to match agents to intent');
  }

  return json.data as IntentTemplate;
}

/**
 * Hook to fetch a list of intent templates with optional filtering
 *
 * @param options - Query options including category filter and limit
 * @returns TanStack Query result with intent templates array
 *
 * @example
 * ```tsx
 * // Fetch all intent templates
 * const { data, isLoading } = useIntents();
 *
 * // Fetch only automation templates
 * const { data } = useIntents({ category: 'automation', limit: 10 });
 * ```
 */
export function useIntents(
  options: UseIntentsOptions = {},
): UseQueryResult<IntentTemplate[], Error> {
  const { category, limit = 20, enabled = true } = options;

  return useQuery<IntentTemplate[], Error>({
    queryKey: category ? queryKeys.intentsByCategory(category) : queryKeys.intents(),
    queryFn: () => fetchIntents({ category, limit }),
    enabled,
    staleTime: 60 * 1000, // 1 minute - templates don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a single intent template by ID
 *
 * @param id - Intent template ID
 * @param options - Query options
 * @returns TanStack Query result with intent template or null if not found
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useIntent('code-review-workflow');
 *
 * if (data) {
 *   console.log(data.name, data.steps);
 * }
 * ```
 */
export function useIntent(
  id: string,
  options: UseIntentOptions = {},
): UseQueryResult<IntentTemplate | null, Error> {
  const { enabled = true } = options;

  return useQuery<IntentTemplate | null, Error>({
    queryKey: queryKeys.intent(id),
    queryFn: () => fetchIntent(id),
    enabled: enabled && Boolean(id),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnMount: true,
  });
}

/**
 * Hook to match agents to intent template roles
 *
 * Automatically updates the intent query cache with matched agents on success.
 *
 * @param id - Intent template ID
 * @returns TanStack Query mutation result with match function
 *
 * @example
 * ```tsx
 * const { mutate: matchAgents, isPending, data } = useIntentMatches('code-review-workflow');
 *
 * // Trigger matching
 * matchAgents();
 *
 * // Access matched template
 * if (data) {
 *   console.log(data.matchedAgents);
 * }
 * ```
 */
export function useIntentMatches(id: string): UseMutationResult<IntentTemplate, Error, void> {
  const queryClient = useQueryClient();

  return useMutation<IntentTemplate, Error, void>({
    mutationFn: () => matchIntentAgents(id),
    onSuccess: (matchResult) => {
      // Merge matched agents with existing template to preserve all original data
      // This prevents cache corruption if the match endpoint returns incomplete data
      queryClient.setQueryData<IntentTemplate | null>(queryKeys.intent(id), (existingTemplate) => {
        if (!existingTemplate) return matchResult;

        // Only update matchedAgents from the match result, preserve everything else
        return {
          ...existingTemplate,
          matchedAgents: matchResult.matchedAgents,
        };
      });

      // Invalidate the matches query
      queryClient.invalidateQueries({
        queryKey: queryKeys.intentMatches(id),
      });
    },
  });
}
