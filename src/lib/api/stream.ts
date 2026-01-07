/**
 * Server-Sent Events (SSE) Client Utilities
 *
 * Provides a reusable SSE client for streaming search and real-time events.
 * Uses native EventSource API with auto-reconnect and exponential backoff.
 *
 * IMPORTANT: This module is for client-side use only.
 * Use in React components or client-side hooks.
 */

import type { AgentSummary } from '@/types';

// ============================================================================
// Types
// ============================================================================

/**
 * SSE connection state
 */
export type SSEConnectionState = 'connecting' | 'open' | 'closed' | 'error';

/**
 * Options for creating an SSE client
 */
export interface SSEClientOptions<T> {
  /** Callback when a message is received */
  onMessage: (data: T) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Callback when the stream completes */
  onComplete?: () => void;
  /** Callback when reconnection is attempted */
  onReconnect?: (attempt: number) => void;
  /** Maximum number of reconnection attempts (default: 3) */
  maxRetries?: number;
  /** Base delay between retries in ms (default: 1000) */
  retryDelay?: number;
  /** Custom event types to listen for (default: ['message']) */
  eventTypes?: string[];
}

/**
 * SSE client instance
 */
export interface SSEClient {
  /** Close the SSE connection */
  close: () => void;
  /** Get the current connection state */
  getState: () => SSEConnectionState;
}

/**
 * Metadata sent with streaming search
 */
export interface StreamMetadata {
  /** Total count of results (if available) */
  total?: number;
  /** Whether there are more results */
  hasMore?: boolean;
  /** Cursor for pagination */
  nextCursor?: string;
  /** Query that was executed */
  query?: string;
  /** Time taken in ms */
  duration?: number;
}

/**
 * Error from streaming search
 */
export interface StreamError {
  /** Error code */
  code: string;
  /** Human-readable message */
  message: string;
  /** HTTP status (if applicable) */
  status?: number;
}

/**
 * Options for streaming search
 */
export interface StreamSearchOptions {
  /** Search query string */
  query: string;
  /** Optional filters */
  filters?: Record<string, unknown>;
  /** Callback for each search result */
  onResult: (result: AgentSummary) => void;
  /** Callback for stream metadata */
  onMetadata?: (metadata: StreamMetadata) => void;
  /** Callback for errors */
  onError?: (error: StreamError) => void;
  /** Callback when search completes */
  onComplete?: () => void;
}

/**
 * Real-time event from the platform
 */
export interface RealtimeEvent {
  /** Event type identifier */
  type: string;
  /** Event payload */
  payload: unknown;
  /** Timestamp of the event */
  timestamp: string;
  /** Source chain ID (if applicable) */
  chainId?: number;
}

/**
 * Options for real-time event stream
 */
