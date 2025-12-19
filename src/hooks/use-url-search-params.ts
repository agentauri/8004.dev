'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { SortField, SortOrder } from '@/components/molecules';
import type { SearchFiltersState } from '@/components/organisms/search-filters';
import { parseUrlParams, serializeToUrl, type UrlSearchState } from '@/lib/url-params';

// Re-export types for consumers
export type { UrlSearchState } from '@/lib/url-params';

export interface UseUrlSearchParamsReturn {
  /** Current search query */
  query: string;
  /** Current page number (1-indexed) */
  page: number;
  /** Current filter state */
  filters: SearchFiltersState;
  /** Items per page */
  pageSize: number;
  /** Current sort field */
  sortBy: SortField;
  /** Current sort order */
  sortOrder: SortOrder;
  /** Update search query (resets page to 1) */
  setQuery: (query: string) => void;
  /** Update current page */
  setPage: (page: number) => void;
  /** Update page size (resets page to 1) */
  setPageSize: (pageSize: number) => void;
  /** Update filters (resets page to 1) */
  setFilters: (filters: SearchFiltersState) => void;
  /** Update sorting (resets page to 1) */
  setSort: (sortBy: SortField, sortOrder: SortOrder) => void;
  /** Calculate offset for API calls */
  offset: number;
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
      updateUrl((prev) => ({ ...prev, query, page: 1 })); // Reset page on query change
    },
    [updateUrl],
  );

  const setPage = useCallback(
    (page: number) => {
      updateUrl((prev) => ({ ...prev, page: Math.max(1, page) }));
    },
    [updateUrl],
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      updateUrl((prev) => ({ ...prev, pageSize, page: 1 })); // Reset page on page size change
    },
    [updateUrl],
  );

  const setFilters = useCallback(
    (filters: SearchFiltersState) => {
      updateUrl((prev) => ({ ...prev, filters, page: 1 })); // Reset page on filter change
    },
    [updateUrl],
  );

  const setSort = useCallback(
    (sortBy: SortField, sortOrder: SortOrder) => {
      updateUrl((prev) => ({ ...prev, sortBy, sortOrder, page: 1 })); // Reset page on sort change
    },
    [updateUrl],
  );

  const offset = useMemo(() => (state.page - 1) * state.pageSize, [state.page, state.pageSize]);

  return {
    query: state.query,
    page: state.page,
    filters: state.filters,
    pageSize: state.pageSize,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    setQuery,
    setPage,
    setPageSize,
    setFilters,
    setSort,
    offset,
  };
}
