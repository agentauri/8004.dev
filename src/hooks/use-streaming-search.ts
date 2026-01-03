/**
 * Hook for streaming search with real-time result accumulation
 *
 * Uses Server-Sent Events (SSE) to stream search results as they arrive,
 * providing a responsive user experience for semantic search.
 *
 * Integrates with TanStack Query for cache management, updating the
 * search cache incrementally as results stream in.
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createStreamingSearch, type SSEClient } from '@/lib/api/stream';
import { queryKeys } from '@/lib/query-keys';
import type { AgentSummary, StreamError, StreamMetadata } from '@/types/agent';
import type { SearchParams, SearchResult } from '@/types/search';

// ============================================================================
// Types
// ============================================================================

/**
 * Stream state for tracking connection lifecycle
 */
export type StreamState = 'idle' | 'connecting' | 'streaming' | 'complete' | 'error';

/**
 * Options for the streaming search hook
 */
export interface StreamingSearchOptions {
  /** Whether streaming is enabled (default: true) */
  enabled?: boolean;
  /** Callback when a new result arrives */
  onResult?: (result: AgentSummary) => void;
  /** Callback when stream metadata is received */
  onMetadata?: (metadata: StreamMetadata) => void;
  /** Callback when stream completes successfully */
  onComplete?: () => void;
  /** Callback when an error occurs */
  onError?: (error: StreamError) => void;
}

/**
 * Return type for the streaming search hook
 */
export interface StreamingSearchResult {
  /** Results accumulating in real-time */
  results: AgentSummary[];

  /** Stream metadata (HyDE query, expected total, etc.) */
  metadata: StreamMetadata | null;

  /** HyDE-generated query used for semantic search */
  hydeQuery: string | null;

  /** Current stream state */
  streamState: StreamState;

  /** Whether currently streaming (shorthand for streamState === 'streaming') */
  isStreaming: boolean;

  /** Error if stream failed */
  error: StreamError | null;

  /** Start/restart the streaming search */
  startStream: () => void;

  /** Stop the current stream */
  stopStream: () => void;

  /** Clear accumulated results and reset state */
  clearResults: () => void;

  /** Number of results received so far */
  resultCount: number;