export interface EventStreamOptions {
  /** Callback for each event */
  onEvent: (event: RealtimeEvent) => void;
  /** Callback for errors */
  onError?: (error: Error) => void;
  /** Filter to specific event types (empty = all events) */
  eventTypes?: string[];
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Check if Server-Sent Events are supported in the current environment
 *
 * @returns true if SSE is supported, false otherwise
 *
 * @example
 * ```typescript
 * if (!isSSESupported()) {
 *   console.warn('SSE not supported, falling back to polling');
 * }
 * ```
 */
export function isSSESupported(): boolean {
  return typeof EventSource !== 'undefined';
}

/**
 * Calculate exponential backoff delay
 *
 * @param attempt - The current retry attempt (0-based)
 * @param baseDelay - Base delay in milliseconds
 * @returns Delay in milliseconds with jitter
 */
function calculateBackoff(attempt: number, baseDelay: number): number {
  // Exponential backoff: delay * 2^attempt
  const exponentialDelay = baseDelay * 2 ** attempt;
  // Add jitter (0-25% of delay) to prevent thundering herd
  const jitter = exponentialDelay * Math.random() * 0.25;
  // Cap at 30 seconds
  return Math.min(exponentialDelay + jitter, 30000);
}

/**
 * Safely parse JSON, returning null on failure
 *
 * @param text - JSON string to parse
 * @returns Parsed object or null
 */
function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

// ============================================================================
// Core SSE Client
// ============================================================================

/**
 * Create a generic SSE client with auto-reconnect and exponential backoff
 *
 * @param url - The SSE endpoint URL
 * @param options - Client configuration options
 * @returns SSEClient instance with close() and getState() methods
 *
 * @example
 * ```typescript
 * const client = createSSEClient<SearchResult>('/api/stream/search', {
 *   onMessage: (result) => console.log('Got result:', result),
 *   onError: (error) => console.error('Error:', error),
 *   onComplete: () => console.log('Stream complete'),
 *   maxRetries: 3,
 *   retryDelay: 1000,
 * });
 *
 * // Later: clean up
 * client.close();
 * ```
 */
export function createSSEClient<T>(url: string, options: SSEClientOptions<T>): SSEClient {
  const {
    onMessage,
    onError,
    onComplete,
    onReconnect,
    maxRetries = 3,
    retryDelay = 1000,
    eventTypes = ['message'],
  } = options;

  // Check for SSE support
  if (!isSSESupported()) {
    const error = new Error('Server-Sent Events are not supported in this environment');
    onError?.(error);
    return {
      close: () => {},
      getState: () => 'error',
    };
  }

  let state: SSEConnectionState = 'connecting';
  let eventSource: EventSource | null = null;
  let retryCount = 0;
  let retryTimeout: ReturnType<typeof setTimeout> | null = null;
  let isClosed = false;

  /**
   * Handle incoming message event
   */
  const handleMessage = (event: MessageEvent): void => {
    // Check for completion signal or empty/undefined data
    if (
      event.data === '[DONE]' ||
      event.data === '' ||
      event.data === undefined ||
      event.data === null
    ) {
      onComplete?.();
      return;
    }

    // Handle string "undefined" or "null" as error (malformed backend response)
    if (event.data === 'undefined' || event.data === 'null') {
      onError?.(new Error('Received malformed SSE data from server'));
      return;
    }

    // Parse JSON data
    const data = safeJsonParse<T>(event.data);
    if (data === null) {
      // Check if it looks like an HTML error page (common when endpoint doesn't exist)
      const dataStr = String(event.data).trim();
      if (dataStr.startsWith('<!DOCTYPE') || dataStr.startsWith('<html')) {
        onError?.(new Error('SSE endpoint returned HTML instead of JSON - endpoint may not exist'));
        return;
      }
      onError?.(new Error(`Failed to parse SSE message: ${dataStr.slice(0, 100)}`));
      return;
    }

    onMessage(data);
  };

  /**
   * Handle connection open
   */
  const handleOpen = (): void => {
    state = 'open';
    retryCount = 0; // Reset retry count on successful connection
  };

  /**
   * Handle connection error and reconnection
   */
  const handleError = (): void => {
    if (isClosed) return;

    state = 'error';

    // Clean up current connection
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }

    // Attempt reconnection
    if (retryCount < maxRetries) {
      retryCount++;
      const delay = calculateBackoff(retryCount - 1, retryDelay);

      onReconnect?.(retryCount);

      retryTimeout = setTimeout(() => {
        if (!isClosed) {
          connect();
        }
      }, delay);
    } else {
      onError?.(new Error(`SSE connection failed after ${maxRetries} retries`));
      state = 'closed';
      onComplete?.();
    }
  };

  /**
   * Establish SSE connection
   */
  const connect = (): void => {
    if (isClosed) return;

    state = 'connecting';
    eventSource = new EventSource(url);

    // Set up event listeners
    eventSource.onopen = handleOpen;
    eventSource.onerror = handleError;

    // Listen to specified event types
    for (const eventType of eventTypes) {
      eventSource.addEventListener(eventType, handleMessage);
    }
  };

