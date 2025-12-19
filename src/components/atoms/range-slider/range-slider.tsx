'use client';

import type React from 'react';
import { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface RangeSliderProps {
  /** Minimum value of the range */
  min: number;
  /** Maximum value of the range */
  max: number;
  /** Current minimum value */
  minValue: number;
  /** Current maximum value */
  maxValue: number;
  /** Callback when values change */
  onChange: (minValue: number, maxValue: number) => void;
  /** Step increment */
  step?: number;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Aria label for accessibility */
  ariaLabel?: string;
  /** Optional additional class names */
  className?: string;
}

/**
 * Clamps a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * RangeSlider provides a dual-handle slider for selecting a range of values.
 *
 * @example
 * ```tsx
 * <RangeSlider
 *   min={0}
 *   max={100}
 *   minValue={20}
 *   maxValue={80}
 *   onChange={(min, max) => setRange({ min, max })}
 * />
 * ```
 */
export function RangeSlider({
  min,
  max,
  minValue,
  maxValue,
  onChange,
  step = 1,
  disabled = false,
  ariaLabel,
  className,
}: RangeSliderProps): React.JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null);

  // Calculate percentage positions
  const range = max - min;
  const minPercent = ((minValue - min) / range) * 100;
  const maxPercent = ((maxValue - min) / range) * 100;

  // Convert position to value
  const _getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = (clientX - rect.left) / rect.width;
      const rawValue = min + percent * range;
      const steppedValue = Math.round(rawValue / step) * step;
      return clamp(steppedValue, min, max);
    },
    [min, max, range, step],
  );

  // Handle min thumb drag
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const newMin = clamp(value, min, maxValue - step);
    onChange(newMin, maxValue);
  };

  // Handle max thumb drag
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const newMax = clamp(value, minValue + step, max);
    onChange(minValue, newMax);
  };

  return (
    <div
      className={cn('relative w-full h-6', disabled && 'opacity-50', className)}
      data-testid="range-slider"
      data-min={minValue}
      data-max={maxValue}
      data-disabled={disabled}
      aria-label={ariaLabel || `Range slider from ${min} to ${max}`}
    >
      {/* Track background */}
      <div
        ref={trackRef}
        className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-[var(--pixel-gray-700)]"
      />

      {/* Active range */}
      <div
        className="absolute top-1/2 h-2 -translate-y-1/2 bg-[var(--pixel-blue-sky)]"
        style={{
          left: `${minPercent}%`,
          width: `${maxPercent - minPercent}%`,
        }}
        data-testid="active-range"
      />

      {/* Min input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        disabled={disabled}
        className={cn(
          'absolute top-0 left-0 w-full h-full appearance-none bg-transparent pointer-events-none',
          '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[var(--pixel-white)]',
          '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--pixel-blue-sky)]',
          '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_var(--glow-blue)]',
          '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none',
          '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[var(--pixel-white)]',
          '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--pixel-blue-sky)]',
          '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-[0_0_8px_var(--glow-blue)]',
          disabled &&
            '[&::-webkit-slider-thumb]:cursor-not-allowed [&::-moz-range-thumb]:cursor-not-allowed',
        )}
        aria-label="Minimum value"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={minValue}
        data-testid="min-thumb"
      />

      {/* Max input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        disabled={disabled}
        className={cn(
          'absolute top-0 left-0 w-full h-full appearance-none bg-transparent pointer-events-none',
          '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[var(--pixel-white)]',
          '[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--pixel-blue-sky)]',
          '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_var(--glow-blue)]',
          '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none',
          '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[var(--pixel-white)]',
          '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--pixel-blue-sky)]',
          '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-[0_0_8px_var(--glow-blue)]',
          disabled &&
            '[&::-webkit-slider-thumb]:cursor-not-allowed [&::-moz-range-thumb]:cursor-not-allowed',
        )}
        aria-label="Maximum value"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={maxValue}
        data-testid="max-thumb"
      />
    </div>
  );
}
