import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Header } from '@/components/organisms';

export const metadata: Metadata = {
  title: {
    template: '%s | Intent Templates',
    default: 'Intent Templates',
  },
  description:
    'Browse predefined workflow templates for common AI agent tasks. Discover automation patterns and find agents to execute multi-step workflows.',
};

interface IntentsLayoutProps {
  children: ReactNode;
}

/**
 * Layout for intents pages.
 * Provides consistent header and main content container.
 */
export default function IntentsLayout({ children }: IntentsLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
