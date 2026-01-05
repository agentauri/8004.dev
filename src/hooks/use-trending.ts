/**
 * Hook for fetching trending agents with TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { TrendingAgentsResponse, TrendingPeriod } from '@/types/trending';

interface UseTrendingOptions {
  /** Time period for trending calculation */
  period?: TrendingPeriod;
  /** Number of agents to fetch (max 10) */
  limit?: number;
  /** Whether the query should be enabled */
  enabled?: boolean;
}

/**
 * Fetch trending agents from API route
 */
async function fetchTrending(
  period: TrendingPeriod,
  limit: number,
): Promise<TrendingAgentsResponse> {
  const params = new URLSearchParams({
    period,
    limit: String(limit),
  });

  const response = await fetch(`/api/trending?${params}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch trending agents');
  }

  return json.data;
}

/**
 * Hook to fetch trending agents (highest reputation growth)
 *
 * @param options - Hook configuration options
 * @returns TanStack Query result with trending agents, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useTrending({ period: '7d', limit: 5 });
 *
 * if (data) {
 *   for (const agent of data.agents) {
 *     console.log(`${agent.name}: +${agent.scoreChange} pts`);
 *   }
 * }
 * ```
 */
export function useTrending({
  period = '7d',
  limit = 5,
  enabled = true,
}: UseTrendingOptions = {}) {
  return useQuery<TrendingAgentsResponse, Error>({
    queryKey: queryKeys.trending(period, limit),
    queryFn: () => fetchTrending(period, limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
    refetchOnWindowFocus: true,
  });
}
