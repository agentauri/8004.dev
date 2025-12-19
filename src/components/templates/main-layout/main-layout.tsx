'use client';

import type React from 'react';
import { useState } from 'react';
import type { ChainId } from '@/components/atoms';
import { Footer, Header } from '@/components/organisms';
import { cn } from '@/lib/utils';

export interface MainLayoutProps {
  /** Page content */
  children: React.ReactNode;
  /** Initial selected chains (empty array means all chains) */
  initialChains?: ChainId[];
  /** Callback when chains change */
  onChainsChange?: (chains: ChainId[]) => void;
  /** Whether to show the footer */
  showFooter?: boolean;
  /** Optional additional class names for main content area */
  className?: string;
}

/**
 * MainLayout provides the standard page layout with header and optional footer.
 *
 * @example
 * ```tsx
 * <MainLayout>
 *   <h1>Page Content</h1>
 * </MainLayout>
 * ```
 */
export function MainLayout({
  children,
  initialChains = [],
  onChainsChange,
  showFooter = true,
  className,
}: MainLayoutProps): React.JSX.Element {
  const [selectedChains, setSelectedChains] = useState<ChainId[]>(initialChains);

  const handleChainsChange = (chains: ChainId[]) => {
    setSelectedChains(chains);
    onChainsChange?.(chains);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[var(--pixel-gray-dark)]"
      data-testid="main-layout"
    >
      <Header selectedChains={selectedChains} onChainsChange={handleChainsChange} />
      <main className={cn('flex-1', className)} data-testid="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
