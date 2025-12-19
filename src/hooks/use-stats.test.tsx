import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useStats } from './use-stats';

const mockStats = {
  totalAgents: 1250,
  withMetadata: 1100,
  activeAgents: 890,
  chainBreakdown: [
    { chainId: 11155111, name: 'Ethereum Sepolia', total: 500, withMetadata: 450, active: 380 },
    { chainId: 84532, name: 'Base Sepolia', total: 450, withMetadata: 400, active: 320 },
    { chainId: 80002, name: 'Polygon Amoy', total: 300, withMetadata: 250, active: 190 },
  ],
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

describe('useStats', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches platform statistics', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockStats }),
      });

      const { result } = renderHook(() => useStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockStats);
      expect(mockFetch).toHaveBeenCalledWith('/api/stats');
    });

    it('returns correct stats structure', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockStats }),
      });

      const { result } = renderHook(() => useStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.totalAgents).toBe(1250);
      expect(result.current.data?.withMetadata).toBe(1100);
      expect(result.current.data?.activeAgents).toBe(890);
      expect(result.current.data?.chainBreakdown).toHaveLength(3);
    });

    it('returns chain breakdown with correct structure', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockStats }),
      });

      const { result } = renderHook(() => useStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const sepoliaChain = result.current.data?.chainBreakdown[0];
      expect(sepoliaChain?.chainId).toBe(11155111);
      expect(sepoliaChain?.name).toBe('Ethereum Sepolia');
      expect(sepoliaChain?.total).toBe(500);
      expect(sepoliaChain?.active).toBe(380);
    });
  });

  describe('enabled option', () => {
    it('does not fetch when enabled is false', async () => {
      const { result } = renderHook(() => useStats(false), {
        wrapper: createWrapper(),
      });

      // Query should not run
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('fetches when enabled is true (default)', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockStats }),
      });

      const { result } = renderHook(() => useStats(true), {
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
            error: 'Failed to fetch statistics',
          }),
      });

      const { result } = renderHook(() => useStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch statistics');
    });

    it('handles API error without message', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: false,
          }),
      });

      const { result } = renderHook(() => useStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch platform statistics');
    });

    it('handles network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useStats(), {
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
        json: () => Promise.resolve({ success: true, data: mockStats }),
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
      const { result: result1 } = renderHook(() => useStats(), { wrapper });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // Second render with same query
      const { result: result2 } = renderHook(() => useStats(), { wrapper });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should only have fetched once due to caching
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('query key', () => {
    it('uses consistent query key', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockStats }),
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result } = renderHook(() => useStats(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify the query is cached under stats key
      const cachedData = queryClient.getQueryData(['stats']);
      expect(cachedData).toEqual(mockStats);
    });
  });
});
