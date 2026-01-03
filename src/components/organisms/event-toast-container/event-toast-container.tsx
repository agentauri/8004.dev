'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { EventNotification } from '@/components/organisms/event-notification';
import { useRealtimeEvents } from '@/hooks/use-realtime-events';
import { cn } from '@/lib/utils';
import type { RealtimeEvent } from '@/types/agent';

/**
 * Maximum number of toasts to show at once
 */
const MAX_VISIBLE_TOASTS = 3;

/**
 * Auto-dismiss time in milliseconds
 */
const AUTO_DISMISS_MS = 5000;

export interface EventToastContainerProps {
  /** Optional additional class names */
  className?: string;
  /** Maximum number of toasts to display (default: 3) */
  maxToasts?: number;
  /** Auto-dismiss time in ms (default: 5000, 0 to disable) */
  autoDismissMs?: number;
  /** Position of the container (default: 'bottom-right') */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * EventToastContainer displays incoming real-time events as toast notifications.
 * Uses the RealtimeEventsProvider context to receive events.
 *
 * Features:
 * - Positioned in corner of screen (configurable)
 * - Stacks multiple toasts with limit
 * - Auto-dismisses after timeout
 * - Click to navigate to agent page
 * - Animated entrance/exit
 *
 * @example
 * ```tsx
 * // In app layout, within RealtimeEventsProvider
 * <EventToastContainer position="bottom-right" maxToasts={3} />
 * ```
 */
export function EventToastContainer({
  className,
  maxToasts = MAX_VISIBLE_TOASTS,
  autoDismissMs = AUTO_DISMISS_MS,
  position = 'bottom-right',
}: EventToastContainerProps): React.JSX.Element | null {
  const router = useRouter();
  const { lastEvent, isConnected } = useRealtimeEvents();
  const [visibleToasts, setVisibleToasts] = useState<RealtimeEvent[]>([]);

  // Add new events to visible toasts
  useEffect(() => {
    if (lastEvent && isConnected) {
      setVisibleToasts((prev) => {
        // Check if this event is already showing (avoid duplicates)
        const isDuplicate = prev.some(
          (e) =>
            e.type === lastEvent.type && e.timestamp.getTime() === lastEvent.timestamp.getTime(),
        );

        if (isDuplicate) return prev;

        // Add new event, limiting to maxToasts
        const newToasts = [lastEvent, ...prev];
        return newToasts.slice(0, maxToasts);
      });
    }
  }, [lastEvent, isConnected, maxToasts]);

  // Remove a toast by index
  const removeToast = useCallback((index: number) => {
    setVisibleToasts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Navigate to agent page
  const handleAction = useCallback(
    (event: RealtimeEvent) => {
      const agentId = 'agentId' in event.data ? event.data.agentId : undefined;
      if (agentId) {
        router.push(`/agent/${agentId}`);
      }
    },
    [router],
  );

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  // Stack direction based on position
  const stackDirection = position.startsWith('top') ? 'flex-col' : 'flex-col-reverse';

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed z-50 flex gap-2 w-80 max-w-[calc(100vw-2rem)]',
        positionClasses[position],
        stackDirection,
        className,
      )}
      role="region"
      aria-label="Event notifications"
      data-testid="event-toast-container"
    >
      {visibleToasts.map((event, index) => (
        <div
          key={`${event.type}-${event.timestamp.getTime()}-${index}`}
          className="animate-in slide-in-from-right-full fade-in duration-200"
          data-testid={`event-toast-${index}`}
        >
          <EventNotification
            event={event}
            onDismiss={() => removeToast(index)}
            onAction={handleAction}
            autoDismissMs={autoDismissMs}
          />
        </div>
      ))}
    </div>
  );
}
