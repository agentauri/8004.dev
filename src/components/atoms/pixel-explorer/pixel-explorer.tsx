import type React from 'react';
import { cn } from '@/lib/utils';
import styles from './explorer.module.css';
import type { ExplorerAnimation, ExplorerSize } from './explorer-config';
import { SIZE_MAP } from './explorer-config';
import { ExplorerSVG } from './explorer-svg';

// Re-export types for consumers
export type { ExplorerAnimation, ExplorerSize } from './explorer-config';

export interface PixelExplorerProps {
  /** Size of the explorer sprite */
  size?: ExplorerSize;
  /** Animation type to apply */
  animation?: ExplorerAnimation;
  /** Optional additional class names */
  className?: string;
}

// Helper to safely access CSS module classes (handles undefined in some build environments)
function getAnimationClass(animation: ExplorerAnimation): string {
  if (!styles) return '';
  const classMap: Record<ExplorerAnimation, string | undefined> = {
    none: '',
    float: styles.animateFloat,
    bounce: styles.animateBounce,
    walk: styles.animateWalk,
    search: styles.animateSearch,
    discover: styles.animateDiscover,
  };
  return classMap[animation] ?? '';
}

/**
 * PixelExplorer displays a classic explorer character in Indiana Jones style.
 * Features a hat-wearing adventurer with beard and brown explorer outfit.
 * 32x40 pixel art in authentic 16-bit retro style.
 *
 * @example
 * ```tsx
 * <PixelExplorer size="md" />
 * <PixelExplorer size="lg" animation="float" />
 * <PixelExplorer animation="bounce" />
 * ```
 */
export function PixelExplorer({
  size = 'md',
  animation = 'none',
  className,
}: PixelExplorerProps): React.JSX.Element {
  const sizeConfig = SIZE_MAP[size];
  const animationClass = getAnimationClass(animation);

  return (
    <div
      className={cn(sizeConfig.className, animationClass, 'relative', className)}
      data-testid="pixel-explorer"
      data-size={size}
      data-animation={animation}
    >
      <ExplorerSVG animation={animation} />
    </div>
  );
}
