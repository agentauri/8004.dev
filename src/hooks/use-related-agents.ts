/**
 * Hook for fetching agents related to a given agent
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { Agent, AgentSummary } from '@/types/agent';

export interface UseRelatedAgentsOptions {
  /** Maximum number of related agents to return */
  limit?: number;
  /** Whether to include agents from all chains or same chain only */
  crossChain?: boolean;
}

/**
 * Fetch related agents from API route
 */
async function fetchRelatedAgents(
  agent: Agent,
  limit: number,
  crossChain: boolean,
): Promise<AgentSummary[]> {
  const searchParams = new URLSearchParams();

  // Build search params based on agent's capabilities
  if (agent.endpoints.mcp) searchParams.set('mcp', 'true');
  if (agent.endpoints.a2a) searchParams.set('a2a', 'true');
  if (agent.x402support) searchParams.set('x402', 'true');
  searchParams.set('active', 'true');
  // Request limit+1 to account for potential current agent in results
  searchParams.set('limit', String(limit + 1));
  if (!crossChain) {
    searchParams.set('chainIds', String(agent.chainId));
  }

  const response = await fetch(`/api/agents?${searchParams.toString()}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch related agents');
  }

  const agents = json.data as AgentSummary[];

  // Filter out the current agent and apply limit
  const filtered = agents.filter((a) => a.id !== agent.id).slice(0, limit);

  return filtered;
}

/**
 * Hook to fetch agents with similar capabilities to the given agent
 *
 * @param agent - The agent to find related agents for
 * @param options - Configuration options
 * @returns TanStack Query result with related agents
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useRelatedAgents(agent, { limit: 5 });
 * ```
 */
export function useRelatedAgents(agent: Agent | undefined, options: UseRelatedAgentsOptions = {}) {
  const { limit = 4, crossChain = true } = options;

  return useQuery<AgentSummary[], Error>({
    queryKey: queryKeys.related(agent?.id ?? '', limit, crossChain),
    queryFn: () => {
      if (!agent) return Promise.resolve([]);
      return fetchRelatedAgents(agent, limit, crossChain);
    },
    enabled: !!agent,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
