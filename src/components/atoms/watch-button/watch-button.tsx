'use client';

import { Eye, EyeOff } from 'lucide-react';
import type React from 'react';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface WatchButtonProps {
  /** Whether the item is currently watched */
  isWatched: boolean;
  /** Callback when watch is toggled */
  onToggle: () => void;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Optional additional class names */
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
}

const SIZE_CONFIG = {
  xs: { button: 'p-1.5', icon: 14 },
  sm: { button: 'p-2', icon: 16 },
  md: { button: 'p-2.5 min-w-[44px] min-h-[44px]', icon: 18 },
  lg: { button: 'p-3 min-w-[44px] min-h-[44px]', icon: 20 },
};

/**
 * WatchButton provides a toggle button for watching/unwatching agents.
 *
 * @example
 * ```tsx
 * <WatchButton
 *   isWatched={isWatched}
 *   onToggle={() => toggleWatch(agentId)}
 * />
 * ```
 */
export function WatchButton({
  isWatched,
  onToggle,
  size = 'md',
  className,
  label,
  disabled = false,
}: WatchButtonProps): React.JSX.Element {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Prevent click from propagating to parent elements (e.g., Link in AgentCard)
      e.stopPropagation();
      e.preventDefault();

      if (!disabled) {
        onToggle();
      }
    },
    [onToggle, disabled],
  );

  const sizeConfig = SIZE_CONFIG[size];
  const accessibleLabel = label ?? (isWatched ? 'Stop watching' : 'Start watching');

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center border-2 transition-all duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixel-blue-sky)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pixel-black)]',
        disabled && 'opacity-50 cursor-not-allowed',
        isWatched
          ? 'border-[var(--pixel-blue-sky)] text-[var(--pixel-blue-sky)] shadow-[0_0_8px_var(--glow-blue)] hover:bg-[rgba(92,148,252,0.2)]'
          : 'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-blue-sky)] hover:text-[var(--pixel-blue-sky)] hover:shadow-[0_0_8px_var(--glow-blue)] hover:bg-[rgba(92,148,252,0.1)]',
        sizeConfig.button,
        className,
      )}
      aria-label={accessibleLabel}
      aria-pressed={isWatched}
      data-testid="watch-button"
      data-watched={isWatched}
    >
      {isWatched ? (
        <Eye size={sizeConfig.icon} aria-hidden="true" />
      ) : (
        <EyeOff size={sizeConfig.icon} aria-hidden="true" />
      )}
    </button>
  );
}
