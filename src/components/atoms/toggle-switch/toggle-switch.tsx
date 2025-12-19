import type React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleSwitchProps {
  /** Left option label */
  leftLabel: string;
  /** Right option label */
  rightLabel: string;
  /** Current value (true = right, false = left) */
  value: boolean;
  /** Callback when value changes */
  onChange: (value: boolean) => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Optional additional class names */
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    container: 'h-7 text-[0.5rem]',
    label: 'px-4',
    slider: 'w-1/2 h-full',
  },
  md: {
    container: 'h-8 text-[0.625rem]',
    label: 'px-5',
    slider: 'w-1/2 h-full',
  },
  lg: {
    container: 'h-10 text-[0.75rem]',
    label: 'px-6',
    slider: 'w-1/2 h-full',
  },
};

/**
 * ToggleSwitch provides a binary toggle between two options (like AND/OR).
 *
 * @example
 * ```tsx
 * <ToggleSwitch
 *   leftLabel="AND"
 *   rightLabel="OR"
 *   value={isOr}
 *   onChange={setIsOr}
 * />
 * ```
 */
export function ToggleSwitch({
  leftLabel,
  rightLabel,
  value,
  onChange,
  size = 'md',
  disabled = false,
  ariaLabel,
  className,
}: ToggleSwitchProps): React.JSX.Element {
  const sizeConfig = SIZE_CONFIG[size];

  const handleClick = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!value);
    }
    if (e.key === 'ArrowLeft' && value) {
      e.preventDefault();
      onChange(false);
    }
    if (e.key === 'ArrowRight' && !value) {
      e.preventDefault();
      onChange(true);
    }
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center border-2 border-[var(--pixel-gray-600)]',
        'font-[family-name:var(--font-pixel-body)] uppercase',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
        sizeConfig.container,
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel || `Toggle between ${leftLabel} and ${rightLabel}`}
      tabIndex={disabled ? -1 : 0}
      data-testid="toggle-switch"
      data-value={value ? 'right' : 'left'}
      data-disabled={disabled}
    >
      {/* Sliding background */}
      <div
        className={cn(
          'absolute top-0 bg-[var(--pixel-blue-sky)] transition-transform duration-150',
          sizeConfig.slider,
          value ? 'translate-x-full' : 'translate-x-0',
        )}
        aria-hidden="true"
      />

      {/* Left label */}
      <span
        className={cn(
          'relative z-10 flex-1 flex items-center justify-center transition-colors',
          sizeConfig.label,
          !value ? 'text-[var(--pixel-black)]' : 'text-[var(--pixel-gray-400)]',
        )}
        data-testid="left-label"
      >
        {leftLabel}
      </span>

      {/* Right label */}
      <span
        className={cn(
          'relative z-10 flex-1 flex items-center justify-center transition-colors',
          sizeConfig.label,
          value ? 'text-[var(--pixel-black)]' : 'text-[var(--pixel-gray-400)]',
        )}
        data-testid="right-label"
      >
        {rightLabel}
      </span>
    </div>
  );
}
