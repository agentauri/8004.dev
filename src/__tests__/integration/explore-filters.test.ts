/**
 * Integration tests for explore page filter combinations
 * Tests API calls directly with mocked backend
 */

import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSearchAgents } from '@/hooks/use-search-agents';
import { toSearchParams } from '@/lib/filters/to-search-params';
import {
  createSmartBackendMock,
  createWrapper,
  formatValidationResult,
  generateEdgeCaseTests,
  generateSingleFilterTests,
  mockFetch,
  restoreFetch,
  setupFetchMock,
  validateResponseMatchesFilters,
  type FilterTestCase,
  type SmartBackendMock,
} from '@/test';

describe('Explore Page Filter Integration Tests', () => {
  let smartMock: SmartBackendMock;

  beforeEach(() => {
    setupFetchMock();
    smartMock = createSmartBackendMock();
    mockFetch.mockImplementation(smartMock.handler);
  });

  afterEach(() => {
    restoreFetch();
    vi.restoreAllMocks();
  });

  /**
   * Helper to run a filter test case
   */
  async function runFilterTest(testCase: FilterTestCase) {
    const params = toSearchParams({
      query: testCase.query,
      filters: {
        status: testCase.filters.status,
        protocols: testCase.filters.protocols,
        chains: testCase.filters.chains,
        filterMode: testCase.filters.filterMode,
        minReputation: testCase.filters.minReputation,
        maxReputation: testCase.filters.maxReputation,
        skills: testCase.filters.skills,
        domains: testCase.filters.domains,
        showAllAgents: testCase.filters.showAllAgents,
      },
      limit: 20,
    });

    // Add sorting to params
    if (testCase.sortBy !== 'relevance') {
      params.sort = testCase.sortBy;
    }
    if (testCase.sortOrder !== 'desc') {
      params.order = testCase.sortOrder;
    }

    const { result } = renderHook(() => useSearchAgents(params), {
      wrapper: createWrapper(),
    });

    // Wait for success
    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 5000 }
    );

    return result.current;
  }

  describe('Single Filter Tests', () => {
    const singleFilterTests = generateSingleFilterTests();

    it.each(singleFilterTests)('$name (id: $id)', async (testCase: FilterTestCase) => {
      const result = await runFilterTest(testCase);

      // Verify correct endpoint was used
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const [url, options] = lastCall;

      if (testCase.expectedEndpoint === 'POST') {
        expect(url).toBe('/api/search');
        expect(options?.method).toBe('POST');
      } else {
        expect(url).toContain('/api/agents');
        expect(options?.method ?? 'GET').toBe('GET');
      }

      // Verify response structure
      expect(result.data?.agents).toBeInstanceOf(Array);
      expect(typeof result.data?.total).toBe('number');

      // Validate that returned agents match filters
      if (result.data?.agents && result.data.agents.length > 0) {
        const validation = validateResponseMatchesFilters(result.data.agents, testCase);
        expect(validation.valid).toBe(true);
        if (!validation.valid) {
          console.error(formatValidationResult(validation));
        }
      }
    });
  });

  describe('Edge Case Tests', () => {
    const edgeCaseTests = generateEdgeCaseTests();

    it.each(edgeCaseTests)('$name (id: $id)', async (testCase: FilterTestCase) => {
      const result = await runFilterTest(testCase);

      // All edge cases should complete without error
      expect(result.isSuccess).toBe(true);
      expect(result.data?.agents).toBeInstanceOf(Array);
    });
  });

  describe('API Endpoint Selection', () => {
    it('uses GET /api/agents when no query text', async () => {
      const params = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: ['mcp'],
          chains: [],
          filterMode: 'AND',
          minReputation: 0,
          maxReputation: 100,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('/api/agents');
    });

    it('uses POST /api/search when query text is provided', async () => {
      const params = toSearchParams({
        query: 'trading agent',
        filters: {
          status: [],
          protocols: [],
          chains: [],
          filterMode: 'AND',
          minReputation: 0,
          maxReputation: 100,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe('/api/search');
      expect(options?.method).toBe('POST');
    });

    it('treats whitespace-only query as empty (uses GET)', async () => {
      const params = toSearchParams({
        query: '   ',
        filters: {
          status: [],
          protocols: [],
          chains: [],
          filterMode: 'AND',
          minReputation: 0,
          maxReputation: 100,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const [url] = mockFetch.mock.calls[0];
      expect(url).toContain('/api/agents');
    });
  });

  describe('Filter Mode Tests', () => {
    it('AND mode requires all protocol filters to match', async () => {
      const params = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: ['mcp', 'a2a'],
          chains: [],
          filterMode: 'AND',
          minReputation: 0,
          maxReputation: 100,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // All returned agents should have both MCP and A2A
      for (const agent of result.current.data?.agents ?? []) {
        expect(agent.hasMcp).toBe(true);
        expect(agent.hasA2a).toBe(true);
      }
    });

    it('OR mode requires at least one protocol filter to match', async () => {
      const params = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: ['mcp', 'x402'],
          chains: [],
          filterMode: 'OR',
          minReputation: 0,
          maxReputation: 100,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // All returned agents should have at least MCP or x402
      for (const agent of result.current.data?.agents ?? []) {
        const hasEither = agent.hasMcp || agent.x402Support;
        expect(hasEither).toBe(true);
      }
    });
  });

  describe('Reputation Filter Tests', () => {
    it('filters by minimum reputation', async () => {
      const params = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: [],
          chains: [],
          filterMode: 'AND',
          minReputation: 50,
          maxReputation: 100,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      for (const agent of result.current.data?.agents ?? []) {
        expect(agent.reputationScore ?? 0).toBeGreaterThanOrEqual(50);
      }
    });

    it('filters by maximum reputation', async () => {
      const params = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: [],
          chains: [],
          filterMode: 'AND',
          minReputation: 0,
          maxReputation: 50,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      for (const agent of result.current.data?.agents ?? []) {
        expect(agent.reputationScore ?? 100).toBeLessThanOrEqual(50);
      }
    });
  });

  describe('Chain Filter Tests', () => {
    it('filters by single chain', async () => {
      const params = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: [],
          chains: [11155111],
          filterMode: 'AND',
          minReputation: 0,
          maxReputation: 100,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      for (const agent of result.current.data?.agents ?? []) {
        expect(agent.chainId).toBe(11155111);
      }
    });

    it('filters by multiple chains', async () => {
      const params = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: [],
          chains: [11155111, 84532],
          filterMode: 'AND',
          minReputation: 0,
          maxReputation: 100,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      for (const agent of result.current.data?.agents ?? []) {
        expect([11155111, 84532]).toContain(agent.chainId);
      }
    });
  });
});