  /** Expected total results (from metadata, if available) */
  expectedTotal: number | null;
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Create a stable serialization of params for comparison
 */
function serializeParams(params: SearchParams): string {
  return JSON.stringify(params, Object.keys(params).sort());
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for streaming search with real-time result accumulation
 *
 * @param params - Search parameters (query, filters, pagination)
 * @param options - Hook options (enabled, callbacks)
 * @returns StreamingSearchResult with results, state, and controls
 *
 * @example
 * ```tsx
 * const {
 *   results,
 *   isStreaming,
 *   streamState,
 *   startStream,
 *   stopStream,
 *   resultCount,
 *   expectedTotal,
 * } = useStreamingSearch(
 *   { q: 'trading agent', mcp: true },
 *   {
 *     onResult: (result) => console.log('New result:', result.name),
 *     onComplete: () => console.log('Search complete'),
 *   }
 * );
 *
 * // Start streaming when ready
 * useEffect(() => {
 *   if (searchQuery) {
 *     startStream();
 *   }
 * }, [searchQuery, startStream]);
 * ```
 */
export function useStreamingSearch(
  params: SearchParams,
  options: StreamingSearchOptions = {},
): StreamingSearchResult {
  const { enabled = true, onResult, onMetadata, onComplete, onError } = options;

  // State
  const [results, setResults] = useState<AgentSummary[]>([]);
  const [metadata, setMetadata] = useState<StreamMetadata | null>(null);
  const [streamState, setStreamState] = useState<StreamState>('idle');
  const [error, setError] = useState<StreamError | null>(null);

  // Refs for stable references
  const sseClientRef = useRef<SSEClient | null>(null);
  const paramsRef = useRef<string>(serializeParams(params));
  const callbacksRef = useRef({ onResult, onMetadata, onComplete, onError });

  // Query client for cache updates
  const queryClient = useQueryClient();

  // Update callbacks ref on each render to avoid stale closures
  useEffect(() => {
    callbacksRef.current = { onResult, onMetadata, onComplete, onError };
  }, [onResult, onMetadata, onComplete, onError]);

  /**
   * Stop the current stream and clean up
   */
  const stopStream = useCallback(() => {
    if (sseClientRef.current) {
      sseClientRef.current.close();
      sseClientRef.current = null;
    }
    // Don't reset state here - allow component to show final state
  }, []);

  /**
   * Clear all results and reset state
   */
  const clearResults = useCallback(() => {
    stopStream();
    setResults([]);
    setMetadata(null);
    setStreamState('idle');
    setError(null);
  }, [stopStream]);

  /**
   * Start a new streaming search
   */
  const startStream = useCallback(() => {
    // Don't start if not enabled
    if (!enabled) return;

    // Don't start without a query
    if (!params.q?.trim()) {
      setError({ code: 'EMPTY_QUERY', message: 'Search query is required' });
      setStreamState('error');
      return;
    }

    // Clean up any existing stream
    if (sseClientRef.current) {
      sseClientRef.current.close();
      sseClientRef.current = null;
    }

    // Reset state for new search
    setResults([]);
    setMetadata(null);
    setError(null);
    setStreamState('connecting');

    // Accumulator for results (needed for cache updates)
    let accumulatedResults: AgentSummary[] = [];
    let receivedMetadata: StreamMetadata | null = null;

    sseClientRef.current = createStreamingSearch({
      query: params.q,
      filters: {
        chains: params.chains,
        mcp: params.mcp,
        a2a: params.a2a,
        x402: params.x402,
        active: params.active,
        minRep: params.minRep,
        maxRep: params.maxRep,
        skills: params.skills,
        domains: params.domains,
        filterMode: params.filterMode,
      },
      onResult: (result) => {
        // Transition to streaming state on first result
        setStreamState('streaming');

        // Add result to state
        setResults((prev) => [...prev, result]);
        accumulatedResults = [...accumulatedResults, result];

        // Update TanStack Query cache incrementally
        // Priority: metadata total > current accumulated count
        // We use accumulated count during streaming since it reflects reality
        queryClient.setQueryData(
          queryKeys.list(params),
          (): SearchResult => ({
            agents: accumulatedResults,
            total: receivedMetadata?.totalExpected || accumulatedResults.length,
            hasMore: false,
            nextCursor: undefined,
          }),
        );

        // Call user callback
        callbacksRef.current.onResult?.(result);
      },
      onMetadata: (meta) => {
        // Map backend StreamMetadata to frontend format
        const frontendMeta: StreamMetadata = {
          hydeQuery: meta.query || '',
          totalExpected: meta.total || 0,
          rerankerModel: 'default',
        };
        receivedMetadata = frontendMeta;
        setMetadata(frontendMeta);

        // Call user callback
        callbacksRef.current.onMetadata?.(frontendMeta);
      },
      onError: (err) => {
        setError(err);
        setStreamState('error');

        // Call user callback
        callbacksRef.current.onError?.(err);
      },
      onComplete: () => {
        setStreamState('complete');
        sseClientRef.current = null;

        // Final cache update with complete data
        queryClient.setQueryData(
          queryKeys.list(params),
          (): SearchResult => ({
            agents: accumulatedResults,
            total: receivedMetadata?.totalExpected || accumulatedResults.length,
            hasMore: false,
            nextCursor: undefined,
          }),
        );

        // Call user callback
        callbacksRef.current.onComplete?.();
      },
    });
  }, [enabled, params, queryClient]);

  // Reset state when params change significantly
  useEffect(() => {
    const newSerializedParams = serializeParams(params);
    if (paramsRef.current !== newSerializedParams) {
      paramsRef.current = newSerializedParams;
      // Clear results when params change
      clearResults();
    }
  }, [params, clearResults]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sseClientRef.current) {
        sseClientRef.current.close();
        sseClientRef.current = null;
      }
    };
  }, []);

  return {
    results,
    metadata,
    hydeQuery: metadata?.hydeQuery || null,
    streamState,
    isStreaming: streamState === 'streaming',
    error,
    startStream,
    stopStream,
    clearResults,
    resultCount: results.length,
    expectedTotal: metadata?.totalExpected || null,
  };
}
