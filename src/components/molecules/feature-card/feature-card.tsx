import Link from 'next/link';
import type React from 'react';
import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Link destination */
  href: string;
  /** Optional glow color variant */
  glowColor?: 'blue' | 'gold' | 'green' | 'red';
  /** Optional additional class names */
  className?: string;
}

const GLOW_COLORS = {
  blue: {
    icon: 'text-[var(--pixel-blue-sky)]',
    border: 'hover:border-[var(--pixel-blue-sky)]',
    shadow: 'hover:shadow-[0_0_16px_var(--glow-blue)]',
  },
  gold: {
    icon: 'text-[var(--pixel-gold-coin)]',
    border: 'hover:border-[var(--pixel-gold-coin)]',
    shadow: 'hover:shadow-[0_0_16px_var(--glow-gold)]',
  },
  green: {
    icon: 'text-[var(--pixel-green-pipe)]',
    border: 'hover:border-[var(--pixel-green-pipe)]',
    shadow: 'hover:shadow-[0_0_16px_var(--glow-green)]',
  },
  red: {
    icon: 'text-[var(--pixel-red-fire)]',
    border: 'hover:border-[var(--pixel-red-fire)]',
    shadow: 'hover:shadow-[0_0_16px_var(--glow-red)]',
  },
};

/**
 * FeatureCard displays a feature highlight with an icon, title, and description.
 * Links to a feature page with hover glow effects in the retro pixel art style.
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={<ZapIcon className="w-6 h-6" />}
 *   title="Streaming Search"
 *   description="Real-time results as they're found"
 *   href="/explore"
 *   glowColor="blue"
 * />
 * ```
 */
export const FeatureCard = memo(function FeatureCard({
  icon,
  title,
  description,
  href,
  glowColor = 'blue',
  className,
}: FeatureCardProps): React.JSX.Element {
  const colors = GLOW_COLORS[glowColor];

  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col p-5 border-2 transition-all bg-[var(--pixel-gray-dark)]',
        'hover:translate-y-[-2px]',
        'border-[var(--pixel-gray-700)]',
        colors.border,
        colors.shadow,
        className,
      )}
      data-testid="feature-card"
      data-href={href}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-10 h-10 flex items-center justify-center mb-4',
          'border-2 border-[var(--pixel-gray-700)]',
          'bg-[var(--pixel-gray-800)]',
          'group-hover:border-current transition-colors',
          colors.icon,
        )}
        data-testid="feature-card-icon"
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)] text-sm md:text-base mb-2 uppercase"
        data-testid="feature-card-title"
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-[var(--pixel-gray-400)] text-sm leading-relaxed"
        data-testid="feature-card-description"
      >
        {description}
      </p>

      {/* Arrow indicator */}
      <div className="mt-auto pt-4">
        <span
          className={cn(
            'text-[var(--pixel-gray-500)] group-hover:translate-x-1 transition-transform inline-block',
            `group-hover:${colors.icon}`,
          )}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
});