  /**
   * Close the SSE connection and clean up
   */
  const close = (): void => {
    isClosed = true;
    state = 'closed';

    // Clear any pending retry
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      retryTimeout = null;
    }

    // Close EventSource
    if (eventSource) {
      // Remove event listeners
      for (const eventType of eventTypes) {
        eventSource.removeEventListener(eventType, handleMessage);
      }
      eventSource.close();
      eventSource = null;
    }
  };

  /**
   * Get current connection state
   */
  const getState = (): SSEConnectionState => state;

  // Start connection
  connect();

  return {
    close,
    getState,
  };
}

// ============================================================================
// Specialized Helpers
// ============================================================================

/**
 * Create a streaming search client for agent discovery
 *
 * Connects to the streaming search endpoint and emits results as they arrive.
 * Handles metadata events and completion signals automatically.
 *
 * @param options - Streaming search configuration
 * @returns SSEClient instance
 *
 * @example
 * ```typescript
 * const results: AgentSummary[] = [];
 *
 * const search = createStreamingSearch({
 *   query: 'AI assistant for code review',
 *   filters: { chains: [11155111], mcp: true },
 *   onResult: (agent) => {
 *     results.push(agent);
 *     updateUI(results);
 *   },
 *   onMetadata: (meta) => {
 *     console.log(`Found ${meta.total} total results`);
 *   },
 *   onComplete: () => {
 *     console.log('Search complete');
 *   },
 * });
 *
 * // Cancel if needed
 * search.close();
 * ```
 */
export function createStreamingSearch(options: StreamSearchOptions): SSEClient {
  const { query, filters, onResult, onMetadata, onError, onComplete } = options;

  // Build URL with individual query parameters (not JSON-encoded filters)
  const url = new URL('/api/search/stream', window.location.origin);
  url.searchParams.set('q', query);

  if (filters) {
    // Send filters as individual query params, not JSON
    if (filters.chains && Array.isArray(filters.chains) && filters.chains.length > 0) {
      url.searchParams.set('chains', filters.chains.join(','));
    }
    if (filters.mcp === true) {
      url.searchParams.set('mcp', 'true');
    }
    if (filters.a2a === true) {
      url.searchParams.set('a2a', 'true');
    }
    if (filters.x402 === true) {
      url.searchParams.set('x402', 'true');
    }
    if (filters.active !== undefined) {
      url.searchParams.set('active', String(filters.active));
    }
    if (typeof filters.minRep === 'number' && filters.minRep > 0) {
      url.searchParams.set('minReputation', String(filters.minRep));
    }
    if (typeof filters.maxRep === 'number' && filters.maxRep < 100) {
      url.searchParams.set('maxReputation', String(filters.maxRep));
    }
  }

  return createSSEClient<BackendStreamMessage>(url.toString(), {
    onMessage: (message) => {
      // Route message to appropriate handler based on backend event types
      switch (message.type) {
        // Backend sends agent results as 'agent_enriched' events
        case 'agent_enriched':
          if (message.data?.agent) {
            onResult(message.data.agent as AgentSummary);
          }
          break;
        // Backend sends metadata in 'vector_results' or 'search_started' events
        case 'vector_results':
          if (message.data && onMetadata) {
            onMetadata({
              total: message.data.total,
              hasMore: message.data.hasMore,
              query: message.data.query,
            });
          }
          break;
        case 'search_started':
          // Initial metadata with query info
          if (message.data && onMetadata) {
            onMetadata({
              query: message.data.query,
            });
          }
          break;
        // Backend sends errors as 'error' events
        case 'error':
          if (message.data && onError) {
            onError({
              code: message.data.code || 'STREAM_ERROR',
              message: message.data.error || 'Unknown error',
            });
          }
          break;
        // Backend sends completion as 'search_complete' events
        case 'search_complete':
          // Final metadata update with complete info
          if (message.data && onMetadata) {
            onMetadata({
              total: message.data.total,
              hasMore: message.data.hasMore,
              nextCursor: message.data.nextCursor,
              query: message.data.query,
            });
          }
          onComplete?.();
          break;
        // Handle legacy/fallback event types
        case 'result':
          if (message.data) {
            onResult(message.data as unknown as AgentSummary);
          }
          break;
        case 'metadata':
          if (message.metadata && onMetadata) {
            onMetadata(message.metadata);
          }
          break;
        case 'complete':
          onComplete?.();
          break;
        case 'done':
          onComplete?.();
          break;
      }
    },
    onError: (error) => {
      onError?.({
        code: 'SSE_ERROR',
        message: error.message,
      });
    },
    onComplete,
    // Listen for backend event types
    eventTypes: [
      'message',
      'search_started',
      'vector_results',
      'enrichment_progress',
      'agent_enriched',
      'search_complete',
      'error',
      // Legacy event types for backwards compatibility
      'result',
      'metadata',
      'complete',
    ],
  });
}

