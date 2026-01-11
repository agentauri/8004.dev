/**
 * Tests for SSE Client Utilities
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createEventStream,
  createSSEClient,
  createStreamingSearch,
  isSSESupported,
  type RealtimeEvent,
  type StreamMetadata,
} from './stream';

// ============================================================================
// Mock EventSource
// ============================================================================

interface MockEventSourceInstance {
  url: string;
  onopen: (() => void) | null;
  onerror: (() => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  listeners: Map<string, ((event: MessageEvent) => void)[]>;
  close: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  simulateOpen: () => void;
  simulateError: () => void;
  simulateMessage: (data: string, eventType?: string) => void;
}

class MockEventSource implements MockEventSourceInstance {
  url: string;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  listeners: Map<string, ((event: MessageEvent) => void)[]> = new Map();
  close = vi.fn();
  addEventListener = vi.fn((type: string, handler: (event: MessageEvent) => void) => {
    const handlers = this.listeners.get(type) || [];
    handlers.push(handler);
    this.listeners.set(type, handlers);
  });
  removeEventListener = vi.fn((type: string, handler: (event: MessageEvent) => void) => {
    const handlers = this.listeners.get(type) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
    this.listeners.set(type, handlers);
  });

  constructor(url: string) {
    this.url = url;
    mockEventSourceInstances.push(this);
  }

  simulateOpen(): void {
    this.onopen?.();
  }

  simulateError(): void {
    this.onerror?.();
  }

  simulateMessage(data: string, eventType = 'message'): void {
    const event = { data } as MessageEvent;
    const handlers = this.listeners.get(eventType) || [];
    for (const handler of handlers) {
      handler(event);
    }
  }
}

let mockEventSourceInstances: MockEventSourceInstance[] = [];

// ============================================================================
// Test Setup
// ============================================================================

describe('SSE Client Utilities', () => {
  beforeEach(() => {
    mockEventSourceInstances = [];
    vi.stubGlobal('EventSource', MockEventSource);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // ==========================================================================
  // isSSESupported
  // ==========================================================================

  describe('isSSESupported', () => {
    it('returns true when EventSource is available', () => {
      expect(isSSESupported()).toBe(true);
    });

    it('returns false when EventSource is not available', () => {
      vi.stubGlobal('EventSource', undefined);
      expect(isSSESupported()).toBe(false);
    });
  });

  // ==========================================================================
  // createSSEClient
  // ==========================================================================

  describe('createSSEClient', () => {
    const testUrl = 'http://test.com/stream';

    it('creates client and establishes connection', () => {
      const onMessage = vi.fn();
      const client = createSSEClient(testUrl, { onMessage });

      expect(mockEventSourceInstances).toHaveLength(1);
      expect(mockEventSourceInstances[0].url).toBe(testUrl);
      expect(client.getState()).toBe('connecting');

      client.close();
    });

    it('transitions to open state on successful connection', () => {
      const onMessage = vi.fn();
      const client = createSSEClient(testUrl, { onMessage });

      mockEventSourceInstances[0].simulateOpen();

      expect(client.getState()).toBe('open');

      client.close();
    });

    it('calls onMessage with parsed JSON data', () => {
      const onMessage = vi.fn();
      const client = createSSEClient<{ id: number; name: string }>(testUrl, { onMessage });

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage('{"id": 1, "name": "test"}');

      expect(onMessage).toHaveBeenCalledWith({ id: 1, name: 'test' });

      client.close();
    });

    it('calls onComplete when [DONE] message is received', () => {
      const onMessage = vi.fn();
      const onComplete = vi.fn();
      const client = createSSEClient(testUrl, { onMessage, onComplete });

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage('[DONE]');

      expect(onComplete).toHaveBeenCalled();
      expect(onMessage).not.toHaveBeenCalled();

      client.close();
    });

    it('calls onComplete when empty message is received', () => {
      const onMessage = vi.fn();
      const onComplete = vi.fn();
      const client = createSSEClient(testUrl, { onMessage, onComplete });

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage('');

      expect(onComplete).toHaveBeenCalled();

      client.close();
    });

    it('calls onError when JSON parsing fails', () => {
      const onMessage = vi.fn();
      const onError = vi.fn();
      const client = createSSEClient(testUrl, { onMessage, onError });

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage('invalid json {');

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Failed to parse SSE message'),
        }),
      );

      client.close();
    });

    it('listens to custom event types', () => {
      const onMessage = vi.fn();
      const client = createSSEClient(testUrl, {
        onMessage,
        eventTypes: ['custom-event', 'another-event'],
      });

      expect(mockEventSourceInstances[0].addEventListener).toHaveBeenCalledWith(
        'custom-event',
        expect.any(Function),
      );
      expect(mockEventSourceInstances[0].addEventListener).toHaveBeenCalledWith(
        'another-event',
        expect.any(Function),
      );

      client.close();
    });

    it('closes connection and cleans up', () => {
      const onMessage = vi.fn();
      const client = createSSEClient(testUrl, {
        onMessage,
        eventTypes: ['message'],
      });

      client.close();

      expect(mockEventSourceInstances[0].close).toHaveBeenCalled();
      expect(mockEventSourceInstances[0].removeEventListener).toHaveBeenCalled();
      expect(client.getState()).toBe('closed');
    });

    describe('reconnection', () => {
      it('attempts to reconnect on error', () => {
        const onMessage = vi.fn();
        const onReconnect = vi.fn();
        const client = createSSEClient(testUrl, {
          onMessage,
          onReconnect,
          maxRetries: 3,
          retryDelay: 1000,
        });

        // Initial connection
        expect(mockEventSourceInstances).toHaveLength(1);

        // Simulate error
        mockEventSourceInstances[0].simulateError();

        expect(onReconnect).toHaveBeenCalledWith(1);

        // Fast-forward past retry delay
        vi.advanceTimersByTime(2000);

        // Should have created new connection
        expect(mockEventSourceInstances).toHaveLength(2);

        client.close();
      });

      it('stops reconnecting after max retries', () => {
        const onMessage = vi.fn();
        const onError = vi.fn();
        const onComplete = vi.fn();
        const client = createSSEClient(testUrl, {
          onMessage,
          onError,
          onComplete,
          maxRetries: 2,
          retryDelay: 100,
        });

        // First error
        mockEventSourceInstances[0].simulateError();
        vi.advanceTimersByTime(200);

        // Second error
        mockEventSourceInstances[1].simulateError();
        vi.advanceTimersByTime(400);

        // Third error (final)
        mockEventSourceInstances[2].simulateError();

        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'SSE connection failed after 2 retries',
          }),
        );
        expect(onComplete).toHaveBeenCalled();
        expect(client.getState()).toBe('closed');
      });

      it('resets retry count on successful connection', () => {
        const onMessage = vi.fn();
        const onReconnect = vi.fn();
        const client = createSSEClient(testUrl, {
          onMessage,
          onReconnect,
          maxRetries: 3,
          retryDelay: 100,
        });

        // First error
        mockEventSourceInstances[0].simulateError();
        vi.advanceTimersByTime(200);

        // Successful reconnection
        mockEventSourceInstances[1].simulateOpen();

        // Another error after success
        mockEventSourceInstances[1].simulateError();
        vi.advanceTimersByTime(200);

        // Should be retry 1 again, not retry 3
        expect(onReconnect).toHaveBeenLastCalledWith(1);

        client.close();
      });

      it('does not reconnect after close is called', () => {
        const onMessage = vi.fn();
        const client = createSSEClient(testUrl, {
          onMessage,
          maxRetries: 3,
          retryDelay: 100,
        });

        // Close immediately
        client.close();

        // Simulate error after close
        mockEventSourceInstances[0].simulateError();
        vi.advanceTimersByTime(1000);

        // Should not create new connection
        expect(mockEventSourceInstances).toHaveLength(1);
      });
    });

    describe('SSE not supported', () => {
      it('returns error state when EventSource is unavailable', () => {
        vi.stubGlobal('EventSource', undefined);

        const onMessage = vi.fn();
        const onError = vi.fn();
        const client = createSSEClient(testUrl, { onMessage, onError });

        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Server-Sent Events are not supported in this environment',
          }),
        );
        expect(client.getState()).toBe('error');
      });

      it('close() is a no-op when SSE is unsupported', () => {
        vi.stubGlobal('EventSource', undefined);

        const onMessage = vi.fn();
        const client = createSSEClient(testUrl, { onMessage });

        // Should not throw
        expect(() => client.close()).not.toThrow();
      });
    });
  });

  // ==========================================================================
  // createStreamingSearch
  // ==========================================================================

  describe('createStreamingSearch', () => {
    beforeEach(() => {
      // Mock window.location for URL construction
      vi.stubGlobal('window', {
        location: {
          origin: 'http://localhost:3000',
        },
      });
    });

    it('creates streaming search with correct URL', () => {
      const onResult = vi.fn();
      const client = createStreamingSearch({
        query: 'AI assistant',
        onResult,
      });

      const url = new URL(mockEventSourceInstances[0].url);
      expect(url.pathname).toBe('/api/search/stream');
      expect(url.searchParams.get('q')).toBe('AI assistant');

      client.close();
    });

    it('includes filters in URL as individual params', () => {
      const onResult = vi.fn();
      const filters = { chains: [11155111], mcp: true, active: true };
      const client = createStreamingSearch({
        query: 'test',
        filters,
        onResult,
      });

      const url = new URL(mockEventSourceInstances[0].url);
      // Filters are now sent as individual query params, not JSON-encoded
      expect(url.searchParams.get('chains')).toBe('11155111');
      expect(url.searchParams.get('mcp')).toBe('true');
      expect(url.searchParams.get('active')).toBe('true');
      // No JSON-encoded filters param
      expect(url.searchParams.get('filters')).toBeNull();

      client.close();
    });

    it('calls onResult for result messages', () => {
      const onResult = vi.fn();
      const client = createStreamingSearch({
        query: 'test',
        onResult,
      });

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage(
        JSON.stringify({
          type: 'result',
          data: { id: '11155111:1', name: 'Test Agent' },
        }),
      );

      expect(onResult).toHaveBeenCalledWith({ id: '11155111:1', name: 'Test Agent' });

      client.close();
    });

    it('calls onMetadata for metadata messages', () => {
      const onResult = vi.fn();
      const onMetadata = vi.fn();
      const client = createStreamingSearch({
        query: 'test',
        onResult,
        onMetadata,
      });

      const metadata: StreamMetadata = {
        total: 42,
        hasMore: true,
        duration: 150,
      };

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage(
        JSON.stringify({
          type: 'metadata',
          metadata,
        }),
      );

      expect(onMetadata).toHaveBeenCalledWith(metadata);

      client.close();
    });

    it('calls onError for error messages', () => {
      const onResult = vi.fn();
      const onError = vi.fn();
      const client = createStreamingSearch({
        query: 'test',
        onResult,
        onError,
      });

      // Backend sends errors in data.code and data.error format
      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage(
        JSON.stringify({
          type: 'error',
          data: {
            code: 'SEARCH_ERROR',
            error: 'Search failed',
          },
        }),
      );

      expect(onError).toHaveBeenCalledWith({
        code: 'SEARCH_ERROR',
        message: 'Search failed',
      });

      client.close();
    });

    it('calls onComplete for complete messages', () => {
      const onResult = vi.fn();
      const onComplete = vi.fn();
      const client = createStreamingSearch({
        query: 'test',
        onResult,
        onComplete,
      });

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage(
        JSON.stringify({
          type: 'complete',
        }),
      );

      expect(onComplete).toHaveBeenCalled();

      client.close();
    });

    it('calls onError for SSE connection errors', () => {
      const onResult = vi.fn();
      const onError = vi.fn();
      const client = createStreamingSearch({
        query: 'test',
        onResult,
        onError,
        onComplete: () => {},
      });

      // Exhaust retries
      for (let i = 0; i < 4; i++) {
        mockEventSourceInstances[i]?.simulateError();
        vi.advanceTimersByTime(30000);
      }

      expect(onError).toHaveBeenCalledWith({
        code: 'SSE_ERROR',
        message: expect.stringContaining('failed after'),
      });

      client.close();
    });

    it('handles missing data gracefully', () => {
      const onResult = vi.fn();
      const onMetadata = vi.fn();
      const client = createStreamingSearch({
        query: 'test',
        onResult,
        onMetadata,
      });

      mockEventSourceInstances[0].simulateOpen();

      // Result without data
      mockEventSourceInstances[0].simulateMessage(
        JSON.stringify({
          type: 'result',
        }),
      );
      expect(onResult).not.toHaveBeenCalled();

      // Metadata without metadata field
      mockEventSourceInstances[0].simulateMessage(
        JSON.stringify({
          type: 'metadata',
        }),
      );
      expect(onMetadata).not.toHaveBeenCalled();

      client.close();
    });
  });

  // ==========================================================================
  // createEventStream
  // ==========================================================================

  describe('createEventStream', () => {
    beforeEach(() => {
      vi.stubGlobal('window', {
        location: {
          origin: 'http://localhost:3000',
        },
      });
    });

    it('creates event stream with correct URL', () => {
      const onEvent = vi.fn();
      const client = createEventStream({ onEvent });

      const url = new URL(mockEventSourceInstances[0].url);
      expect(url.pathname).toBe('/api/events');

      client.close();
    });

    it('includes event types filter in URL', () => {
      const onEvent = vi.fn();
      const client = createEventStream({
        onEvent,
        eventTypes: ['agent.registered', 'feedback.submitted'],
      });

      const url = new URL(mockEventSourceInstances[0].url);
      expect(url.searchParams.get('types')).toBe('agent.registered,feedback.submitted');

      client.close();
    });

    it('calls onEvent for matching events', () => {
      const onEvent = vi.fn();
      const client = createEventStream({
        onEvent,
        eventTypes: ['agent.registered'],
      });

      const event: RealtimeEvent = {
        type: 'agent.registered',
        payload: { agentId: '11155111:1' },
        timestamp: '2024-01-01T00:00:00Z',
        chainId: 11155111,
      };

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage(JSON.stringify(event), 'agent.registered');

      expect(onEvent).toHaveBeenCalledWith(event);

      client.close();
    });

    it('filters events by type', () => {
      const onEvent = vi.fn();
      const client = createEventStream({
        onEvent,
        eventTypes: ['agent.registered'],
      });

      const event: RealtimeEvent = {
        type: 'feedback.submitted', // Different type
        payload: {},
        timestamp: '2024-01-01T00:00:00Z',
      };

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage(JSON.stringify(event), 'agent.registered');

      // Should not be called because event type doesn't match filter
      expect(onEvent).not.toHaveBeenCalled();

      client.close();
    });

    it('receives all events when no filter specified', () => {
      const onEvent = vi.fn();
      const client = createEventStream({ onEvent });

      const event1: RealtimeEvent = {
        type: 'agent.registered',
        payload: {},
        timestamp: '2024-01-01T00:00:00Z',
      };

      const event2: RealtimeEvent = {
        type: 'feedback.submitted',
        payload: {},
        timestamp: '2024-01-01T00:00:00Z',
      };

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage(JSON.stringify(event1));
      mockEventSourceInstances[0].simulateMessage(JSON.stringify(event2));

      expect(onEvent).toHaveBeenCalledTimes(2);
      expect(onEvent).toHaveBeenNthCalledWith(1, event1);
      expect(onEvent).toHaveBeenNthCalledWith(2, event2);

      client.close();
    });

    it('calls onError for connection errors', () => {
      const onEvent = vi.fn();
      const onError = vi.fn();
      const client = createEventStream({ onEvent, onError });

      // Exhaust retries
      for (let i = 0; i < 4; i++) {
        mockEventSourceInstances[i]?.simulateError();
        vi.advanceTimersByTime(30000);
      }

      expect(onError).toHaveBeenCalled();

      client.close();
    });
  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('edge cases', () => {
    it('handles rapid open/close cycles', () => {
      const onMessage = vi.fn();

      for (let i = 0; i < 10; i++) {
        const client = createSSEClient('http://test.com/stream', { onMessage });
        client.close();
      }

      expect(mockEventSourceInstances).toHaveLength(10);
      for (const instance of mockEventSourceInstances) {
        expect(instance.close).toHaveBeenCalled();
      }
    });

    it('handles multiple messages in quick succession', () => {
      const onMessage = vi.fn();
      const client = createSSEClient<{ id: number }>('http://test.com/stream', { onMessage });

      mockEventSourceInstances[0].simulateOpen();

      for (let i = 0; i < 100; i++) {
        mockEventSourceInstances[0].simulateMessage(JSON.stringify({ id: i }));
      }

      expect(onMessage).toHaveBeenCalledTimes(100);

      client.close();
    });

    it('handles undefined optional callbacks', () => {
      const onMessage = vi.fn();
      const client = createSSEClient('http://test.com/stream', {
        onMessage,
        // No onError, onComplete, or onReconnect
      });

      mockEventSourceInstances[0].simulateOpen();
      mockEventSourceInstances[0].simulateMessage('[DONE]');

      // Should not throw
      expect(() => {
        mockEventSourceInstances[0].simulateError();
        vi.advanceTimersByTime(30000);
      }).not.toThrow();

      client.close();
    });

    it('defaults to message event type', () => {
      const onMessage = vi.fn();
      const client = createSSEClient('http://test.com/stream', { onMessage });

      expect(mockEventSourceInstances[0].addEventListener).toHaveBeenCalledWith(
        'message',
        expect.any(Function),
      );

      client.close();
    });

    it('applies exponential backoff with jitter', () => {
      const onReconnect = vi.fn();
      const client = createSSEClient('http://test.com/stream', {
        onMessage: vi.fn(),
        onReconnect,
        maxRetries: 5,
        retryDelay: 1000,
      });

      // First error
      mockEventSourceInstances[0].simulateError();

      // Should not reconnect immediately
      expect(mockEventSourceInstances).toHaveLength(1);

      // Should reconnect after base delay (with possible jitter)
      vi.advanceTimersByTime(1250); // 1000 + 25% jitter max
      expect(mockEventSourceInstances).toHaveLength(2);

      // Second error - longer delay (2000 base)
      mockEventSourceInstances[1].simulateError();
      vi.advanceTimersByTime(1000);
      expect(mockEventSourceInstances).toHaveLength(2); // Not yet

      vi.advanceTimersByTime(1500);
      expect(mockEventSourceInstances).toHaveLength(3);

      client.close();
    });
  });
});
