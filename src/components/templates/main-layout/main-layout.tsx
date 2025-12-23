'use client';

import type React from 'react';
import { Footer, Header } from '@/components/organisms';
import { cn } from '@/lib/utils';

export interface MainLayoutProps {
  /** Page content */
  children: React.ReactNode;
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
  showFooter = true,
  className,
}: MainLayoutProps): React.JSX.Element {
  return (
    <div
      className="min-h-screen flex flex-col bg-[var(--pixel-gray-dark)]"
      data-testid="main-layout"
    >
      <Header />
      <main className={cn('flex-1', className)} data-testid="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
