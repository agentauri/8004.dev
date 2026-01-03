'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { queryKeys } from '@/lib/query-keys';
import type { RealtimeEvent, RealtimeEventType } from '@/types/agent';

/**
 * Maximum number of recent events to store
 */
const MAX_RECENT_EVENTS = 20;

/**
 * Reconnection delay in milliseconds (with exponential backoff)
 */
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

/**
 * Context value for realtime events
 */
export interface RealtimeEventsContextValue {
  /** Whether SSE connection is active */
  isConnected: boolean;
  /** Last received event */
  lastEvent: RealtimeEvent | null;
  /** Total count of events received in this session */
  eventCount: number;
  /** Recent events (last 20) */
  recentEvents: RealtimeEvent[];
  /** Clear all stored events */
  clearEvents: () => void;
}

const RealtimeEventsContext = createContext<RealtimeEventsContextValue | null>(null);

/**
 * Parse SSE event data into a RealtimeEvent
 */
function parseEventData(type: string, data: string): RealtimeEvent | null {
  try {
    const parsed = JSON.parse(data);
    const eventType = type as RealtimeEventType;

    // Validate event type
    const validTypes: RealtimeEventType[] = [
      'agent.created',
      'agent.updated',
      'agent.classified',
      'reputation.changed',
      'evaluation.completed',
    ];

    if (!validTypes.includes(eventType)) {
      return null;
    }

    return {
      type: eventType,
      timestamp: new Date(),
      data: parsed,
    } as RealtimeEvent;
  } catch {
    console.warn('Failed to parse SSE event data:', data);
    return null;
  }
}

interface RealtimeEventsProviderProps {
  children: ReactNode;
  /** Whether to connect to SSE on mount (default: true) */
  enabled?: boolean;
  /** SSE endpoint URL (default: /api/events) */
  endpoint?: string;
}

/**
 * Provider for real-time events via SSE.
 *
 * Features:
 * - Connects to SSE on mount
 * - Invalidates TanStack Query caches on relevant events
 * - Stores recent events (last 20)
 * - Provides connection status
 * - Auto-reconnect on disconnect with exponential backoff
 *
 * @example
 * ```tsx
 * <RealtimeEventsProvider>
 *   <App />
 * </RealtimeEventsProvider>
 * ```
 */
export function RealtimeEventsProvider({
  children,
  enabled = true,
  endpoint = '/api/events',
}: RealtimeEventsProviderProps) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);

  /**
   * Clear all stored events
   */
  const clearEvents = useCallback(() => {
    setRecentEvents([]);
    setEventCount(0);
    setLastEvent(null);
  }, []);

  /**
   * Handle cache invalidation based on event type
   */
  const invalidateCache = useCallback(
    (event: RealtimeEvent) => {
      switch (event.type) {
        case 'agent.created':
          // Invalidate agent lists
          queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
          queryClient.invalidateQueries({ queryKey: queryKeys.stats() });
          break;

        case 'agent.updated':
          // Invalidate specific agent and lists
          if (event.data.agentId) {
            queryClient.invalidateQueries({ queryKey: queryKeys.detail(event.data.agentId) });
          }
          queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
          break;

        case 'agent.classified':
          // Invalidate agent detail and lists (OASF classification changed)
          if (event.data.agentId) {
            queryClient.invalidateQueries({ queryKey: queryKeys.detail(event.data.agentId) });
          }
          queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
          break;

        case 'reputation.changed':
          // Invalidate agent reputation and lists
          if (event.data.agentId) {
            queryClient.invalidateQueries({ queryKey: queryKeys.detail(event.data.agentId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.reputation(event.data.agentId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.feedback(event.data.agentId) });
          }
          queryClient.invalidateQueries({ queryKey: queryKeys.lists() });
          break;

        case 'evaluation.completed':
          // Invalidate evaluation queries
          if (event.data.evaluationId) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.evaluation(event.data.evaluationId),
            });
          }
          if (event.data.agentId) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.agentEvaluations(event.data.agentId),
            });
          }
          queryClient.invalidateQueries({ queryKey: queryKeys.evaluations() });
          break;
      }
    },
    [queryClient],
  );

  /**
   * Add event to recent events list
   */
  const addEvent = useCallback(
    (event: RealtimeEvent) => {
      setLastEvent(event);
      setEventCount((prev) => prev + 1);
      setRecentEvents((prev) => {
        const newEvents = [event, ...prev];
        return newEvents.slice(0, MAX_RECENT_EVENTS);
      });

      // Trigger cache invalidation
      invalidateCache(event);
    },
    [invalidateCache],
  );

  /**
   * Connect to SSE endpoint
   */
  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(endpoint);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      // Reset reconnect delay on successful connection
      reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
      eventSourceRef.current = null;

      // Schedule reconnect with exponential backoff
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, reconnectDelayRef.current);

      // Increase delay for next reconnect (exponential backoff)
      reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, MAX_RECONNECT_DELAY);
    };

    // Handle specific event types
    const eventTypes: RealtimeEventType[] = [
      'agent.created',
      'agent.updated',
      'agent.classified',
      'reputation.changed',
      'evaluation.completed',
    ];

    for (const type of eventTypes) {
      eventSource.addEventListener(type, (e: MessageEvent) => {
        const event = parseEventData(type, e.data);
        if (event) {
          addEvent(event);
        }
      });
    }

    // Handle connected event (not stored, just for connection confirmation)
    eventSource.addEventListener('connected', () => {
      setIsConnected(true);
    });
  }, [endpoint, addEvent]);

  /**
   * Disconnect from SSE
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  const value: RealtimeEventsContextValue = {
    isConnected,
    lastEvent,
    eventCount,
    recentEvents,
    clearEvents,
  };

  return <RealtimeEventsContext.Provider value={value}>{children}</RealtimeEventsContext.Provider>;
}

/**
 * Hook to access realtime events context.
 * Must be used within a RealtimeEventsProvider.
 *
 * @throws Error if used outside of RealtimeEventsProvider
 *
 * @example
 * ```tsx
 * function EventIndicator() {
 *   const { isConnected, eventCount, lastEvent } = useRealtimeEventsContext();
 *
 *   return (
 *     <div>
 *       {isConnected ? 'Connected' : 'Disconnected'}
 *       <span>Events: {eventCount}</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function useRealtimeEventsContext(): RealtimeEventsContextValue {
  const context = useContext(RealtimeEventsContext);

  if (!context) {
    throw new Error('useRealtimeEventsContext must be used within a RealtimeEventsProvider');
  }

  return context;
}
