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
  page: number;
  pageSize: number;
  filters: SearchFiltersState;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export function parseUrlParams(searchParams: URLSearchParams): UrlSearchState {
  const query = searchParams.get('q') ?? '';
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);

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

  // Parse reputation range
  const minReputation = Number.parseInt(searchParams.get('minRep') ?? '0', 10) || 0;
  const maxReputation = Number.parseInt(searchParams.get('maxRep') ?? '100', 10) || 100;

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
      minReputation: Math.max(0, Math.min(100, minReputation)),
      maxReputation: Math.max(0, Math.min(100, maxReputation)),
      skills,
      domains,
      showAllAgents,
    },
  };
}
