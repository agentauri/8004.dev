'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChainId } from '@/components/atoms';
import type { CapabilityType } from '@/components/molecules';
import type { AgentCardAgent } from '@/components/organisms/agent-card';
import type { SearchFiltersState } from '@/components/organisms/search-filters';
import { ExploreTemplate } from '@/components/templates';
import { useSearchAgents, useStreamingSearch, useUrlSearchParams } from '@/hooks';
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

  // Track if we have an active text query (for streaming vs regular search decision)
  const hasTextQuery = useMemo(() => !!urlQuery.trim(), [urlQuery]);

  // Cursor-based pagination state (only used for regular search)
  const [cursorState, setCursorState] = useState<CursorState>(INITIAL_CURSOR_STATE);

  // Track previous query for change detection
  const prevQueryRef = useRef(urlQuery);

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

  // Streaming search hook - enabled when there's a text query
  const streaming = useStreamingSearch(searchParamsObj, {
    enabled: hasTextQuery,
    onComplete: () => {
      // Stream completed - results are now in streaming.results
    },
  });

  // Regular search hook - enabled when there's NO text query (filter-only browsing)
  const regular = useSearchAgents(searchParamsObj, {
    enabled: !hasTextQuery,
  });

  // Auto-start streaming when query changes
  useEffect(() => {
    if (hasTextQuery && prevQueryRef.current !== urlQuery) {
      // Query changed, start new stream
      streaming.startStream();
    }
    prevQueryRef.current = urlQuery;
  }, [urlQuery, hasTextQuery, streaming.startStream]);

  // Also start stream when filters change while we have a query
  // biome-ignore lint/correctness/useExhaustiveDependencies: resetSignal is an intentional change trigger
  useEffect(() => {
    if (hasTextQuery && streaming.streamState === 'idle') {
      streaming.startStream();
    }
  }, [resetSignal]);

  // Determine the error to display
  const displayError = useMemo(() => {
    if (hasTextQuery) {
      // For streaming, only show error if it's not an "empty query" error
      // (which would happen before user types anything)
      if (streaming.error && streaming.error.code !== 'EMPTY_QUERY') {
        return streaming.error.message;
      }
      return undefined;
    }
    return regular.error?.message;
  }, [hasTextQuery, streaming.error, regular.error]);

  // Transform and sort agents for display (client-side sorting)
  const agents = useMemo(() => {
    // Choose data source based on search mode
    const sourceAgents = hasTextQuery ? streaming.results : regular.data?.agents;

    if (!sourceAgents || sourceAgents.length === 0) return [];

    const sorted = sortAgents(sourceAgents, sortBy, sortOrder);
    return sorted.map(toAgentCardAgent);
  }, [hasTextQuery, streaming.results, regular.data?.agents, sortBy, sortOrder]);

  // Determine loading state
  const isLoading = useMemo(() => {
    if (hasTextQuery) {
      // For streaming, we're "loading" only during initial connection
      return streaming.streamState === 'connecting';
    }
    return regular.isLoading;
  }, [hasTextQuery, streaming.streamState, regular.isLoading]);

  // Total count for display
  const totalCount = useMemo(() => {
    if (hasTextQuery) {
      return streaming.expectedTotal ?? streaming.resultCount;
    }
    return regular.data?.total ?? 0;
  }, [hasTextQuery, streaming.expectedTotal, streaming.resultCount, regular.data?.total]);

  // Navigation handlers (only used for regular search)
  const handleNext = useCallback(() => {
    if (!regular.data?.hasMore || !regular.data?.nextCursor) return;

    setCursorState((prev) => ({
      pageNumber: prev.pageNumber + 1,
      currentCursor: regular.data.nextCursor,
      cursorHistory: [...prev.cursorHistory, regular.data.nextCursor],
    }));
  }, [regular.data?.hasMore, regular.data?.nextCursor]);

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

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setUrlQuery(searchQuery); // This triggers resetSignal change, which resets cursor

      // Clear streaming results if query is cleared
      if (!searchQuery.trim()) {
        streaming.clearResults();
      }
    },
    [setUrlQuery, streaming.clearResults],
  );

  const handleFiltersChange = (newFilters: SearchFiltersState) => {
    setUrlFilters(newFilters); // This triggers resetSignal change, which resets cursor
  };

  // Keep input in sync with URL query
  const handleQueryChange = (newQuery: string) => {
    setInputQuery(newQuery);
  };

  // Handle retry for streaming errors
  const handleRetry = useCallback(() => {
    if (hasTextQuery) {
      streaming.startStream();
    } else {
      regular.manualRefresh?.();
    }
  }, [hasTextQuery, streaming.startStream, regular.manualRefresh]);

  return (
    <ExploreTemplate
      query={inputQuery}
      onQueryChange={handleQueryChange}
      onSearch={handleSearch}
      filters={urlFilters}
      onFiltersChange={handleFiltersChange}
      agents={agents}
      totalCount={totalCount}
      isLoading={isLoading}
      error={displayError}
      // Cursor-based pagination props (only for regular search)
      pageNumber={hasTextQuery ? undefined : cursorState.pageNumber}
      hasMore={hasTextQuery ? false : (regular.data?.hasMore ?? false)}
      onNext={hasTextQuery ? undefined : handleNext}
      onPrevious={hasTextQuery ? undefined : handlePrevious}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSortChange={setSort}
      isRefreshing={hasTextQuery ? false : regular.isRefreshing}
      lastUpdated={hasTextQuery ? undefined : regular.lastUpdated}
      onManualRefresh={handleRetry}
      // Streaming props
      isStreaming={hasTextQuery ? streaming.isStreaming : false}
      streamProgress={
        hasTextQuery
          ? {
              current: streaming.resultCount,
              expected: streaming.expectedTotal,
            }
          : undefined
      }
      hydeQuery={hasTextQuery ? streaming.hydeQuery : null}
      onStopStream={hasTextQuery ? streaming.stopStream : undefined}
      // Compose team button (shown when we have results)
      showComposeButton={agents.length > 0}
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
