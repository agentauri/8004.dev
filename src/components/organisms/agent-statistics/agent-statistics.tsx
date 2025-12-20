import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Shield,
  Star,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { ReputationDistribution, StatCard } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type {
  AgentHealthScore,
  AgentReputation,
  AgentValidation,
  HealthCheckStatus,
} from '@/types/agent';

export interface AgentStatisticsProps {
  /** Agent reputation data */
  reputation?: AgentReputation;
  /** Agent validations */
  validations?: AgentValidation[];
  /** Supported trust mechanisms */
  supportedTrust?: string[];
  /** Registration date */
  registeredAt?: string;
  /** Agent health score with checks breakdown */
  healthScore?: AgentHealthScore;
  /** Whether the section is loading */
  isLoading?: boolean;
  /** Optional additional class names */
  className?: string;
}

/** Trust model descriptions */
const TRUST_MODEL_DESCRIPTIONS: Record<string, string> = {
  reputation: 'Community feedback and ratings from other agents and users',
  tee: 'Trusted Execution Environment - Hardware-based security attestation',
  zkml: 'Zero-Knowledge Machine Learning - Cryptographic proof of model behavior',
  stake: 'Economic stake - Collateral backing agent behavior guarantees',
};

/** Health check status styles */
const HEALTH_STATUS_CONFIG: Record<
  HealthCheckStatus,
  { icon: React.ReactNode; colorClass: string; bgClass: string }
> = {
  pass: {
    icon: <CheckCircle size={16} />,
    colorClass: 'text-[var(--pixel-green-pipe)]',
    bgClass: 'bg-[rgba(0,216,0,0.1)]',
  },
  warning: {
    icon: <AlertTriangle size={16} />,
    colorClass: 'text-[var(--pixel-gold-coin)]',
    bgClass: 'bg-[rgba(252,192,60,0.1)]',
  },
  fail: {
    icon: <XCircle size={16} />,
    colorClass: 'text-[var(--pixel-red-fire)]',
    bgClass: 'bg-[rgba(252,84,84,0.1)]',
  },
};

/**
 * AgentStatistics displays detailed statistics for an agent.
 * Used in the Statistics tab of the agent detail page.
 *
 * Contains:
 * - Stats grid: Average Score, Total Feedbacks, Validations Count
 * - Score distribution chart
 * - Supported Trust Models with descriptions
 *
 * @example
 * ```tsx
 * <AgentStatistics
 *   reputation={reputationData}
 *   validations={validationsData}
 *   supportedTrust={['reputation', 'stake']}
 * />
 * ```
 */
export function AgentStatistics({
  reputation,
  validations = [],
  supportedTrust = [],
  registeredAt,
  healthScore,
  isLoading = false,
  className,
}: AgentStatisticsProps): React.JSX.Element {
  // Calculate valid validations count
  const validValidationsCount = validations.filter((v) => v.status === 'valid').length;

  // Format registration date
  const formattedDate = registeredAt
    ? new Date(registeredAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined;

  return (
    <div className={cn('space-y-6', className)} data-testid="agent-statistics">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Average Score"
          value={reputation?.averageScore ?? 0}
          subValue="/ 100"
          color="var(--pixel-blue-sky)"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Feedbacks"
          value={reputation?.count ?? 0}
          color="var(--pixel-green-pipe)"
          isLoading={isLoading}
        />
        <StatCard
          label="Validations"
          value={validValidationsCount}
          subValue={validations.length > 0 ? `/ ${validations.length} total` : undefined}
          color="var(--pixel-gold-coin)"
          isLoading={isLoading}
        />
        <StatCard
          label="Trust Models"
          value={supportedTrust.length}
          color="var(--pixel-gray-400)"
          isLoading={isLoading}
        />
      </div>

      {/* Score Distribution */}
      {reputation && reputation.count > 0 && (
        <div className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-[var(--pixel-blue-text)]" aria-hidden="true" />
            <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-200)] text-sm uppercase tracking-wider">
              Score Distribution
            </h3>
          </div>
          <ReputationDistribution
            averageScore={reputation.averageScore}
            count={reputation.count}
            distribution={reputation.distribution}
            showDetails={true}
          />
        </div>
      )}

      {/* Health Checks Breakdown */}
      {healthScore?.checks && healthScore.checks.length > 0 && (
        <div
          className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]"
          data-testid="health-checks-section"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--pixel-blue-text)]" aria-hidden="true" />
              <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-200)] text-sm uppercase tracking-wider">
                Health Checks
              </h3>
            </div>
            <span className="text-[var(--pixel-gray-400)] text-sm font-mono">
              {healthScore.overallScore}/100
            </span>
          </div>
          <div className="space-y-2">
            {healthScore.checks.map((check) => {
              const config = HEALTH_STATUS_CONFIG[check.status] || HEALTH_STATUS_CONFIG.warning;
              return (
                <div
                  key={check.category}
                  className={cn(
                    'flex items-start gap-3 p-3 border-2 border-[var(--pixel-gray-700)]',
                    config.bgClass,
                  )}
                  data-testid="health-check-item"
                  data-category={check.category}
                  data-status={check.status}
                >
                  <div className={cn('shrink-0 mt-0.5', config.colorClass)}>{config.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-200)] text-sm uppercase">
                        {check.category}
                      </span>
                      <span className={cn('text-xs font-mono', config.colorClass)}>
                        {check.score}/100
                      </span>
                    </div>
                    <p className="text-[var(--pixel-gray-400)] text-xs mt-1">{check.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Supported Trust Models */}
      <div className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[var(--pixel-green-pipe)]" aria-hidden="true" />
          <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-200)] text-sm uppercase tracking-wider">
            Supported Trust Models
          </h3>
        </div>

        {supportedTrust.length === 0 ? (
          <p className="text-[var(--pixel-gray-500)] text-sm">
            No trust models configured for this agent.
          </p>
        ) : (
          <div className="space-y-3">
            {supportedTrust.map((trust) => (
              <div
                key={trust}
                className="flex items-start gap-3 p-3 bg-[var(--pixel-gray-700)] rounded"
              >
                <div className="p-1.5 bg-[var(--pixel-green-pipe)]/20 rounded">
                  <Shield className="w-4 h-4 text-[var(--pixel-green-pipe)]" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-200)] text-sm uppercase">
                    {trust}
                  </p>
                  <p className="text-[var(--pixel-gray-400)] text-xs mt-0.5">
                    {TRUST_MODEL_DESCRIPTIONS[trust.toLowerCase()] ?? 'Custom trust mechanism'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registration Info */}
      {formattedDate && (
        <div className="p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-[var(--pixel-gold-coin)]" aria-hidden="true" />
            <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-200)] text-sm uppercase tracking-wider">
              Registration Date
            </h3>
          </div>
          <p className="text-[var(--pixel-gray-300)] text-sm">{formattedDate}</p>
        </div>
      )}
    </div>
  );
}
