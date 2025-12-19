import { cn } from '@/lib/utils';
import type { ColorToken } from '../utils/design-tokens';

interface ColorSwatchProps {
  color: ColorToken;
  showCssVar?: boolean;
}

/**
 * Displays a single color token with its name, value, and CSS variable.
 */
export function ColorSwatch({ color, showCssVar = true }: ColorSwatchProps) {
  const isGlow = color.category === 'glow';

  return (
    <div className="flex items-center gap-3 p-2 rounded bg-[var(--pixel-gray-800)]">
      <div
        className={cn(
          'w-12 h-12 rounded border-2 border-[var(--pixel-gray-600)]',
          isGlow && 'shadow-lg',
        )}
        style={{
          backgroundColor: color.value,
          boxShadow: isGlow ? `0 0 20px ${color.value}` : undefined,
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-white)]">
          {color.name}
        </div>
        <div className="font-mono text-xs text-[var(--pixel-gray-400)]">{color.value}</div>
        {showCssVar && (
          <div className="font-mono text-xs text-[var(--pixel-blue-sky)] truncate">
            var({color.cssVar})
          </div>
        )}
      </div>
    </div>
  );
}

interface ColorGridProps {
  colors: ColorToken[];
  title?: string;
}

/**
 * Displays a grid of color swatches.
 */
export function ColorGrid({ colors, title }: ColorGridProps) {
  return (
    <div className="space-y-3">
      {title && (
        <h3 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-200)] uppercase">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {colors.map((color) => (
          <ColorSwatch key={color.cssVar} color={color} />
        ))}
      </div>
    </div>
  );
}
