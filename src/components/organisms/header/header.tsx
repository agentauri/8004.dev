'use client';

import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { MCPConnectModal } from '@/components/organisms/mcp-connect-modal';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  /** Optional additional class names */
  className?: string;
}

/**
 * Header displays the main navigation bar with logo and navigation links.
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export function Header({ className }: HeaderProps): React.JSX.Element {
  const [showMCPModal, setShowMCPModal] = useState(false);

  return (
    <header
      className={cn(
        'flex items-center justify-between px-4 md:px-6 py-3 md:py-4',
        'bg-[var(--pixel-gray-900)] border-b-2 border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="header"
    >
      <Link
        href="/"
        className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
        data-testid="header-logo"
      >
        <span className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)] text-base md:text-lg tracking-wider">
          8004<span className="text-[var(--pixel-primary)]">.dev</span>
        </span>
        <PixelExplorer size="sm" animation="none" className="hidden md:block" />
      </Link>

      <nav className="flex items-center gap-3 md:gap-6" data-testid="header-nav">
        <Link
          href="/explore"
          className={cn(
            'hidden sm:block font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider',
            'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-100)] transition-colors',
          )}
          data-testid="nav-explore"
        >
          Explore
        </Link>
        <button
          type="button"
          onClick={() => setShowMCPModal(true)}
          className={cn(
            'font-[family-name:var(--font-pixel-body)] text-xs md:text-sm uppercase tracking-wider',
            'px-2 md:px-3 py-1.5 border-2 border-[var(--pixel-gold-coin)]',
            'text-[var(--pixel-gold-coin)] bg-transparent',
            'hover:bg-[var(--pixel-gold-coin)] hover:text-[var(--pixel-black)]',
            'hover:shadow-[0_0_12px_var(--pixel-gold-coin)]',
            'transition-all duration-150',
          )}
          data-testid="nav-connect-mcp"
        >
          Connect MCP
        </button>
      </nav>

      <MCPConnectModal isOpen={showMCPModal} onClose={() => setShowMCPModal(false)} />
    </header>
  );
}
