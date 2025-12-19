/**
 * Design tokens extracted from the 80s Retro Pixel Art design system.
 * These are used by Storybook documentation components.
 */

export interface ColorToken {
  name: string;
  cssVar: string;
  value: string;
  description: string;
  category: 'primary' | 'dark' | 'chain' | 'glow';
}

export interface TypographyToken {
  name: string;
  fontFamily: string;
  cssVar: string;
  usage: string;
  sampleText: string;
}

export interface SpacingToken {
  name: string;
  value: string;
  pixels: number;
}

export interface AnimationToken {
  name: string;
  cssClass: string;
  duration: string;
  timing: string;
  description: string;
}

/**
 * Primary and accent colors from the NES/Sega inspired palette.
 */
export const COLOR_TOKENS: ColorToken[] = [
  // Primary Colors
  {
    name: 'Blue Sky',
    cssVar: '--pixel-blue-sky',
    value: '#5C94FC',
    description: 'Primary action - Mario sky blue',
    category: 'primary',
  },
  {
    name: 'Red Fire',
    cssVar: '--pixel-red-fire',
    value: '#FC5454',
    description: 'Error/danger states',
    category: 'primary',
  },
  {
    name: 'Green Pipe',
    cssVar: '--pixel-green-pipe',
    value: '#00D800',
    description: 'Success states',
    category: 'primary',
  },
  {
    name: 'Gold Coin',
    cssVar: '--pixel-gold-coin',
    value: '#FCC03C',
    description: 'Highlight/premium',
    category: 'primary',
  },

  // Dark Theme Base
  {
    name: 'Black',
    cssVar: '--pixel-black',
    value: '#000000',
    description: 'Pure black background',
    category: 'dark',
  },
  {
    name: 'Gray Dark',
    cssVar: '--pixel-gray-dark',
    value: '#1A1A1A',
    description: 'Card backgrounds',
    category: 'dark',
  },
  {
    name: 'Gray 800',
    cssVar: '--pixel-gray-800',
    value: '#2A2A2A',
    description: 'Elevated surfaces',
    category: 'dark',
  },
  {
    name: 'Gray 700',
    cssVar: '--pixel-gray-700',
    value: '#3A3A3A',
    description: 'Borders',
    category: 'dark',
  },
  {
    name: 'Gray 600',
    cssVar: '--pixel-gray-600',
    value: '#4A4A4A',
    description: 'Disabled states',
    category: 'dark',
  },
  {
    name: 'Gray 500',
    cssVar: '--pixel-gray-500',
    value: '#6A6A6A',
    description: 'Muted text',
    category: 'dark',
  },
  {
    name: 'Gray 400',
    cssVar: '--pixel-gray-400',
    value: '#9A9A9A',
    description: 'Secondary text',
    category: 'dark',
  },
  {
    name: 'Gray 300',
    cssVar: '--pixel-gray-300',
    value: '#BABABA',
    description: 'Tertiary text',
    category: 'dark',
  },
  {
    name: 'Gray 200',
    cssVar: '--pixel-gray-200',
    value: '#DADADA',
    description: 'Primary text',
    category: 'dark',
  },
  {
    name: 'White',
    cssVar: '--pixel-white',
    value: '#FFFFFF',
    description: 'Bright text/accents',
    category: 'dark',
  },

  // Chain Colors
  {
    name: 'Sepolia',
    cssVar: '--chain-sepolia',
    value: '#FC5454',
    description: 'Ethereum red',
    category: 'chain',
  },
  {
    name: 'Base',
    cssVar: '--chain-base',
    value: '#5C94FC',
    description: 'Base blue',
    category: 'chain',
  },
  {
    name: 'Polygon',
    cssVar: '--chain-polygon',
    value: '#9C54FC',
    description: 'Polygon purple',
    category: 'chain',
  },

  // Glow Effects
  {
    name: 'Glow Blue',
    cssVar: '--glow-blue',
    value: 'rgba(59, 113, 201, 0.5)',
    description: 'Blue CRT glow effect',
    category: 'glow',
  },
  {
    name: 'Glow Green',
    cssVar: '--glow-green',
    value: 'rgba(0, 216, 0, 0.5)',
    description: 'Green CRT glow effect',
    category: 'glow',
  },
  {
    name: 'Glow Gold',
    cssVar: '--glow-gold',
    value: 'rgba(252, 192, 60, 0.5)',
    description: 'Gold CRT glow effect',
    category: 'glow',
  },
];

/**
 * Typography tokens for the pixel art design system.
 */
export const TYPOGRAPHY_TOKENS: TypographyToken[] = [
  {
    name: 'Display',
    fontFamily: 'Press Start 2P',
    cssVar: '--font-pixel-display',
    usage: 'Page titles, hero text',
    sampleText: 'AGENT EXPLORER',
  },
  {
    name: 'Heading',
    fontFamily: 'Silkscreen',
    cssVar: '--font-pixel-heading',
    usage: 'Card titles, badges, labels',
    sampleText: 'Section Title',
  },
  {
    name: 'Body',
    fontFamily: 'JetBrains Mono',
    cssVar: '--font-pixel-body',
    usage: 'Descriptions, addresses',
    sampleText: '0x1234...5678',
  },
  {
    name: 'UI',
    fontFamily: 'Inter',
    cssVar: '--font-sans',
    usage: 'Form inputs, long text',
    sampleText: 'Search for agents by name, capability, or address',
  },
];

/**
 * Spacing scale based on 4px grid.
 */
export const SPACING_TOKENS: SpacingToken[] = [
  { name: '0', value: '0', pixels: 0 },
  { name: '1', value: '0.25rem', pixels: 4 },
  { name: '2', value: '0.5rem', pixels: 8 },
  { name: '3', value: '0.75rem', pixels: 12 },
  { name: '4', value: '1rem', pixels: 16 },
  { name: '5', value: '1.25rem', pixels: 20 },
  { name: '6', value: '1.5rem', pixels: 24 },
  { name: '8', value: '2rem', pixels: 32 },
  { name: '10', value: '2.5rem', pixels: 40 },
  { name: '12', value: '3rem', pixels: 48 },
  { name: '16', value: '4rem', pixels: 64 },
];

/**
 * Animation tokens for pixel-perfect transitions.
 */
export const ANIMATION_TOKENS: AnimationToken[] = [
  {
    name: 'Pulse Glow',
    cssClass: 'animate-pulse-glow',
    duration: '2s',
    timing: 'ease-in-out infinite',
    description: 'Subtle pulsing glow for active states',
  },
  {
    name: 'Blink',
    cssClass: 'animate-blink',
    duration: '1s',
    timing: 'steps(2, start) infinite',
    description: '8-bit style cursor blink',
  },
  {
    name: 'Fade In',
    cssClass: 'animate-fade-in',
    duration: '150ms',
    timing: 'ease-out',
    description: 'Quick fade in for modals/tooltips',
  },
  {
    name: 'Slide Up',
    cssClass: 'animate-slide-up',
    duration: '200ms',
    timing: 'ease-out',
    description: 'Slide up entrance animation',
  },
];

/**
 * Get colors filtered by category.
 */
export function getColorsByCategory(category: ColorToken['category']): ColorToken[] {
  return COLOR_TOKENS.filter((token) => token.category === category);
}
