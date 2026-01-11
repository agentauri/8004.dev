/**
 * Shared test case definitions for filter testing
 * Used by both Vitest integration tests and Playwright E2E tests
 */

import type { ChainId } from '@/components/atoms';
import type { CapabilityType } from '@/components/molecules/capability-tag';
import type { FilterMode } from '@/components/molecules/filter-mode-toggle';
import type { Erc8004Version, SearchSortField, SearchSortOrder } from '@/types/search';

/**
 * Simplified filter state for test cases
 */
export interface TestFiltersState {
  status: string[];
  protocols: CapabilityType[];
  chains: ChainId[];
  filterMode: FilterMode;
  minReputation: number;
  maxReputation: number;
  skills: string[];
  domains: string[];
  showAllAgents: boolean;
  // Gap 1: Trust Score & Version Filters
  minTrustScore: number;
  maxTrustScore: number;
  erc8004Version: Erc8004Version | '';
  mcpVersion: string;
  a2aVersion: string;
  // Gap 3: Curation Filters
  isCurated: boolean;
  curatedBy: string;
  // Gap 5: Endpoint Filters
  hasEmail: boolean;
  hasOasfEndpoint: boolean;
  // Gap 6: Reachability Filters
  hasRecentReachability: boolean;
}

/**
 * Test case definition shared between Vitest and Playwright
 */
export interface FilterTestCase {
  id: string;
  name: string;
  query: string;
  filters: TestFiltersState;
  sortBy: SearchSortField;
  sortOrder: SearchSortOrder;
  expectedEndpoint: 'GET' | 'POST';
  category: 'single-filter' | 'combination' | 'edge-case' | 'sorting';
}

/**
 * Default empty filter state
 */
export function createDefaultFilters(): TestFiltersState {
  return {
    status: [],
    protocols: [],
    chains: [],
    filterMode: 'AND',
    minReputation: 0,
    maxReputation: 100,
    skills: [],
    domains: [],
    showAllAgents: false,
    // Gap 1: Trust Score & Version Filters
    minTrustScore: 0,
    maxTrustScore: 100,
    erc8004Version: '',
    mcpVersion: '',
    a2aVersion: '',
    // Gap 3: Curation Filters
    isCurated: false,
    curatedBy: '',
    // Gap 5: Endpoint Filters
    hasEmail: false,
    hasOasfEndpoint: false,
    // Gap 6: Reachability Filters
    hasRecentReachability: false,
  };
}

/**
 * All protocol subsets (power set excluding 'custom')
 */
export const PROTOCOL_SUBSETS: CapabilityType[][] = [
  [],
  ['mcp'],
  ['a2a'],
  ['x402'],
  ['mcp', 'a2a'],
  ['mcp', 'x402'],
  ['a2a', 'x402'],
  ['mcp', 'a2a', 'x402'],
];

/**
 * Chain subsets (power set of supported chains)
 */
export const CHAIN_SUBSETS: ChainId[][] = [
  [],
  [11155111],
  [84532],
  [80002],
  [11155111, 84532],
  [11155111, 80002],
  [84532, 80002],
  [11155111, 84532, 80002],
];

/**
 * Status filter options
 */
export const STATUS_OPTIONS: string[][] = [[], ['active'], ['inactive'], ['active', 'inactive']];

/**
 * Generate single-filter test cases - each filter in isolation
 */
export function generateSingleFilterTests(): FilterTestCase[] {
  const cases: FilterTestCase[] = [];
  const baseFilters = createDefaultFilters();

  // Protocol filters
  for (const protocol of ['mcp', 'a2a', 'x402'] as const) {
    cases.push({
      id: `single-protocol-${protocol}`,
      name: `Single ${protocol.toUpperCase()} filter`,
      query: '',
      filters: { ...baseFilters, protocols: [protocol] },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'single-filter',
    });
  }

  // Chain filters
  const chainIds: ChainId[] = [11155111, 84532, 80002];
  for (const chainId of chainIds) {
    const chainNames: Record<ChainId, string> = {
      11155111: 'Sepolia',
      84532: 'Base',
      80002: 'Polygon',
    };
    cases.push({
      id: `single-chain-${chainId}`,
      name: `Single chain ${chainNames[chainId]} filter`,
      query: '',
      filters: { ...baseFilters, chains: [chainId] },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'single-filter',
    });
  }

  // Status filters
  cases.push(
    {
      id: 'single-status-active',
      name: 'Active agents only',
      query: '',
      filters: { ...baseFilters, status: ['active'] },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'single-filter',
    },
    {
      id: 'single-status-inactive',
      name: 'Inactive agents only',
      query: '',
      filters: { ...baseFilters, status: ['inactive'] },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'single-filter',
    },
  );

  // Query-based searches (uses POST)
  cases.push(
    {
      id: 'single-query-trading',
      name: 'Search query "trading"',
      query: 'trading',
      filters: baseFilters,
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'POST',
      category: 'single-filter',
    },
    {
      id: 'single-query-agent',
      name: 'Search query "agent"',
      query: 'agent',
      filters: baseFilters,
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'POST',
      category: 'single-filter',
    },
  );

  // Reputation filters
  cases.push(
    {
      id: 'single-rep-min-50',
      name: 'Minimum reputation 50',
      query: '',
      filters: { ...baseFilters, minReputation: 50, maxReputation: 100 },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'single-filter',
    },
    {
      id: 'single-rep-max-50',
      name: 'Maximum reputation 50',
      query: '',
      filters: { ...baseFilters, minReputation: 0, maxReputation: 50 },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'single-filter',
    },
  );

  // showAllAgents
  cases.push({
    id: 'single-show-all',
    name: 'Show all agents toggle',
    query: '',
    filters: { ...baseFilters, showAllAgents: true },
    sortBy: 'relevance',
    sortOrder: 'desc',
    expectedEndpoint: 'GET',
    category: 'single-filter',
  });

  return cases;
}

