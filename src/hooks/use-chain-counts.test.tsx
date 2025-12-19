import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useChainCounts } from './use-chain-counts';

const mockChainCounts = {
  11155111: 150, // Sepolia
  84532: 75, // Base Sepolia
  80002: 25, // Polygon Amoy
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

describe('useChainCounts', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches chain counts', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: [
              { chainId: 11155111, agentCount: 150 },
              { chainId: 84532, agentCount: 75 },
              { chainId: 80002, agentCount: 25 },
            ],
          }),
      });

      const { result } = renderHook(() => useChainCounts(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockChainCounts);
      expect(mockFetch).toHaveBeenCalledWith('/api/chains');
    });

    it('returns counts for all chains', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: [
              { chainId: 11155111, agentCount: 150 },
              { chainId: 84532, agentCount: 75 },
              { chainId: 80002, agentCount: 25 },
            ],
          }),
      });

      const { result } = renderHook(() => useChainCounts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.[11155111]).toBe(150);
      expect(result.current.data?.[84532]).toBe(75);
      expect(result.current.data?.[80002]).toBe(25);
    });

    it('handles empty counts', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: [],
          }),
      });

      const { result } = renderHook(() => useChainCounts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({});
    });
  });

  describe('error handling', () => {
    it('handles fetch errors', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: false,
            error: 'Network error',
          }),
      });

      const { result } = renderHook(() => useChainCounts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Network error');
    });

    it('handles fetch rejection', async () => {
      mockFetch.mockRejectedValue(new Error('Fetch failed'));

      const { result } = renderHook(() => useChainCounts(), {
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
            data: [
              { chainId: 11155111, agentCount: 150 },
              { chainId: 84532, agentCount: 75 },
              { chainId: 80002, agentCount: 25 },
            ],
          }),
      });

      const { result } = renderHook(() => useChainCounts(false), {
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
            data: [
              { chainId: 11155111, agentCount: 150 },
              { chainId: 84532, agentCount: 75 },
              { chainId: 80002, agentCount: 25 },
            ],
          }),
      });

      const { result } = renderHook(() => useChainCounts(true), {
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

      const { result } = renderHook(() => useChainCounts(), {
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
            data: [
              { chainId: 11155111, agentCount: 150 },
              { chainId: 84532, agentCount: 75 },
              { chainId: 80002, agentCount: 25 },
            ],
          }),
      });

      const { result } = renderHook(() => useChainCounts(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
    });
  });

  describe('partial counts', () => {
    it('handles single chain count', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: [{ chainId: 11155111, agentCount: 50 }],
          }),
      });

      const { result } = renderHook(() => useChainCounts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.[11155111]).toBe(50);
      expect(result.current.data?.[84532]).toBeUndefined();
    });

    it('handles zero counts', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: [
              { chainId: 11155111, agentCount: 0 },
              { chainId: 84532, agentCount: 0 },
              { chainId: 80002, agentCount: 0 },
            ],
          }),
      });

      const { result } = renderHook(() => useChainCounts(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.[11155111]).toBe(0);
      expect(result.current.data?.[84532]).toBe(0);
    });
  });
});
