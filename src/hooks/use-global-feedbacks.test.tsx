import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGlobalFeedbacks, useInfiniteGlobalFeedbacks } from './use-global-feedbacks';

const mockFeedbackResult = {
  feedbacks: [
    {
      id: 'fb_1',
      score: 92,
      tags: ['reliable', 'fast'],
      context: 'Excellent code review.',
      submitter: '0x1234567890abcdef1234567890abcdef12345678',
      timestamp: '2026-01-05T10:00:00Z',
      transactionHash: '0xabc123',
      agentId: '11155111:42',
      agentName: 'CodeReview Pro',
      agentChainId: 11155111,
    },
    {
      id: 'fb_2',
      score: 45,
      tags: ['slow'],
      context: 'Response was accurate but slow.',
      submitter: '0xabcdef1234567890abcdef1234567890abcdef12',
      timestamp: '2026-01-04T08:00:00Z',
      transactionHash: '0xdef456',
      agentId: '84532:15',
      agentName: 'Trading Assistant',
      agentChainId: 84532,
    },
  ],
  stats: {
    total: 150,
    positive: 95,
    neutral: 40,
    negative: 15,
  },
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

describe('useGlobalFeedbacks', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches feedbacks with default options', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockFeedbackResult }),
      });

      const { result } = renderHook(() => useGlobalFeedbacks(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockFeedbackResult);
      expect(mockFetch).toHaveBeenCalledWith('/api/feedbacks?');
    });

    it('fetches feedbacks with score category filter', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockFeedbackResult }),
      });

      const { result } = renderHook(() => useGlobalFeedbacks({ scoreCategory: 'positive' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/feedbacks?scoreCategory=positive');
    });

    it('fetches feedbacks with chain filter', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockFeedbackResult }),
      });

      const { result } = renderHook(() => useGlobalFeedbacks({ chains: [11155111, 84532] }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/feedbacks?chains=11155111%2C84532');
    });

    it('fetches feedbacks with date range', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockFeedbackResult }),
      });

      const { result } = renderHook(
        () =>
          useGlobalFeedbacks({
            startDate: '2026-01-01',
            endDate: '2026-01-31',
          }),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/feedbacks?startDate=2026-01-01&endDate=2026-01-31');
    });

    it('fetches feedbacks with agent search', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockFeedbackResult }),
      });

      const { result } = renderHook(() => useGlobalFeedbacks({ agentSearch: 'CodeReview' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/feedbacks?agentSearch=CodeReview');
    });

    it('fetches feedbacks with limit', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockFeedbackResult }),
      });

      const { result } = renderHook(() => useGlobalFeedbacks({ limit: 50 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/feedbacks?limit=50');
    });

    it('returns correct data structure', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockFeedbackResult }),
      });

      const { result } = renderHook(() => useGlobalFeedbacks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.feedbacks).toHaveLength(2);
      expect(result.current.data?.stats.total).toBe(150);
      expect(result.current.data?.hasMore).toBe(true);
      expect(result.current.data?.nextCursor).toBe('cursor_abc123');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when enabled is false', async () => {
      const { result } = renderHook(() => useGlobalFeedbacks({ enabled: false }), {
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
            error: 'Failed to fetch feedbacks',
          }),
      });

      const { result } = renderHook(() => useGlobalFeedbacks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch feedbacks');
    });

    it('handles API error without message', async () => {
      mockFetch.mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: false,
          }),
      });

      const { result } = renderHook(() => useGlobalFeedbacks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch feedbacks');
    });

    it('handles network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useGlobalFeedbacks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Network error');
    });
  });
});

describe('useInfiniteGlobalFeedbacks', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful queries', () => {
    it('fetches first page of feedbacks', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockFeedbackResult }),
      });

      const { result } = renderHook(() => useInfiniteGlobalFeedbacks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages).toHaveLength(1);
      expect(result.current.data?.pages[0]).toEqual(mockFeedbackResult);
    });

    it('indicates hasNextPage when more results available', async () => {
      mockFetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: mockFeedbackResult }),
      });

      const { result } = renderHook(() => useInfiniteGlobalFeedbacks(), {
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
            data: { ...mockFeedbackResult, hasMore: false, nextCursor: undefined },
          }),
      });

      const { result } = renderHook(() => useInfiniteGlobalFeedbacks(), {
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
          json: () => Promise.resolve({ success: true, data: mockFeedbackResult }),
        })
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              success: true,
              data: {
                ...mockFeedbackResult,
                feedbacks: [
                  {
                    id: 'fb_3',
                    score: 88,
                    tags: ['accurate'],
                    context: 'Great analysis.',
                    submitter: '0x9876543210fedcba9876543210fedcba98765432',
                    timestamp: '2026-01-03T12:00:00Z',
                    transactionHash: '0x789abc',
                    agentId: '80002:77',
                    agentName: 'Data Analyzer',
                    agentChainId: 80002,
                  },
                ],
                hasMore: false,
                nextCursor: undefined,
              },
            }),
        });

      const { result } = renderHook(() => useInfiniteGlobalFeedbacks(), {
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
      expect(mockFetch).toHaveBeenLastCalledWith('/api/feedbacks?cursor=cursor_abc123');
    });
  });

  describe('enabled option', () => {
    it('does not fetch when enabled is false', async () => {
      const { result } = renderHook(() => useInfiniteGlobalFeedbacks({ enabled: false }), {
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
            error: 'Failed to fetch feedbacks',
          }),
      });

      const { result } = renderHook(() => useInfiniteGlobalFeedbacks(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe('Failed to fetch feedbacks');
    });
  });
});
