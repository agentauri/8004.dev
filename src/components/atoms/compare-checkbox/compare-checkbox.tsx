import { GitCompareArrows } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';

export interface CompareCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when checkbox state changes */
  onChange: () => void;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Optional custom label for accessibility */
  label?: string;
  /** Optional additional class names */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md';
}

const SIZE_CLASSES = {
  sm: {
    button: 'w-6 h-6',
    icon: 14,
  },
  md: {
    button: 'w-8 h-8',
    icon: 18,
  },
} as const;

/**
 * A checkbox button for selecting agents to compare.
 * Uses compare arrows icon to indicate comparison functionality.
 *
 * @example
 * ```tsx
 * <CompareCheckbox
 *   checked={isSelected}
 *   onChange={() => toggleSelection(agent.id)}
 *   disabled={!isSelected && isMaxSelected}
 *   label={`Compare ${agent.name}`}
 * />
 * ```
 */
export function CompareCheckbox({
  checked,
  onChange,
  disabled = false,
  label,
  className,
  size = 'md',
}: CompareCheckboxProps): React.JSX.Element {
  const sizeConfig = SIZE_CLASSES[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onChange();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        onChange();
      }
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label || (checked ? 'Remove from comparison' : 'Add to comparison')}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center justify-center border-2 transition-all',
        sizeConfig.button,
        checked
          ? [
              'border-[var(--pixel-blue-sky)] bg-[var(--pixel-blue-sky)]/20',
              'text-[var(--pixel-blue-text)]',
              'shadow-[0_0_8px_var(--glow-blue)]',
            ]
          : [
              'border-[var(--pixel-gray-600)] bg-transparent',
              'text-[var(--pixel-gray-400)]',
              'hover:border-[var(--pixel-blue-sky)] hover:text-[var(--pixel-blue-text)]',
            ],
        disabled &&
          !checked &&
          'opacity-50 cursor-not-allowed hover:border-[var(--pixel-gray-600)] hover:text-[var(--pixel-gray-400)]',
        className,
      )}
      data-testid="compare-checkbox"
      data-checked={checked}
    >
      <GitCompareArrows
        size={sizeConfig.icon}
        aria-hidden="true"
        className={cn('transition-transform', checked && 'scale-110')}
      />
    </button>
  );
}
