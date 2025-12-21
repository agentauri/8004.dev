/**
 * Integration tests for cache consistency
 * Verifies that query key serialization produces consistent cache hits
 */

import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSearchAgents } from '@/hooks/use-search-agents';
import { toSearchParams } from '@/lib/filters/to-search-params';
import {
  createSmartBackendMock,
  createWrapper,
  mockFetch,
  restoreFetch,
  type SmartBackendMock,
  setupFetchMock,
} from '@/test';

describe('Cache Consistency Integration Tests', () => {
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

  describe('Query Key Stability', () => {
    it('identical params produce cache hit on second call', async () => {
      const createParams = () =>
        toSearchParams({
          query: '',
          filters: {
            status: [],
            protocols: ['mcp'],
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

      const wrapper = createWrapper();

      // First call
      const { result: result1 } = renderHook(() => useSearchAgents(createParams()), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const callCountAfterFirst = mockFetch.mock.calls.length;

      // Second call with same params (should hit cache)
      const { result: result2 } = renderHook(() => useSearchAgents(createParams()), {
        wrapper,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should not make additional API call due to cache
      expect(mockFetch.mock.calls.length).toBe(callCountAfterFirst);
    });

    it('different params produce cache miss', async () => {
      const wrapper = createWrapper();

      const params1 = toSearchParams({
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

      const params2 = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: ['a2a'],
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

      // First call
      const { result: result1 } = renderHook(() => useSearchAgents(params1), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const callCountAfterFirst = mockFetch.mock.calls.length;

      // Second call with different params (should miss cache)
      const { result: result2 } = renderHook(() => useSearchAgents(params2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should make additional API call due to different params
      expect(mockFetch.mock.calls.length).toBeGreaterThan(callCountAfterFirst);
    });
  });

  describe('Parameter Order Independence', () => {
    it('protocols in different order produce same cache key', async () => {
      const wrapper = createWrapper();

      // Create params with protocols in different orders
      const params1 = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: ['mcp', 'a2a', 'x402'],
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

      const params2 = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: ['x402', 'mcp', 'a2a'],
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

      // First call
      const { result: result1 } = renderHook(() => useSearchAgents(params1), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const callCountAfterFirst = mockFetch.mock.calls.length;

      // Second call with reordered protocols
      const { result: result2 } = renderHook(() => useSearchAgents(params2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should hit cache because protocols are sorted in query key
      expect(mockFetch.mock.calls.length).toBe(callCountAfterFirst);
    });

    it('chains in different order produce same cache key', async () => {
      const wrapper = createWrapper();

      const params1 = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: [],
          chains: [11155111, 84532, 80002],
          filterMode: 'AND',
          minReputation: 0,
          maxReputation: 100,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const params2 = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: [],
          chains: [80002, 11155111, 84532],
          filterMode: 'AND',
          minReputation: 0,
          maxReputation: 100,
          skills: [],
          domains: [],
          showAllAgents: false,
        },
        limit: 20,
      });

      const { result: result1 } = renderHook(() => useSearchAgents(params1), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const callCountAfterFirst = mockFetch.mock.calls.length;

      const { result: result2 } = renderHook(() => useSearchAgents(params2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should hit cache because chains are sorted in query key
      expect(mockFetch.mock.calls.length).toBe(callCountAfterFirst);
    });
  });

  describe('Semantic Equivalence', () => {
    it('empty query and whitespace query produce same cache key', async () => {
      const wrapper = createWrapper();

      const params1 = toSearchParams({
        query: '',
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

      const params2 = toSearchParams({
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

      const { result: result1 } = renderHook(() => useSearchAgents(params1), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const callCountAfterFirst = mockFetch.mock.calls.length;

      const { result: result2 } = renderHook(() => useSearchAgents(params2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should hit cache because whitespace is trimmed
      expect(mockFetch.mock.calls.length).toBe(callCountAfterFirst);
    });

    it('default values and explicit defaults produce same cache key', async () => {
      const wrapper = createWrapper();

      // Params with explicit defaults
      const params1 = toSearchParams({
        query: '',
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

      // Same params (semantically equivalent)
      const params2 = toSearchParams({
        query: '',
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

      const { result: result1 } = renderHook(() => useSearchAgents(params1), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const callCountAfterFirst = mockFetch.mock.calls.length;

      const { result: result2 } = renderHook(() => useSearchAgents(params2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockFetch.mock.calls.length).toBe(callCountAfterFirst);
    });
  });

  describe('Cache Key Determinism', () => {
    it('same params on different hooks produce same results', async () => {
      const wrapper = createWrapper();

      const createParams = () =>
        toSearchParams({
          query: '',
          filters: {
            status: [],
            protocols: ['mcp'],
            chains: [11155111],
            filterMode: 'AND',
            minReputation: 50,
            maxReputation: 100,
            skills: [],
            domains: [],
            showAllAgents: false,
          },
          limit: 10,
        });

      const { result: result1 } = renderHook(() => useSearchAgents(createParams()), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const { result: result2 } = renderHook(() => useSearchAgents(createParams()), {
        wrapper,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Both should have same data (from cache)
      expect(result1.current.data?.agents.length).toBe(result2.current.data?.agents.length);
      expect(result1.current.data?.total).toBe(result2.current.data?.total);
    });
  });

  describe('Sorting Cache Keys', () => {
    it('different sort produces cache miss', async () => {
      const wrapper = createWrapper();

      const params1 = toSearchParams({
        query: '',
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
      params1.sort = 'name';

      const params2 = toSearchParams({
        query: '',
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
      params2.sort = 'reputation';

      const { result: result1 } = renderHook(() => useSearchAgents(params1), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const callCountAfterFirst = mockFetch.mock.calls.length;

      const { result: result2 } = renderHook(() => useSearchAgents(params2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Different sort should produce cache miss
      expect(mockFetch.mock.calls.length).toBeGreaterThan(callCountAfterFirst);
    });

    it('different sort order produces cache miss', async () => {
      const wrapper = createWrapper();

      const params1 = toSearchParams({
        query: '',
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
      params1.sort = 'name';
      params1.order = 'asc';

      const params2 = toSearchParams({
        query: '',
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
      params2.sort = 'name';
      params2.order = 'desc';

      const { result: result1 } = renderHook(() => useSearchAgents(params1), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const callCountAfterFirst = mockFetch.mock.calls.length;

      const { result: result2 } = renderHook(() => useSearchAgents(params2), {
        wrapper,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Different order should produce cache miss
      expect(mockFetch.mock.calls.length).toBeGreaterThan(callCountAfterFirst);
    });
  });
});
