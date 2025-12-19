/**
 * Hook for fetching agent details with TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { AgentDetailResponse } from '@/types/agent';

/**
 * Fetch agent details from API route
 */
async function fetchAgentDetail(agentId: string): Promise<AgentDetailResponse | null> {
  const response = await fetch(`/api/agents/${agentId}`);
  const json = await response.json();

  if (!json.success) {
    if (json.code === 'AGENT_NOT_FOUND') {
      return null;
    }
    throw new Error(json.error || 'Failed to fetch agent details');
  }

  return json.data as AgentDetailResponse;
}

/**
 * Hook to fetch full agent details including reputation and feedback
 *
 * @param agentId - Agent ID in format "chainId:tokenId"
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns TanStack Query result with agent detail data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAgentDetail('11155111:123');
 *
 * if (data) {
 *   console.log(data.agent.name);
 *   console.log(data.reputation.averageScore);
 * }
 * ```
 */
export function useAgentDetail(agentId: string, enabled = true) {
  return useQuery<AgentDetailResponse | null, Error>({
    queryKey: queryKeys.detail(agentId),
    queryFn: () => fetchAgentDetail(agentId),
    enabled: enabled && Boolean(agentId),
    // Stale-while-revalidate: show cached data immediately, refetch in background
    staleTime: 60 * 1000, // 1 minute - agent details can stay fresh longer
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache longer for revisits
    refetchOnMount: true, // Check for updates on mount
  });
}
