import type React from 'react';
import { cn } from '@/lib/utils';
import styles from './mascot.module.css';
import type { MascotAnimation, MascotSize } from './mascot-config';
import { SIZE_MAP } from './mascot-config';
import { MascotSVG } from './mascot-svg';

// Re-export types for consumers
export type { MascotAnimation, MascotSize } from './mascot-config';

export interface AgentMascotProps {
  /** Size of the mascot sprite */
  size?: MascotSize;
  /** Animation type to apply */
  animation?: MascotAnimation;
  /** Optional additional class names */
  className?: string;
}

// Helper to safely access CSS module classes (handles undefined in some build environments)
function getAnimationClass(animation: MascotAnimation): string {
  if (!styles) return '';
  const classMap: Record<MascotAnimation, string | undefined> = {
    none: '',
    float: styles.animateFloat,
    blink: styles.animateBlink,
    bounce: styles.animateBounce,
    pulse: styles.animatePulse,
    walk: styles.animateWalk,
    wave: styles.animateWave,
    dance: styles.animateDance,
    glitch: styles.animateGlitch,
    spin: styles.animateSpin,
    celebrate: styles.animateCelebrate,
  };
  return classMap[animation] ?? '';
}

/**
 * AgentMascot displays a pixel art mascot character in the style of 80s retro games.
 * The "Agent Pixel" design features a humanoid figure with VR visor, blue jacket, and 8004 badge.
 *
 * @example
 * ```tsx
 * <AgentMascot size="md" />
 * <AgentMascot size="lg" animation="bounce" />
 * <AgentMascot animation="blink" />
 * ```
 */
export function AgentMascot({
  size = 'md',
  animation = 'none',
  className,
}: AgentMascotProps): React.JSX.Element {
  const sizeConfig = SIZE_MAP[size];
  const animationClass = getAnimationClass(animation);

  return (
    <div
      className={cn(sizeConfig.className, animationClass, 'relative', className)}
      data-testid="agent-mascot"
      data-size={size}
      data-animation={animation}
    >
      <MascotSVG animation={animation} />
    </div>
  );
}
