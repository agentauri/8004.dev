/**
 * PixelExplorer configuration constants
 */

export type ExplorerSize = 'sm' | 'md' | 'lg' | 'xl';
export type ExplorerAnimation =
  | 'none'
  | 'float'
  | 'bounce'
  | 'walk'
  | 'search'
  | 'discover';

// Size map for 35x45 aspect ratio (width:height = 7:9)
// The SVG viewBox handles proper scaling within these container sizes
export const SIZE_MAP: Record<ExplorerSize, { width: number; height: number; className: string }> = {
  sm: { width: 32, height: 40, className: 'w-8 h-10' },
  md: { width: 64, height: 80, className: 'w-16 h-20' },
  lg: { width: 128, height: 160, className: 'w-32 h-40' },
  xl: { width: 256, height: 320, className: 'w-64 h-80' },
};

// Color palette for classic explorer character (Indiana Jones style)
// Extracted from personaggio_pixel_allpixels.svg
export const COLORS = {
  // Outlines/blacks
  outline: '#020002',
  outlineAlt: '#030303',

  // Hat browns
  hatMain: '#886c41', // main hat color
  hatDark: '#574113', // hat shadow
  hatBand: '#3b290a', // dark band
  hatLight: '#c29165', // hat highlight

  // Face/Skin tones
  skin: '#f4ae6c', // main skin
  skinLight: '#eccca9', // skin highlight

  // Hair/Beard (blonde/light brown)
  hair: '#c29165',
  hairDark: '#704e1b',

  // Jacket/Body browns
  jacket: '#886c41',
  jacketDark: '#574113',
  jacketLight: '#c29165',

  // Pants/Boots
  pants: '#574113',
  boots: '#3b290a',

  // Whites (shirt/details)
  white: '#ffffff',
  whiteOff: '#fefefe',

  // Legacy - kept for animation compatibility
  goggles: '#5C94FC',
  gogglesGlow: '#7BB8FF',
  gogglesLens: '#00D800',
  antenna: '#FCC03C',
};
