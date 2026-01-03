'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useCallback } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { IntentGallery } from '@/components/organisms';
import { useIntents } from '@/hooks';
import type { IntentTemplate } from '@/types';

/**
 * Main intents page content
 */
function IntentsPageContent(): React.JSX.Element {
  const router = useRouter();
  const { data: templates, isLoading, error } = useIntents();

  const handleSelectTemplate = useCallback(
    (template: IntentTemplate) => {
      router.push(`/intents/${template.id}`);
    },
    [router],
  );

  if (error) {
    throw error;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-pixel-display)] text-2xl md:text-3xl text-[var(--pixel-gray-100)] shadow-[0_0_20px_var(--glow-blue)]">
          INTENT TEMPLATES
        </h1>
        <p className="font-[family-name:var(--font-pixel-body)] text-xs text-[var(--pixel-gray-400)] mt-2 uppercase tracking-wider">
          Browse workflow templates for common AI agent tasks
        </p>
      </div>

      {/* Gallery */}
      <IntentGallery
        templates={templates ?? []}
        onSelect={handleSelectTemplate}
        isLoading={isLoading}
      />
    </div>
  );
}

/**
 * Intents gallery page.
 * Lists all available intent templates with search and category filtering.
 */
export default function IntentsPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <PixelExplorer size="lg" animation="bounce" />
          <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-300)] mt-4 animate-pulse uppercase tracking-wider">
            Loading Intent Templates...
          </p>
        </div>
      }
    >
      <IntentsPageContent />
    </Suspense>
  );
}
