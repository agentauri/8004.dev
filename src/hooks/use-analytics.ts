/**
 * Hook for fetching platform analytics with TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import type { AnalyticsSummary, Period } from '@/types/analytics';

/**
 * Query key factory for analytics
 */
const analyticsKeys = {
  all: ['analytics'] as const,
  summary: (period: Period) => [...analyticsKeys.all, 'summary', period] as const,
};

export interface UseAnalyticsOptions {
  /** Time period for aggregation (default: 'day') */
  period?: Period;
  /** Whether the query should be enabled (default: true) */
  enabled?: boolean;
}

/**
 * Fetch analytics from API route
 */
async function fetchAnalytics(period: Period): Promise<AnalyticsSummary> {
  const params = new URLSearchParams({ period });
  const response = await fetch(`/api/analytics?${params}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch analytics');
  }

  return json.data;
}

/**
 * Hook to fetch platform analytics with caching
 *
 * @param options - Query parameters and hook options
 * @returns TanStack Query result with analytics data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAnalytics({ period: 'week' });
 *
 * if (data) {
 *   console.log(`Total Agents: ${data.platformStats.totalAgents}`);
 *   console.log(`MCP Adoption: ${data.platformStats.protocolAdoption.mcp}`);
 * }
 * ```
 */
export function useAnalytics({ period = 'day', enabled = true }: UseAnalyticsOptions = {}) {
  return useQuery<AnalyticsSummary, Error>({
    queryKey: analyticsKeys.summary(period),
    queryFn: () => fetchAnalytics(period),
    enabled,
    staleTime: 5 * 60 * 1000, // Analytics can be cached for 5 minutes
    refetchOnWindowFocus: false,
  });
}
