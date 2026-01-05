import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useInfiniteLeaderboard, useLeaderboard } from './use-leaderboard';

const mockLeaderboardResponse = {
  entries: [
    {
      rank: 1,
      agentId: '11155111:42',
      name: 'CodeReview Pro',
      score: 95,
      feedbackCount: 156,
      trend: 'up' as const,
      hasMcp: true,
      hasA2a: true,
      x402Support: false,
      chainId: 11155111,
      active: true,
    },
    {
      rank: 2,
      agentId: '84532:15',
      name: 'Trading Assistant',
      score: 88,
      feedbackCount: 89,
      trend: 'up' as const,
      hasMcp: false,
      hasA2a: true,
      x402Support: true,
      chainId: 84532,
      active: true,
    },
  ],
  total: 150,
  hasMore: true,
  nextCursor: 'cursor_abc123',
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

describe('useLeaderboard', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches leaderboard with default options', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockLeaderboardResponse }),
      });

      const { result } = renderHook(() => useLeaderboard(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockLeaderboardResponse);
      expect(mockFetch).toHaveBeenCalledWith('/api/leaderboard?');
    });

    it('fetches leaderboard with period filter', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockLeaderboardResponse }),
      });

      const { result } = renderHook(() => useLeaderboard({ period: '7d' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/leaderboard?period=7d');
    });

    it('fetches leaderboard with chain filter', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockLeaderboardResponse }),
      });

      const { result } = renderHook(() => useLeaderboard({ chains: [11155111, 84532] }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/leaderboard?chains=11155111%2C84532');
    });

    it('fetches leaderboard with protocol filters', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockLeaderboardResponse }),
      });

      const { result } = renderHook(() => useLeaderboard({ mcp: true, a2a: false }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/leaderboard?mcp=true&a2a=false');
    });

    it('fetches leaderboard with limit', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockLeaderboardResponse }),
      });

      const { result } = renderHook(() => useLeaderboard({ limit: 50 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/leaderboard?limit=50');
    });

    it('returns correct data structure', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockLeaderboardResponse }),
      });

      const { result } = renderHook(() => useLeaderboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.entries).toHaveLength(2);
      expect(result.current.data?.total).toBe(150);
      expect(result.current.data?.hasMore).toBe(true);
      expect(result.current.data?.nextCursor).toBe('cursor_abc123');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when enabled is false', async () => {
      const { result } = renderHook(() => useLeaderboard({ enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('handles API error response', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: false,
            error: 'Failed to fetch leaderboard',
          }),
      });

      const { result } = renderHook(() => useLeaderboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch leaderboard');
    });

    it('handles API error without message', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: false,
          }),
      });

      const { result } = renderHook(() => useLeaderboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch leaderboard');
    });

    it('handles network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useLeaderboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Network error');
    });
  });
});

describe('useInfiniteLeaderboard', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches first page of leaderboard', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockLeaderboardResponse }),
      });

      const { result } = renderHook(() => useInfiniteLeaderboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0]).toEqual(mockLeaderboardResponse);
    });

    it('indicates hasNextPage when more results available', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockLeaderboardResponse }),
      });

      const { result } = renderHook(() => useInfiniteLeaderboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(true);
    });

    it('indicates no next page when no more results', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: { ...mockLeaderboardResponse, hasMore: false, nextCursor: undefined },
          }),
      });

      const { result } = renderHook(() => useInfiniteLeaderboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(false);
    });

    it('fetches next page with cursor', async () => {
      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true, data: mockLeaderboardResponse }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              success: true,
              data: {
                ...mockLeaderboardResponse,
                entries: [
                  {
                    rank: 3,
                    agentId: '80002:77',
                    name: 'Data Analyzer',
                    score: 82,
                    feedbackCount: 45,
                    trend: 'stable' as const,
                    hasMcp: true,
                    hasA2a: false,
                    x402Support: false,
                    chainId: 80002,
                    active: true,
                  },
                ],
                hasMore: false,
                nextCursor: undefined,
              },
            }),
        });

      const { result } = renderHook(() => useInfiniteLeaderboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Fetch next page
      result.current.fetchNextPage();

      await waitFor(() => {
        expect(result.current.data?.pages).toHaveLength(2);
      });

      // Verify cursor was passed
      expect(mockFetch).toHaveBeenLastCalledWith('/api/leaderboard?cursor=cursor_abc123');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when enabled is false', async () => {
      const { result } = renderHook(() => useInfiniteLeaderboard({ enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('handles API error response', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: false,
            error: 'Failed to fetch leaderboard',
          }),
      });

      const { result } = renderHook(() => useInfiniteLeaderboard(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch leaderboard');
    });
  });
});
