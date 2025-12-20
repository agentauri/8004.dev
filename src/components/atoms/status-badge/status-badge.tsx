import type React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 'active' | 'inactive' | 'verified' | 'mcp' | 'a2a' | 'x402' | 'trust';

export interface StatusBadgeProps {
  /** The status type to display */
  status: StatusType;
  /** Optional additional class names */
  className?: string;
}

const STATUS_CONFIG: Record<
  StatusType,
  { label: string; colorClass: string; glowClass: string; bgClass: string; animate?: boolean }
> = {
  active: {
    label: 'ACTIVE',
    colorClass: 'text-[var(--status-active)]',
    glowClass: 'shadow-[0_0_6px_var(--glow-green)]',
    bgClass: 'bg-[rgba(0,216,0,0.1)]',
  },
  inactive: {
    label: 'INACTIVE',
    colorClass: 'text-[var(--status-inactive)]',
    glowClass: '',
    bgClass: 'bg-[rgba(136,136,136,0.1)]',
  },
  verified: {
    label: 'VERIFIED',
    colorClass: 'text-[var(--status-verified)]',
    glowClass: 'shadow-[0_0_6px_var(--glow-green)]',
    bgClass: 'bg-[rgba(0,255,0,0.1)]',
  },
  mcp: {
    label: 'MCP',
    colorClass: 'text-[var(--pixel-blue-text)]',
    glowClass: 'shadow-[0_0_6px_var(--glow-blue-text)]',
    bgClass: 'bg-[rgba(107,163,255,0.1)]',
  },
  a2a: {
    label: 'A2A',
    colorClass: 'text-[var(--pixel-gold-coin)]',
    glowClass: 'shadow-[0_0_6px_var(--glow-gold)]',
    bgClass: 'bg-[rgba(252,192,60,0.1)]',
  },
  x402: {
    label: 'x402',
    colorClass: 'text-[var(--pixel-emerald)]',
    glowClass: 'shadow-[0_0_6px_var(--glow-green)]',
    bgClass: 'bg-[rgba(0,255,0,0.1)]',
  },
  trust: {
    label: 'TRUST',
    colorClass: 'text-[var(--pixel-purple)]',
    glowClass: 'shadow-[0_0_6px_var(--glow-purple)]',
    bgClass: 'bg-[rgba(156,84,252,0.1)]',
  },
};

/**
 * StatusBadge displays a status indicator with appropriate styling and glow effects.
 *
 * @example
 * ```tsx
 * <StatusBadge status="active" />
 * <StatusBadge status="mcp" />
 * <StatusBadge status="verified" />
 * ```
 */
export function StatusBadge({ status, className }: StatusBadgeProps): React.JSX.Element {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'badge-pixel',
        config.colorClass,
        config.glowClass,
        config.bgClass,
        config.animate && 'animate-glow-pulse',
        className,
      )}
      data-testid="status-badge"
      data-status={status}
    >
      {status === 'active' && (
        <span className="w-2 h-2 rounded-full bg-current" aria-hidden="true" />
      )}
      {config.label}
    </span>
  );
}
