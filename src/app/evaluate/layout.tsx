import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Header } from '@/components/organisms';

export const metadata: Metadata = {
  title: {
    template: '%s | Agent Evaluations',
    default: 'Agent Evaluations',
  },
  description:
    'Evaluate AI agents on safety, capability, reliability, and performance. View benchmark results and scores for agents on the ERC-8004 registry.',
};

interface EvaluateLayoutProps {
  children: ReactNode;
}

/**
 * Layout for evaluation pages.
 * Provides consistent header and main content container.
 */
export default function EvaluateLayout({ children }: EvaluateLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
