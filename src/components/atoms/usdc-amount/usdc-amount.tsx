/**
 * UsdcAmount Atom
 *
 * Displays USDC amounts with proper formatting and optional USD symbol.
 */

import type React from 'react';
import { cn } from '@/lib/utils';

export interface UsdcAmountProps {
  /** Amount in USD (e.g., 0.05 for $0.05) */
  amount: number;
  /** Show USD symbol prefix */
  showSymbol?: boolean;
  /** Show "USDC" suffix */
  showToken?: boolean;
  /** Text size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

/**
 * Formats a USD amount to a string with proper decimal places
 * Removes trailing zeros for cleaner display
 */
function formatAmount(amount: number): string {
  // For amounts less than 0.01, show more precision
  if (amount < 0.01 && amount > 0) {
    return amount.toFixed(6).replace(/\.?0+$/, '');
  }
  // Standard display with 2 decimal places
  return amount.toFixed(2);
}

/**
 * UsdcAmount displays USDC amounts with consistent formatting.
 *
 * @example
 * ```tsx
 * <UsdcAmount amount={0.05} showSymbol showToken />
 * // Renders: "$0.05 USDC"
 *
 * <UsdcAmount amount={1.5} />
 * // Renders: "1.50"
 * ```
 */
export function UsdcAmount({
  amount,
  showSymbol = false,
  showToken = false,
  size = 'md',
  className,
}: UsdcAmountProps): React.JSX.Element {
  const formattedAmount = formatAmount(amount);

  return (
    <span
      className={cn('font-mono tabular-nums text-pixel-green-pipe', sizeClasses[size], className)}
    >
      {showSymbol && '$'}
      {formattedAmount}
      {showToken && <span className="ml-1 text-pixel-gray-400">USDC</span>}
    </span>
  );
}
