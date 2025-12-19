/**
 * ClippyBody - SVG paperclip body rendering
 */

import { COLORS } from './clippy-config';

const WIRE_PATH =
  'M5,8 C5,8 2,12 2,20 L2,78 C2,86 7,92 15,92 C23,92 28,86 28,78 L28,36 C28,28 24,22 19,22 L19,72 C19,76 18,80 15,80 C12,80 11,76 11,72 L11,28';

export function ClippyBody(): React.JSX.Element {
  return (
    <g>
      {/* Outer dark outline */}
      <path
        d={WIRE_PATH}
        fill="none"
        stroke={COLORS.wireOutline}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Shadow layer */}
      <path
        d={WIRE_PATH}
        fill="none"
        stroke={COLORS.wireShadow}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main wire */}
      <path
        d={WIRE_PATH}
        fill="none"
        stroke={COLORS.wireMain}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Highlight */}
      <path
        d={WIRE_PATH}
        fill="none"
        stroke={COLORS.wireHighlight}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </g>
  );
}
