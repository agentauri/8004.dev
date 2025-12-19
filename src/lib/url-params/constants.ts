/**
 * URL params constants
 */

import type { ChainId } from '@/components/atoms';
import type { SortField, SortOrder } from '@/components/molecules';
import type { SearchFiltersState } from '@/components/organisms/search-filters';

export const SUPPORTED_CHAIN_IDS: ChainId[] = [11155111, 84532, 80002];
export const VALID_SORT_FIELDS: SortField[] = ['relevance', 'name', 'createdAt', 'reputation'];
export const VALID_SORT_ORDERS: SortOrder[] = ['asc', 'desc'];

export const DEFAULT_FILTERS: SearchFiltersState = {
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
