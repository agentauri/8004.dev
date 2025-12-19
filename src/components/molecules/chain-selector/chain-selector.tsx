'use client';

import { Check, ChevronDown } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChainBadge, type ChainId } from '@/components/atoms';
import { cn } from '@/lib/utils';

export interface ChainSelectorProps {
  /** Currently selected chains (empty array means all chains) */
  value?: ChainId[];
  /** Callback when chain selection changes */
  onChange?: (chains: ChainId[]) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Optional additional class names */
  className?: string;
}

const CHAIN_OPTIONS: ChainId[] = [11155111, 84532, 80002];

/**
 * ChainSelector is a dropdown molecule for selecting multiple blockchain networks.
 * An empty selection means "All Chains".
 *
 * @example
 * ```tsx
 * <ChainSelector
 *   value={selectedChains}
 *   onChange={setSelectedChains}
 * />
 * ```
 */
export function ChainSelector({
  value = [],
  onChange,
  disabled = false,
  className,
}: ChainSelectorProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleToggleChain = useCallback(
    (chainId: ChainId) => {
      if (value.includes(chainId)) {
        // Remove chain from selection
        onChange?.(value.filter((id) => id !== chainId));
      } else {
        // Add chain to selection
        onChange?.([...value, chainId]);
      }
    },
    [onChange, value],
  );

  const handleSelectAll = useCallback(() => {
    // Empty array means all chains
    onChange?.([]);
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle],
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const isAllSelected = value.length === 0;

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block', className)}
      data-testid="chain-selector"
    >
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-3 py-2.5',
          'bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-600)]',
          'font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-200)]',
          'hover:border-[var(--pixel-gray-500)]',
          'focus:outline-none focus:border-[var(--pixel-blue-sky)] focus:shadow-[0_0_8px_var(--glow-blue)]',
          'transition-all duration-150',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && 'border-[var(--pixel-blue-sky)]',
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        data-testid="chain-selector-trigger"
      >
        {isAllSelected ? (
          <span className="text-[var(--pixel-gray-400)]">ALL CHAINS</span>
        ) : (
          <span className="flex items-center gap-1.5">
            {value.map((chainId) => (
              <ChainBadge key={chainId} chainId={chainId} />
            ))}
          </span>
        )}
        <ChevronDown
          size={16}
          className={cn(
            'text-[var(--pixel-gray-500)] transition-transform duration-150',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          className={cn(
            'absolute z-50 mt-1 w-full min-w-[180px]',
            'bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-600)]',
            'shadow-[0_4px_12px_rgba(0,0,0,0.5)]',
          )}
          // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: Custom dropdown for consistent styling
          // biome-ignore lint/a11y/useSemanticElements: Custom dropdown for consistent styling
          role="listbox"
          aria-multiselectable="true"
          tabIndex={-1}
          data-testid="chain-selector-dropdown"
        >
          {/* All Chains option */}
          <li>
            <button
              type="button"
              onClick={handleSelectAll}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2.5 text-left',
                'hover:bg-[var(--pixel-gray-700)]',
                'focus:outline-none focus:bg-[var(--pixel-gray-700)]',
                'transition-colors duration-100',
                isAllSelected && 'bg-[var(--pixel-gray-700)]',
              )}
              // biome-ignore lint/a11y/useSemanticElements: Custom dropdown for consistent styling across browsers
              role="option"
              aria-selected={isAllSelected}
              data-testid="chain-option-all"
            >
              <span
                className={cn(
                  'w-4 h-4 flex items-center justify-center',
                  isAllSelected ? 'text-[var(--pixel-green-pipe)]' : 'text-transparent',
                )}
              >
                <Check size={14} aria-hidden="true" />
              </span>
              <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm">
                ALL CHAINS
              </span>
            </button>
          </li>

          {/* Individual chain options */}
          {CHAIN_OPTIONS.map((chainId) => {
            const isSelected = value.includes(chainId);
            return (
              <li key={chainId}>
                <button
                  type="button"
                  onClick={() => handleToggleChain(chainId)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2.5 text-left',
                    'hover:bg-[var(--pixel-gray-700)]',
                    'focus:outline-none focus:bg-[var(--pixel-gray-700)]',
                    'transition-colors duration-100',
                    isSelected && 'bg-[var(--pixel-gray-700)]',
                  )}
                  // biome-ignore lint/a11y/useSemanticElements: Custom dropdown for consistent styling across browsers
                  role="option"
                  aria-selected={isSelected}
                  data-testid={`chain-option-${chainId}`}
                >
                  <span
                    className={cn(
                      'w-4 h-4 flex items-center justify-center',
                      isSelected ? 'text-[var(--pixel-green-pipe)]' : 'text-transparent',
                    )}
                  >
                    <Check size={14} aria-hidden="true" />
                  </span>
                  <ChainBadge chainId={chainId} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
