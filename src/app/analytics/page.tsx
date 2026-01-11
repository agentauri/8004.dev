/**
 * Analytics Dashboard Page
 *
 * Displays platform-wide statistics, charts, and metrics.
 */

'use client';

import { BarChart3 } from 'lucide-react';
import { Suspense, useState } from 'react';
import { PixelExplorer } from '@/components/atoms';
import { PageHeader, StatCard } from '@/components/molecules';
import { useAnalytics } from '@/hooks';
import { CHAINS } from '@/lib/constants/chains';
import { cn } from '@/lib/utils';
import type { Period } from '@/types/analytics';

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'hour', label: 'Last Hour' },
  { value: 'day', label: 'Last 24h' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
];

/**
 * Period selector component
 */
function PeriodSelector({
  value,
  onChange,
}: {
  value: Period;
  onChange: (period: Period) => void;
}) {
  return (
    <div className="flex gap-2" data-testid="period-selector">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 text-xs uppercase tracking-wider',
            'font-[family-name:var(--font-pixel-body)]',
            'border-2 transition-all',
            value === option.value
              ? 'bg-[var(--pixel-primary)] border-[var(--pixel-primary)] text-[var(--pixel-black)]'
              : 'bg-transparent border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-400)]',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Progress bar component for displaying percentages
 */
function ProgressBar({
  value,
  max,
  color,
  label,
}: {
  value: number;
  max: number;
  color: string;
  label: string;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-[var(--pixel-gray-400)] uppercase tracking-wider font-[family-name:var(--font-pixel-body)]">
          {label}
        </span>
        <span className="text-xs text-[var(--pixel-gray-300)] font-[family-name:var(--font-pixel-body)]">
          {value.toLocaleString()} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-2 bg-[var(--pixel-gray-700)] overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/**
 * Main analytics content
 */
function AnalyticsContent() {
  const [period, setPeriod] = useState<Period>('day');
  const { data, isLoading, error } = useAnalytics({ period });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--pixel-destructive)] font-[family-name:var(--font-pixel-body)] text-sm">
          Failed to load analytics: {error.message}
        </p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center">
          <PixelExplorer size="lg" animation="bounce" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatCard key={i} label="Loading..." value={0} isLoading />
          ))}
        </div>
      </div>
    );
  }

  const { platformStats, popularFilters, topEndpoints, searchVolume, chainActivity } = data;
  const _totalProtocolAdoption =
    platformStats.protocolAdoption.mcp +
    platformStats.protocolAdoption.a2a +
    platformStats.protocolAdoption.x402;

  return (
    <div className="space-y-8">
      {/* Period Selector */}
      <div className="flex justify-end">
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Overview Stats */}
      <section data-testid="overview-stats">
        <h2 className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gray-100)] uppercase tracking-wider mb-4">
          Platform Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Agents"
            value={platformStats.totalAgents}
            subValue={`${platformStats.activeAgents} active`}
            color="#00D800"
          />
          <StatCard
            label="Total Searches"
            value={platformStats.totalSearches}
            subValue={`${searchVolume.avgLatencyMs.toFixed(0)}ms avg`}
            color="#5c94fc"
          />
          <StatCard
            label="Classifications"
            value={platformStats.totalClassifications}
            color="#ffd700"
          />
          <StatCard
            label="Feedback Submitted"
            value={platformStats.totalFeedback}
            color="#9c54fc"
          />
        </div>
      </section>

      {/* Protocol Adoption */}
      <section data-testid="protocol-adoption">
        <h2 className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gray-100)] uppercase tracking-wider mb-4">
          Protocol Adoption
        </h2>
        <div className="bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] p-6 space-y-4">
          <ProgressBar
            label="MCP (Model Context Protocol)"
            value={platformStats.protocolAdoption.mcp}
            max={platformStats.totalAgents}
            color="#5c94fc"
          />
          <ProgressBar
            label="A2A (Agent-to-Agent)"
            value={platformStats.protocolAdoption.a2a}
            max={platformStats.totalAgents}
            color="#00D800"
          />
          <ProgressBar
            label="X.402 (Payment Protocol)"
            value={platformStats.protocolAdoption.x402}
            max={platformStats.totalAgents}
            color="#ffd700"
          />
        </div>
      </section>

      {/* Chain Distribution & Activity */}
      <section data-testid="chain-stats">
        <h2 className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gray-100)] uppercase tracking-wider mb-4">
          Chain Activity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chain Distribution */}
          <div className="bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] p-6">
            <h3 className="text-sm text-[var(--pixel-gray-400)] uppercase tracking-wider mb-4 font-[family-name:var(--font-pixel-body)]">
              Agent Distribution by Chain
            </h3>
            <div className="space-y-3">
              {Object.entries(platformStats.chainDistribution).map(([chainId, count]) => {
                const chain = CHAINS[Number(chainId)];
                return (
                  <ProgressBar
                    key={chainId}
                    label={chain?.shortName ?? `Chain ${chainId}`}
                    value={count}
                    max={platformStats.totalAgents}
                    color={chain?.color ?? '#888888'}
                  />
                );
              })}
            </div>
          </div>

          {/* Chain Activity */}
          <div className="bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] p-6">
            <h3 className="text-sm text-[var(--pixel-gray-400)] uppercase tracking-wider mb-4 font-[family-name:var(--font-pixel-body)]">
              Activity by Chain (Period)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--pixel-gray-700)]">
                    <th className="pb-2 text-xs text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)]">
                      Chain
                    </th>
                    <th className="pb-2 text-xs text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)] text-right">
                      Agents
                    </th>
                    <th className="pb-2 text-xs text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)] text-right">
                      Searches
                    </th>
                    <th className="pb-2 text-xs text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)] text-right">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(chainActivity).map(([chainId, activity]) => {
                    const chain = CHAINS[Number(chainId)];
                    return (
                      <tr
                        key={chainId}
                        className="border-b border-[var(--pixel-gray-700)] last:border-0"
                      >
                        <td
                          className="py-2 text-sm font-[family-name:var(--font-pixel-body)]"
                          style={{ color: chain?.color }}
                        >
                          {chain?.shortName ?? `Chain ${chainId}`}
                        </td>
                        <td className="py-2 text-sm text-[var(--pixel-gray-300)] text-right font-[family-name:var(--font-pixel-body)]">
                          {activity.agents}
                        </td>
                        <td className="py-2 text-sm text-[var(--pixel-gray-300)] text-right font-[family-name:var(--font-pixel-body)]">
                          {activity.searches}
                        </td>
                        <td className="py-2 text-sm text-[var(--pixel-gray-300)] text-right font-[family-name:var(--font-pixel-body)]">
                          {activity.feedback}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Search Volume & Performance */}
      <section data-testid="search-stats">
        <h2 className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gray-100)] uppercase tracking-wider mb-4">
          Search Analytics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StatCard
            label="Search Volume"
            value={searchVolume.total}
            subValue="queries"
            color="#5c94fc"
          />
          <StatCard
            label="Avg Latency"
            value={Math.round(searchVolume.avgLatencyMs)}
            subValue="milliseconds"
            color="#00D800"
          />
          <StatCard
            label="Avg Results"
            value={Math.round(searchVolume.avgResultCount * 10) / 10}
            subValue="per query"
            color="#ffd700"
          />
        </div>
      </section>

      {/* Top Endpoints */}
      <section data-testid="endpoint-stats">
        <h2 className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gray-100)] uppercase tracking-wider mb-4">
          API Endpoints
        </h2>
        <div className="bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--pixel-gray-700)]">
                <th className="pb-2 text-xs text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)]">
                  Endpoint
                </th>
                <th className="pb-2 text-xs text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)] text-center">
                  Method
                </th>
                <th className="pb-2 text-xs text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)] text-right">
                  Requests
                </th>
                <th className="pb-2 text-xs text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)] text-right">
                  Avg Latency
                </th>
                <th className="pb-2 text-xs text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)] text-right">
                  Success Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {topEndpoints.map((endpoint, _idx) => (
                <tr
                  key={`${endpoint.endpoint}-${endpoint.method}`}
                  className="border-b border-[var(--pixel-gray-700)] last:border-0"
                >
                  <td className="py-2 text-sm text-[var(--pixel-gray-200)] font-[family-name:var(--font-mono)]">
                    {endpoint.endpoint}
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs uppercase font-[family-name:var(--font-pixel-body)]',
                        endpoint.method === 'GET' && 'bg-[#00D800]/20 text-[#00D800]',
                        endpoint.method === 'POST' && 'bg-[#5c94fc]/20 text-[#5c94fc]',
                        endpoint.method === 'DELETE' && 'bg-[#fc5454]/20 text-[#fc5454]',
                      )}
                    >
                      {endpoint.method}
                    </span>
                  </td>
                  <td className="py-2 text-sm text-[var(--pixel-gray-300)] text-right font-[family-name:var(--font-pixel-body)]">
                    {endpoint.requestCount.toLocaleString()}
                  </td>
                  <td className="py-2 text-sm text-[var(--pixel-gray-300)] text-right font-[family-name:var(--font-pixel-body)]">
                    {endpoint.avgLatencyMs?.toFixed(0) ?? '-'}ms
                  </td>
                  <td className="py-2 text-right">
                    <span
                      className={cn(
                        'text-sm font-[family-name:var(--font-pixel-body)]',
                        endpoint.successRate >= 0.99 && 'text-[#00D800]',
                        endpoint.successRate >= 0.95 &&
                          endpoint.successRate < 0.99 &&
                          'text-[#ffd700]',
                        endpoint.successRate < 0.95 && 'text-[#fc5454]',
                      )}
                    >
                      {(endpoint.successRate * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Popular Filters */}
      <section data-testid="filter-stats">
        <h2 className="font-[family-name:var(--font-pixel-display)] text-lg text-[var(--pixel-gray-100)] uppercase tracking-wider mb-4">
          Popular Filters
        </h2>
        <div className="bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)] p-6">
          <div className="flex flex-wrap gap-2">
            {popularFilters.map((filter, _idx) => (
              <div
                key={`${filter.filterName}-${filter.filterValue}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--pixel-gray-700)] border border-[var(--pixel-gray-600)]"
              >
                <span className="text-xs text-[var(--pixel-gray-400)] uppercase font-[family-name:var(--font-pixel-body)]">
                  {filter.filterName}:
                </span>
                <span className="text-xs text-[var(--pixel-gray-200)] font-[family-name:var(--font-pixel-body)]">
                  {filter.filterValue}
                </span>
                <span className="text-xs text-[var(--pixel-primary)] font-[family-name:var(--font-pixel-body)]">
                  ({filter.usageCount})
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Analytics Dashboard Page
 */
export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-pixel-grid">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          title="Analytics"
          description="Platform-wide statistics, usage metrics, and performance data."
          icon={BarChart3}
          glow="blue"
          className="mb-8"
        />

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <PixelExplorer size="lg" animation="bounce" />
              <p className="font-[family-name:var(--font-pixel-body)] text-sm text-[var(--pixel-gray-300)] mt-4 animate-pulse uppercase tracking-wider">
                Loading Analytics...
              </p>
            </div>
          }
        >
          <AnalyticsContent />
        </Suspense>
      </div>
    </div>
  );
}
