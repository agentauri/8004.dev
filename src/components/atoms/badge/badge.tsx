import type React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Badge content */
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--pixel-primary)] text-white border-[var(--pixel-primary)]',
  secondary:
    'bg-[var(--pixel-gray-700)] text-[var(--pixel-gray-300)] border-[var(--pixel-gray-600)]',
  destructive: 'bg-[var(--pixel-destructive)] text-white border-[var(--pixel-destructive)]',
  outline: 'bg-transparent text-[var(--pixel-gray-300)] border-[var(--pixel-gray-500)]',
};

/**
 * Badge displays a small label or status indicator.
 *
 * @example
 * ```tsx
 * <Badge variant="default">Active</Badge>
 * <Badge variant="secondary">Pending</Badge>
 * ```
 */
export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 text-xs font-medium border',
        'font-[family-name:var(--font-pixel-body)]',
        variantStyles[variant],
        className,
      )}
      data-testid="badge"
      data-variant={variant}
      {...props}
    >
      {children}
    </span>
  );
}
