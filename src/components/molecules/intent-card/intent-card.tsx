import type React from 'react';
import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { IntentTemplate } from '@/types';

export interface IntentCardProps {
  /** Intent template data */
  template: IntentTemplate;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * Get category color classes based on category name
 */
function getCategoryColor(category: string): {
  bg: string;
  text: string;
  glow: string;
} {
  const categoryLower = category.toLowerCase();

  if (categoryLower.includes('automation') || categoryLower.includes('auto')) {
    return {
      bg: 'bg-[var(--pixel-green-pipe)]/20',
      text: 'text-[var(--pixel-green-pipe)]',
      glow: 'shadow-[0_0_8px_var(--glow-green)]',
    };
  }
  if (categoryLower.includes('development') || categoryLower.includes('dev')) {
    return {
      bg: 'bg-[var(--pixel-blue-sky)]/20',
      text: 'text-[var(--pixel-blue-sky)]',
      glow: 'shadow-[0_0_8px_var(--glow-blue)]',
    };
  }
  if (categoryLower.includes('security') || categoryLower.includes('audit')) {
    return {
      bg: 'bg-[var(--pixel-red-fire)]/20',
      text: 'text-[var(--pixel-red-fire)]',
      glow: 'shadow-[0_0_8px_var(--glow-red)]',
    };
  }
  if (categoryLower.includes('analysis') || categoryLower.includes('data')) {
    return {
      bg: 'bg-[var(--pixel-gold-coin)]/20',
      text: 'text-[var(--pixel-gold-coin)]',
      glow: 'shadow-[0_0_8px_var(--glow-gold)]',
    };
  }

  // Default purple for other categories
  return {
    bg: 'bg-[#9C54FC]/20',
    text: 'text-[#9C54FC]',
    glow: 'shadow-[0_0_8px_rgba(156,84,252,0.5)]',
  };
}

/**
 * IntentCard displays a summary card for an intent template.
 * Shows the template name, description, category, number of steps, and required roles.
 *
 * @example
 * ```tsx
 * <IntentCard
 *   template={{
 *     id: 'code-review',
 *     name: 'Code Review Workflow',
 *     description: 'Automated code review with AI agents',
 *     category: 'development',
 *     steps: [...],
 *     requiredRoles: ['analyzer', 'reviewer'],
 *   }}
 *   onClick={() => router.push('/intents/code-review')}
 * />
 * ```
 */
export const IntentCard = memo(function IntentCard({
  template,
  onClick,
  className,
}: IntentCardProps): React.JSX.Element {
  const categoryColors = getCategoryColor(template.category);
  const stepCount = template.steps.length;

  const cardContent = (
    <>
      {/* Header with category badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className={cn(
            'px-2 py-0.5 text-[0.625rem] uppercase tracking-wider font-[family-name:var(--font-pixel-body)]',
            categoryColors.bg,
            categoryColors.text,
          )}
          data-testid="intent-category-badge"
        >
          {template.category}
        </span>
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]',
          )}
          data-testid="intent-steps-count"
        >
          <span className="font-[family-name:var(--font-pixel-body)] text-[0.625rem] text-[var(--pixel-gray-400)] uppercase">
            Steps:
          </span>
          <span className="font-[family-name:var(--font-pixel-display)] text-sm text-[var(--pixel-gray-100)] tabular-nums">
            {stepCount}
          </span>
        </div>
      </div>

      {/* Template name */}
      <h3
        className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)] text-sm md:text-base mb-2"
        data-testid="intent-name"
      >
        {template.name}
      </h3>

      {/* Description */}
      {template.description && (
        <p
          className="text-[var(--pixel-gray-400)] text-sm line-clamp-2 mb-4"
          data-testid="intent-description"
        >
          {template.description}
        </p>
      )}

      {/* Required roles */}
      <div className="mt-auto">
        <span className="font-[family-name:var(--font-pixel-body)] text-[0.5rem] uppercase tracking-wider text-[var(--pixel-gray-500)] block mb-2">
          Required Roles
        </span>
        <div className="flex flex-wrap gap-1.5" data-testid="intent-roles">
          {template.requiredRoles.slice(0, 4).map((role) => (
            <span
              key={role}
              className="px-2 py-0.5 text-[0.625rem] bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)] text-[var(--pixel-gray-300)] font-mono uppercase"
            >
              {role}
            </span>
          ))}
          {template.requiredRoles.length > 4 && (
            <span className="px-2 py-0.5 text-[0.625rem] text-[var(--pixel-gray-500)] font-mono">
              +{template.requiredRoles.length - 4} more
            </span>
          )}
        </div>
      </div>
    </>
  );

  const cardClasses = cn(
    'flex flex-col p-4 border-2 transition-all cursor-pointer bg-[var(--pixel-gray-dark)] min-h-[180px]',
    'hover:translate-y-[-2px] hover:border-[var(--pixel-blue-sky)]',
    'hover:shadow-[0_0_12px_var(--glow-blue)]',
    'border-[var(--pixel-gray-700)]',
    className,
  );

  if (onClick) {
    return (
      <div
        className={cardClasses}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        data-testid="intent-card"
        data-intent-id={template.id}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div className={cardClasses} data-testid="intent-card" data-intent-id={template.id}>
      {cardContent}
    </div>
  );
});
