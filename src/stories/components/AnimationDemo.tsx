import { cn } from '@/lib/utils';
import type { AnimationToken } from '../utils/design-tokens';

interface AnimationDemoProps {
  animation: AnimationToken;
}

/**
 * Demonstrates an animation token with a preview.
 */
export function AnimationDemo({ animation }: AnimationDemoProps) {
  return (
    <div className="p-4 bg-[var(--pixel-gray-800)] rounded border border-[var(--pixel-gray-700)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-white)]">
            {animation.name}
          </h4>
          <div className="font-mono text-xs text-[var(--pixel-gray-400)]">{animation.cssClass}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--pixel-gray-500)]">
            {animation.duration} {animation.timing}
          </div>
        </div>
      </div>

      <p className="text-xs text-[var(--pixel-gray-400)] mb-4">{animation.description}</p>

      {/* Animation preview */}
      <div className="flex items-center justify-center h-20 border border-[var(--pixel-gray-600)] rounded">
        <div
          className={cn(
            'w-12 h-12 bg-[var(--pixel-blue-sky)] rounded',
            animation.cssClass === 'animate-pulse-glow' &&
              'animate-pulse shadow-[0_0_20px_var(--glow-blue)]',
            animation.cssClass === 'animate-blink' && 'animate-pulse',
            animation.cssClass === 'animate-fade-in' && 'animate-pulse opacity-50',
            animation.cssClass === 'animate-slide-up' && 'animate-bounce',
          )}
        />
      </div>
    </div>
  );
}

interface AnimationGridProps {
  animations: AnimationToken[];
}

/**
 * Displays a grid of animation demos.
 */
export function AnimationGrid({ animations }: AnimationGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {animations.map((animation) => (
        <AnimationDemo key={animation.name} animation={animation} />
      ))}
    </div>
  );
}
