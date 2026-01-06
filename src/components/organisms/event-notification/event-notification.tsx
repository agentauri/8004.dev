'use client';

import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { RealtimeEvent, RealtimeEventType } from '@/types/agent';

export interface EventNotificationProps {
  /** Event to display */
  event: RealtimeEvent;
  /** Handler to dismiss the notification */
  onDismiss?: () => void;
  /** Handler when action button is clicked */
  onAction?: (event: RealtimeEvent) => void;
  /** Auto-dismiss timeout in milliseconds (default: 5000, 0 to disable) */
  autoDismissMs?: number;
  /** Optional additional class names */
  className?: string;
}

const EVENT_TYPE_CONFIG: Record<
  RealtimeEventType,
  { label: string; icon: string; colorClass: string; glowClass: string }
> = {
  'agent.created': {
    label: 'New Agent Registered',
    icon: '+',
    colorClass: 'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)]',
    glowClass: 'shadow-[0_0_12px_var(--glow-green)]',
  },
  'agent.updated': {
    label: 'Agent Updated',
    icon: '*',
    colorClass: 'border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-text)]',
    glowClass: 'shadow-[0_0_12px_var(--glow-blue)]',
  },
  'agent.classified': {
    label: 'Agent Classified',
    icon: '#',
    colorClass: 'border-[var(--pixel-purple)] text-[var(--pixel-purple)]',
    glowClass: 'shadow-[0_0_12px_rgba(156,84,252,0.5)]',
  },
  'reputation.changed': {
    label: 'Reputation Changed',
    icon: '^',
    colorClass: 'border-[var(--pixel-gold-coin)] text-[var(--pixel-gold-coin)]',
    glowClass: 'shadow-[0_0_12px_var(--glow-gold)]',
  },
  'evaluation.completed': {
    label: 'Evaluation Complete',
    icon: '!',
    colorClass: 'border-[var(--pixel-red-fire)] text-[var(--pixel-red-fire)]',
    glowClass: 'shadow-[0_0_12px_rgba(252,84,84,0.5)]',
  },
};

/**
 * Gets a display description for the event
 */
function getEventDescription(event: RealtimeEvent): string {
  switch (event.type) {
    case 'agent.created':
      return event.data.name || `Agent ${event.data.tokenId}`;
    case 'agent.updated':
      return `Agent ${event.data.agentId} updated`;
    case 'agent.classified':
      return `Agent ${event.data.agentId} classified`;
    case 'reputation.changed':
      return `Score: ${event.data.previousScore} -> ${event.data.newScore}`;
    case 'evaluation.completed':
      return event.data.status === 'completed'
        ? `Score: ${event.data.overallScore}`
        : 'Evaluation failed';
    default:
      return 'Unknown event';
  }
}

/**
 * EventNotification displays a toast-style notification for a single event.
 * Features auto-dismiss, action button, and retro pixel styling.
 *
 * @example
 * ```tsx
 * <EventNotification
 *   event={event}
 *   onDismiss={() => removeEvent(event)}
 *   onAction={(e) => navigate(`/agent/${e.data.agentId}`)}
 *   autoDismissMs={5000}
 * />
 * ```
 */
export function EventNotification({
  event,
  onDismiss,
  onAction,
  autoDismissMs = 5000,
  className,
}: EventNotificationProps): React.JSX.Element {
  const [isExiting, setIsExiting] = useState(false);
  const config = EVENT_TYPE_CONFIG[event.type];

  // Handle dismiss with animation
  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss?.();
    }, 150); // Match animation duration
  }, [onDismiss]);

  // Auto-dismiss after timeout
  useEffect(() => {
    if (autoDismissMs > 0) {
      const timer = setTimeout(handleDismiss, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [autoDismissMs, handleDismiss]);

  const hasAction = 'agentId' in event.data && event.data.agentId;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3',
        'bg-[var(--pixel-gray-dark)] border-2',
        config.colorClass,
        config.glowClass,
        'transition-all duration-150',
        isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0',
        className,
      )}
      role="alert"
      data-testid="event-notification"
    >
      {/* Event type icon */}
      <span
        className={cn(
          'flex-shrink-0 w-8 h-8',
          'flex items-center justify-center',
          'font-[family-name:var(--font-pixel-heading)] text-lg',
          'bg-[var(--pixel-black)]',
        )}
        aria-hidden="true"
      >
        {config.icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
            config.colorClass.split(' ')[1], // Extract text color
          )}
        >
          {config.label}
        </p>
        <p className="mt-1 text-sm text-[var(--pixel-gray-300)] truncate">
          {getEventDescription(event)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {hasAction && (
          <button
            type="button"
            onClick={() => onAction?.(event)}
            className={cn(
              'px-2 py-1',
              'font-[family-name:var(--font-pixel-body)] text-xs uppercase',
              'border border-[var(--pixel-gray-600)]',
              'text-[var(--pixel-gray-300)]',
              'hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-100)]',
              'transition-colors',
            )}
            data-testid="event-notification-action"
          >
            View
          </button>
        )}
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            'w-6 h-6 flex items-center justify-center',
            'text-[var(--pixel-gray-500)]',
            'hover:text-[var(--pixel-gray-300)]',
            'transition-colors',
          )}
          aria-label="Dismiss notification"
          data-testid="event-notification-dismiss"
        >
          X
        </button>
      </div>
    </div>
  );
}
