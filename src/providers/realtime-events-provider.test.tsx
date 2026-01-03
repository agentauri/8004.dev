import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { queryKeys } from '@/lib/query-keys';
import type { AgentCreatedEvent } from '@/types/agent';
import { RealtimeEventsProvider, useRealtimeEventsContext } from './realtime-events-provider';

// Mock EventSource
class MockEventSource {
  static instances: MockEventSource[] = [];
  url: string;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  listeners: Map<string, ((e: MessageEvent) => void)[]> = new Map();
  readyState = 0;

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
    // Simulate async connection
    setTimeout(() => {
      this.readyState = 1;
      this.onopen?.();
    }, 0);
  }

  addEventListener(type: string, handler: (e: MessageEvent) => void) {
    const handlers = this.listeners.get(type) || [];
    handlers.push(handler);
    this.listeners.set(type, handlers);
  }

  removeEventListener(type: string, handler: (e: MessageEvent) => void) {
    const handlers = this.listeners.get(type) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.listeners.set(type, handlers);
    }
  }

  dispatchEvent(type: string, data: unknown) {
    const handlers = this.listeners.get(type) || [];
    const event = new MessageEvent(type, { data: JSON.stringify(data) });
    for (const handler of handlers) {
      handler(event);
    }
  }

  close() {
    this.readyState = 2;
    const index = MockEventSource.instances.indexOf(this);
    if (index > -1) {
      MockEventSource.instances.splice(index, 1);
    }
  }

  static reset() {
    for (const instance of MockEventSource.instances) {
      instance.close();
    }
    MockEventSource.instances = [];
  }

  static getLatest(): MockEventSource | undefined {
    return MockEventSource.instances[MockEventSource.instances.length - 1];
  }
}

// Replace global EventSource
const originalEventSource = globalThis.EventSource;

describe('RealtimeEventsProvider', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.useFakeTimers();
    MockEventSource.reset();
    globalThis.EventSource = MockEventSource as unknown as typeof EventSource;

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    globalThis.EventSource = originalEventSource;
    MockEventSource.reset();
  });

  const createWrapper = (enabled = true) => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <RealtimeEventsProvider enabled={enabled}>{children}</RealtimeEventsProvider>
        </QueryClientProvider>
      );
    };
  };

  describe('connection', () => {
    it('connects to SSE on mount', async () => {
      renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(MockEventSource.instances).toHaveLength(1);
      expect(MockEventSource.instances[0].url).toBe('/api/events');
    });

    it('sets isConnected to true on successful connection', async () => {
      const { result } = renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      // Initially not connected
      expect(result.current.isConnected).toBe(false);

      // Run timers to trigger onopen
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // Now should be connected
      expect(result.current.isConnected).toBe(true);
    });

    it('does not connect when disabled', async () => {
      renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(false),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(MockEventSource.instances).toHaveLength(0);
    });

    it('closes connection on unmount', async () => {
      const { unmount } = renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(MockEventSource.instances).toHaveLength(1);

      unmount();

      expect(MockEventSource.instances).toHaveLength(0);
    });
  });

  describe('event handling', () => {
    it('stores received events in recentEvents', async () => {
      const { result } = renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();
      expect(eventSource).toBeDefined();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          chainId: 11155111,
          tokenId: '1',
          name: 'Test Agent',
        });
      });

      expect(result.current.recentEvents).toHaveLength(1);
      expect(result.current.recentEvents[0].type).toBe('agent.created');
      expect(result.current.lastEvent?.type).toBe('agent.created');
      expect(result.current.eventCount).toBe(1);
    });

    it('limits recentEvents to 20 items', async () => {
      const { result } = renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      // Send 25 events
      for (let i = 0; i < 25; i++) {
        await act(async () => {
          eventSource?.dispatchEvent('agent.created', {
            agentId: `11155111:${i}`,
            chainId: 11155111,
            tokenId: String(i),
            name: `Agent ${i}`,
          });
        });
      }

      expect(result.current.recentEvents).toHaveLength(20);
      expect(result.current.eventCount).toBe(25);
      // Most recent should be first - use type assertion for the test
      const data = result.current.recentEvents[0].data as AgentCreatedEvent;
      expect(data.tokenId).toBe('24');
    });

    it('clears events when clearEvents is called', async () => {
      const { result } = renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          chainId: 11155111,
          tokenId: '1',
          name: 'Test Agent',
        });
      });

      expect(result.current.recentEvents).toHaveLength(1);

      act(() => {
        result.current.clearEvents();
      });

      expect(result.current.recentEvents).toHaveLength(0);
      expect(result.current.eventCount).toBe(0);
      expect(result.current.lastEvent).toBeNull();
    });
  });

  describe('cache invalidation', () => {
    it('invalidates agent lists on agent.created', async () => {
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.created', {
          agentId: '11155111:1',
          chainId: 11155111,
          tokenId: '1',
          name: 'Test Agent',
        });
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.lists() });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.stats() });
    });

    it('invalidates agent detail on agent.updated', async () => {
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('agent.updated', {
          agentId: '11155111:1',
          changedFields: ['name'],
        });
      });

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: queryKeys.detail('11155111:1'),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.lists() });
    });

    it('invalidates reputation on reputation.changed', async () => {
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('reputation.changed', {
          agentId: '11155111:1',
          previousScore: 50,
          newScore: 75,
          feedbackId: 'fb-123',
        });
      });

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: queryKeys.reputation('11155111:1'),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: queryKeys.feedback('11155111:1'),
      });
    });

    it('invalidates evaluations on evaluation.completed', async () => {
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const eventSource = MockEventSource.getLatest();

      await act(async () => {
        eventSource?.dispatchEvent('evaluation.completed', {
          evaluationId: 'eval-123',
          agentId: '11155111:1',
          overallScore: 85,
          status: 'completed',
        });
      });

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: queryKeys.evaluation('eval-123'),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: queryKeys.agentEvaluations('11155111:1'),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: queryKeys.evaluations(),
      });
    });
  });

  describe('reconnection', () => {
    it('attempts to reconnect on error', async () => {
      renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      const firstEventSource = MockEventSource.getLatest();
      expect(firstEventSource).toBeDefined();

      // Simulate connection error
      await act(async () => {
        firstEventSource?.onerror?.();
      });

      // Wait for reconnect delay
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      // Should have created new EventSource
      expect(MockEventSource.instances).toHaveLength(1);
      expect(MockEventSource.instances[0]).not.toBe(firstEventSource);
    });

    it('uses exponential backoff for reconnection', async () => {
      renderHook(() => useRealtimeEventsContext(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // First connection error
      const es1 = MockEventSource.getLatest();
      await act(async () => {
        es1?.onerror?.();
      });

      // Wait 1 second (initial delay)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      // Second connection error
      const es2 = MockEventSource.getLatest();
      await act(async () => {
        es2?.onerror?.();
      });

      // Should not reconnect after 1 second (delay doubled to 2s)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
      expect(MockEventSource.instances).toHaveLength(0);

      // Should reconnect after 2 seconds total
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
      expect(MockEventSource.instances).toHaveLength(1);
    });
  });

  describe('useRealtimeEventsContext', () => {
    it('throws when used outside provider', () => {
      expect(() => {
        renderHook(() => useRealtimeEventsContext());
      }).toThrow('useRealtimeEventsContext must be used within a RealtimeEventsProvider');
    });
  });
});
