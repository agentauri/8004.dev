/**
 * PixelClippy configuration constants
 */

export type ClippySize = 'sm' | 'md' | 'lg' | 'xl';
export type ClippyMood = 'idle' | 'thinking' | 'happy' | 'surprised' | 'wink';
export type ClippyAnimation = 'none' | 'float' | 'bounce' | 'wiggle' | 'wave';

export const SIZE_MAP: Record<ClippySize, { width: number; height: number; className: string }> = {
  sm: { width: 20, height: 64, className: 'w-5 h-16' },
  md: { width: 30, height: 96, className: 'w-[1.875rem] h-24' },
  lg: { width: 40, height: 128, className: 'w-10 h-32' },
  xl: { width: 60, height: 192, className: 'w-15 h-48' },
};

// Original Clippy color palette - metallic gray-purple
export const COLORS = {
  wireMain: '#9898B0', // Metallic gray-purple (main body)
  wireHighlight: '#C8C8D8', // Light metallic highlight
  wireShadow: '#686880', // Dark shadow
  wireOutline: '#484858', // Dark outline
  eyeWhite: '#FFFFFF',
  pupil: '#000000',
  eyebrow: '#2A2A3A', // Dark gray-purple for eyebrows
  blush: '#E8A0A0', // Soft pink blush
};

// Animation class mapping
export const ANIMATION_CLASS_MAP: Record<ClippyAnimation, string> = {
  none: '',
  float: 'animate-clippy-float',
  bounce: 'animate-clippy-bounce',
  wiggle: 'animate-clippy-wiggle',
  wave: 'animate-clippy-wave',
};

// Eye position constants for viewBox (30x96)
export const EYE_CONFIG = {
  leftEyeX: 6,
  rightEyeX: 24,
  eyeY: 38,
  eyeRadius: 10,
  pupilRadius: 5.5,
  highlightRadius: 2.5,
};
