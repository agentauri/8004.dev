import Link from 'next/link';
import type React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  /** Section title text */
  title: string;
  /** Optional icon to display before the title */
  icon?: React.ReactNode;
  /** Optional link URL for "View all" / "Browse all" action */
  actionHref?: string;
  /** Optional link text (defaults to "View all") */
  actionText?: string;
  /** Optional test ID for action link */
  actionTestId?: string;
  /** Optional additional content to render in the header (e.g., period selector) */
  children?: React.ReactNode;
  /** Optional additional class names */
  className?: string;
}

/**
 * SectionHeader provides consistent styling for homepage section titles.
 *
 * Features:
 * - UPPERCASE title with pixel-heading font
 * - Optional icon before title
 * - Optional "View all" link on the right
 * - Optional children for additional controls
 *
 * @example
 * ```tsx
 * // Simple header
 * <SectionHeader title="Recent Evaluations" />
 *
 * // With icon and action link
 * <SectionHeader
 *   title="Trending Agents"
 *   icon={<Flame className="w-5 h-5" />}
 *   actionHref="/trending"
 *   actionText="View all"
 * />
 *
 * // With custom children (e.g., period selector)
 * <SectionHeader title="Trending Agents" icon={<Flame />}>
 *   <PeriodSelector value={period} onChange={setPeriod} />
 * </SectionHeader>
 * ```
 */
export function SectionHeader({
  title,
  icon,
  actionHref,
  actionText = 'View all',
  actionTestId,
  children,
  className,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-[var(--pixel-gray-400)]" aria-hidden="true">
            {icon}
          </span>
        )}
        <h2 className="font-[family-name:var(--font-pixel-heading)] text-lg md:text-xl text-[var(--pixel-gray-100)] uppercase">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {children}
        {actionHref && (
          <Link
            href={actionHref}
            className="text-[var(--pixel-blue-sky)] text-sm hover:underline whitespace-nowrap"
            data-testid={actionTestId}
          >
            {actionText}
          </Link>
        )}
      </div>
    </div>
  );
}
