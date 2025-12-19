'use client';

import { Suspense, useMemo, useState } from 'react';
import type { ChainId } from '@/components/atoms';
import type { CapabilityType, SortField, SortOrder } from '@/components/molecules';
import type { AgentCardAgent } from '@/components/organisms/agent-card';
import type { SearchFiltersState } from '@/components/organisms/search-filters';
import { ExploreTemplate } from '@/components/templates';
import { useSearchAgents, useUrlSearchParams } from '@/hooks';
import { sortAgents } from '@/lib/sorting';
import type { AgentSummary } from '@/types/agent';
import type { SearchParams } from '@/types/search';

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

/**
 * Convert SearchFiltersState to SearchParams for the provider
 *
 * Default behavior: Show only active agents with registration file
 * When showAllAgents is true: Show all agents including inactive and without metadata
 *
 * Note: Sorting is handled client-side, not sent to API.
 * This improves caching - the same data can be sorted multiple ways without refetching.
 */
function toSearchParams(
  query: string,
  filters: SearchFiltersState,
  limit: number,
  offset: number,
): SearchParams {
  const params: SearchParams = {};

  if (query.trim()) {
    params.q = query.trim();
  }

  // Handle showAllAgents toggle vs default filtering
  if (filters.showAllAgents) {
    // Show all agents: pass hasRegistrationFile=false to include agents without metadata
    params.hasRegistrationFile = false;
    // Don't apply default active filter, but still respect explicit status selection
    if (filters.status.length === 1) {
      params.active = filters.status[0] === 'active';
    }
  } else {
    // Default: only active agents with registration file
    // Backend returns agents with registration file by default, so we only need active=true
    if (filters.status.length === 0) {
      // No explicit status filter, apply default: only active agents
      params.active = true;
    } else if (filters.status.length === 1) {
      params.active = filters.status[0] === 'active';
    }
    // Don't set hasRegistrationFile - backend defaults to true
  }

  // Handle protocol filters
  if (filters.protocols.includes('mcp')) {
    params.mcp = true;
  }
  if (filters.protocols.includes('a2a')) {
    params.a2a = true;
  }
  if (filters.protocols.includes('x402')) {
    params.x402 = true;
  }

  // Handle chain filters
  if (filters.chains.length > 0) {
    params.chains = filters.chains;
  }

  // Handle reputation filter
  if (filters.minReputation > 0) {
    params.minRep = filters.minReputation;
  }
  if (filters.maxReputation < 100) {
    params.maxRep = filters.maxReputation;
  }

  // Handle skills filter
  if (filters.skills.length > 0) {
    params.skills = filters.skills;
  }

  // Handle domains filter
  if (filters.domains.length > 0) {
    params.domains = filters.domains;
  }

  // Handle filterMode (only send OR, since AND is the default)
  if (filters.filterMode === 'OR') {
    params.filterMode = 'OR';
  }

  // Pagination
  params.limit = limit;
  if (offset > 0) {
    // Backend expects cursor in format: {"_global_offset": N}
    params.cursor = JSON.stringify({ _global_offset: offset });
  }

  // Note: Sorting is NOT sent to API - it's handled client-side
  // This improves cache efficiency as the same data serves all sort options

  return params;
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

function ExplorePageContent() {
  // URL-driven state for filters and pagination
  const {
    query: urlQuery,
    page,
    filters: urlFilters,
    pageSize,
    sortBy,
    sortOrder,
    setQuery: setUrlQuery,
    setPage,
    setPageSize,
    setFilters: setUrlFilters,
    setSort,
    offset,
  } = useUrlSearchParams();

  // Local state for search input (before submission)
  const [inputQuery, setInputQuery] = useState(urlQuery);

  // Build search params from current state (sorting handled client-side)
  const searchParamsObj = useMemo(
    () => toSearchParams(urlQuery, urlFilters, pageSize, offset),
    [urlQuery, urlFilters, pageSize, offset],
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

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!data?.total) return 1;
    return Math.ceil(data.total / pageSize);
  }, [data?.total, pageSize]);

  const handleSearch = (searchQuery: string) => {
    setUrlQuery(searchQuery); // This also resets page to 1
  };

  const handleFiltersChange = (newFilters: SearchFiltersState) => {
    setUrlFilters(newFilters); // This also resets page to 1
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
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
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
