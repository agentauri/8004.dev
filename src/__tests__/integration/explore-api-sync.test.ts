/**
 * Integration tests for API → Frontend synchronization
 * Verifies that URL parameters correctly translate to API calls
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
  setupFetchMock,
  type SmartBackendMock,
} from '@/test';

describe('API → Frontend Sync Integration Tests', () => {
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

  describe('URL Parameter to API Call Mapping', () => {
    it('maps protocols array to individual boolean params', async () => {
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

      const [url] = mockFetch.mock.calls[0];
      const urlObj = new URL(url, 'http://localhost');

      // Verify protocols are sent as individual boolean params
      expect(urlObj.searchParams.get('mcp')).toBe('true');
      expect(urlObj.searchParams.get('a2a')).toBe('true');
    });

    it('maps status filter to active param', async () => {
      const params = toSearchParams({
        query: '',
        filters: {
          status: ['active'],
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
      const urlObj = new URL(url, 'http://localhost');

      expect(urlObj.searchParams.get('active')).toBe('true');
    });

    it('maps chains array to comma-separated string', async () => {
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

      const [url] = mockFetch.mock.calls[0];
      const urlObj = new URL(url, 'http://localhost');

      const chains = urlObj.searchParams.get('chains');
      expect(chains).toBeTruthy();
      expect(chains?.split(',').map(Number)).toEqual(expect.arrayContaining([11155111, 84532]));
    });

    it('maps reputation range to minRep/maxRep params', async () => {
      const params = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: [],
          chains: [],
          filterMode: 'AND',
          minReputation: 25,
          maxReputation: 75,
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
      const urlObj = new URL(url, 'http://localhost');

      expect(urlObj.searchParams.get('minRep')).toBe('25');
      expect(urlObj.searchParams.get('maxRep')).toBe('75');
    });

    it('maps filterMode to filterMode param', async () => {
      const params = toSearchParams({
        query: '',
        filters: {
          status: [],
          protocols: ['mcp', 'a2a'],
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

      const [url] = mockFetch.mock.calls[0];
      const urlObj = new URL(url, 'http://localhost');

      expect(urlObj.searchParams.get('filterMode')).toBe('OR');
    });
  });

  describe('Query to POST Body Mapping', () => {
    it('sends query in POST body when text is present', async () => {
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

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options?.body as string);

      expect(body.query).toBe('trading agent');
    });

    it('sends filters in POST body nested under filters key', async () => {
      const params = toSearchParams({
        query: 'test query',
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

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const [, options] = mockFetch.mock.calls[0];
      const body = JSON.parse(options?.body as string);

      expect(body.filters).toBeDefined();
      expect(body.filters.mcp).toBe(true);
      expect(body.filters.chainIds).toEqual([11155111]);
    });
  });

  describe('Response Structure', () => {
    it('returns agents array from response data', async () => {
      const params = toSearchParams({
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

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.agents).toBeInstanceOf(Array);
      expect(typeof result.current.data?.total).toBe('number');
    });

    it('includes all required agent fields in response', async () => {
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
        limit: 5,
      });

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const agents = result.current.data?.agents ?? [];
      expect(agents.length).toBeGreaterThan(0);

      const agent = agents[0];
      expect(agent).toHaveProperty('id');
      expect(agent).toHaveProperty('chainId');
      expect(agent).toHaveProperty('name');
      expect(agent).toHaveProperty('hasMcp');
      expect(agent).toHaveProperty('hasA2a');
      expect(agent).toHaveProperty('x402Support');
    });
  });

  describe('Default Value Handling', () => {
    it('does not send default reputation range (0-100)', async () => {
      const params = toSearchParams({
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

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const [url] = mockFetch.mock.calls[0];
      const urlObj = new URL(url, 'http://localhost');

      // Default values should not be sent
      expect(urlObj.searchParams.has('minRep')).toBe(false);
      expect(urlObj.searchParams.has('maxRep')).toBe(false);
    });

    it('does not send empty arrays', async () => {
      const params = toSearchParams({
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

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const [url] = mockFetch.mock.calls[0];
      const urlObj = new URL(url, 'http://localhost');

      // Empty arrays should not be sent
      expect(urlObj.searchParams.has('chains')).toBe(false);
    });

    it('does not send AND filterMode (default)', async () => {
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
      const urlObj = new URL(url, 'http://localhost');

      // AND is default, should not be sent
      expect(urlObj.searchParams.has('filterMode')).toBe(false);
    });
  });
});
