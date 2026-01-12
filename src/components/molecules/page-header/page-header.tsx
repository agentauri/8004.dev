import type { LucideIcon } from 'lucide-react';
import type { JSX, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Glow color variants for the page header
 */
export type PageHeaderGlow = 'blue' | 'gold' | 'green';

/**
 * Text alignment options for the page header
 */
export type PageHeaderAlign = 'left' | 'center';

export interface PageHeaderProps {
  /** Page title (will be displayed in UPPERCASE) */
  title: string;
  /** Optional description below the title */
  description?: string;
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Glow effect color (default: 'blue') */
  glow?: PageHeaderGlow;
  /** Text alignment (default: 'left') */
  align?: PageHeaderAlign;
  /** Optional action element (button, link, etc.) rendered on the right */
  action?: ReactNode;
  /** Optional additional class names */
  className?: string;
  /** Optional test ID for testing (default: 'page-header') */
  testId?: string;
}

/**
 * Icon color classes matching each color variant
 */
const iconColorClasses: Record<PageHeaderGlow, string> = {
  blue: 'text-[var(--pixel-blue-sky)]',
  gold: 'text-[var(--pixel-gold-coin)]',
  green: 'text-[var(--pixel-green-pipe)]',
};

/**
 * PageHeader displays a standardized header section for pages.
 *
 * Features:
 * - UPPERCASE title with pixel font
 * - Icon with color matching the selected variant
 * - Optional description with uppercase styling
 * - Optional action button/element
 * - Left or center alignment
 *
 * @example Basic usage
 * ```tsx
 * <PageHeader
 *   title="Leaderboard"
 *   description="Top agents ranked by reputation score."
 *   icon={Trophy}
 *   glow="gold"
 * />
 * ```
 *
 * @example With action button
 * ```tsx
 * <PageHeader
 *   title="Evaluations"
 *   description="Agent benchmark results."
 *   icon={FlaskConical}
 *   glow="blue"
 *   action={<Button>+ New Evaluation</Button>}
 * />
 * ```
 *
 * @example Centered alignment
 * ```tsx
 * <PageHeader
 *   title="Team Composer"
 *   description="Build the perfect agent team."
 *   icon={Users}
 *   glow="gold"
 *   align="center"
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  icon: Icon,
  glow = 'blue',
  align = 'left',
  action,
  className,
  testId = 'page-header',
}: PageHeaderProps): JSX.Element {
  const isCentered = align === 'center';

  return (
    <header className={cn(isCentered && 'text-center', className)} data-testid={testId}>
      {/* Title row with icon and optional action */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center gap-4',
          isCentered ? 'md:justify-center' : 'md:justify-between',
        )}
      >
        <div className={cn('flex items-center gap-3', isCentered && 'justify-center')}>
          <Icon
            className={cn('w-8 h-8 shrink-0', iconColorClasses[glow])}
            aria-hidden="true"
            data-testid={`${testId}-icon`}
          />
          <h1
            className={cn(
              'font-[family-name:var(--font-pixel-display)]',
              'text-2xl md:text-3xl text-[var(--pixel-gray-100)]',
              'uppercase tracking-wider',
            )}
            data-testid={`${testId}-title`}
          >
            {title}
          </h1>
        </div>

        {action && (
          <div className="shrink-0" data-testid={`${testId}-action`}>
            {action}
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p
          className={cn(
            'font-[family-name:var(--font-pixel-body)]',
            'text-xs text-[var(--pixel-gray-400)]',
            'mt-2 uppercase tracking-wider',
            !isCentered && 'max-w-2xl',
          )}
          data-testid={`${testId}-description`}
        >
          {description}
        </p>
      )}
    </header>
  );
}
