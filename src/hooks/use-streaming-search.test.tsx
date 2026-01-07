/**
 * Tests for useStreamingSearch hook
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SSEClient } from '@/lib/api/stream';
import * as streamModule from '@/lib/api/stream';
import { queryKeys } from '@/lib/query-keys';
import type { AgentSummary, StreamError, StreamMetadata } from '@/types/agent';
import type { SearchParams } from '@/types/search';
import { useStreamingSearch } from './use-streaming-search';

// ============================================================================
// Mock Setup
// ============================================================================

// Mock the stream module
vi.mock('@/lib/api/stream', () => ({
  createStreamingSearch: vi.fn(),
}));

// Create a wrapper with QueryClientProvider
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

// Mock agent data
const mockAgent1: AgentSummary = {
  id: '11155111:1',
  chainId: 11155111,
  tokenId: '1',
  name: 'Trading Agent',
  description: 'AI trading assistant',
  active: true,
  x402support: false,
  hasMcp: true,
  hasA2a: false,
  supportedTrust: [],
};

const mockAgent2: AgentSummary = {
  id: '11155111:2',
  chainId: 11155111,
  tokenId: '2',
  name: 'Code Review Agent',
  description: 'AI code reviewer',
  active: true,
  x402support: true,
  hasMcp: true,
  hasA2a: true,
  supportedTrust: [],
};

// Mock metadata for reference (used in some tests via callbacks)
const _mockMetadata: StreamMetadata = {
  hydeQuery: 'Find trading agents with MCP support',
  totalExpected: 5,
  rerankerModel: 'cross-encoder',
};

const mockError: StreamError = {
  code: 'SEARCH_FAILED',
  message: 'Search service unavailable',
};

// ============================================================================
// Tests
// ============================================================================

describe('useStreamingSearch', () => {
  let mockSSEClient: SSEClient;
  let capturedCallbacks: {
    onResult?: (result: AgentSummary) => void;
    onMetadata?: (metadata: { query?: string; total?: number }) => void;
    onError?: (error: StreamError) => void;
    onComplete?: () => void;
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create mock SSE client
    mockSSEClient = {
      close: vi.fn(),
      getState: vi.fn().mockReturnValue('open') as SSEClient['getState'],
    };

    // Capture callbacks when createStreamingSearch is called
    capturedCallbacks = {};
    vi.mocked(streamModule.createStreamingSearch).mockImplementation((options) => {
      capturedCallbacks = {
        onResult: options.onResult,
        onMetadata: options.onMetadata,
        onError: options.onError,
        onComplete: options.onComplete,
      };
      return mockSSEClient;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with idle state and empty results', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.results).toEqual([]);
      expect(result.current.metadata).toBeNull();
      expect(result.current.hydeQuery).toBeNull();
      expect(result.current.streamState).toBe('idle');
      expect(result.current.isStreaming).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.resultCount).toBe(0);
      expect(result.current.expectedTotal).toBeNull();
    });

    it('should not start stream automatically', () => {
      renderHook(() => useStreamingSearch({ q: 'trading' }), { wrapper: createWrapper() });

      expect(streamModule.createStreamingSearch).not.toHaveBeenCalled();
    });
  });

  describe('startStream', () => {
    it('should start streaming when startStream is called', async () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading agents' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      expect(streamModule.createStreamingSearch).toHaveBeenCalledTimes(1);
      expect(streamModule.createStreamingSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'trading agents',
        }),
      );
      expect(result.current.streamState).toBe('connecting');
    });

    it('should not start stream without a query', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: '' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      expect(streamModule.createStreamingSearch).not.toHaveBeenCalled();
      expect(result.current.error).toEqual({
        code: 'EMPTY_QUERY',
        message: 'Search query is required',
      });
      expect(result.current.streamState).toBe('error');
    });

    it('should not start stream when enabled is false', () => {
      const { result } = renderHook(
        () => useStreamingSearch({ q: 'trading' }, { enabled: false }),
        { wrapper: createWrapper() },
      );

      act(() => {
        result.current.startStream();
      });

      expect(streamModule.createStreamingSearch).not.toHaveBeenCalled();
    });

    it('should pass filters to createStreamingSearch', () => {
      const params: SearchParams = {
        q: 'trading',
        chains: [11155111, 84532],
        mcp: true,
        a2a: true,
        x402: true,
        active: true,
        minRep: 50,
        maxRep: 100,
        skills: ['code-generation'],
        domains: ['finance'],
        filterMode: 'OR',
      };

      const { result } = renderHook(() => useStreamingSearch(params), { wrapper: createWrapper() });

      act(() => {
        result.current.startStream();
      });

      expect(streamModule.createStreamingSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'trading',
          filters: expect.objectContaining({
            chains: [11155111, 84532],
            mcp: true,
            a2a: true,
            x402: true,
            active: true,
            minRep: 50,
            maxRep: 100,
            skills: ['code-generation'],
            domains: ['finance'],
            filterMode: 'OR',
          }),
        }),
      );
    });

    it('should close existing stream before starting new one', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      // Start first stream
      act(() => {
        result.current.startStream();
      });

      // Start second stream
      act(() => {
        result.current.startStream();
      });

      expect(mockSSEClient.close).toHaveBeenCalledTimes(1);
      expect(streamModule.createStreamingSearch).toHaveBeenCalledTimes(2);
    });
  });

  describe('result accumulation', () => {
    it('should accumulate results as they arrive', async () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      // Simulate first result
      act(() => {
        capturedCallbacks.onResult?.(mockAgent1);
      });

      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0]).toEqual(mockAgent1);
      expect(result.current.resultCount).toBe(1);
      expect(result.current.streamState).toBe('streaming');
      expect(result.current.isStreaming).toBe(true);

      // Simulate second result
      act(() => {
        capturedCallbacks.onResult?.(mockAgent2);
      });

      expect(result.current.results).toHaveLength(2);
      expect(result.current.results[1]).toEqual(mockAgent2);
      expect(result.current.resultCount).toBe(2);
    });

    it('should call onResult callback for each result', () => {
      const onResult = vi.fn();

      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }, { onResult }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onResult?.(mockAgent1);
      });

      act(() => {
        capturedCallbacks.onResult?.(mockAgent2);
      });

      expect(onResult).toHaveBeenCalledTimes(2);
      expect(onResult).toHaveBeenNthCalledWith(1, mockAgent1);
      expect(onResult).toHaveBeenNthCalledWith(2, mockAgent2);
    });

    it('should skip duplicate results with same id', () => {
      const onResult = vi.fn();

      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }, { onResult }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      // First result
      act(() => {
        capturedCallbacks.onResult?.(mockAgent1);
      });

      expect(result.current.results).toHaveLength(1);
      expect(onResult).toHaveBeenCalledTimes(1);

      // Duplicate result (same id)
      act(() => {
        capturedCallbacks.onResult?.(mockAgent1);
      });

      // Should still have only 1 result
      expect(result.current.results).toHaveLength(1);
      expect(onResult).toHaveBeenCalledTimes(1); // Not called again for duplicate

      // Different result
      act(() => {
        capturedCallbacks.onResult?.(mockAgent2);
      });

      expect(result.current.results).toHaveLength(2);
      expect(onResult).toHaveBeenCalledTimes(2);
    });
  });

  describe('metadata handling', () => {
    it('should store metadata when received', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onMetadata?.({
          query: 'Find trading agents with MCP support',
          total: 5,
        });
      });

      expect(result.current.metadata).toEqual({
        hydeQuery: 'Find trading agents with MCP support',
        totalExpected: 5,
        rerankerModel: 'default',
      });
      expect(result.current.hydeQuery).toBe('Find trading agents with MCP support');
      expect(result.current.expectedTotal).toBe(5);
    });

    it('should call onMetadata callback', () => {
      const onMetadata = vi.fn();

      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }, { onMetadata }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onMetadata?.({
          query: 'Find trading agents',
          total: 3,
        });
      });

      expect(onMetadata).toHaveBeenCalledTimes(1);
      expect(onMetadata).toHaveBeenCalledWith({
        hydeQuery: 'Find trading agents',
        totalExpected: 3,
        rerankerModel: 'default',
      });
    });
  });

  describe('stream completion', () => {
    it('should set complete state when stream finishes', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onResult?.(mockAgent1);
      });

      act(() => {
        capturedCallbacks.onComplete?.();
      });

      expect(result.current.streamState).toBe('complete');
      expect(result.current.isStreaming).toBe(false);
      expect(result.current.results).toHaveLength(1);
    });

    it('should call onComplete callback', () => {
      const onComplete = vi.fn();

      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }, { onComplete }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onComplete?.();
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should set error state on stream error', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onError?.(mockError);
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.streamState).toBe('error');
      expect(result.current.isStreaming).toBe(false);
    });

    it('should call onError callback', () => {
      const onError = vi.fn();

      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }, { onError }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onError?.(mockError);
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  describe('stopStream', () => {
    it('should close the SSE client when stopStream is called', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        result.current.stopStream();
      });

      expect(mockSSEClient.close).toHaveBeenCalledTimes(1);
    });

    it('should not throw when called without active stream', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      expect(() => {
        act(() => {
          result.current.stopStream();
        });
      }).not.toThrow();
    });
  });

  describe('clearResults', () => {
    it('should clear all state and stop stream', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onResult?.(mockAgent1);
        capturedCallbacks.onMetadata?.({ query: 'Test', total: 1 });
      });

      expect(result.current.results).toHaveLength(1);

      act(() => {
        result.current.clearResults();
      });

      expect(result.current.results).toEqual([]);
      expect(result.current.metadata).toBeNull();
      expect(result.current.streamState).toBe('idle');
      expect(result.current.error).toBeNull();
      expect(mockSSEClient.close).toHaveBeenCalled();
    });
  });

  describe('params change handling', () => {
    it('should clear results when params change', () => {
      const { result, rerender } = renderHook(({ params }) => useStreamingSearch(params), {
        wrapper: createWrapper(),
        initialProps: { params: { q: 'trading' } as SearchParams },
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onResult?.(mockAgent1);
      });

      expect(result.current.results).toHaveLength(1);

      // Change params
      rerender({ params: { q: 'code review' } });

      expect(result.current.results).toEqual([]);
      expect(result.current.streamState).toBe('idle');
    });

    it('should not clear results if params are the same', () => {
      const { result, rerender } = renderHook(({ params }) => useStreamingSearch(params), {
        wrapper: createWrapper(),
        initialProps: { params: { q: 'trading', mcp: true } as SearchParams },
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onResult?.(mockAgent1);
      });

      expect(result.current.results).toHaveLength(1);

      // Rerender with equivalent params (same values, different object reference)
      rerender({ params: { q: 'trading', mcp: true } });

      expect(result.current.results).toHaveLength(1);
    });
  });

  describe('cleanup on unmount', () => {
    it('should close stream on unmount', () => {
      const { result, unmount } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      unmount();

      expect(mockSSEClient.close).toHaveBeenCalled();
    });
  });

  describe('TanStack Query cache integration', () => {
    it('should update query cache as results arrive', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: 0 },
        },
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const params: SearchParams = { q: 'trading' };

      const { result } = renderHook(() => useStreamingSearch(params), { wrapper });

      act(() => {
        result.current.startStream();
      });

      // Simulate results arriving
      act(() => {
        capturedCallbacks.onResult?.(mockAgent1);
      });

      // Check cache was updated
      const cachedData = queryClient.getQueryData(queryKeys.list(params));
      expect(cachedData).toEqual({
        agents: [mockAgent1],
        total: 1,
        hasMore: false,
        nextCursor: undefined,
      });

      // Simulate more results
      act(() => {
        capturedCallbacks.onResult?.(mockAgent2);
      });

      const updatedCache = queryClient.getQueryData(queryKeys.list(params));
      expect(updatedCache).toEqual({
        agents: [mockAgent1, mockAgent2],
        total: 2,
        hasMore: false,
        nextCursor: undefined,
      });
    });

    it('should use metadata total in cache when available', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: 0 },
        },
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );

      const params: SearchParams = { q: 'trading' };

      const { result } = renderHook(() => useStreamingSearch(params), { wrapper });

      act(() => {
        result.current.startStream();
      });

      // Metadata arrives first
      act(() => {
        capturedCallbacks.onMetadata?.({ query: 'Test', total: 10 });
      });

      // Then results
      act(() => {
        capturedCallbacks.onResult?.(mockAgent1);
      });

      const cachedData = queryClient.getQueryData(queryKeys.list(params));
      expect(cachedData).toEqual(
        expect.objectContaining({
          total: 10, // From metadata, not result count
        }),
      );
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace-only query', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: '   ' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      expect(streamModule.createStreamingSearch).not.toHaveBeenCalled();
      expect(result.current.error?.code).toBe('EMPTY_QUERY');
    });

    it('should handle rapid param changes', () => {
      const { result, rerender } = renderHook(({ params }) => useStreamingSearch(params), {
        wrapper: createWrapper(),
        initialProps: { params: { q: 'a' } as SearchParams },
      });

      // Rapidly change params
      rerender({ params: { q: 'ab' } });
      rerender({ params: { q: 'abc' } });
      rerender({ params: { q: 'abcd' } });

      expect(result.current.streamState).toBe('idle');
      expect(result.current.results).toEqual([]);
    });

    it('should handle metadata with missing fields', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onMetadata?.({});
      });

      expect(result.current.metadata).toEqual({
        hydeQuery: '',
        totalExpected: 0,
        rerankerModel: 'default',
      });
    });

    it('should handle empty results stream', () => {
      const { result } = renderHook(() => useStreamingSearch({ q: 'trading' }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startStream();
      });

      act(() => {
        capturedCallbacks.onComplete?.();
      });

      expect(result.current.results).toEqual([]);
      expect(result.current.streamState).toBe('complete');
      expect(result.current.resultCount).toBe(0);
    });
  });
});
