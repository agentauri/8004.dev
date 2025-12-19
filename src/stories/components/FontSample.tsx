import type { TypographyToken } from '../utils/design-tokens';

interface FontSampleProps {
  font: TypographyToken;
}

/**
 * Displays a typography sample with font info and example text.
 */
export function FontSample({ font }: FontSampleProps) {
  const getFontStyle = () => {
    switch (font.cssVar) {
      case '--font-pixel-display':
        return 'font-[family-name:var(--font-pixel-display)] text-xl';
      case '--font-pixel-heading':
        return 'font-[family-name:var(--font-pixel-heading)] text-lg';
      case '--font-pixel-body':
        return 'font-[family-name:var(--font-pixel-body)] text-base';
      default:
        return 'font-sans text-base';
    }
  };

  return (
    <div className="p-4 rounded bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-700)]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-white)]">
            {font.name}
          </h4>
          <div className="font-mono text-xs text-[var(--pixel-gray-400)]">{font.fontFamily}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs text-[var(--pixel-blue-sky)]">var({font.cssVar})</div>
          <div className="text-xs text-[var(--pixel-gray-500)]">{font.usage}</div>
        </div>
      </div>

      <div
        className={`${getFontStyle()} text-[var(--pixel-white)] py-3 border-t border-[var(--pixel-gray-700)]`}
      >
        {font.sampleText}
      </div>

      {/* Character showcase */}
      <div className={`${getFontStyle()} text-[var(--pixel-gray-400)] text-sm mt-2`}>
        ABCDEFGHIJKLMNOPQRSTUVWXYZ
        <br />
        abcdefghijklmnopqrstuvwxyz
        <br />
        0123456789 !@#$%^&*()
      </div>
    </div>
  );
}

interface FontGridProps {
  fonts: TypographyToken[];
}

/**
 * Displays a list of font samples.
 */
export function FontGrid({ fonts }: FontGridProps) {
  return (
    <div className="space-y-4">
      {fonts.map((font) => (
        <FontSample key={font.cssVar} font={font} />
      ))}
    </div>
  );
}
