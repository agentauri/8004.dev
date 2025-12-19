import type React from 'react';
import { cn } from '@/lib/utils';
import styles from './clippy.module.css';
import { ClippyBody } from './clippy-body';
import type { ClippyAnimation, ClippyMood, ClippySize } from './clippy-config';
import { SIZE_MAP } from './clippy-config';
import { ClippyEyes } from './clippy-eyes';

// Re-export types for consumers
export type { ClippyAnimation, ClippyMood, ClippySize } from './clippy-config';

export interface PixelClippyProps {
  /** Size of the clippy */
  size?: ClippySize;
  /** Current mood/expression */
  mood?: ClippyMood;
  /** Speech bubble text (optional) */
  message?: string;
  /** Animation */
  animation?: ClippyAnimation;
  /** Click handler */
  onClick?: () => void;
  /** Additional className */
  className?: string;
  /** Test ID */
  testId?: string;
}

// Helper to safely access CSS module classes (handles undefined in some build environments)
function getAnimationClass(animation: ClippyAnimation): string {
  if (!styles) return '';
  const classMap: Record<ClippyAnimation, string | undefined> = {
    none: '',
    float: styles.animateFloat,
    bounce: styles.animateBounce,
    wiggle: styles.animateWiggle,
    wave: styles.animateWave,
  };
  return classMap[animation] ?? '';
}

/**
 * PixelClippy displays a pixel art paperclip assistant character inspired by Clippy.
 * Features different moods, animations, and optional speech bubbles.
 *
 * @example
 * ```tsx
 * <PixelClippy size="md" mood="happy" />
 * <PixelClippy animation="float" message="Need help?" />
 * ```
 */
export function PixelClippy({
  size = 'md',
  mood = 'idle',
  message,
  animation = 'none',
  onClick,
  className,
  testId = 'pixel-clippy',
}: PixelClippyProps): React.JSX.Element {
  const sizeConfig = SIZE_MAP[size];
  const animationClass = getAnimationClass(animation);

  return (
    <div
      className={cn(
        'relative inline-block',
        animationClass,
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-testid={testId}
      data-size={size}
      data-mood={mood}
      data-animation={animation}
    >
      {/* Speech bubble */}
      {message && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap
            bg-[var(--pixel-white)] text-[var(--pixel-black)] border-2 border-[var(--pixel-black)] px-2 py-1
            font-[family-name:var(--font-pixel-body)] text-[0.5rem] uppercase tracking-wide
            before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2
            before:border-4 before:border-transparent before:border-t-[var(--pixel-black)]
            after:content-[''] after:absolute after:top-[calc(100%-2px)] after:left-1/2 after:-translate-x-1/2
            after:border-4 after:border-transparent after:border-t-[var(--pixel-white)]"
          data-testid={`${testId}-message`}
        >
          {message}
        </div>
      )}

      {/* Clippy SVG */}
      <svg
        viewBox="0 0 30 96"
        className={sizeConfig.className}
        style={{ imageRendering: 'auto', overflow: 'visible' }}
        aria-label={`Clippy assistant ${mood} mood`}
        role="img"
      >
        <ClippyBody />
        <ClippyEyes mood={mood} />
      </svg>
    </div>
  );
}
