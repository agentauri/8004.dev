import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTrending } from './use-trending';

const mockTrendingResponse = {
  agents: [
    {
      id: '11155111:42',
      name: 'CodeReview Pro',
      chainId: 11155111,
      currentScore: 92,
      previousScore: 78,
      scoreChange: 14,
      percentageChange: 17.9,
      trend: 'up' as const,
      hasMcp: true,
      hasA2a: true,
      x402Support: false,
      isActive: true,
    },
    {
      id: '84532:15',
      name: 'Trading Assistant',
      chainId: 84532,
      currentScore: 85,
      previousScore: 70,
      scoreChange: 15,
      percentageChange: 21.4,
      trend: 'up' as const,
      hasMcp: false,
      hasA2a: true,
      x402Support: true,
      isActive: true,
    },
  ],
  period: '7d' as const,
  generatedAt: '2026-01-05T10:00:00Z',
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

describe('useTrending', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches trending agents with default options', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockTrendingResponse }),
      });

      const { result } = renderHook(() => useTrending(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTrendingResponse);
      expect(mockFetch).toHaveBeenCalledWith('/api/trending?period=7d&limit=5');
    });

    it('fetches trending agents with custom period', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockTrendingResponse }),
      });

      const { result } = renderHook(() => useTrending({ period: '24h' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/trending?period=24h&limit=5');
    });

    it('fetches trending agents with custom limit', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockTrendingResponse }),
      });

      const { result } = renderHook(() => useTrending({ limit: 10 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/trending?period=7d&limit=10');
    });

    it('returns correct data structure', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockTrendingResponse }),
      });

      const { result } = renderHook(() => useTrending(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.agents).toHaveLength(2);
      expect(result.current.data?.agents[0].name).toBe('CodeReview Pro');
      expect(result.current.data?.period).toBe('7d');
      expect(result.current.data?.generatedAt).toBe('2026-01-05T10:00:00Z');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when enabled is false', async () => {
      const { result } = renderHook(() => useTrending({ enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches when enabled is true (default)', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockTrendingResponse }),
      });

      const { result } = renderHook(() => useTrending({ enabled: true }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('handles API error response', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: false,
            error: 'Failed to fetch trending agents',
          }),
      });

      const { result } = renderHook(() => useTrending(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch trending agents');
    });

    it('handles API error without message', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: false,
          }),
      });

      const { result } = renderHook(() => useTrending(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch trending agents');
    });

    it('handles network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useTrending(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Network error');
    });
  });

  describe('caching behavior', () => {
    it('uses 5 minute stale time', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockTrendingResponse }),
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            gcTime: 0,
          },
        },
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      // First render
      const { result: result1 } = renderHook(() => useTrending(), { wrapper });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // Second render with same query
      const { result: result2 } = renderHook(() => useTrending(), { wrapper });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should only have fetched once due to caching
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('query key', () => {
    it('uses consistent query key with period and limit', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockTrendingResponse }),
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useTrending({ period: '7d', limit: 5 }), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify the query is cached under correct key
      const cachedData = queryClient.getQueryData(['trending', '7d', 5]);
      expect(cachedData).toEqual(mockTrendingResponse);
    });

    it('creates different cache entries for different periods', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockTrendingResponse }),
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      // First period
      const { result: result1 } = renderHook(() => useTrending({ period: '7d' }), { wrapper });
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));

      // Second period
      const { result: result2 } = renderHook(() => useTrending({ period: '24h' }), { wrapper });
      await waitFor(() => expect(result2.current.isSuccess).toBe(true));

      // Should have fetched twice for different periods
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
