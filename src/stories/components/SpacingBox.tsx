import type { SpacingToken } from '../utils/design-tokens';

interface SpacingBoxProps {
  spacing: SpacingToken;
}

/**
 * Displays a spacing token visualization.
 */
export function SpacingBox({ spacing }: SpacingBoxProps) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="bg-[var(--pixel-blue-sky)] h-6"
        style={{ width: `${spacing.pixels}px`, minWidth: spacing.pixels > 0 ? '4px' : '2px' }}
      />
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-[var(--pixel-white)] w-8">{spacing.name}</span>
        <span className="font-mono text-xs text-[var(--pixel-gray-400)]">{spacing.value}</span>
        <span className="font-mono text-xs text-[var(--pixel-gray-500)]">{spacing.pixels}px</span>
      </div>
    </div>
  );
}

interface SpacingScaleProps {
  spacings: SpacingToken[];
}

/**
 * Displays the full spacing scale.
 */
export function SpacingScale({ spacings }: SpacingScaleProps) {
  return (
    <div className="space-y-3 p-4 bg-[var(--pixel-gray-800)] rounded border border-[var(--pixel-gray-700)]">
      {spacings.map((spacing) => (
        <SpacingBox key={spacing.name} spacing={spacing} />
      ))}
    </div>
  );
}
