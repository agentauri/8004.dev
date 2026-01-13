/**
 * Parse URL search params into filter state
 */

import type { ChainId } from '@/components/atoms';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS } from '@/components/atoms';
import type { CapabilityType, SortField, SortOrder } from '@/components/molecules';
import type { SearchFiltersState } from '@/components/organisms/search-filters';
import { SUPPORTED_CHAIN_IDS, VALID_SORT_FIELDS, VALID_SORT_ORDERS } from './constants';

export interface UrlSearchState {
  query: string;
  /** @deprecated Page-based pagination removed. Use cursor from API response. */
  page: number;
  pageSize: number;
  filters: SearchFiltersState;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export function parseUrlParams(searchParams: URLSearchParams): UrlSearchState {
  const query = searchParams.get('q') ?? '';
  // Page parameter is deprecated - cursor-based pagination is managed in React state
  // Always return 1 for backwards compatibility with existing code
  const page = 1;

  // Parse page size (limit) - validate against allowed options
  const limitParam = searchParams.get('limit');
  const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : DEFAULT_PAGE_SIZE;
  const pageSize = DEFAULT_PAGE_SIZE_OPTIONS.includes(parsedLimit as 10 | 20 | 50 | 100)
    ? parsedLimit
    : DEFAULT_PAGE_SIZE;

  // Parse status filter
  const status: string[] = [];
  const activeParam = searchParams.get('active');
  if (activeParam === 'true') {
    status.push('active');
  } else if (activeParam === 'false') {
    status.push('inactive');
  }

  // Parse protocol filters
  const protocols: CapabilityType[] = [];
  if (searchParams.get('mcp') === 'true') protocols.push('mcp');
  if (searchParams.get('a2a') === 'true') protocols.push('a2a');
  if (searchParams.get('x402') === 'true') protocols.push('x402');

  // Parse chain filters
  const chainsParam = searchParams.get('chains');
  const chains: ChainId[] = chainsParam
    ? chainsParam
        .split(',')
        .map((s) => Number.parseInt(s, 10))
        .filter((id): id is ChainId => SUPPORTED_CHAIN_IDS.includes(id as ChainId))
    : [];

  // Parse reputation range (use proper null checks to handle 0 correctly)
  const minRepParam = searchParams.get('minRep');
  const maxRepParam = searchParams.get('maxRep');
  const parsedMinRep = minRepParam !== null ? Number.parseInt(minRepParam, 10) : 0;
  const parsedMaxRep = maxRepParam !== null ? Number.parseInt(maxRepParam, 10) : 100;
  // Handle NaN from invalid input
  const minReputation = Number.isNaN(parsedMinRep) ? 0 : parsedMinRep;
  const maxReputation = Number.isNaN(parsedMaxRep) ? 100 : parsedMaxRep;

  // Parse filter mode
  const filterModeParam = searchParams.get('filterMode');
  const filterMode = filterModeParam === 'OR' ? 'OR' : 'AND';

  // Parse skills (comma-separated slugs)
  const skillsParam = searchParams.get('skills');
  const skills: string[] = skillsParam
    ? skillsParam.split(',').filter((s) => s.trim().length > 0)
    : [];

  // Parse domains (comma-separated slugs)
  const domainsParam = searchParams.get('domains');
  const domains: string[] = domainsParam
    ? domainsParam.split(',').filter((s) => s.trim().length > 0)
    : [];

  // Parse showAllAgents toggle
  const showAllAgents = searchParams.get('showAll') === 'true';

  // Parse sorting
  const sortByParam = searchParams.get('sort');
  const sortBy: SortField = VALID_SORT_FIELDS.includes(sortByParam as SortField)
    ? (sortByParam as SortField)
    : 'relevance';

  const sortOrderParam = searchParams.get('order');
  const sortOrder: SortOrder = VALID_SORT_ORDERS.includes(sortOrderParam as SortOrder)
    ? (sortOrderParam as SortOrder)
    : 'desc';

  // Clamp reputation values to valid range [0, 100]
  const clampedMin = Math.max(0, Math.min(100, minReputation));
  const clampedMax = Math.max(0, Math.min(100, maxReputation));

  // Ensure min <= max (swap if inverted)
  const finalMinRep = Math.min(clampedMin, clampedMax);
  const finalMaxRep = Math.max(clampedMin, clampedMax);

  // Gap 1: Parse trust score range (use proper null checks to handle 0 correctly)
  const minTrustParam = searchParams.get('minTrust');
  const maxTrustParam = searchParams.get('maxTrust');
  const minTrustScoreParam = minTrustParam !== null ? Number.parseInt(minTrustParam, 10) : 0;
  const maxTrustScoreParam = maxTrustParam !== null ? Number.parseInt(maxTrustParam, 10) : 100;
  // Handle NaN from invalid input
  const safeMinTrust = Number.isNaN(minTrustScoreParam) ? 0 : minTrustScoreParam;
  const safeMaxTrust = Number.isNaN(maxTrustScoreParam) ? 100 : maxTrustScoreParam;
  const clampedMinTrust = Math.max(0, Math.min(100, safeMinTrust));
  const clampedMaxTrust = Math.max(0, Math.min(100, safeMaxTrust));
  const minTrustScore = Math.min(clampedMinTrust, clampedMaxTrust);
  const maxTrustScore = Math.max(clampedMinTrust, clampedMaxTrust);

  // Gap 1: Parse version filters (removed from UI)

  // Gap 3: Parse curation filters
  const isCurated = searchParams.get('isCurated') === 'true';
  const curatedBy = searchParams.get('curatedBy') ?? '';

  // Gap 5: Parse endpoint filters
  const hasEmail = searchParams.get('hasEmail') === 'true';
  const hasOasfEndpoint = searchParams.get('hasOasfEndpoint') === 'true';

  // Gap 6: Parse reachability filters
  const hasRecentReachability = searchParams.get('hasRecentReachability') === 'true';

  return {
    query,
    page,
    pageSize,
    sortBy,
    sortOrder,
    filters: {
      status,
      protocols,
      chains,
      filterMode,
      minReputation: finalMinRep,
      maxReputation: finalMaxRep,
      skills,
      domains,
      showAllAgents,
      // Gap 1: Trust Score & Version Filters
      minTrustScore,
      maxTrustScore,
      // Gap 3: Curation Filters
      isCurated,
      curatedBy,
      // Gap 5: Endpoint Filters
      hasEmail,
      hasOasfEndpoint,
      // Gap 6: Reachability Filters
      hasRecentReachability,
    },
  };
}
