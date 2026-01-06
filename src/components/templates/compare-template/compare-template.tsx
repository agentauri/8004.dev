import { ArrowLeft, GitCompareArrows } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { PixelClippy } from '@/components/atoms';
import { Footer, Header } from '@/components/organisms';
import { CompareTable, type CompareTableAgent } from '@/components/organisms/compare-table';
import { cn } from '@/lib/utils';

export interface CompareTemplateProps {
  /** Agents to compare */
  agents: CompareTableAgent[];
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when an agent is removed */
  onRemoveAgent?: (agentId: string) => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * Template for the agent comparison page.
 * Displays a header, comparison table, and footer.
 *
 * @example
 * ```tsx
 * <CompareTemplate
 *   agents={comparedAgents}
 *   onRemoveAgent={(id) => removeAgent(id)}
 * />
 * ```
 */
export function CompareTemplate({
  agents,
  isLoading = false,
  onRemoveAgent,
  className,
}: CompareTemplateProps): React.JSX.Element {
  return (
    <div className={cn('min-h-screen flex flex-col', className)} data-testid="compare-template">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Explore</span>
          </Link>

          <div className="flex items-center gap-3">
            <GitCompareArrows size={32} className="text-[var(--pixel-blue-sky)]" />
            <h1 className="font-[family-name:var(--font-pixel-heading)] text-2xl md:text-3xl text-[var(--pixel-white)]">
              Compare Agents
            </h1>
          </div>

          {agents.length >= 2 && (
            <p className="mt-2 text-[var(--pixel-gray-400)]">
              Comparing {agents.length} agents side by side
            </p>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className="flex flex-col items-center justify-center py-16"
            data-testid="compare-loading"
          >
            <div className="animate-pulse flex flex-col items-center gap-4">
              <GitCompareArrows size={48} className="text-[var(--pixel-blue-sky)]" />
              <p className="font-silkscreen text-[var(--pixel-gray-400)]">Loading agents...</p>
            </div>
          </div>
        )}

        {/* Comparison table or empty state */}
        {!isLoading &&
          (agents.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16"
              data-testid="compare-empty"
            >
              <PixelClippy mood="thinking" size="lg" className="mb-6" />
              <h2 className="font-silkscreen text-xl text-[var(--pixel-white)] mb-2">
                No agents selected
              </h2>
              <p className="text-[var(--pixel-gray-400)] mb-6 text-center max-w-md">
                Select 2-4 agents from the explore page to compare them side by side.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--pixel-blue-sky)] text-[var(--pixel-black)] font-silkscreen hover:bg-[var(--pixel-blue-sky)]/80 transition-colors"
              >
                <GitCompareArrows size={18} />
                Browse Agents
              </Link>
            </div>
          ) : agents.length === 1 ? (
            <div
              className="flex flex-col items-center justify-center py-16"
              data-testid="compare-minimum"
            >
              <PixelClippy mood="thinking" size="lg" className="mb-6" />
              <h2 className="font-silkscreen text-xl text-[var(--pixel-white)] mb-2">
                Select one more agent
              </h2>
              <p className="text-[var(--pixel-gray-400)] mb-6 text-center max-w-md">
                You need at least 2 agents to compare. Add one more from the explore page.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--pixel-blue-sky)] text-[var(--pixel-black)] font-silkscreen hover:bg-[var(--pixel-blue-sky)]/80 transition-colors"
              >
                <GitCompareArrows size={18} />
                Add More Agents
              </Link>
            </div>
          ) : (
            <CompareTable agents={agents} onRemoveAgent={onRemoveAgent} />
          ))}
      </main>

      <Footer />
    </div>
  );
}
