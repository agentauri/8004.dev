/**
 * Hook for fetching agent counts by chain with TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

/**
 * Chain counts response type
 * Maps chain ID to agent count
 */
export type ChainCounts = Record<number, number>;

/**
 * Fetch chain counts from API route
 */
async function fetchChainCounts(): Promise<ChainCounts> {
  const response = await fetch('/api/chains');
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch chain counts');
  }

  // Convert array response to chainId -> count map
  const counts: ChainCounts = {};
  for (const chain of json.data) {
    counts[chain.chainId] = chain.agentCount;
  }
  return counts;
}

/**
 * Hook to fetch agent count per chain with caching
 *
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns TanStack Query result with chain counts, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useChainCounts();
 *
 * if (data) {
 *   console.log(`Sepolia: ${data[11155111]} agents`);
 *   console.log(`Base: ${data[84532]} agents`);
 * }
 * ```
 */
export function useChainCounts(enabled = true) {
  return useQuery<ChainCounts, Error>({
    queryKey: queryKeys.chains(),
    queryFn: fetchChainCounts,
    enabled,
    staleTime: 5 * 60 * 1000, // Chain counts can be cached longer (5 minutes)
  });
}
