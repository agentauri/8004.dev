import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_REFRESH_INTERVAL, useSearchAgents } from './use-search-agents';

const mockSearchResult = {
  agents: [
    {
      id: '11155111:1',
      name: 'Test Agent 1',
      description: 'A test agent',
      chainId: 11155111,
      active: true,
      hasMcp: true,
      hasA2a: false,
      x402support: false,
      reputationScore: 85,
    },
    {
      id: '11155111:2',
      name: 'Test Agent 2',
      description: 'Another test agent',
      chainId: 11155111,
      active: false,
      hasMcp: false,
      hasA2a: true,
      x402support: true,
      reputationScore: 72,
    },
  ],
  total: 2,
  hasMore: false,
};

const mockFetch = vi.fn();

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useSearchAgents', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches agents with default params using GET /api/agents', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.agents).toEqual(mockSearchResult.agents);
      // Without query, uses GET /api/agents
      expect(mockFetch).toHaveBeenCalledWith('/api/agents?');
    });

    it('fetches agents with search query using POST /api/search', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // With query, uses POST /api/search
      expect(mockFetch).toHaveBeenCalledWith('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'trading', limit: 20 }),
      });
    });

    it('fetches agents with query and filters using POST /api/search', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const params = {
        q: 'test',
        mcp: true,
        a2a: true,
        active: true,
      };

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // With query, uses POST /api/search with filters
      expect(mockFetch).toHaveBeenCalledWith('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'test',
          limit: 20,
          filters: { active: true, mcp: true, a2a: true },
        }),
      });
    });

    it('passes cursor for pagination in semantic search', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 100, hasMore: true },
          }),
      });

      // Cursor is passed directly to backend per OpenAPI spec
      const params = {
        q: 'trading',
        limit: 20,
        cursor: 'abc123',
      };

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Backend uses cursor-based pagination per OpenAPI spec
      expect(mockFetch).toHaveBeenCalledWith('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'trading',
          limit: 20,
          cursor: 'abc123',
        }),
      });
    });

    it('passes sort and order in semantic search', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const params = {
        q: 'ciro',
        sort: 'name' as const,
        order: 'asc' as const,
      };

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'ciro',
          limit: 20,
          sort: 'name',
          order: 'asc',
        }),
      });
    });

    it('passes sort without order in semantic search when only sort specified', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const params = {
        q: 'agent',
        sort: 'createdAt' as const,
      };

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'agent',
          limit: 20,
          sort: 'createdAt',
        }),
      });
    });

    it('fetches agents with only filters using GET /api/agents', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const params = {
        mcp: true,
        active: true,
      };

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Without query, uses GET /api/agents
      expect(mockFetch).toHaveBeenCalledWith('/api/agents?mcp=true&active=true');
    });

    it('includes filterMode in request when set to OR', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const params = {
        mcp: true,
        a2a: true,
        filterMode: 'OR' as const,
      };

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/agents?mcp=true&a2a=true&filterMode=OR');
    });

    it('does not include filterMode in request when set to AND (default)', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const params = {
        mcp: true,
        filterMode: 'AND' as const,
      };

      const { result } = renderHook(() => useSearchAgents(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // AND is default, should not be included in URL
      expect(mockFetch).toHaveBeenCalledWith('/api/agents?mcp=true');
    });

    it('returns agents data', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.agents).toHaveLength(2);
      expect(result.current.data?.total).toBe(2);
      expect(result.current.data?.hasMore).toBe(false);
    });
  });

  describe('error handling', () => {
    it('handles search errors', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: false,
            error: 'Network error',
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Network error');
    });

    it('handles fetch rejection', async () => {
      mockFetch.mockRejectedValue(new Error('Fetch failed'));

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Fetch failed');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when disabled', () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}, false), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches when enabled', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}, true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('starts in loading state', () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isFetching).toBe(true);
    });

    it('transitions to success state', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('pagination support', () => {
    it('handles pagination params', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: true, nextCursor: 'cursor123' },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({ limit: 10, cursor: 'abc' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/agents?limit=10&cursor=abc');
      expect(result.current.data?.hasMore).toBe(true);
      expect(result.current.data?.nextCursor).toBe('cursor123');
    });
  });

  describe('options object', () => {
    it('accepts options object with enabled property', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}, { enabled: true }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalled();
    });

    it('does not fetch when options.enabled is false', () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}, { enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('real-time polling', () => {
    it('exports DEFAULT_REFRESH_INTERVAL constant', () => {
      expect(DEFAULT_REFRESH_INTERVAL).toBe(30000);
    });

    it('returns autoRefresh as false by default', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.autoRefresh).toBe(false);
    });

    it('returns autoRefresh as true when enabled via options', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}, { autoRefresh: true }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.autoRefresh).toBe(true);
    });

    it('provides toggleAutoRefresh function', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.autoRefresh).toBe(false);

      act(() => {
        result.current.toggleAutoRefresh();
      });

      expect(result.current.autoRefresh).toBe(true);

      act(() => {
        result.current.toggleAutoRefresh();
      });

      expect(result.current.autoRefresh).toBe(false);
    });

    it('provides manualRefresh function', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const initialCallCount = mockFetch.mock.calls.length;

      await act(async () => {
        result.current.manualRefresh();
      });

      await waitFor(() => {
        expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });

    it('returns isRefreshing as false during initial load', () => {
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      // isRefreshing should be false because this is initial load, not a refetch
      expect(result.current.isRefreshing).toBe(false);
      expect(result.current.isLoading).toBe(true);
    });

    it('sets lastUpdated after successful fetch', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result } = renderHook(() => useSearchAgents({}), {
        wrapper: createWrapper(),
      });

      expect(result.current.lastUpdated).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.lastUpdated).toBeInstanceOf(Date);
    });

    it('syncs autoRefresh state with external option', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: mockSearchResult.agents,
            meta: { total: 2, hasMore: false },
          }),
      });

      const { result, rerender } = renderHook(
        ({ autoRefresh }) => useSearchAgents({}, { autoRefresh }),
        {
          wrapper: createWrapper(),
          initialProps: { autoRefresh: false },
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.autoRefresh).toBe(false);

      rerender({ autoRefresh: true });

      expect(result.current.autoRefresh).toBe(true);
    });
  });
});
