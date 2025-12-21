'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import type { ChainId } from '@/components/atoms';
import type { CapabilityType } from '@/components/molecules';
import type { AgentCardAgent } from '@/components/organisms/agent-card';
import type { SearchFiltersState } from '@/components/organisms/search-filters';
import { ExploreTemplate } from '@/components/templates';
import { useSearchAgents, useUrlSearchParams } from '@/hooks';
import { toSearchParams } from '@/lib/filters';
import { sortAgents } from '@/lib/sorting';
import type { AgentSummary } from '@/types/agent';

/**
 * Convert AgentSummary to AgentCardAgent for display
 */
function toAgentCardAgent(agent: AgentSummary): AgentCardAgent {
  const capabilities: CapabilityType[] = [];
  if (agent.hasMcp) capabilities.push('mcp');
  if (agent.hasA2a) capabilities.push('a2a');
  if (agent.x402support) capabilities.push('x402');

  return {
    id: agent.id,
    name: agent.name,
    description: agent.description,
    image: agent.image,
    chainId: agent.chainId as ChainId,
    isActive: agent.active,
    trustScore: agent.reputationScore,
    capabilities,
    // Search metadata
    relevanceScore: agent.relevanceScore,
    matchReasons: agent.matchReasons,
    // OASF classification
    oasfSkills: agent.oasf?.skills,
    oasfDomains: agent.oasf?.domains,
    oasfSource: agent.oasfSource,
    // Wallet and trust
    walletAddress: agent.walletAddress,
    supportedTrust: agent.supportedTrust,
  };
}

const DEFAULT_FILTERS: SearchFiltersState = {
  status: [],
  protocols: [],
  chains: [],
  filterMode: 'AND',
  minReputation: 0,
  maxReputation: 100,
  skills: [],
  domains: [],
  showAllAgents: false,
};

/**
 * Cursor pagination state
 */
interface CursorState {
  /** Current page number (1-indexed, for display) */
  pageNumber: number;
  /** Current cursor for API request (undefined for first page) */
  currentCursor?: string;
  /** History of cursors for back navigation (index 0 = page 1's cursor = undefined) */
  cursorHistory: (string | undefined)[];
}

const INITIAL_CURSOR_STATE: CursorState = {
  pageNumber: 1,
  currentCursor: undefined,
  cursorHistory: [undefined], // First page has no cursor
};

function ExplorePageContent() {
  // URL-driven state for filters (pagination is managed locally with cursors)
  const {
    query: urlQuery,
    filters: urlFilters,
    pageSize,
    sortBy,
    sortOrder,
    setQuery: setUrlQuery,
    setPageSize,
    setFilters: setUrlFilters,
    setSort,
    resetSignal,
  } = useUrlSearchParams();

  // Local state for search input (before submission)
  const [inputQuery, setInputQuery] = useState(urlQuery);

  // Cursor-based pagination state
  const [cursorState, setCursorState] = useState<CursorState>(INITIAL_CURSOR_STATE);

  // Reset cursor state when URL params change (query, filters, sort, pageSize)
  // biome-ignore lint/correctness/useExhaustiveDependencies: resetSignal is an intentional change trigger
  useEffect(() => {
    setCursorState(INITIAL_CURSOR_STATE);
  }, [resetSignal]);

  // Build search params from current state (using cursor-based pagination)
  const searchParamsObj = useMemo(
    () =>
      toSearchParams({
        query: urlQuery,
        filters: urlFilters,
        limit: pageSize,
        cursor: cursorState.currentCursor,
      }),
    [urlQuery, urlFilters, pageSize, cursorState.currentCursor],
  );

  // Use TanStack Query hook for data fetching
  const { data, isLoading, error, isRefreshing, lastUpdated, manualRefresh } =
    useSearchAgents(searchParamsObj);

  // Transform and sort agents for display (client-side sorting)
  const agents = useMemo(() => {
    if (!data?.agents) return [];
    const sorted = sortAgents(data.agents, sortBy, sortOrder);
    return sorted.map(toAgentCardAgent);
  }, [data?.agents, sortBy, sortOrder]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!data?.hasMore || !data?.nextCursor) return;

    setCursorState((prev) => ({
      pageNumber: prev.pageNumber + 1,
      currentCursor: data.nextCursor,
      cursorHistory: [...prev.cursorHistory, data.nextCursor],
    }));
  }, [data?.hasMore, data?.nextCursor]);

  const handlePrevious = useCallback(() => {
    setCursorState((prev) => {
      if (prev.pageNumber <= 1) return prev;

      const newPageNumber = prev.pageNumber - 1;
      // Get cursor from history (index is pageNumber - 1)
      const previousCursor = prev.cursorHistory[newPageNumber - 1];

      return {
        pageNumber: newPageNumber,
        currentCursor: previousCursor,
        // Keep history but slice to current position + 1
        cursorHistory: prev.cursorHistory.slice(0, newPageNumber),
      };
    });
  }, []);

  const handleSearch = (searchQuery: string) => {
    setUrlQuery(searchQuery); // This triggers resetSignal change, which resets cursor
  };

  const handleFiltersChange = (newFilters: SearchFiltersState) => {
    setUrlFilters(newFilters); // This triggers resetSignal change, which resets cursor
  };

  // Keep input in sync with URL query
  const handleQueryChange = (newQuery: string) => {
    setInputQuery(newQuery);
  };

  return (
    <ExploreTemplate
      query={inputQuery}
      onQueryChange={handleQueryChange}
      onSearch={handleSearch}
      filters={urlFilters}
      onFiltersChange={handleFiltersChange}
      agents={agents}
      totalCount={data?.total ?? 0}
      isLoading={isLoading}
      error={error?.message}
      // Cursor-based pagination props
      pageNumber={cursorState.pageNumber}
      hasMore={data?.hasMore ?? false}
      onNext={handleNext}
      onPrevious={handlePrevious}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={setSort}
      isRefreshing={isRefreshing}
      lastUpdated={lastUpdated}
      onManualRefresh={manualRefresh}
    />
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <ExploreTemplate
          query=""
          onQueryChange={() => {}}
          onSearch={() => {}}
          filters={DEFAULT_FILTERS}
          onFiltersChange={() => {}}
          agents={[]}
          totalCount={0}
          isLoading={true}
          error={undefined}
        />
      }
    >
      <ExplorePageContent />
    </Suspense>
  );
}
