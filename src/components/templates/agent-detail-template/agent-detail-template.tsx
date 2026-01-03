'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type JSX, useEffect, useState } from 'react';
import { type ChainId, PixelExplorer } from '@/components/atoms';
import { EvaluationScores, IntentCard, type TabItem, TabNavigation } from '@/components/molecules';
import {
  AgentFeedbacks,
  AgentHeader,
  AgentMetadata,
  AgentOverview,
  AgentStatistics,
  EvaluationCard,
  ValidationSection,
} from '@/components/organisms';
import { cn } from '@/lib/utils';
import type {
  Agent,
  AgentFeedback,
  AgentReputation,
  AgentSummary,
  AgentValidation,
  Evaluation,
  IntentTemplate,
} from '@/types/agent';

// Lazy load RelatedAgents for better initial page load
const RelatedAgents = dynamic(
  () => import('@/components/organisms/related-agents').then((mod) => mod.RelatedAgents),
  { ssr: false },
);

/** Tab IDs for the agent detail page */
type TabId = 'overview' | 'evaluations' | 'statistics' | 'feedbacks' | 'validations' | 'metadata';

export interface AgentDetailTemplateProps {
  /** Agent data */
  agent?: Agent;
  /** Agent reputation data */
  reputation?: AgentReputation;
  /** Recent feedback entries */
  recentFeedback?: AgentFeedback[];
  /** Agent validations */
  validations?: AgentValidation[];
  /** Related agents */
  relatedAgents?: AgentSummary[];
  /** Whether related agents are loading */
  relatedAgentsLoading?: boolean;
  /** Agent evaluations */
  evaluations?: Evaluation[];
  /** Whether evaluations are loading */
  evaluationsLoading?: boolean;
  /** Matching intent templates */
  matchingIntents?: IntentTemplate[];
  /** Whether intents are loading */
  intentsLoading?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Initial tab to show (for deep linking) */
  initialTab?: TabId;
  /** Optional additional class names */
  className?: string;
}

/**
 * Get the latest completed evaluation from a list
 */
function getLatestCompletedEvaluation(evaluations?: Evaluation[]): Evaluation | undefined {
  if (!evaluations || evaluations.length === 0) return undefined;
  return evaluations.find((e) => e.status === 'completed');
}

/**
 * AgentDetailTemplate provides the page layout for agent detail pages.
 * Features a tab-based navigation for Overview, Evaluations, Statistics, Feedbacks, Validations, and Metadata.
 *
 * @example
 * ```tsx
 * <AgentDetailTemplate
 *   agent={agentData}
 *   reputation={reputationData}
 *   validations={validationsData}
 *   evaluations={evaluationsData}
 *   isLoading={false}
 * />
 * ```
 */
