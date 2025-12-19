/**
 * Hook for fetching platform statistics with TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import type { PlatformStats } from '@/components/organisms';
import { queryKeys } from '@/lib/query-keys';

/**
 * Fetch platform stats from API route
 */
async function fetchStats(): Promise<PlatformStats> {
  const response = await fetch('/api/stats');
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch platform statistics');
  }

  return json.data;
}

/**
 * Hook to fetch platform statistics with caching
 *
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns TanStack Query result with stats, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useStats();
 *
 * if (data) {
 *   console.log(`Total: ${data.totalAgents}, Active: ${data.activeAgents}`);
 *   for (const chain of data.chainBreakdown) {
 *     console.log(`${chain.name}: ${chain.active} / ${chain.total}`);
 *   }
 * }
 * ```
 */
export function useStats(enabled = true) {
  return useQuery<PlatformStats, Error>({
    queryKey: queryKeys.stats(),
    queryFn: fetchStats,
    enabled,
    staleTime: 5 * 60 * 1000, // Stats can be cached for 5 minutes
  });
}
