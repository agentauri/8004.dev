import { Check, ExternalLink, Minus, X } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { AgentAvatar, ChainBadge, type ChainId, TrustScore } from '@/components/atoms';
import { CapabilityTag, type CapabilityType } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { OASFItem } from '@/types';

export interface CompareTableAgent {
  /** Agent ID (chainId:tokenId) */
  id: string;
  /** Agent name */
  name: string;
  /** Agent description */
  description?: string;
  /** Agent image URL */
  image?: string;
  /** Chain ID */
  chainId: ChainId;
  /** Whether agent is active */
  isActive: boolean;
  /** Whether agent is verified */
  isVerified?: boolean;
  /** Trust score (0-100) */
  trustScore?: number;
  /** Capabilities */
  capabilities?: CapabilityType[];
  /** OASF skills */
  oasfSkills?: OASFItem[];
  /** OASF domains */
  oasfDomains?: OASFItem[];
  /** Wallet address */
  walletAddress?: string;
  /** Supported trust mechanisms */
  supportedTrust?: string[];
  /** Reputation count */
  reputationCount?: number;
}

export interface CompareTableProps {
  /** Agents to compare */
  agents: CompareTableAgent[];
  /** Callback when agent is removed */
  onRemoveAgent?: (agentId: string) => void;
  /** Optional additional class names */
  className?: string;
}

interface RowProps {
  label: string;
  children: React.ReactNode[];
  className?: string;
}

