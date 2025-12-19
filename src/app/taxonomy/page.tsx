'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { TaxonomyCategory, TaxonomyType } from '@/lib/constants/oasf';

// Dynamic import for code splitting - TaxonomyTemplate is a large component
const TaxonomyTemplate = dynamic(
  () => import('@/components/templates/taxonomy-template').then((mod) => mod.TaxonomyTemplate),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--pixel-gray-400)] animate-pulse">Loading taxonomy...</div>
      </div>
    ),
  },
);

/**
 * Taxonomy browser page - allows users to explore OASF taxonomy
 * and navigate to filtered search results.
 */
export default function TaxonomyPage() {
  const router = useRouter();

  const handleCategorySelect = useCallback(
    (category: TaxonomyCategory, type: TaxonomyType) => {
      // Navigate to explore page with the category filter
      const paramName = type === 'skill' ? 'skills' : 'domains';
      router.push(`/explore?${paramName}=${category.slug}`);
    },
    [router],
  );

  return <TaxonomyTemplate onCategorySelect={handleCategorySelect} />;
}
