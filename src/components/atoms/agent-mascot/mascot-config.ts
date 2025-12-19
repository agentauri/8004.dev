/**
 * AgentMascot configuration constants
 */

export type MascotSize = 'sm' | 'md' | 'lg' | 'xl';
export type MascotAnimation =
  | 'none'
  | 'float'
  | 'blink'
  | 'bounce'
  | 'pulse'
  | 'walk'
  | 'wave'
  | 'dance'
  | 'glitch'
  | 'spin'
  | 'celebrate';

export const SIZE_MAP: Record<MascotSize, { width: number; height: number; className: string }> = {
  sm: { width: 16, height: 16, className: 'w-4 h-4' },
  md: { width: 32, height: 32, className: 'w-8 h-8' },
  lg: { width: 64, height: 64, className: 'w-16 h-16' },
  xl: { width: 128, height: 128, className: 'w-32 h-32' },
};

// Color palette matching the retro design system
export const COLORS = {
  outline: '#000000',
  body: '#5C94FC', // pixel-blue-sky
  bodyDark: '#3A6CD9', // darker blue for shading
  visor: '#00D800', // pixel-green-pipe
  visorGlow: '#00FF00',
  badge: '#FCC03C', // pixel-gold-coin
  skin: '#FCBCB0', // retro skin tone
  hair: '#1A1A1A', // pixel-gray-dark
  mouth: '#E8A090',
};
