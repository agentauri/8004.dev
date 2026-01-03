/**
 * Hook for accessing real-time events from SSE connection.
 *
 * This hook provides access to the RealtimeEventsProvider context,
 * which manages SSE connection, event storage, and cache invalidation.
 *
 * @example
 * ```tsx
 * function EventIndicator() {
 *   const { isConnected, eventCount, recentEvents, clearEvents } = useRealtimeEvents();
 *
 *   return (
 *     <div>
 *       <span>{isConnected ? 'Live' : 'Offline'}</span>
 *       <span>{eventCount} events</span>
 *       <button onClick={clearEvents}>Clear</button>
 *     </div>
 *   );
 * }
 * ```
 */

export {
  type RealtimeEventsContextValue,
  useRealtimeEventsContext as useRealtimeEvents,
} from '@/providers/realtime-events-provider';
