/**
 * MascotSVG - SVG rendering for AgentMascot
 */

import type { MascotAnimation } from './mascot-config';
import { COLORS } from './mascot-config';

interface MascotSVGProps {
  animation: MascotAnimation;
}

export function MascotSVG({ animation }: MascotSVGProps): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 32 32"
      className="w-full h-full"
      style={{ imageRendering: 'pixelated' }}
      aria-label="Agent-0 mascot"
      role="img"
    >
      {/* Hair/Top of head */}
      <rect x="11" y="2" width="10" height="2" fill={COLORS.hair} />
      <rect x="10" y="4" width="12" height="1" fill={COLORS.hair} />

      {/* Head outline and skin */}
      <rect x="9" y="5" width="14" height="8" fill={COLORS.skin} />
      <rect x="8" y="6" width="1" height="6" fill={COLORS.outline} />
      <rect x="23" y="6" width="1" height="6" fill={COLORS.outline} />

      {/* VR Visor */}
      <g className="mascot-visor">
        <rect x="9" y="7" width="14" height="4" fill={COLORS.outline} />
        <rect x="10" y="8" width="5" height="2" fill={COLORS.visor} />
        <rect x="17" y="8" width="5" height="2" fill={COLORS.visor} />
        {/* Visor highlight */}
        <rect x="10" y="8" width="2" height="1" fill={COLORS.visorGlow} opacity="0.6" />
        <rect x="17" y="8" width="2" height="1" fill={COLORS.visorGlow} opacity="0.6" />
        {/* Visor bridge */}
        <rect x="15" y="8" width="2" height="2" fill={COLORS.outline} />
      </g>

      {/* Mouth area */}
      <rect x="13" y="11" width="6" height="1" fill={COLORS.mouth} />

      {/* Neck */}
      <rect x="13" y="13" width="6" height="2" fill={COLORS.skin} />

      {/* Body/Jacket */}
      <rect x="7" y="15" width="18" height="10" fill={COLORS.body} />
      {/* Jacket outline */}
      <rect x="6" y="15" width="1" height="10" fill={COLORS.outline} />
      <rect x="25" y="15" width="1" height="10" fill={COLORS.outline} />
      <rect x="7" y="25" width="18" height="1" fill={COLORS.outline} />

      {/* Jacket shading */}
      <rect x="7" y="15" width="2" height="10" fill={COLORS.bodyDark} />
      <rect x="23" y="15" width="2" height="10" fill={COLORS.bodyDark} />

      {/* 8004 Badge */}
      <g className="mascot-badge">
        <rect x="12" y="17" width="8" height="5" fill={COLORS.badge} />
        <rect x="12" y="17" width="8" height="1" fill={COLORS.outline} opacity="0.3" />
        {/* "8004" text simplified as pixels */}
        <rect x="13" y="18" width="1" height="3" fill={COLORS.outline} />
        <rect x="14" y="18" width="1" height="1" fill={COLORS.outline} />
        <rect x="14" y="20" width="1" height="1" fill={COLORS.outline} />
        <rect x="15" y="19" width="1" height="1" fill={COLORS.outline} />
        <rect x="16" y="18" width="1" height="3" fill={COLORS.outline} />
        <rect x="17" y="18" width="1" height="1" fill={COLORS.outline} />
        <rect x="17" y="20" width="1" height="1" fill={COLORS.outline} />
        <rect x="18" y="18" width="1" height="3" fill={COLORS.outline} />
      </g>

      {/* Left Arm */}
      <g className="mascot-arm-left">
        <rect x="3" y="16" width="4" height="7" fill={COLORS.body} />
        <rect x="2" y="16" width="1" height="7" fill={COLORS.outline} />
        <rect x="3" y="23" width="4" height="1" fill={COLORS.outline} />
        <rect x="3" y="23" width="4" height="2" fill={COLORS.skin} />
      </g>

      {/* Right Arm */}
      <g className="mascot-arm-right">
        <rect x="25" y="16" width="4" height="7" fill={COLORS.body} />
        <rect x="29" y="16" width="1" height="7" fill={COLORS.outline} />
        <rect x="25" y="23" width="4" height="1" fill={COLORS.outline} />
        <rect x="25" y="23" width="4" height="2" fill={COLORS.skin} />
      </g>

      {/* Left Leg */}
      <g className="mascot-leg-left">
        <rect x="9" y="25" width="5" height="5" fill={COLORS.bodyDark} />
        <rect x="8" y="25" width="1" height="6" fill={COLORS.outline} />
        <rect x="14" y="25" width="1" height="6" fill={COLORS.outline} />
        <rect x="7" y="30" width="8" height="2" fill={COLORS.outline} />
      </g>

      {/* Right Leg */}
      <g className="mascot-leg-right">
        <rect x="18" y="25" width="5" height="5" fill={COLORS.bodyDark} />
        <rect x="17" y="25" width="1" height="6" fill={COLORS.outline} />
        <rect x="23" y="25" width="1" height="6" fill={COLORS.outline} />
        <rect x="17" y="30" width="8" height="2" fill={COLORS.outline} />
      </g>

      {/* Confetti for celebrate animation */}
      {animation === 'celebrate' && (
        <g className="mascot-confetti">
          <rect className="confetti-1" x="4" y="8" width="2" height="2" fill={COLORS.badge} />
          <rect className="confetti-2" x="26" y="6" width="2" height="2" fill={COLORS.visor} />
          <rect className="confetti-3" x="8" y="4" width="2" height="2" fill={COLORS.body} />
          <rect className="confetti-4" x="22" y="10" width="2" height="2" fill={COLORS.badge} />
        </g>
      )}
    </svg>
  );
}
