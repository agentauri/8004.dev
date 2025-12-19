import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSimilarAgents } from './use-similar-agents';

const mockSimilarAgents = [
  {
    id: '11155111:456',
    name: 'Similar Agent 1',
    description: 'A similar agent',
    chainId: 11155111,
    similarityScore: 0.95,
    matchedSkills: ['nlp', 'code_generation'],
    matchedDomains: ['development'],
  },
  {
    id: '84532:789',
    name: 'Similar Agent 2',
    description: 'Another similar agent',
    chainId: 84532,
    similarityScore: 0.82,
    matchedSkills: ['nlp'],
    matchedDomains: ['development', 'support'],
  },
];

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

describe('useSimilarAgents', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches similar agents for a given agent ID', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              agents: mockSimilarAgents,
              meta: { total: 2, limit: 4, targetAgent: '11155111:123' },
            },
          }),
      });

      const { result } = renderHook(() => useSimilarAgents('11155111:123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockSimilarAgents);
      expect(mockFetch).toHaveBeenCalledWith('/api/agents/11155111:123/similar?limit=4');
    });

    it('respects custom limit option', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              agents: mockSimilarAgents.slice(0, 1),
              meta: { total: 1, limit: 1, targetAgent: '11155111:123' },
            },
          }),
      });

      const { result } = renderHook(() => useSimilarAgents('11155111:123', { limit: 10 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/agents/11155111:123/similar?limit=10');
    });

    it('returns empty array when agentId is undefined', async () => {
      const { result } = renderHook(() => useSimilarAgents(undefined), {
        wrapper: createWrapper(),
      });

      // Query should not be enabled
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
            error: 'Agent not found',
          }),
      });

      const { result } = renderHook(() => useSimilarAgents('11155111:123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch similar agents');
    });

    it('handles network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useSimilarAgents('11155111:123'), {
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
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              agents: mockSimilarAgents,
              meta: { total: 2, limit: 4, targetAgent: '11155111:123' },
            },
          }),
      });

      const { result } = renderHook(() => useSimilarAgents('11155111:123'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Only one fetch should have occurred
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('query key structure', () => {
    it('uses different query keys for different agent IDs', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
      });

      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              agents: mockSimilarAgents,
              meta: { total: 2, limit: 4, targetAgent: '11155111:123' },
            },
          }),
      });

      const wrapper1 = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      // First hook
      const { result: result1 } = renderHook(() => useSimilarAgents('11155111:123'), {
        wrapper: wrapper1,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // Second hook with different ID
      const { result: result2 } = renderHook(() => useSimilarAgents('11155111:456'), {
        wrapper: wrapper1,
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should have made two separate calls
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('uses different query keys for different limits', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              agents: mockSimilarAgents,
              meta: { total: 2, limit: 4, targetAgent: '11155111:123' },
            },
          }),
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const { result: result1 } = renderHook(() => useSimilarAgents('11155111:123', { limit: 4 }), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const { result: result2 } = renderHook(
        () => useSimilarAgents('11155111:123', { limit: 10 }),
        {
          wrapper,
        },
      );

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      // Should have made two separate calls due to different limits
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
