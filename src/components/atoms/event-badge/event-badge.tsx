import type React from 'react';
import { cn } from '@/lib/utils';

export interface EventBadgeProps {
  /** Number of unread events to display */
  count: number;
  /** Whether connected to the event stream */
  isConnected: boolean;
  /** Click handler for opening event panel */
  onClick?: () => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * EventBadge displays a notification badge with event count and connection status.
 * Shows a pulsing indicator when connected and displays unread count.
 *
 * @example
 * ```tsx
 * <EventBadge count={5} isConnected={true} onClick={() => setShowPanel(true)} />
 * ```
 */
export function EventBadge({
  count,
  isConnected,
  onClick,
  className,
}: EventBadgeProps): React.JSX.Element {
  const displayCount = count > 99 ? '99+' : count;
  const hasEvents = count > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-1.5 px-2 py-1.5',
        'border-2 transition-all duration-150',
        'font-[family-name:var(--font-pixel-body)] text-xs uppercase tracking-wider',
        isConnected
          ? 'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)]'
          : 'border-[var(--pixel-gray-500)] text-[var(--pixel-gray-500)]',
        hasEvents &&
          isConnected &&
          'hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)] hover:shadow-[0_0_12px_var(--pixel-green-pipe)]',
        !hasEvents &&
          isConnected &&
          'hover:bg-[rgba(0,216,0,0.1)] hover:shadow-[0_0_8px_var(--pixel-green-pipe)]',
        !isConnected && 'cursor-default opacity-60',
        className,
      )}
      disabled={!isConnected}
      aria-label={`${count} events${isConnected ? '' : ' (disconnected)'}`}
      data-testid="event-badge"
    >
      {/* Connection indicator */}
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          isConnected ? 'bg-[var(--pixel-green-pipe)] animate-pulse' : 'bg-[var(--pixel-gray-500)]',
        )}
        aria-hidden="true"
        data-testid="event-badge-indicator"
      />

      {/* Event icon (bell shape using CSS) */}
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 1a1 1 0 0 0-1 1v1.07A4.5 4.5 0 0 0 3.5 7.5V11L2 12.5v1h12v-1L12.5 11V7.5A4.5 4.5 0 0 0 9 3.07V2a1 1 0 0 0-1-1zm2 13H6a2 2 0 0 0 4 0z" />
      </svg>

      {/* Count badge */}
      {hasEvents && (
        <span
          className={cn(
            'absolute -top-1.5 -right-1.5',
            'min-w-[18px] h-[18px] px-1',
            'flex items-center justify-center',
            'bg-[var(--pixel-red-fire)] text-[var(--pixel-white)]',
            'text-[10px] font-bold',
            'border border-[var(--pixel-black)]',
          )}
          data-testid="event-badge-count"
        >
          {displayCount}
        </span>
      )}
    </button>
  );
}
