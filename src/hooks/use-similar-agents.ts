/**
 * Hook for fetching similar agents based on OASF taxonomy
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { SimilarAgent } from '@/types/agent';

export interface UseSimilarAgentsOptions {
  /** Maximum number of similar agents to return (default: 4, max: 20) */
  limit?: number;
}

interface SimilarAgentsResponse {
  success: boolean;
  data: {
    agents: SimilarAgent[];
    meta: {
      total: number;
      limit: number;
      targetAgent: string;
    };
  };
}

/**
 * Fetch similar agents from API route
 */
async function fetchSimilarAgents(agentId: string, limit: number): Promise<SimilarAgent[]> {
  const response = await fetch(`/api/agents/${agentId}/similar?limit=${limit}`);
  const json: SimilarAgentsResponse = await response.json();

  if (!json.success) {
    throw new Error('Failed to fetch similar agents');
  }

  return json.data.agents;
}

/**
 * Hook to fetch agents similar to the given agent based on OASF taxonomy
 *
 * Uses the backend's similarity algorithm which considers:
 * - Shared OASF skills
 * - Shared OASF domains
 * - Confidence-weighted matching
 *
 * @param agentId - The agent ID to find similar agents for
 * @param options - Configuration options
 * @returns TanStack Query result with similar agents
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useSimilarAgents('11155111:123', { limit: 5 });
 *
 * // Access similarity data
 * data?.forEach(agent => {
 *   console.log(agent.name, agent.similarityScore);
 *   console.log('Matched skills:', agent.matchedSkills);
 * });
 * ```
 */
export function useSimilarAgents(
  agentId: string | undefined,
  options: UseSimilarAgentsOptions = {},
) {
  const { limit = 4 } = options;

  return useQuery<SimilarAgent[], Error>({
    queryKey: queryKeys.similar(agentId ?? '', limit),
    queryFn: () => {
      if (!agentId) return Promise.resolve([]);
      return fetchSimilarAgents(agentId, limit);
    },
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
