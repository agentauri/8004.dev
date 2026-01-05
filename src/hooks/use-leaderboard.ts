/**
 * Hook for fetching leaderboard with TanStack Query
 */

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { LeaderboardParams, LeaderboardResponse } from '@/types/leaderboard';

interface UseLeaderboardOptions extends LeaderboardParams {
  /** Whether the query should be enabled */
  enabled?: boolean;
}

/**
 * Build URL params from leaderboard options
 */
function buildParams(options: LeaderboardParams): URLSearchParams {
  const params = new URLSearchParams();

  if (options.period) {
    params.set('period', options.period);
  }
  if (options.limit !== undefined) {
    params.set('limit', String(options.limit));
  }
  if (options.cursor) {
    params.set('cursor', options.cursor);
  }
  if (options.chains && options.chains.length > 0) {
    params.set('chains', options.chains.join(','));
  }
  if (options.mcp !== undefined) {
    params.set('mcp', String(options.mcp));
  }
  if (options.a2a !== undefined) {
    params.set('a2a', String(options.a2a));
  }
  if (options.x402 !== undefined) {
    params.set('x402', String(options.x402));
  }

  return params;
}

/**
 * Fetch leaderboard from API route
 */
async function fetchLeaderboard(options: LeaderboardParams): Promise<LeaderboardResponse> {
  const params = buildParams(options);
  const response = await fetch(`/api/leaderboard?${params}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch leaderboard');
  }

  return json.data;
}

/**
 * Hook to fetch leaderboard with simple pagination
 *
 * @param options - Query parameters and hook options
 * @returns TanStack Query result with leaderboard data
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLeaderboard({
 *   period: '7d',
 *   limit: 20,
 *   chains: [11155111],
 * });
 * ```
 */
export function useLeaderboard({
  enabled = true,
  ...params
}: UseLeaderboardOptions = {}) {
  return useQuery<LeaderboardResponse, Error>({
    queryKey: queryKeys.leaderboardList(params),
    queryFn: () => fetchLeaderboard(params),
    enabled,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch leaderboard with infinite scroll pagination
 *
 * @param options - Query parameters and hook options
 * @returns TanStack Query infinite result with leaderboard data
 *
 * @example
 * ```tsx
 * const {
 *   data,
 *   isLoading,
 *   fetchNextPage,
 *   hasNextPage,
 * } = useInfiniteLeaderboard({
 *   period: '7d',
 *   limit: 20,
 *   chains: [11155111],
 * });
 *
 * // Access flattened entries
 * const entries = data?.pages.flatMap(page => page.entries) ?? [];
 * ```
 */
export function useInfiniteLeaderboard({
  enabled = true,
  ...params
}: UseLeaderboardOptions = {}) {
  return useInfiniteQuery<LeaderboardResponse, Error>({
    queryKey: queryKeys.leaderboardList({ ...params, infinite: true }),
    queryFn: ({ pageParam }) =>
      fetchLeaderboard({
        ...params,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    enabled,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}
