'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useCallback, useState } from 'react';
import { EventBadge, PixelExplorer } from '@/components/atoms';
import { EventPanel } from '@/components/organisms/event-panel';
import { MCPConnectModal } from '@/components/organisms/mcp-connect-modal';
import { useRealtimeEvents } from '@/hooks';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  /** Optional additional class names */
  className?: string;
}

interface NavLink {
  href: string;
  label: string;
  testId: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '/explore', label: 'Explore', testId: 'nav-explore' },
  { href: '/leaderboard', label: 'Leaderboard', testId: 'nav-leaderboard' },
  { href: '/feedbacks', label: 'Feedbacks', testId: 'nav-feedbacks' },
  { href: '/evaluate', label: 'Evaluate', testId: 'nav-evaluate' },
  { href: '/compose', label: 'Compose', testId: 'nav-compose' },
  { href: '/intents', label: 'Intents', testId: 'nav-intents' },
  { href: '/analytics', label: 'Analytics', testId: 'nav-analytics' },
  { href: '/webhooks', label: 'Webhooks', testId: 'nav-webhooks' },
];

/**
 * Header displays the main navigation bar with logo, navigation links,
 * event indicator, and MCP connect button.
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export function Header({ className }: HeaderProps): React.JSX.Element {
  const pathname = usePathname();
  const [showMCPModal, setShowMCPModal] = useState(false);
  const [showEventPanel, setShowEventPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { eventCount, isConnected, recentEvents, clearEvents } = useRealtimeEvents();

  const toggleEventPanel = useCallback(() => {
    setShowEventPanel((prev) => !prev);
  }, []);

  const closeEventPanel = useCallback(() => {
    setShowEventPanel(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu((prev) => !prev);
    // Close event panel when opening mobile menu
    setShowEventPanel(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setShowMobileMenu(false);
  }, []);

  const isActiveLink = (href: string): boolean => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        'relative flex items-center justify-between px-4 md:px-6 py-3 md:py-4',
        'bg-[var(--pixel-gray-900)] border-b-2 border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="header"
    >
      {/* Logo */}
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

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-4 lg:gap-6" data-testid="header-nav">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'font-[family-name:var(--font-pixel-body)] text-xs lg:text-sm uppercase tracking-wider',
              'transition-colors',
              isActiveLink(link.href)
                ? 'text-[var(--pixel-primary)]'
                : 'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-100)]',
            )}
            data-testid={link.testId}
          >
            {link.label}
          </Link>
        ))}

        {/* Event Badge (Desktop) */}
        <div className="relative" data-testid="event-badge-container">
          <EventBadge count={eventCount} isConnected={isConnected} onClick={toggleEventPanel} />
        </div>

        {/* MCP Connect Button */}
        <button
          type="button"
          onClick={() => setShowMCPModal(true)}
          className={cn(
            'font-[family-name:var(--font-pixel-body)] text-xs lg:text-sm uppercase tracking-wider',
            'px-2 lg:px-3 py-1.5 border-2 border-[var(--pixel-gold-coin)]',
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

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-3">
        {/* Event Badge (Mobile) */}
        <div className="relative" data-testid="event-badge-container-mobile">
          <EventBadge count={eventCount} isConnected={isConnected} onClick={toggleEventPanel} />
        </div>

        {/* Hamburger Menu Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className={cn(
            'w-10 h-10 flex flex-col items-center justify-center gap-1.5',
            'border-2 border-[var(--pixel-gray-700)]',
            'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-100)]',
            'hover:border-[var(--pixel-gray-500)]',
            'transition-colors',
          )}
          aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
          aria-expanded={showMobileMenu}
          data-testid="mobile-menu-button"
        >
          <span
            className={cn(
              'w-5 h-0.5 bg-current transition-transform',
              showMobileMenu && 'translate-y-2 rotate-45',
            )}
          />
          <span
            className={cn('w-5 h-0.5 bg-current transition-opacity', showMobileMenu && 'opacity-0')}
          />
          <span
            className={cn(
              'w-5 h-0.5 bg-current transition-transform',
              showMobileMenu && '-translate-y-2 -rotate-45',
            )}
          />
        </button>
      </div>

      {/* Event Panel (shared, positioned based on viewport) */}
      {showEventPanel && (
        <div
          className={cn(
            'absolute top-full mt-2 z-50',
            // On desktop: positioned to the right, aligned with event badge
            'md:right-24',
            // On mobile: positioned to the right edge
            'right-4',
          )}
        >
          <EventPanel events={recentEvents} onClear={clearEvents} onClose={closeEventPanel} />
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div
          className={cn(
            'absolute top-full left-0 right-0',
            'bg-[var(--pixel-gray-900)] border-b-2 border-[var(--pixel-gray-700)]',
            'shadow-[0_4px_20px_rgba(0,0,0,0.5)]',
            'z-40 md:hidden',
          )}
          data-testid="mobile-menu"
        >
          <nav className="flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  'px-4 py-3',
                  'font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider',
                  'transition-colors',
                  isActiveLink(link.href)
                    ? 'text-[var(--pixel-primary)] bg-[rgba(92,148,252,0.1)]'
                    : 'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-100)] hover:bg-[var(--pixel-gray-800)]',
                )}
                data-testid={`mobile-${link.testId}`}
              >
                {link.label}
              </Link>
            ))}

            {/* MCP Connect in Mobile Menu */}
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                setShowMCPModal(true);
              }}
              className={cn(
                'mx-4 my-3 px-3 py-2',
                'font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wider',
                'border-2 border-[var(--pixel-gold-coin)]',
                'text-[var(--pixel-gold-coin)] bg-transparent',
                'hover:bg-[var(--pixel-gold-coin)] hover:text-[var(--pixel-black)]',
                'transition-all duration-150',
              )}
              data-testid="mobile-nav-connect-mcp"
            >
              Connect MCP
            </button>
          </nav>
        </div>
      )}

      <MCPConnectModal isOpen={showMCPModal} onClose={() => setShowMCPModal(false)} />
    </header>
  );
}
