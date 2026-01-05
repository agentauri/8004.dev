/**
 * Hook for fetching global feedbacks with TanStack Query
 */

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { GlobalFeedbackParams, GlobalFeedbackResult } from '@/types/feedback';

interface UseGlobalFeedbacksOptions extends GlobalFeedbackParams {
  /** Whether the query should be enabled */
  enabled?: boolean;
}

/**
 * Build URL params from feedback options
 */
function buildParams(options: GlobalFeedbackParams): URLSearchParams {
  const params = new URLSearchParams();

  if (options.scoreCategory) {
    params.set('scoreCategory', options.scoreCategory);
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
  if (options.startDate) {
    params.set('startDate', options.startDate);
  }
  if (options.endDate) {
    params.set('endDate', options.endDate);
  }
  if (options.agentSearch) {
    params.set('agentSearch', options.agentSearch);
  }

  return params;
}

/**
 * Fetch global feedbacks from API route
 */
async function fetchGlobalFeedbacks(options: GlobalFeedbackParams): Promise<GlobalFeedbackResult> {
  const params = buildParams(options);
  const response = await fetch(`/api/feedbacks?${params}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch feedbacks');
  }

  return json.data;
}

/**
 * Hook to fetch global feedbacks with simple pagination
 *
 * @param options - Query parameters and hook options
 * @returns TanStack Query result with feedback data
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGlobalFeedbacks({
 *   scoreCategory: 'positive',
 *   limit: 20,
 * });
 * ```
 */
export function useGlobalFeedbacks({
  enabled = true,
  ...params
}: UseGlobalFeedbacksOptions = {}) {
  return useQuery<GlobalFeedbackResult, Error>({
    queryKey: queryKeys.globalFeedbacksList(params),
    queryFn: () => fetchGlobalFeedbacks(params),
    enabled,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch global feedbacks with infinite scroll pagination
 *
 * @param options - Query parameters and hook options
 * @returns TanStack Query infinite result with feedback data
 *
 * @example
 * ```tsx
 * const {
 *   data,
 *   isLoading,
 *   fetchNextPage,
 *   hasNextPage,
 * } = useInfiniteGlobalFeedbacks({
 *   scoreCategory: 'positive',
 *   limit: 20,
 * });
 *
 * // Access flattened feedbacks
 * const feedbacks = data?.pages.flatMap(page => page.feedbacks) ?? [];
 * ```
 */
export function useInfiniteGlobalFeedbacks({
  enabled = true,
  ...params
}: UseGlobalFeedbacksOptions = {}) {
  return useInfiniteQuery<GlobalFeedbackResult, Error>({
    queryKey: queryKeys.globalFeedbacksList({ ...params, infinite: true }),
    queryFn: ({ pageParam }) =>
      fetchGlobalFeedbacks({
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
