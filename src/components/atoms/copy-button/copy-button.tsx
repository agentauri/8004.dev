'use client';

import { Check, Copy } from 'lucide-react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

export interface CopyButtonProps {
  /** The text to copy to clipboard */
  text: string;
  /** Duration in ms to show success state */
  successDuration?: number;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Optional additional class names */
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
  /** Callback when copy is successful */
  onCopy?: () => void;
  /** Callback when copy fails */
  onError?: (error: Error) => void;
}

const SIZE_CONFIG = {
  xs: { button: 'p-1.5', icon: 14 },
  sm: { button: 'p-2', icon: 16 },
  md: { button: 'p-2.5 min-w-[44px] min-h-[44px]', icon: 18 },
  lg: { button: 'p-3 min-w-[44px] min-h-[44px]', icon: 20 },
};

/**
 * CopyButton provides a clickable button to copy text to clipboard with visual feedback.
 *
 * @example
 * ```tsx
 * <CopyButton text="0x1234...5678" />
 * <CopyButton text="Copy me" size="lg" onCopy={() => console.log('Copied!')} />
 * ```
 */
export function CopyButton({
  text,
  successDuration = 2000,
  size = 'md',
  className,
  label = 'Copy to clipboard',
  onCopy,
  onError,
}: CopyButtonProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      // Prevent click from propagating to parent elements (e.g., Link in AgentCard)
      e.stopPropagation();
      e.preventDefault();

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(false);
        onCopy?.();

        setTimeout(() => {
          setCopied(false);
        }, successDuration);
      } catch (err) {
        // Clipboard API may fail in some environments (e.g., insecure contexts, permissions denied)
        const copyError = err instanceof Error ? err : new Error('Failed to copy to clipboard');

        // Log in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.warn('[CopyButton] Failed to copy:', copyError.message);
        }

        // Show error state briefly to provide visual feedback
        setError(true);
        onError?.(copyError);

        setTimeout(() => {
          setError(false);
        }, successDuration);
      }
    },
    [text, successDuration, onCopy, onError],
  );

  const sizeConfig = SIZE_CONFIG[size];

  // Determine aria-label based on state
  const ariaLabel = error ? 'Copy failed' : copied ? 'Copied!' : label;

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center border-2 transition-all duration-100',
        'hover:bg-[rgba(92,148,252,0.2)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixel-blue-sky)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pixel-black)]',
        copied
          ? 'border-[var(--pixel-green-pipe)] text-[var(--pixel-green-pipe)] shadow-[0_0_8px_var(--glow-green)]'
          : error
            ? 'border-[var(--pixel-red-fire)] text-[var(--pixel-red-fire)] shadow-[0_0_8px_rgba(252,84,84,0.5)]'
            : 'border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-blue-text)] hover:text-[var(--pixel-blue-text)] hover:shadow-[0_0_8px_var(--glow-blue-text)]',
        sizeConfig.button,
        className,
      )}
      aria-label={ariaLabel}
      data-testid="copy-button"
      data-copied={copied}
      data-error={error}
    >
      {copied ? (
        <Check size={sizeConfig.icon} aria-hidden="true" />
      ) : (
        <Copy size={sizeConfig.icon} aria-hidden="true" />
      )}
    </button>
  );
}