/**
 * Internal message type for streaming search (legacy format)
 */
interface StreamSearchMessage {
  type: 'result' | 'metadata' | 'error' | 'complete';
  data?: AgentSummary;
  metadata?: StreamMetadata;
  error?: StreamError;
}

/**
 * Backend stream message format
 * The backend sends events with different types and nested data structures
 */
interface BackendStreamMessage {
  type:
    | 'search_started'
    | 'vector_results'
    | 'enrichment_progress'
    | 'agent_enriched'
    | 'search_complete'
    | 'error'
    | 'done'
    // Legacy types for backwards compatibility
    | 'result'
    | 'metadata'
    | 'complete';
  timestamp?: string;
  data?: {
    // For agent_enriched events
    agent?: AgentSummary;
    index?: number;
    total?: number;
    // For vector_results / search_complete events
    count?: number;
    hasMore?: boolean;
    nextCursor?: string;
    query?: string;
    // For search_started events
    limit?: number;
    // For error events
    code?: string;
    error?: string;
    // For enrichment_progress
    phase?: string;
    // Generic agents array for search_complete
    agents?: AgentSummary[];
    // Direct data for legacy format
    [key: string]: unknown;
  };
  // Legacy fields
  metadata?: StreamMetadata;
  error?: StreamError;
}

/**
 * Create a real-time event stream for platform updates
 *
 * Connects to the real-time event endpoint and filters events by type.
 * Useful for live updates like new agent registrations or feedback.
 *
 * @param options - Event stream configuration
 * @returns SSEClient instance
 *
 * @example
 * ```typescript
 * const stream = createEventStream({
 *   eventTypes: ['agent.registered', 'feedback.submitted'],
 *   onEvent: (event) => {
 *     switch (event.type) {
 *       case 'agent.registered':
 *         showNotification('New agent registered!');
 *         break;
 *       case 'feedback.submitted':
 *         refreshFeedbackList();
 *         break;
 *     }
 *   },
 *   onError: (error) => {
 *     console.error('Event stream error:', error);
 *   },
 * });
 *
 * // Disconnect when done
 * stream.close();
 * ```
 */
export function createEventStream(options: EventStreamOptions): SSEClient {
  const { onEvent, onError, eventTypes = [] } = options;

  // Build URL with event type filter
  const url = new URL('/api/events', window.location.origin);

  if (eventTypes.length > 0) {
    url.searchParams.set('types', eventTypes.join(','));
  }

  return createSSEClient<RealtimeEvent>(url.toString(), {
    onMessage: (event) => {
      // If eventTypes filter is specified, only emit matching events
      if (eventTypes.length === 0 || eventTypes.includes(event.type)) {
        onEvent(event);
      }
    },
    onError,
    // Use custom event types if specified, otherwise just 'message'
    eventTypes: eventTypes.length > 0 ? eventTypes : ['message'],
  });
}
