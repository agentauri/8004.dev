'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { FeatureCard, IntentCard, SearchInput } from '@/components/molecules';
import {
  EvaluationCard,
  MCPConnectModal,
  StatsGrid,
  TrendingSection,
} from '@/components/organisms';
import { useEvaluations, useIntents, useStats } from '@/hooks';

// Icon components for feature cards
function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMCPModal, setShowMCPModal] = useState(false);
  const { data: stats, isLoading: statsLoading, error: statsError } = useStats();
  const { data: featuredIntents, isLoading: intentsLoading } = useIntents({ limit: 4 });
  const { data: recentEvaluations, isLoading: evaluationsLoading } = useEvaluations({
    status: 'completed',
    limit: 3,
  });

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pixel-grid overflow-y-auto">
      {/* Header with navigation */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--pixel-gray-800)] shrink-0">
        <span className="text-pixel-body text-sm text-[var(--pixel-gray-400)]">8004.dev</span>
        <nav className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowMCPModal(true)}
            className="text-pixel-body text-sm text-[var(--pixel-gold-coin)] hover:text-glow border border-[var(--pixel-gold-coin)] px-2 py-1 hover:bg-[var(--pixel-gold-coin)] hover:text-[var(--pixel-black)] transition-all"
            data-testid="home-connect-mcp"
          >
            Connect MCP
          </button>
          <Link
            href="/explore"
            className="text-pixel-body text-sm text-[var(--pixel-blue-text)] hover:text-glow-blue"
          >
            Explore
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center p-4 md:p-6 pb-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 md:space-y-4 max-w-4xl mx-auto">
          {/* Hero Title with Explorer */}
          <div className="flex flex-col items-center gap-3 md:gap-2">
            <PixelExplorer size="lg" animation="float" />
            <h1 className="text-pixel-display text-2xl md:text-4xl text-[var(--pixel-blue-text)] text-glow-blue">
              AGENT EXPLORER
            </h1>
          </div>

          {/* Status Badge - derived from stats query */}
          {statsLoading ? (
            <div className="inline-flex items-center gap-2 badge-pixel text-[var(--pixel-gray-400)] border-[var(--pixel-gray-400)]">
              <span className="w-2 h-2 bg-[var(--pixel-gray-400)] animate-pulse" />
              <span>CHECKING...</span>
            </div>
          ) : statsError ? (
            <div className="inline-flex items-center gap-2 badge-pixel text-[var(--pixel-red-fire)] border-[var(--pixel-red-fire)] glow-red">
              <span className="w-2 h-2 bg-[var(--pixel-red-fire)] animate-pulse" />
              <span>SYSTEM OFFLINE</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 badge-pixel text-[var(--pixel-green-pipe)] border-[var(--pixel-green-pipe)] glow-green">
              <span className="w-2 h-2 bg-[var(--pixel-green-pipe)] animate-glow-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
          )}

          {/* Subtitle */}
          <p className="text-pixel-body text-sm md:text-base text-[var(--pixel-gray-200)] max-w-xl mx-auto">
            Discover and explore autonomous AI agents registered on the ERC-8004 standard
          </p>

          {/* Search Input + Buttons grouped */}
          <div className="pt-2 md:pt-1 space-y-3 md:space-y-2">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              placeholder="Search agents by name..."
              className="max-w-md mx-auto"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore" className="btn-pixel-primary">
                ADVANCED SEARCH
              </Link>
              <button type="button" className="btn-pixel-secondary">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <section className="w-full max-w-4xl mx-auto mt-12" data-testid="features-section">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<ZapIcon className="w-5 h-5" />}
              title="Streaming Search"
              description="Real-time results as they're found"
              href="/explore"
              glowColor="blue"
            />
            <FeatureCard
              icon={<UsersIcon className="w-5 h-5" />}
              title="Compose Teams"
              description="Build optimal agent teams for tasks"
              href="/compose"
              glowColor="gold"
            />
            <FeatureCard
              icon={<TrophyIcon className="w-5 h-5" />}
              title="Evaluations"
              description="Benchmark agent performance"
              href="/evaluate"
              glowColor="green"
            />
          </div>
        </section>

        {/* Trending Agents */}
        <TrendingSection initialPeriod="7d" limit={5} className="w-full max-w-4xl mx-auto mt-16" />

        {/* Compose a Team CTA */}
        <section
          className="w-full max-w-4xl mx-auto mt-16 text-center py-10 px-6 bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]"
          data-testid="compose-cta-section"
        >
          <h2 className="font-[family-name:var(--font-pixel-heading)] text-xl md:text-2xl text-[var(--pixel-gray-100)] mb-4 uppercase">
            Build Your Dream Team
          </h2>
          <p className="text-[var(--pixel-gray-400)] text-sm md:text-base mb-6 max-w-lg mx-auto">
            Describe your task and let AI find the perfect combination of agents to accomplish it
          </p>
          <Link
            href="/compose"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--pixel-gold-coin)] text-[var(--pixel-black)] font-[family-name:var(--font-pixel-body)] text-sm uppercase tracking-wide border-2 border-[var(--pixel-gold-coin)] hover:bg-transparent hover:text-[var(--pixel-gold-coin)] transition-all shadow-[0_0_16px_var(--glow-gold)]"
            data-testid="compose-cta-button"
          >
            Start Composing
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        {/* Workflow Templates */}
        <section className="w-full max-w-4xl mx-auto mt-16" data-testid="intents-section">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-[family-name:var(--font-pixel-heading)] text-lg md:text-xl text-[var(--pixel-gray-100)] uppercase">
              Workflow Templates
            </h2>
            <Link
              href="/intents"
              className="text-[var(--pixel-blue-sky)] text-sm hover:underline"
              data-testid="intents-browse-link"
            >
              Browse all
            </Link>
          </div>
          {intentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`intent-skeleton-${i}`}
                  className="h-[180px] bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] animate-pulse"
                  data-testid="intent-skeleton"
                />
              ))}
            </div>
          ) : featuredIntents && featuredIntents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredIntents.map((intent) => (
                <IntentCard
                  key={intent.id}
                  template={intent}
                  onClick={() => router.push(`/intents/${intent.id}`)}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-8 text-[var(--pixel-gray-400)]"
              data-testid="intents-empty"
            >
              No workflow templates available
            </div>
          )}
        </section>

        {/* Recent Evaluations */}
        <section className="w-full max-w-4xl mx-auto mt-16" data-testid="evaluations-section">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-[family-name:var(--font-pixel-heading)] text-lg md:text-xl text-[var(--pixel-gray-100)] uppercase">
              Recent Evaluations
            </h2>
            <Link
              href="/evaluate"
              className="text-[var(--pixel-blue-sky)] text-sm hover:underline"
              data-testid="evaluations-browse-link"
            >
              View all
            </Link>
          </div>
          {evaluationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`eval-skeleton-${i}`}
                  className="h-[200px] bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)] animate-pulse"
                  data-testid="evaluation-skeleton"
                />
              ))}
            </div>
          ) : recentEvaluations && recentEvaluations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentEvaluations.map((evaluation) => (
                <EvaluationCard
                  key={evaluation.id}
                  evaluation={evaluation}
                  showAgent
                  onClick={() => router.push(`/evaluate/${evaluation.id}`)}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-8 text-[var(--pixel-gray-400)]"
              data-testid="evaluations-empty"
            >
              No recent evaluations
            </div>
          )}
        </section>

        {/* Platform Statistics */}
        <section
          className="w-full max-w-4xl mx-auto mt-16 space-y-3 md:space-y-2"
          data-testid="stats-section"
        >
          <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)] text-center uppercase">
            Platform Statistics
          </p>
          <StatsGrid stats={stats} isLoading={statsLoading} error={statsError?.message} />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-3 md:py-4 text-center space-y-1 border-t border-[var(--pixel-gray-800)] shrink-0 mt-auto">
        <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)]">
          Powered by{' '}
          <a
            href="https://eips.ethereum.org/EIPS/eip-8004"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--pixel-blue-text)] hover:text-glow"
          >
            ERC-8004
          </a>{' '}
          Trustless Agents
        </p>
        <p className="text-pixel-body text-xs text-[var(--pixel-gray-400)]">
          Built with{' '}
          <a
            href="https://github.com/agent0lab"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--pixel-gold-coin)] hover:text-glow"
          >
            Agent0 Lab
          </a>{' '}
          open-source tools
        </p>
      </footer>

      <MCPConnectModal isOpen={showMCPModal} onClose={() => setShowMCPModal(false)} />
    </div>
  );
}
