/**
 * Hook for searching agents with TanStack Query
 *
 * Uses semantic search (POST /api/search) when a text query is provided,
 * otherwise uses structured listing (GET /api/agents) for filter-only queries.
 *
 * Supports real-time updates via configurable polling interval.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { queryKeys } from '@/lib/query-keys';
import type { AgentSummary } from '@/types/agent';
import type { SearchParams, SearchResult } from '@/types/search';

/** Default polling interval for auto-refresh (30 seconds) */
export const DEFAULT_REFRESH_INTERVAL = 30 * 1000;

/** Options for search agents hook */
export interface UseSearchAgentsOptions {
  /** Whether the query is enabled (default: true) */
  enabled?: boolean;
  /** Enable auto-refresh polling (default: false) */
  autoRefresh?: boolean;
  /** Polling interval in milliseconds (default: 30000) */
  refreshInterval?: number;
}

/**
 * Fetch agents using semantic search (POST /api/search)
 * Used when a text query is provided
 */
async function fetchSemanticSearch(params: SearchParams): Promise<SearchResult> {
  // Build filters object for semantic search
  const filters: Record<string, boolean | number | number[] | string[] | string> = {};
  if (params.active !== undefined) filters.active = params.active;
  if (params.mcp) filters.mcp = true;
  if (params.a2a) filters.a2a = true;
  if (params.x402) filters.x402 = true;
  // Send chainIds as array per OpenAPI spec
  if (params.chains && params.chains.length > 0) {
    filters.chainIds = params.chains;
  }
  // Forward skills filter
  if (params.skills && params.skills.length > 0) {
    filters.skills = params.skills;
  }
  // Forward domains filter
  if (params.domains && params.domains.length > 0) {
    filters.domains = params.domains;
  }
  // Forward filterMode (AND/OR)
  if (params.filterMode) {
    filters.filterMode = params.filterMode;
  }

  const body: {
    query: string | undefined;
    limit: number;
    cursor?: string;
    sort?: string;
    order?: string;
    filters?: Record<string, boolean | number | number[] | string[] | string>;
  } = {
    query: params.q,
    limit: params.limit ?? 20,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
  };

  // Add cursor for pagination (backend uses cursor-based pagination per OpenAPI spec)
  if (params.cursor) {
    body.cursor = params.cursor;
  }

  // Add sorting parameters
  if (params.sort) {
    body.sort = params.sort;
  }
  if (params.order) {
    body.order = params.order;
  }

  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to search agents');
  }

  return {
    agents: json.data as AgentSummary[],
    total: json.meta?.total ?? json.data.length,
    hasMore: json.meta?.hasMore ?? false,
    nextCursor: json.meta?.nextCursor,
  };
}

/**
 * Fetch agents using structured listing (GET /api/agents)
 * Used when no text query is provided (filter-only)
 */
