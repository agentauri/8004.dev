import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { ExploreBreadcrumb } from '@/components/organisms/json-ld';

export const metadata: Metadata = {
  title: 'Explore AI Agents',
  description:
    'Search and discover autonomous AI agents registered on the ERC-8004 standard. Filter by chain, capabilities, and status.',
  alternates: {
    canonical: 'https://www.8004.dev/explore',
  },
  openGraph: {
    title: 'Explore AI Agents | Agent Explorer',
    description:
      'Search and discover autonomous AI agents registered on the ERC-8004 standard. Filter by chain, capabilities, and status.',
    url: 'https://www.8004.dev/explore',
  },
  twitter: {
    title: 'Explore AI Agents | Agent Explorer',
    description:
      'Search and discover autonomous AI agents registered on the ERC-8004 standard. Filter by chain, capabilities, and status.',
  },
};

interface ExploreLayoutProps {
  children: ReactNode;
}

export default function ExploreLayout({ children }: ExploreLayoutProps) {
  return (
    <>
      <ExploreBreadcrumb />
      {children}
    </>
  );
}
