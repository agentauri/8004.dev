/**
 * PaymentCost Molecule
 *
 * Displays the cost of a paid operation with USDC formatting.
 */

import { Coins } from 'lucide-react';
import type React from 'react';
import { UsdcAmount } from '@/components/atoms/usdc-amount';
import { cn } from '@/lib/utils';

export interface PaymentCostProps {
  /** Cost in USD */
  cost: number;
  /** Label for the operation */
  label?: string;
  /** Show icon */
  showIcon?: boolean;
  /** Layout variant */
  variant?: 'inline' | 'stacked';
  /** Additional CSS classes */
  className?: string;
}

/**
 * PaymentCost displays the cost of an operation with optional label.
 *
 * @example
 * ```tsx
 * <PaymentCost cost={0.05} label="Compose Team" />
 * ```
 */
export function PaymentCost({
  cost,
  label,
  showIcon = true,
  variant = 'inline',
  className,
}: PaymentCostProps): React.JSX.Element {
  if (variant === 'stacked') {
    return (
      <div className={cn('flex flex-col items-center gap-1', className)}>
        {showIcon && <Coins className="h-5 w-5 text-pixel-gold-coin" />}
        {label && <span className="text-xs text-pixel-gray-400">{label}</span>}
        <UsdcAmount amount={cost} showSymbol showToken size="lg" />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && <Coins className="h-4 w-4 text-pixel-gold-coin" />}
      {label && <span className="text-sm text-pixel-gray-400">{label}:</span>}
      <UsdcAmount amount={cost} showSymbol showToken />
    </div>
  );
}
