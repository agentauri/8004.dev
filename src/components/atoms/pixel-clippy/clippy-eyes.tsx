/**
 * ClippyEyes - SVG eye rendering for PixelClippy based on mood
 */

import styles from './clippy.module.css';
import type { ClippyMood } from './clippy-config';
import { COLORS, EYE_CONFIG } from './clippy-config';

// Safe style accessors
const safeStyles = {
  get happyEye() {
    return styles?.happyEye;
  },
  get blush() {
    return styles?.blush;
  },
  get pupilSurprised() {
    return styles?.pupilSurprised;
  },
  get highlight() {
    return styles?.highlight;
  },
  get pupilThinking() {
    return styles?.pupilThinking;
  },
  get pupilWink() {
    return styles?.pupilWink;
  },
  get pupilLeft() {
    return styles?.pupilLeft;
  },
  get pupilRight() {
    return styles?.pupilRight;
  },
};

interface ClippyEyesProps {
  mood: ClippyMood;
}

export function ClippyEyes({ mood }: ClippyEyesProps): React.JSX.Element {
  const { leftEyeX, rightEyeX, eyeY, eyeRadius, pupilRadius, highlightRadius } = EYE_CONFIG;

  switch (mood) {
    case 'happy':
      return (
        <g>
          {/* Left eye - happy arc */}
          <path
            className={safeStyles.happyEye}
            d={`M${leftEyeX - 6} ${eyeY + 2} Q${leftEyeX} ${eyeY - 6} ${leftEyeX + 6} ${eyeY + 2}`}
            fill="none"
            stroke={COLORS.pupil}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Right eye - happy arc */}
          <path
            className={safeStyles.happyEye}
            d={`M${rightEyeX - 6} ${eyeY + 2} Q${rightEyeX} ${eyeY - 6} ${rightEyeX + 6} ${eyeY + 2}`}
            fill="none"
            stroke={COLORS.pupil}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Blush circles */}
          <circle
            className={safeStyles.blush}
            cx={leftEyeX + 2}
            cy={eyeY + 10}
            r="4"
            fill="#FF6B6B"
            opacity="0.85"
          />
          <circle
            className={safeStyles.blush}
            cx={rightEyeX - 2}
            cy={eyeY + 10}
            r="4"
            fill="#FF6B6B"
            opacity="0.85"
          />
        </g>
      );

    case 'surprised':
      return (
        <g>
          {/* Left eye - extra large */}
          <circle
            cx={leftEyeX}
            cy={eyeY}
            r={eyeRadius + 2}
            fill={COLORS.eyeWhite}
            stroke={COLORS.pupil}
            strokeWidth="2"
          />
          <circle
            className={safeStyles.pupilSurprised}
            cx={leftEyeX}
            cy={eyeY}
            r={pupilRadius + 1}
            fill={COLORS.pupil}
          />
          <circle
            className={safeStyles.highlight}
            cx={leftEyeX - 3}
            cy={eyeY - 3}
            r={highlightRadius}
            fill={COLORS.eyeWhite}
          />
          {/* Right eye - extra large */}
          <circle
            cx={rightEyeX}
            cy={eyeY}
            r={eyeRadius + 2}
            fill={COLORS.eyeWhite}
            stroke={COLORS.pupil}
            strokeWidth="2"
          />
          <circle
            className={safeStyles.pupilSurprised}
            cx={rightEyeX}
            cy={eyeY}
            r={pupilRadius + 1}
            fill={COLORS.pupil}
          />
          <circle
            className={safeStyles.highlight}
            cx={rightEyeX - 3}
            cy={eyeY - 3}
            r={highlightRadius}
            fill={COLORS.eyeWhite}
          />
          {/* Raised eyebrows */}
          <path
            d={`M${leftEyeX - 8} ${eyeY - 12} Q${leftEyeX} ${eyeY - 18} ${leftEyeX + 8} ${eyeY - 14}`}
            fill="none"
            stroke={COLORS.eyebrow}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={`M${rightEyeX - 8} ${eyeY - 14} Q${rightEyeX} ${eyeY - 18} ${rightEyeX + 8} ${eyeY - 12}`}
            fill="none"
            stroke={COLORS.eyebrow}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      );

    case 'thinking':
      return (
        <g>
          {/* Left eye */}
          <circle
            cx={leftEyeX}
            cy={eyeY}
            r={eyeRadius}
            fill={COLORS.eyeWhite}
            stroke={COLORS.pupil}
            strokeWidth="2"
          />
          <circle
            className={safeStyles.pupilThinking}
            cx={leftEyeX + 2}
            cy={eyeY - 2}
            r={pupilRadius}
            fill={COLORS.pupil}
          />
          <circle
            className={safeStyles.highlight}
            cx={leftEyeX - 2}
            cy={eyeY - 3}
            r={highlightRadius}
            fill={COLORS.eyeWhite}
          />
          {/* Right eye */}
          <circle
            cx={rightEyeX}
            cy={eyeY}
            r={eyeRadius}
            fill={COLORS.eyeWhite}
            stroke={COLORS.pupil}
            strokeWidth="2"
          />
          <circle
            className={safeStyles.pupilThinking}
            cx={rightEyeX + 2}
            cy={eyeY - 2}
            r={pupilRadius}
            fill={COLORS.pupil}
          />
          <circle
            className={safeStyles.highlight}
            cx={rightEyeX - 2}
            cy={eyeY - 3}
            r={highlightRadius}
            fill={COLORS.eyeWhite}
          />
          {/* Eyebrows - one raised */}
          <path
            d={`M${leftEyeX - 8} ${eyeY - 10} Q${leftEyeX} ${eyeY - 16} ${leftEyeX + 8} ${eyeY - 12}`}
            fill="none"
            stroke={COLORS.eyebrow}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={`M${rightEyeX - 8} ${eyeY - 11} Q${rightEyeX} ${eyeY - 12} ${rightEyeX + 8} ${eyeY - 11}`}
            fill="none"
            stroke={COLORS.eyebrow}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      );

    case 'wink':
      return (
        <g>
          {/* Left eye - wink arc */}
          <path
            d={`M${leftEyeX - 6} ${eyeY} Q${leftEyeX} ${eyeY + 4} ${leftEyeX + 6} ${eyeY}`}
            fill="none"
            stroke={COLORS.pupil}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Right eye - open */}
          <circle
            cx={rightEyeX}
            cy={eyeY}
            r={eyeRadius}
            fill={COLORS.eyeWhite}
            stroke={COLORS.pupil}
            strokeWidth="2"
          />
          <circle
            className={safeStyles.pupilWink}
            cx={rightEyeX}
            cy={eyeY}
            r={pupilRadius}
            fill={COLORS.pupil}
          />
          <circle
            className={safeStyles.highlight}
            cx={rightEyeX - 2}
            cy={eyeY - 3}
            r={highlightRadius}
            fill={COLORS.eyeWhite}
          />
        </g>
      );
    default:
      return (
        <g>
          {/* Left eye */}
          <circle
            cx={leftEyeX}
            cy={eyeY}
            r={eyeRadius}
            fill={COLORS.eyeWhite}
            stroke={COLORS.pupil}
            strokeWidth="2"
          />
          <circle
            className={safeStyles.pupilLeft}
            cx={leftEyeX}
            cy={eyeY}
            r={pupilRadius}
            fill={COLORS.pupil}
          />
          <circle
            className={safeStyles.highlight}
            cx={leftEyeX - 2}
            cy={eyeY - 3}
            r={highlightRadius}
            fill={COLORS.eyeWhite}
          />
          {/* Right eye */}
          <circle
            cx={rightEyeX}
            cy={eyeY}
            r={eyeRadius}
            fill={COLORS.eyeWhite}
            stroke={COLORS.pupil}
            strokeWidth="2"
          />
          <circle
            className={safeStyles.pupilRight}
            cx={rightEyeX}
            cy={eyeY}
            r={pupilRadius}
            fill={COLORS.pupil}
          />
          <circle
            className={safeStyles.highlight}
            cx={rightEyeX - 2}
            cy={eyeY - 3}
            r={highlightRadius}
            fill={COLORS.eyeWhite}
          />
          {/* Eyebrows */}
          <path
            d={`M${leftEyeX - 7} ${eyeY - 11} Q${leftEyeX} ${eyeY - 14} ${leftEyeX + 7} ${eyeY - 11}`}
            fill="none"
            stroke={COLORS.eyebrow}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={`M${rightEyeX - 7} ${eyeY - 11} Q${rightEyeX} ${eyeY - 14} ${rightEyeX + 7} ${eyeY - 11}`}
            fill="none"
            stroke={COLORS.eyebrow}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      );
  }
}
