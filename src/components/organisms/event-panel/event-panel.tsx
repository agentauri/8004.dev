'use client';

import Link from 'next/link';
import type React from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { RealtimeEvent, RealtimeEventType } from '@/types/agent';

export interface EventPanelProps {
  /** List of events to display */
  events: RealtimeEvent[];
  /** Handler to clear all events */
  onClear: () => void;
  /** Handler when an event is clicked */
  onEventClick?: (event: RealtimeEvent) => void;
  /** Handler to close the panel */
  onClose?: () => void;
  /** Optional additional class names */
  className?: string;
}

const EVENT_TYPE_CONFIG: Record<
  RealtimeEventType,
  { label: string; icon: string; colorClass: string }
> = {
  'agent.created': {
    label: 'New Agent',
    icon: '+',
    colorClass: 'text-[var(--pixel-green-pipe)]',
  },
  'agent.updated': {
    label: 'Agent Updated',
    icon: '*',
    colorClass: 'text-[var(--pixel-blue-text)]',
  },
  'agent.classified': {
    label: 'Classified',
    icon: '#',
    colorClass: 'text-[var(--pixel-purple)]',
  },
  'reputation.changed': {
    label: 'Reputation',
    icon: '!',
    colorClass: 'text-[var(--pixel-gold-coin)]',
  },
  'evaluation.completed': {
    label: 'Evaluation',
    icon: '>',
    colorClass: 'text-[var(--pixel-emerald)]',
  },
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return date.toLocaleDateString();
}

function getAgentId(event: RealtimeEvent): string | undefined {
  return event.data.agentId;
}

function getEventName(event: RealtimeEvent): string {
  if ('name' in event.data && event.data.name) {
    return event.data.name;
  }
  return event.data.agentId || 'Unknown';
}

/**
 * EventPanel displays a dropdown list of recent real-time events.
 * Shows event type, description, and timestamp with click-to-navigate functionality.
 *
 * @example
 * ```tsx
 * <EventPanel
 *   events={recentEvents}
 *   onClear={clearEvents}
 *   onEventClick={handleEventClick}
 *   onClose={() => setShowPanel(false)}
 * />
 * ```
 */
export function EventPanel({
  events,
  onClear,
  onEventClick,
  onClose,
  className,
}: EventPanelProps): React.JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose?.();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const hasEvents = events.length > 0;

  return (
    <div
      ref={panelRef}
      className={cn(
        'absolute top-full right-0 mt-2',
        'w-80 max-h-96',
        'bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]',
        'shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
        'z-50 overflow-hidden',
        className,
      )}
      role="dialog"
      aria-label="Recent events"
      data-testid="event-panel"
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between',
          'px-3 py-2',
          'border-b-2 border-[var(--pixel-gray-700)]',
          'bg-[var(--pixel-gray-800)]',
        )}
      >
        <h3
          className={cn(
            'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
            'text-[var(--pixel-gray-100)]',
          )}
        >
          Events
        </h3>
        <div className="flex items-center gap-2">
          {hasEvents && (
            <button
              type="button"
              onClick={onClear}
              className={cn(
                'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
                'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-red-fire)]',
                'transition-colors',
              )}
              data-testid="event-panel-clear"
            >
              Clear
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'w-6 h-6 flex items-center justify-center',
                'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-100)]',
                'transition-colors',
              )}
              aria-label="Close event panel"
              data-testid="event-panel-close"
            >
              X
            </button>
          )}
        </div>
      </div>

      {/* Event List */}
      <div className="overflow-y-auto max-h-80" data-testid="event-panel-list">
        {!hasEvents ? (
          <div
            className={cn(
              'flex flex-col items-center justify-center',
              'py-8 px-4',
              'text-[var(--pixel-gray-500)]',
            )}
            data-testid="event-panel-empty"
          >
            <span className="text-2xl mb-2">~</span>
            <span className="font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider">
              No events yet
            </span>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--pixel-gray-700)]">
            {events.map((event, index) => {
              const config = EVENT_TYPE_CONFIG[event.type];
              const agentId = getAgentId(event);
              const eventKey = `${event.type}-${event.timestamp.getTime()}-${index}`;

              const content = (
                <div
                  className={cn(
                    'flex items-start gap-3 px-3 py-3',
                    'hover:bg-[var(--pixel-gray-800)]',
                    'transition-colors cursor-pointer',
                  )}
                  onClick={() => onEventClick?.(event)}
                  onKeyDown={(e) => e.key === 'Enter' && onEventClick?.(event)}
                  data-testid={`event-item-${index}`}
                >
                  {/* Event type icon */}
                  <span
                    className={cn(
                      'flex-shrink-0 w-6 h-6',
                      'flex items-center justify-center',
                      'font-[family-name:var(--font-pixel-heading)] text-sm',
                      config.colorClass,
                    )}
                    aria-hidden="true"
                  >
                    {config.icon}
                  </span>

                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
                          config.colorClass,
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className={cn('mt-0.5 text-sm text-[var(--pixel-gray-300)]', 'truncate')}>
                      {getEventName(event)}
                    </p>
                    <time
                      className={cn(
                        'mt-1 text-xs text-[var(--pixel-gray-500)]',
                        'font-[family-name:var(--font-pixel-body)]',
                      )}
                      dateTime={event.timestamp.toISOString()}
                    >
                      {formatRelativeTime(event.timestamp)}
                    </time>
                  </div>
                </div>
              );

              return (
                <li key={eventKey}>
                  {agentId ? (
                    <Link href={`/agent/${agentId}`} className="block">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      {hasEvents && (
        <div
          className={cn(
            'px-3 py-2',
            'border-t-2 border-[var(--pixel-gray-700)]',
            'bg-[var(--pixel-gray-800)]',
          )}
        >
          <Link
            href="/explore"
            className={cn(
              'block text-center',
              'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
              'text-[var(--pixel-blue-text)] hover:text-[var(--pixel-gray-100)]',
              'transition-colors',
            )}
            onClick={() => onClose?.()}
            data-testid="event-panel-view-all"
          >
            View All Agents
          </Link>
        </div>
      )}
    </div>
  );
}
