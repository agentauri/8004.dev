'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, type JSX } from 'react';
import { PixelExplorer, type ChainId } from '@/components/atoms';
import { TabNavigation, type TabItem } from '@/components/molecules';
import {
  AgentFeedbacks,
  AgentHeader,
  AgentMetadata,
  AgentOverview,
  AgentStatistics,
  ValidationSection,
} from '@/components/organisms';
import { cn } from '@/lib/utils';
import type { Agent, AgentFeedback, AgentReputation, AgentSummary, AgentValidation } from '@/types/agent';

// Lazy load RelatedAgents for better initial page load
const RelatedAgents = dynamic(
  () => import('@/components/organisms/related-agents').then((mod) => mod.RelatedAgents),
  { ssr: false },
);

/** Tab IDs for the agent detail page */
type TabId = 'overview' | 'statistics' | 'feedbacks' | 'validations' | 'metadata';

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
 * AgentDetailTemplate provides the page layout for agent detail pages.
 * Features a tab-based navigation for Overview, Statistics, Feedbacks, Validations, and Metadata.
 *
 * @example
 * ```tsx
 * <AgentDetailTemplate
 *   agent={agentData}
 *   reputation={reputationData}
 *   validations={validationsData}
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
  isLoading = false,
  error,
  initialTab = 'overview',
  className,
}: AgentDetailTemplateProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  // Handle URL hash for deep linking
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as TabId;
    const validTabs: TabId[] = ['overview', 'statistics', 'feedbacks', 'validations', 'metadata'];
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

  // Tab configuration
  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'feedbacks', label: 'Feedbacks', count: reputation?.count },
    { id: 'validations', label: 'Validations', count: validations.length },
    { id: 'metadata', label: 'Metadata' },
  ];

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
            {/* Related Agents only on Overview tab */}
            <RelatedAgents agents={relatedAgents} isLoading={relatedAgentsLoading} maxAgents={4} />
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
        return (
          <AgentFeedbacks
            feedback={recentFeedback}
            totalCount={reputation?.count}
          />
        );

      case 'validations':
        return (
          <ValidationSection
            validations={validations}
            agentId={agent.id}
          />
        );

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

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

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
