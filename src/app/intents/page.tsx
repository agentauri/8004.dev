'use client';

import { Workflow } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { PageHeader } from '@/components/molecules';
import { IntentGallery } from '@/components/organisms';
import { MainLayout } from '@/components/templates';
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
      <PageHeader
        title="Intent Templates"
        description="Browse workflow templates for common AI agent tasks"
        icon={Workflow}
        glow="blue"
      />

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
    <MainLayout>
      <div className="min-h-screen bg-pixel-grid">
        <div className="max-w-7xl mx-auto px-4 py-8">
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
        </div>
      </div>
    </MainLayout>
  );
}
