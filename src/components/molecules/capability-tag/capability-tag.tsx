import { Cpu, CreditCard, type LucideIcon, MessageSquare, Zap } from 'lucide-react';
import type React from 'react';
import { Badge } from '@/components/atoms';
import { cn } from '@/lib/utils';

export type CapabilityType = 'mcp' | 'a2a' | 'x402' | 'custom';

export interface CapabilityTagProps {
  /** Type of capability */
  type: CapabilityType;
  /** Custom label (required for custom type) */
  label?: string;
  /** Whether the tag is interactive/clickable */
  interactive?: boolean;
  /** Whether this capability is selected/active */
  selected?: boolean;
  /** Click handler for interactive mode */
  onClick?: () => void;
  /** Optional additional class names */
  className?: string;
}

interface CapabilityConfig {
  label: string;
  icon: LucideIcon;
  description: string;
}

const CAPABILITY_CONFIG: Record<Exclude<CapabilityType, 'custom'>, CapabilityConfig> = {
  mcp: {
    label: 'MCP',
    icon: Cpu,
    description: 'Model Context Protocol',
  },
  a2a: {
    label: 'A2A',
    icon: MessageSquare,
    description: 'Agent-to-Agent Protocol',
  },
  x402: {
    label: 'x402',
    icon: CreditCard,
    description: 'Payment Protocol',
  },
};

/**
 * CapabilityTag displays a capability badge with icon for agent protocols.
 *
 * @example
 * ```tsx
 * <CapabilityTag type="mcp" />
 * <CapabilityTag type="a2a" interactive selected onClick={handleClick} />
 * <CapabilityTag type="custom" label="GraphQL" />
 * ```
 */
export function CapabilityTag({
  type,
  label,
  interactive = false,
  selected = false,
  onClick,
  className,
}: CapabilityTagProps): React.JSX.Element {
  const isCustom = type === 'custom';
  const config = isCustom ? null : CAPABILITY_CONFIG[type];
  const displayLabel = label || config?.label || 'Unknown';
  const Icon = config?.icon || Zap;
  const description = config?.description || displayLabel;

  const handleClick = () => {
    if (interactive && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (interactive && onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Badge
      variant={selected ? 'default' : 'secondary'}
      className={cn(
        'gap-1.5 font-[family-name:var(--font-pixel-body)] text-[0.625rem]',
        interactive && 'cursor-pointer hover:bg-[var(--pixel-gray-600)] transition-colors',
        selected && 'bg-[var(--pixel-primary)] text-white',
        className,
      )}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      aria-pressed={interactive ? selected : undefined}
      title={description}
      data-testid="capability-tag"
      data-type={type}
      data-selected={selected}
    >
      <Icon size={12} aria-hidden="true" />
      <span>{displayLabel}</span>
    </Badge>
  );
}
