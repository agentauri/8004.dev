import { BookOpen, Cpu } from 'lucide-react';
import type React from 'react';
import type { TaxonomyType } from '@/lib/constants/oasf';
import { cn } from '@/lib/utils';

export interface TaxonomyBadgeProps {
  /** Type of taxonomy (skill or domain) */
  type: TaxonomyType;
  /** Display name for the badge */
  name: string;
  /** Visual variant */
  variant?: 'default' | 'outline';
  /** Whether to show the icon */
  showIcon?: boolean;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Optional additional class names */
  className?: string;
}

const TYPE_CONFIG = {
  skill: {
    colorClass: 'text-[var(--taxonomy-skill)] border-[var(--taxonomy-skill)]',
    bgClass: 'bg-[var(--taxonomy-skill)]/10',
    glowClass: 'shadow-[0_0_8px_var(--taxonomy-glow-skill)]',
    Icon: Cpu,
  },
  domain: {
    colorClass: 'text-[var(--taxonomy-domain)] border-[var(--taxonomy-domain)]',
    bgClass: 'bg-[var(--taxonomy-domain)]/10',
    glowClass: 'shadow-[0_0_8px_var(--taxonomy-glow-domain)]',
    Icon: BookOpen,
  },
};

/**
 * TaxonomyBadge displays a skill or domain category with type-specific colors and optional icon.
 *
 * @example
 * ```tsx
 * <TaxonomyBadge type="skill" name="Natural Language Processing" />
 * <TaxonomyBadge type="domain" name="Healthcare" variant="outline" showIcon />
 * ```
 */
export function TaxonomyBadge({
  type,
  name,
  variant = 'default',
  showIcon = false,
  size = 'sm',
  className,
}: TaxonomyBadgeProps): React.JSX.Element {
  const config = TYPE_CONFIG[type];
  const { Icon } = config;

  const isOutline = variant === 'outline';
  const isMedium = size === 'md';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        'font-[family-name:var(--font-pixel-body)]',
        'uppercase tracking-wider border',
        isMedium ? 'px-2 py-1 text-[0.625rem]' : 'px-1.5 py-0.5 text-[0.5rem]',
        config.colorClass,
        isOutline ? 'bg-transparent' : config.bgClass,
        !isOutline && config.glowClass,
        className,
      )}
      data-testid="taxonomy-badge"
      data-type={type}
      data-variant={variant}
    >
      {showIcon && <Icon size={isMedium ? 12 : 10} aria-hidden="true" />}
      <span className="truncate max-w-[150px]">{name}</span>
    </span>
  );
}
