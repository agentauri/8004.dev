import type React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  /** Current checked state */
  checked: boolean;
  /** Callback when state changes */
  onChange: (checked: boolean) => void;
  /** Optional label text displayed next to the switch */
  label?: string;
  /** Optional description text displayed below the label */
  description?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Aria label for accessibility (used when no visible label is provided) */
  ariaLabel?: string;
  /** Test ID for testing */
  testId?: string;
  /** Optional additional class names */
  className?: string;
}

// Size calculations:
// Track has border-2 (4px total), thumb starts at left-[1px]
// translate-x = track_width - border(4px) - thumb_width - padding(2px)
// sm: 32 - 4 - 10 - 2 = 16px
// md: 40 - 4 - 14 - 2 = 20px
// lg: 48 - 4 - 18 - 2 = 24px
const SIZE_CONFIG = {
  sm: {
    track: 'w-8 h-4', // 32x16px
    thumb: 'w-[10px] h-[10px]', // 10x10px
    thumbTranslate: 'translate-x-[16px]',
    label: 'text-xs',
    description: 'text-[0.625rem]',
  },
  md: {
    track: 'w-10 h-5', // 40x20px
    thumb: 'w-[14px] h-[14px]', // 14x14px
    thumbTranslate: 'translate-x-[20px]',
    label: 'text-sm',
    description: 'text-xs',
  },
  lg: {
    track: 'w-12 h-6', // 48x24px
    thumb: 'w-[18px] h-[18px]', // 18x18px
    thumbTranslate: 'translate-x-[24px]',
    label: 'text-base',
    description: 'text-sm',
  },
};

/**
 * Switch provides a binary on/off toggle control with retro pixel art styling.
 *
 * @example
 * ```tsx
 * <Switch
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 *   label="Enable feature"
 *   description="Turn this on to enable the feature"
 * />
 * ```
 */
export function Switch({
  checked,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
  ariaLabel,
  testId = 'switch',
  className,
}: SwitchProps): React.JSX.Element {
  const sizeConfig = SIZE_CONFIG[size];

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const switchControl = (
    <div
      className={cn(
        'relative inline-flex items-center border-2 transition-colors duration-150 flex-shrink-0',
        sizeConfig.track,
        checked
          ? 'bg-[var(--pixel-blue-sky)] border-[var(--pixel-blue-sky)] shadow-[0_0_8px_rgba(92,148,252,0.5)]'
          : 'bg-[var(--pixel-gray-800)] border-[var(--pixel-gray-600)]',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer',
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || label || 'Toggle switch'}
      tabIndex={disabled ? -1 : 0}
      data-testid={testId}
      data-checked={checked}
      data-disabled={disabled}
      data-size={size}
    >
      {/* Thumb */}
      <div
        className={cn(
          'absolute top-[1px] left-[1px] bg-[var(--pixel-white)] transition-transform duration-150 flex-shrink-0',
          'motion-reduce:transition-none',
          sizeConfig.thumb,
          checked && sizeConfig.thumbTranslate,
        )}
        aria-hidden="true"
        data-testid={`${testId}-thumb`}
      />
    </div>
  );

  // If no label, return just the switch control
  if (!label) {
    return <div className={className}>{switchControl}</div>;
  }

  // With label and optional description
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="flex-shrink-0 pt-0.5">{switchControl}</div>
      <div className="flex flex-col min-w-0">
        <span
          className={cn(
            'font-[family-name:var(--font-pixel-body)] uppercase tracking-wider transition-colors',
            sizeConfig.label,
            disabled ? 'text-[var(--pixel-gray-500)]' : 'text-[var(--pixel-gray-300)]',
          )}
          data-testid={`${testId}-label`}
        >
          {label}
        </span>
        {description && (
          <span
            className={cn(
              'text-[var(--pixel-gray-500)] mt-1 leading-relaxed',
              sizeConfig.description,
            )}
            data-testid={`${testId}-description`}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}
