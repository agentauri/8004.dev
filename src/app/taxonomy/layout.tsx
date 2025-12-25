import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { TaxonomyBreadcrumb } from '@/components/organisms/json-ld';

export const metadata: Metadata = {
  title: 'OASF Taxonomy Browser',
  description:
    'Browse the Open Agentic Schema Framework (OASF) taxonomy. Explore skills and domains used to classify AI agents on the ERC-8004 standard.',
  alternates: {
    canonical: 'https://www.8004.dev/taxonomy',
  },
  openGraph: {
    title: 'OASF Taxonomy Browser | Agent Explorer',
    description:
      'Browse the Open Agentic Schema Framework (OASF) taxonomy. Explore skills and domains used to classify AI agents on the ERC-8004 standard.',
    url: 'https://www.8004.dev/taxonomy',
  },
  twitter: {
    title: 'OASF Taxonomy Browser | Agent Explorer',
    description:
      'Browse the Open Agentic Schema Framework (OASF) taxonomy. Explore skills and domains used to classify AI agents on the ERC-8004 standard.',
  },
};

interface TaxonomyLayoutProps {
  children: ReactNode;
}

export default function TaxonomyLayout({ children }: TaxonomyLayoutProps) {
  return (
    <>
      <TaxonomyBreadcrumb />
      {children}
    </>
  );
}