export function AgentDetailTemplate({
  agent,
  reputation,
  recentFeedback = [],
  validations = [],
  relatedAgents = [],
  relatedAgentsLoading = false,
  evaluations = [],
  evaluationsLoading = false,
  matchingIntents = [],
  intentsLoading = false,
  isLoading = false,
  error,
  initialTab = 'overview',
  className,
}: AgentDetailTemplateProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const router = useRouter();

  // Handle URL hash for deep linking
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as TabId;
    const validTabs: TabId[] = [
      'overview',
      'evaluations',
      'statistics',
      'feedbacks',
      'validations',
      'metadata',
    ];
    if (validTabs.includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (tabId: string) => {
    const newTab = tabId as TabId;
    setActiveTab(newTab);
    window.history.replaceState(null, '', `#${newTab}`);
  };

  // Get latest completed evaluation for header display
  const latestEval = getLatestCompletedEvaluation(evaluations);
  const completedEvaluationsCount = evaluations.filter((e) => e.status === 'completed').length;

  // Tab configuration
  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'evaluations', label: 'Evaluations', count: completedEvaluationsCount || undefined },
    { id: 'statistics', label: 'Statistics' },
    { id: 'feedbacks', label: 'Feedbacks', count: reputation?.count },
    { id: 'validations', label: 'Validations', count: validations.length },
    { id: 'metadata', label: 'Metadata' },
  ];

  // Handle creating a new evaluation
  const handleCreateEvaluation = () => {
    if (agent) {
      router.push(`/agent/${agent.id}/evaluate`);
    }
  };

  // Handle intent click
  const handleIntentClick = (intentId: string) => {
    if (agent) {
      router.push(`/intents/${intentId}?agent=${agent.id}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn('min-h-screen bg-pixel-grid p-6 md:p-8', className)}
        data-testid="agent-detail-template"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <PixelExplorer size="lg" animation="search" />
            <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)]">
              Loading agent...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn('min-h-screen bg-pixel-grid p-6 md:p-8', className)}
        data-testid="agent-detail-template"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <PixelExplorer size="lg" animation="float" />
            <p className="text-[var(--pixel-red-fire)] font-[family-name:var(--font-pixel-body)]">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!agent) {
    return (
      <div
        className={cn('min-h-screen bg-pixel-grid p-6 md:p-8', className)}
        data-testid="agent-detail-template"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <PixelExplorer size="lg" animation="walk" />
            <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)]">
              Agent not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate trust score from reputation
  const trustScore = reputation?.averageScore;

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <AgentOverview agent={agent} reputation={reputation} />

            {/* Matching Workflows Section */}
            {!intentsLoading && matchingIntents.length > 0 && (
              <section className="mt-8" data-testid="matching-workflows-section">
                <div className="mb-4">
                  <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)] text-sm uppercase tracking-wide">
                    Matching Workflows
                  </h3>
                  <p className="text-[var(--pixel-gray-400)] text-xs mt-1">
                    Intent templates this agent can participate in
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchingIntents.slice(0, 4).map((intent) => (
                    <IntentCard
                      key={intent.id}
                      template={intent}
                      onClick={() => handleIntentClick(intent.id)}
                    />
                  ))}
                </div>

                {matchingIntents.length > 4 && (
                  <Link
                    href={`/intents?agent=${agent.id}`}
                    className="inline-block mt-4 text-sm text-[var(--pixel-blue-sky)] hover:underline font-[family-name:var(--font-pixel-body)]"
                    data-testid="view-all-workflows-link"
                  >
                    View all {matchingIntents.length} matching workflows
                  </Link>
                )}
              </section>
            )}

            {/* Related Agents only on Overview tab */}
            <RelatedAgents agents={relatedAgents} isLoading={relatedAgentsLoading} maxAgents={4} />
          </div>
        );

      case 'evaluations':
        return (
          <div data-testid="evaluations-tab-content">
            {/* Header with create button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)] text-base uppercase tracking-wide">
                  Evaluation History
                </h2>
                <p className="text-[var(--pixel-gray-400)] text-xs mt-1">
                  Benchmark results for this agent
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreateEvaluation}
                className={cn(
                  'px-4 py-2 border-2 transition-all',
                  'bg-[var(--pixel-gray-dark)] border-[var(--pixel-blue-sky)]',
                  'text-[var(--pixel-blue-sky)] font-[family-name:var(--font-pixel-body)]',
                  'text-xs uppercase tracking-wide',
                  'hover:bg-[var(--pixel-blue-sky)] hover:text-[var(--pixel-black)]',
                  'hover:shadow-[0_0_12px_var(--glow-blue)]',
                )}
                data-testid="new-evaluation-button"
              >
                New Evaluation
              </button>
            </div>

            {/* Loading state */}
            {evaluationsLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <PixelExplorer size="md" animation="search" />
                <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm">
                  Loading evaluations...
                </p>
              </div>
            )}

            {/* Evaluations grid */}
            {!evaluationsLoading && evaluations.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2" data-testid="evaluations-grid">
                {evaluations.map((evaluation) => (
                  <EvaluationCard key={evaluation.id} evaluation={evaluation} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!evaluationsLoading && evaluations.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-12 gap-4 border-2 border-dashed border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-dark)]"
                data-testid="evaluations-empty-state"
              >
                <PixelExplorer size="md" animation="float" />
                <div className="text-center">
                  <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm mb-3">
                    No evaluations yet
                  </p>
                  <button
                    type="button"
                    onClick={handleCreateEvaluation}
                    className={cn(
                      'px-4 py-2 border-2 transition-all',
                      'bg-[var(--pixel-gray-dark)] border-[var(--pixel-green-pipe)]',
                      'text-[var(--pixel-green-pipe)] font-[family-name:var(--font-pixel-body)]',
                      'text-xs uppercase tracking-wide',
                      'hover:bg-[var(--pixel-green-pipe)] hover:text-[var(--pixel-black)]',
                      'hover:shadow-[0_0_12px_var(--glow-green)]',
                    )}
                    data-testid="create-first-evaluation-button"
                  >
                    Create First Evaluation
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'statistics':
        return (
          <AgentStatistics
            reputation={reputation}
            validations={validations}
            supportedTrust={agent.supportedTrust}
            registeredAt={agent.registration.registeredAt}
            healthScore={agent.healthScore}
          />
        );

      case 'feedbacks':
        return <AgentFeedbacks feedback={recentFeedback} totalCount={reputation?.count} />;

      case 'validations':
        return <ValidationSection validations={validations} agentId={agent.id} />;

      case 'metadata':
        return <AgentMetadata agent={agent} />;

      default:
        return null;
    }
  };

  return (
    <div
      className={cn('min-h-screen bg-pixel-grid p-6 md:p-8', className)}
      data-testid="agent-detail-template"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Agent Header */}
        <AgentHeader
          id={agent.id}
          name={agent.name}
          chainId={agent.chainId as ChainId}
          isActive={agent.active}
          trustScore={trustScore}
          healthScore={agent.healthScore?.overallScore}
          warningsCount={agent.warnings?.length}
          image={agent.image}
          feedbackCount={reputation?.count}
          validationCount={validations.length}
        />

        {/* Evaluation Scores in Header (if completed evaluations exist) */}
        {latestEval && (
          <div
            className="p-4 border-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-dark)]"
            data-testid="header-evaluation-scores"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider text-[var(--pixel-gray-400)]">
                Latest Evaluation Scores
              </span>
              <Link
                href={`/agent/${agent.id}#evaluations`}
                className="text-[0.625rem] text-[var(--pixel-blue-sky)] hover:underline font-mono"
                onClick={() => setActiveTab('evaluations')}
              >
                View all evaluations
              </Link>
            </div>
            <EvaluationScores scores={latestEval.scores} layout="horizontal" size="sm" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3" data-testid="agent-action-buttons">
          <Link
            href={`/agent/${agent.id}#evaluations`}
            onClick={() => setActiveTab('evaluations')}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 border-2 transition-all',
              'bg-[var(--pixel-gray-dark)] border-[var(--pixel-gray-700)]',
              'text-[var(--pixel-gray-300)] font-[family-name:var(--font-pixel-body)]',
              'text-xs uppercase tracking-wide',
              'hover:border-[var(--pixel-gold-coin)] hover:text-[var(--pixel-gold-coin)]',
              'hover:shadow-[0_0_8px_var(--glow-gold)]',
            )}
            data-testid="view-evaluations-button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            View All Evaluations
          </Link>
          <Link
            href={`/compose?agents=${agent.id}`}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 border-2 transition-all',
              'bg-[var(--pixel-gray-dark)] border-[var(--pixel-gray-700)]',
              'text-[var(--pixel-gray-300)] font-[family-name:var(--font-pixel-body)]',
              'text-xs uppercase tracking-wide',
              'hover:border-[var(--pixel-green-pipe)] hover:text-[var(--pixel-green-pipe)]',
              'hover:shadow-[0_0_8px_var(--glow-green)]',
            )}
            data-testid="add-to-team-button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Add to Team
          </Link>
        </div>

        {/* Tab Navigation */}
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          data-testid={`tabpanel-${activeTab}`}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