function CompareRow({ label, children, className }: RowProps) {
  return (
    <div
      className={cn('grid border-b border-[var(--pixel-gray-700)]', className)}
      style={{ gridTemplateColumns: `160px repeat(${children.length}, 1fr)` }}
      data-testid={`compare-row-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="p-3 bg-[var(--pixel-gray-800)] text-[var(--pixel-gray-400)] text-sm font-silkscreen border-r border-[var(--pixel-gray-700)]">
        {label}
      </div>
      {children.map((child, index) => (
        <div
          key={`${label}-${index}`}
          className={cn(
            'p-3 text-sm',
            index < children.length - 1 && 'border-r border-[var(--pixel-gray-700)]',
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

function BooleanIndicator({ value }: { value: boolean | undefined }) {
  if (value === undefined) {
    return <Minus size={16} className="text-[var(--pixel-gray-500)]" aria-label="Not applicable" />;
  }
  return value ? (
    <Check size={16} className="text-[var(--pixel-green-pipe)]" aria-label="Yes" />
  ) : (
    <X size={16} className="text-[var(--pixel-red-fire)]" aria-label="No" />
  );
}

/**
 * Side-by-side comparison table for agents.
 * Displays agent properties in a grid for easy comparison.
 *
 * @example
 * ```tsx
 * <CompareTable
 *   agents={[agent1, agent2, agent3]}
 *   onRemoveAgent={(id) => removeFromComparison(id)}
 * />
 * ```
 */
export function CompareTable({
  agents,
  onRemoveAgent,
  className,
}: CompareTableProps): React.JSX.Element {
  if (agents.length === 0) {
    return (
      <div
        className="p-8 text-center text-[var(--pixel-gray-400)]"
        data-testid="compare-table-empty"
      >
        <p className="font-silkscreen">No agents selected for comparison</p>
        <p className="mt-2 text-sm">Select 2-4 agents from the explore page to compare them.</p>
      </div>
    );
  }

  if (agents.length < 2) {
    return (
      <div
        className="p-8 text-center text-[var(--pixel-gray-400)]"
        data-testid="compare-table-minimum"
      >
        <p className="font-silkscreen">Select at least 2 agents to compare</p>
        <p className="mt-2 text-sm">Add one more agent from the explore page.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-dark)]',
        className,
      )}
      data-testid="compare-table"
    >
      {/* Header row with agent avatars and names */}
      <div
        className="grid border-b-2 border-[var(--pixel-gray-600)]"
        style={{ gridTemplateColumns: `160px repeat(${agents.length}, 1fr)` }}
      >
        <div className="p-3 bg-[var(--pixel-gray-800)] border-r border-[var(--pixel-gray-700)]" />
        {agents.map((agent, index) => (
          <div
            key={agent.id}
            className={cn(
              'p-4 flex flex-col items-center gap-3 bg-[var(--pixel-gray-800)]',
              index < agents.length - 1 && 'border-r border-[var(--pixel-gray-700)]',
            )}
            data-testid={`compare-header-${agent.id}`}
          >
            <AgentAvatar name={agent.name} image={agent.image} size="lg" />
            <div className="text-center">
              <h3 className="font-silkscreen text-[var(--pixel-white)] text-sm truncate max-w-[150px]">
                {agent.name}
              </h3>
              <p className="text-[var(--pixel-gray-500)] text-xs font-mono mt-1">{agent.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/agent/${agent.id}`}
                className="text-[var(--pixel-blue-sky)] hover:text-[var(--pixel-blue-text)] transition-colors"
                title="View agent details"
              >
                <ExternalLink size={16} />
              </Link>
              {onRemoveAgent && (
                <button
                  type="button"
                  onClick={() => onRemoveAgent(agent.id)}
                  className="text-[var(--pixel-gray-500)] hover:text-[var(--pixel-red-fire)] transition-colors"
                  aria-label={`Remove ${agent.name} from comparison`}
                  data-testid={`compare-remove-${agent.id}`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chain */}
      <CompareRow label="Network">
        {agents.map((agent) => (
          <ChainBadge key={agent.id} chainId={agent.chainId} />
        ))}
      </CompareRow>

      {/* Status */}
      <CompareRow label="Status">
        {agents.map((agent) => (
          <span
            key={agent.id}
            className={cn(
              'font-silkscreen text-xs',
              agent.isActive ? 'text-[var(--pixel-green-pipe)]' : 'text-[var(--pixel-gray-500)]',
            )}
          >
            {agent.isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        ))}
      </CompareRow>

      {/* Verified */}
      <CompareRow label="Verified">
        {agents.map((agent) => (
          <BooleanIndicator key={agent.id} value={agent.isVerified} />
        ))}
      </CompareRow>

      {/* Trust Score */}
      <CompareRow label="Trust Score">
        {agents.map((agent) => (
          <div key={agent.id}>
            {agent.trustScore !== undefined ? (
              <TrustScore score={agent.trustScore} count={agent.reputationCount} />
            ) : (
              <span className="text-[var(--pixel-gray-500)]">—</span>
            )}
          </div>
        ))}
      </CompareRow>

      {/* Description */}
      <CompareRow label="Description">
        {agents.map((agent) => (
          <p key={agent.id} className="text-[var(--pixel-gray-300)] line-clamp-3">
            {agent.description || <span className="text-[var(--pixel-gray-500)]">—</span>}
          </p>
        ))}
      </CompareRow>

      {/* Capabilities */}
      <CompareRow label="Protocols">
        {agents.map((agent) => (
          <div key={agent.id} className="flex flex-wrap gap-1">
            {agent.capabilities?.length ? (
              agent.capabilities.map((cap) => <CapabilityTag key={cap} type={cap} />)
            ) : (
              <span className="text-[var(--pixel-gray-500)]">—</span>
            )}
          </div>
        ))}
      </CompareRow>

      {/* Supported Trust */}
      <CompareRow label="Trust Mechanisms">
        {agents.map((agent) => (
          <div key={agent.id} className="flex flex-wrap gap-1">
            {agent.supportedTrust?.length ? (
              agent.supportedTrust.map((trust) => (
                <span
                  key={trust}
                  className="px-2 py-0.5 bg-[var(--pixel-green-pipe)]/20 text-[var(--pixel-green-pipe)] text-[0.625rem] uppercase font-silkscreen"
                >
                  {trust}
                </span>
              ))
            ) : (
              <span className="text-[var(--pixel-gray-500)]">—</span>
            )}
          </div>
        ))}
      </CompareRow>

      {/* OASF Skills */}
      <CompareRow label="Skills">
        {agents.map((agent) => (
          <div key={agent.id} className="flex flex-wrap gap-1">
            {agent.oasfSkills?.length ? (
              agent.oasfSkills.slice(0, 5).map((skill) => (
                <span
                  key={skill.slug}
                  className="px-2 py-0.5 text-[0.625rem] bg-[var(--pixel-blue-sky)]/20 text-[var(--pixel-blue-text)] font-silkscreen uppercase"
                  title={`${skill.slug} (${Math.round(skill.confidence * 100)}%)`}
                >
                  {skill.slug.split('/').pop()}
                </span>
              ))
            ) : (
              <span className="text-[var(--pixel-gray-500)]">—</span>
            )}
          </div>
        ))}
      </CompareRow>

      {/* OASF Domains */}
      <CompareRow label="Domains">
        {agents.map((agent) => (
          <div key={agent.id} className="flex flex-wrap gap-1">
            {agent.oasfDomains?.length ? (
              agent.oasfDomains.slice(0, 3).map((domain) => (
                <span
                  key={domain.slug}
                  className="px-2 py-0.5 text-[0.625rem] bg-[var(--pixel-gold-coin)]/20 text-[var(--pixel-gold-coin)] font-silkscreen uppercase"
                  title={`${domain.slug} (${Math.round(domain.confidence * 100)}%)`}
                >
                  {domain.slug.split('/').pop()}
                </span>
              ))
            ) : (
              <span className="text-[var(--pixel-gray-500)]">—</span>
            )}
          </div>
        ))}
      </CompareRow>

      {/* Wallet Address */}
      <CompareRow label="Wallet">
        {agents.map((agent) => (
          <div key={agent.id} className="font-mono text-xs text-[var(--pixel-gray-400)]">
            {agent.walletAddress ? (
              <span title={agent.walletAddress}>
                {`${agent.walletAddress.slice(0, 6)}...${agent.walletAddress.slice(-4)}`}
              </span>
            ) : (
              <span className="text-[var(--pixel-gray-500)]">—</span>
            )}
          </div>
        ))}
      </CompareRow>
    </div>
  );
}