/**
 * Generate edge case test definitions
 */
export function generateEdgeCaseTests(): FilterTestCase[] {
  const baseFilters = createDefaultFilters();

  return [
    // Empty states
    {
      id: 'edge-no-filters',
      name: 'No filters (defaults only)',
      query: '',
      filters: baseFilters,
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'edge-case',
    },
    // All filters enabled
    {
      id: 'edge-all-filters',
      name: 'All filters enabled',
      query: 'agent',
      filters: {
        ...baseFilters,
        status: ['active'],
        protocols: ['mcp', 'a2a', 'x402'],
        chains: [11155111, 84532, 80002],
        filterMode: 'AND',
        minReputation: 25,
        maxReputation: 75,
      },
      sortBy: 'reputation',
      sortOrder: 'desc',
      expectedEndpoint: 'POST',
      category: 'edge-case',
    },
    // showAllAgents override
    {
      id: 'edge-show-all-with-status',
      name: 'Show all agents with status filter',
      query: '',
      filters: { ...baseFilters, showAllAgents: true, status: ['inactive'] },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'edge-case',
    },
    // Special characters in query
    {
      id: 'edge-special-chars',
      name: 'Special characters in query',
      query: "test <script>alert('xss')</script>",
      filters: baseFilters,
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'POST',
      category: 'edge-case',
    },
    // Unicode in query
    {
      id: 'edge-unicode',
      name: 'Unicode characters in query',
      query: 'agent 交易代理',
      filters: baseFilters,
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'POST',
      category: 'edge-case',
    },
    // OR filter mode
    {
      id: 'edge-or-mode',
      name: 'OR filter mode with multiple protocols',
      query: '',
      filters: { ...baseFilters, protocols: ['mcp', 'a2a'], filterMode: 'OR' },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'edge-case',
    },
    // Reputation range equals
    {
      id: 'edge-rep-equal',
      name: 'Reputation min equals max',
      query: '',
      filters: { ...baseFilters, minReputation: 50, maxReputation: 50 },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'edge-case',
    },
    // Empty query string
    {
      id: 'edge-empty-query',
      name: 'Empty query with whitespace',
      query: '   ',
      filters: baseFilters,
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET', // Whitespace-only queries should use GET
      category: 'edge-case',
    },
    // Long query
    {
      id: 'edge-long-query',
      name: 'Very long query string',
      query: 'a'.repeat(500),
      filters: baseFilters,
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'POST',
      category: 'edge-case',
    },
    // All chains selected
    {
      id: 'edge-all-chains',
      name: 'All chains selected',
      query: '',
      filters: { ...baseFilters, chains: [11155111, 84532, 80002] },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'edge-case',
    },
    // Query with all protocols in OR mode
    {
      id: 'edge-query-or-protocols',
      name: 'Query with all protocols in OR mode',
      query: 'trading',
      filters: { ...baseFilters, protocols: ['mcp', 'a2a', 'x402'], filterMode: 'OR' },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'POST',
      category: 'edge-case',
    },
    // Mixed status
    {
      id: 'edge-both-status',
      name: 'Both active and inactive status',
      query: '',
      filters: { ...baseFilters, status: ['active', 'inactive'] },
      sortBy: 'relevance',
      sortOrder: 'desc',
      expectedEndpoint: 'GET',
      category: 'edge-case',
    },
  ];
}

/**
 * Generate sorting test cases
 */
export function generateSortingTests(): FilterTestCase[] {
  const baseFilters = createDefaultFilters();
  const sortFields: SearchSortField[] = ['relevance', 'name', 'reputation', 'createdAt'];
  const sortOrders: SearchSortOrder[] = ['asc', 'desc'];
  const cases: FilterTestCase[] = [];

  for (const field of sortFields) {
    for (const order of sortOrders) {
      cases.push({
        id: `sort-${field}-${order}`,
        name: `Sort by ${field} ${order}`,
        query: '',
        filters: baseFilters,
        sortBy: field,
        sortOrder: order,
        expectedEndpoint: 'GET',
        category: 'sorting',
      });
    }
  }

  return cases;
}
