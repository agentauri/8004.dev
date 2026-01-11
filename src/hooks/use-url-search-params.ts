'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SortField, SortOrder } from '@/components/molecules';
import type { SearchFiltersState } from '@/components/organisms/search-filters';
import { parseUrlParams, serializeToUrl, type UrlSearchState } from '@/lib/url-params';

// Re-export types for consumers
export type { UrlSearchState } from '@/lib/url-params';

export interface UseUrlSearchParamsReturn {
  /** Current search query */
  query: string;
  /**
   * @deprecated Page-based pagination removed. Use cursor from API response.
   * Always returns 1 for backwards compatibility.
   */
  page: number;
  /** Current filter state */
  filters: SearchFiltersState;
  /** Items per page */
  pageSize: number;
  /** Current sort field */
  sortBy: SortField;
  /** Current sort order */
  sortOrder: SortOrder;
  /** Update search query (resets cursor state) */
  setQuery: (query: string) => void;
  /**
   * @deprecated Page-based pagination removed. Use cursor from API response.
   * This function is a no-op for backwards compatibility.
   */
  setPage: (page: number) => void;
  /** Update page size (resets cursor state) */
  setPageSize: (pageSize: number) => void;
  /** Update filters (resets cursor state) */
  setFilters: (filters: SearchFiltersState) => void;
  /** Update sorting (resets cursor state) */
  setSort: (sortBy: SortField, sortOrder: SortOrder) => void;
  /**
   * @deprecated Offset-based pagination removed. Use cursor from API response.
   * Always returns 0 for backwards compatibility.
   */
  offset: number;
  /**
   * Signal that cursor state should be reset (query, filters, or sort changed)
   * Increments on each change to trigger cursor reset in consuming components
   */
  resetSignal: number;
}

/**
 * Hook to sync search state with URL query parameters
 *
 * @example
 * ```tsx
 * const { query, page, filters, setQuery, setPage, setFilters } = useUrlSearchParams();
 * ```
 */
export function useUrlSearchParams(): UseUrlSearchParamsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse current URL state
  const state = useMemo(() => parseUrlParams(searchParams), [searchParams]);

  // Serialize filters for stable comparison (object reference would change every render)
  const filtersKey = useMemo(() => JSON.stringify(state.filters), [state.filters]);

  // Reset signal - increments when cursor should be reset (query/filters/sort/pageSize change)
  // Using useState + useEffect to avoid side effects in useMemo
  const [resetSignal, setResetSignal] = useState(0);

  // Track changes to generate reset signal
  // biome-ignore lint/correctness/useExhaustiveDependencies: Dependencies are intentional change triggers
  useEffect(() => {
    // Increment signal on URL state changes (triggers cursor reset in consuming components)
    setResetSignal((prev) => prev + 1);
  }, [state.query, filtersKey, state.sortBy, state.sortOrder, state.pageSize]);

  // Update URL helper - accepts either a new state or an updater function
  const updateUrl = useCallback(
    (updater: UrlSearchState | ((prev: UrlSearchState) => UrlSearchState)) => {
      // Re-parse current URL to get latest state (avoids stale closure)
      const currentState = parseUrlParams(searchParams);
      const newState = typeof updater === 'function' ? updater(currentState) : updater;
      const params = serializeToUrl(newState);
      const search = params.toString();
      const url = search ? `${pathname}?${search}` : pathname;
      router.push(url, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const setQuery = useCallback(
    (query: string) => {
      updateUrl((prev) => ({ ...prev, query, page: 1 }));
    },
    [updateUrl],
  );

  // Deprecated: setPage is now a no-op since pagination is cursor-based
  const setPage = useCallback((_page: number) => {
    // No-op for backwards compatibility
    // Cursor-based pagination is managed in component state, not URL
  }, []);

  const setPageSize = useCallback(
    (pageSize: number) => {
      updateUrl((prev) => ({ ...prev, pageSize, page: 1 }));
    },
    [updateUrl],
  );

  const setFilters = useCallback(
    (filters: SearchFiltersState) => {
      updateUrl((prev) => ({ ...prev, filters, page: 1 }));
    },
    [updateUrl],
  );

  const setSort = useCallback(
    (sortBy: SortField, sortOrder: SortOrder) => {
      updateUrl((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
    },
    [updateUrl],
  );

  return {
    query: state.query,
    page: 1, // Always 1 - page-based pagination removed
    filters: state.filters,
    pageSize: state.pageSize,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    setQuery,
    setPage,
    setPageSize,
    setFilters,
    setSort,
    offset: 0, // Always 0 - offset-based pagination removed
    resetSignal,
  };
}
