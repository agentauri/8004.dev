'use client';

import { Bot } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface AgentAvatarProps {
  /** Agent name used for initials and color generation */
  name: string;
  /** Optional image URL */
  image?: string;
  /** Avatar size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const RETRO_COLORS = [
  { bg: 'bg-[#5C94FC]', text: 'text-[#1A1A1A]' }, // pixel-blue-sky - dark text (4.44:1)
  { bg: 'bg-[#FC5454]', text: 'text-[#1A1A1A]' }, // pixel-red-fire - dark text (3.81:1)
  { bg: 'bg-[#00D800]', text: 'text-[#1A1A1A]' }, // pixel-green-pipe - dark text (6.05:1)
  { bg: 'bg-[#FCC03C]', text: 'text-[#1A1A1A]' }, // pixel-gold-coin - dark text (7.54:1)
  { bg: 'bg-[#C494FF]', text: 'text-[#1A1A1A]' }, // lighter purple for contrast (6.2:1)
] as const;

const SIZE_STYLES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
} as const;

const ICON_SIZES = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

const SIZE_DIMENSIONS = {
  sm: 32,
  md: 48,
  lg: 64,
} as const;

/**
 * Generate a consistent color based on the agent name using a simple hash function
 */
function getColorFromName(name: string): { bg: string; text: string } {
  if (!name) return RETRO_COLORS[0];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % RETRO_COLORS.length;
  return RETRO_COLORS[index];
}

/**
 * Extract initials from agent name (first 2 characters)
 */
function getInitials(name: string): string {
  if (!name) return '??';
  return name.slice(0, 2).toUpperCase();
}

/**
 * AgentAvatar displays an agent's avatar with fallback to initials or icon.
 *
 * Priority: image (if valid) → initials → Bot icon fallback
 *
 * Features:
 * - Automatic color generation from name hash for consistency
 * - Graceful fallback on image load errors
 * - Retro pixel art styling with 80s arcade colors
 * - Responsive sizing (sm, md, lg)
 */
export function AgentAvatar({
  name,
  image,
  size = 'md',
  className,
}: AgentAvatarProps): React.JSX.Element {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const showImage = image && !imageError;
  const initials = getInitials(name);
  const colorScheme = getColorFromName(name);
  const sizeClass = SIZE_STYLES[size];
  const iconSize = ICON_SIZES[size];

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      data-testid="agent-avatar"
      className={cn(
        'relative flex items-center justify-center rounded-lg overflow-hidden',
        'border-2 border-[#3A3A3A]',
        !showImage && colorScheme.bg,
        sizeClass,
        className,
      )}
    >
      {showImage ? (
        <>
          {/* Image - using next/image with unoptimized for IPFS/external URLs */}
          <Image
            src={image}
            alt={`${name} avatar`}
            width={SIZE_DIMENSIONS[size]}
            height={SIZE_DIMENSIONS[size]}
            className={cn('w-full h-full object-cover', !imageLoaded && 'opacity-0')}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
            unoptimized
          />

          {/* Loading state */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]">
              <Bot size={iconSize} className="text-[#5C94FC] animate-pulse" />
            </div>
          )}
        </>
      ) : (
        <>
          {/* Initials with pixel font */}
          <span
            className={cn('font-pixel-heading select-none', colorScheme.text)}
            style={{ fontSize: size === 'sm' ? '10px' : size === 'md' ? '14px' : '18px' }}
          >
            {initials}
          </span>
        </>
      )}
    </div>
  );
}