async function fetchAgentsList(params: SearchParams): Promise<SearchResult> {
  const searchParams = new URLSearchParams();

  if (params.mcp) searchParams.set('mcp', 'true');
  if (params.a2a) searchParams.set('a2a', 'true');
  if (params.x402) searchParams.set('x402', 'true');
  if (params.active !== undefined) searchParams.set('active', String(params.active));
  if (params.minRep !== undefined) searchParams.set('minRep', String(params.minRep));
  if (params.maxRep !== undefined) searchParams.set('maxRep', String(params.maxRep));
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.order) searchParams.set('order', params.order);
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.cursor) searchParams.set('cursor', params.cursor);
  if (params.chains && params.chains.length > 0) {
    searchParams.set('chains', params.chains.join(','));
  }
  if (params.skills && params.skills.length > 0) {
    searchParams.set('skills', params.skills.join(','));
  }
  if (params.domains && params.domains.length > 0) {
    searchParams.set('domains', params.domains.join(','));
  }
  if (params.filterMode === 'OR') {
    searchParams.set('filterMode', 'OR');
  }
  if (params.hasRegistrationFile === false) {
    searchParams.set('hasRegistrationFile', 'false');
  }

  const response = await fetch(`/api/agents?${searchParams.toString()}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch agents');
  }

  return {
    agents: json.data as AgentSummary[],
    total: json.meta?.total ?? json.data.length,
    hasMore: json.meta?.hasMore ?? false,
    nextCursor: json.meta?.nextCursor,
  };
}

/**
 * Fetch agents - chooses endpoint based on whether a text query is provided
 */
async function fetchAgents(params: SearchParams): Promise<SearchResult> {
  // Use semantic search when there's a text query
  if (params.q?.trim()) {
    return fetchSemanticSearch(params);
  }
  // Use structured listing for filter-only queries
  return fetchAgentsList(params);
}

/**
 * Hook to search agents with caching, automatic refetching, and optional polling
 *
 * @param params - Search parameters (query, filters, pagination)
 * @param options - Hook options (enabled, autoRefresh, refreshInterval)
 * @returns TanStack Query result with agents data, loading state, error, and refresh controls
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { data, isLoading, error } = useSearchAgents({
 *   q: 'trading',
 *   mcp: true,
 *   active: true,
 * });
 *
 * // With auto-refresh
 * const {
 *   data,
 *   isRefreshing,
 *   lastUpdated,
 *   toggleAutoRefresh,
 *   manualRefresh
 * } = useSearchAgents(
 *   { q: 'trading' },
 *   { autoRefresh: true, refreshInterval: 30000 }
 * );
 * ```
 */
export function useSearchAgents(
  params: SearchParams,
  options: UseSearchAgentsOptions | boolean = true,
) {
  // Handle legacy boolean signature for backwards compatibility
  const normalizedOptions: UseSearchAgentsOptions =
    typeof options === 'boolean' ? { enabled: options } : options;

  const {
    enabled = true,
    autoRefresh: initialAutoRefresh = false,
    refreshInterval = DEFAULT_REFRESH_INTERVAL,
  } = normalizedOptions;

  // Track auto-refresh state internally for toggle capability
  const [autoRefresh, setAutoRefresh] = useState(initialAutoRefresh);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();

  // Sync with external autoRefresh option
  useEffect(() => {
    setAutoRefresh(initialAutoRefresh);
  }, [initialAutoRefresh]);

  const query = useQuery<SearchResult, Error>({
    queryKey: queryKeys.list(params),
    queryFn: () => fetchAgents(params),
    enabled,
    // Stale-while-revalidate: show cached data immediately, refetch in background
    // Agent data is relatively static - 60s matches global provider setting
    staleTime: 60 * 1000, // 60 seconds - agent data doesn't change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for background refetch
    refetchOnMount: true, // Always check for updates on mount
    refetchOnWindowFocus: true, // Refetch when tab regains focus
    refetchInterval: autoRefresh ? refreshInterval : false,
    // Retry on transient failures (search-service/SDK timeouts)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  // Update lastUpdated timestamp when data changes
  useEffect(() => {
    if (query.data && query.dataUpdatedAt) {
      setLastUpdated(new Date(query.dataUpdatedAt));
    }
  }, [query.data, query.dataUpdatedAt]);

  // Prefetch next page when we have more results available
  useEffect(() => {
    if (query.data?.hasMore && query.data?.nextCursor) {
      const nextPageParams: SearchParams = {
        ...params,
        cursor: query.data.nextCursor,
      };
      queryClient.prefetchQuery({
        queryKey: queryKeys.list(nextPageParams),
        queryFn: () => fetchAgents(nextPageParams),
        staleTime: 60 * 1000,
      });
    }
  }, [query.data?.hasMore, query.data?.nextCursor, params, queryClient]);

  // Toggle auto-refresh on/off
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh((prev) => !prev);
  }, []);

  // Trigger manual refresh
  const manualRefresh = useCallback(() => {
    query.refetch();
  }, [query]);

  return {
    ...query,
    /** Whether auto-refresh polling is enabled */
    autoRefresh,
    /** Toggle auto-refresh on/off */
    toggleAutoRefresh,
    /** Trigger a manual refresh */
    manualRefresh,
    /** Whether a background refresh is in progress (not initial load) */
    isRefreshing: query.isFetching && !query.isLoading,
    /** Timestamp of the last successful data update */
    lastUpdated,
  };
}
