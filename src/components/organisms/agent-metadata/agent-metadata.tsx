'use client';

import {
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Check,
  ExternalLink,
  FileJson,
  Key,
  Link2,
  Users,
  Shield,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { cn, formatDateTimeSafe } from '@/lib/utils';
import type { Agent } from '@/types/agent';

export interface AgentMetadataProps {
  /** Agent data */
  agent: Agent;
  /** Optional additional class names */
  className?: string;
}

/**
 * Collapsible section component for metadata display
 */
function MetadataSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-800)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-4',
          'hover:bg-[var(--pixel-gray-700)] transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--pixel-blue-sky)]',
        )}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[var(--pixel-blue-sky)]" aria-hidden="true" />
          <span className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] uppercase tracking-wider">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-[var(--pixel-gray-400)]" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[var(--pixel-gray-400)]" />
        )}
      </button>
      {isOpen && <div className="p-4 pt-0 border-t border-[var(--pixel-gray-700)]">{children}</div>}
    </div>
  );
}

/**
 * Copy button with feedback
 */
function CopyableValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      console.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-[var(--pixel-gray-700)] last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-[var(--pixel-gray-500)] text-sm mb-1">{label}</p>
        <code className="text-[var(--pixel-gray-200)] text-sm font-mono break-all">{value}</code>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          'p-1.5 rounded transition-colors flex-shrink-0',
          'hover:bg-[var(--pixel-gray-700)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--pixel-blue-sky)]',
        )}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-[var(--pixel-green-pipe)]" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-[var(--pixel-gray-400)]" />
        )}
      </button>
    </div>
  );
}

/**
 * AgentMetadata displays raw/developer-focused metadata for an agent.
 * Used in the Metadata tab of the agent detail page.
 *
 * Contains:
 * - Identifiers (Agent URI, DID, ENS)
 * - Operators list
 * - Supported Trust Models
 * - Raw OASF classification
 * - Registration details
 *
 * @example
 * ```tsx
 * <AgentMetadata agent={agentData} />
 * ```
 */
export function AgentMetadata({ agent, className }: AgentMetadataProps): React.JSX.Element {
  return (
    <div className={cn('space-y-4', className)} data-testid="agent-metadata">
      {/* Identifiers */}
      <MetadataSection title="Identifiers" icon={Key} defaultOpen>
        <div className="space-y-1 mt-3">
          <CopyableValue label="Agent ID" value={agent.id} />
          <CopyableValue label="Chain ID" value={agent.chainId.toString()} />
          <CopyableValue label="Token ID" value={agent.tokenId} />
          {agent.registration.metadataUri && (
            <CopyableValue label="Metadata URI" value={agent.registration.metadataUri} />
          )}
        </div>
      </MetadataSection>

      {/* Endpoints & Web3 Identifiers */}
      <MetadataSection title="Endpoints" icon={Link2} defaultOpen>
        <div className="space-y-1 mt-3">
          {agent.endpoints.ens && <CopyableValue label="ENS Name" value={agent.endpoints.ens} />}
          {agent.endpoints.did && <CopyableValue label="DID" value={agent.endpoints.did} />}
          {agent.endpoints.agentWallet && (
            <CopyableValue label="Agent Wallet" value={agent.endpoints.agentWallet} />
          )}
          {agent.endpoints.mcp?.url && (
            <CopyableValue label="MCP Endpoint" value={agent.endpoints.mcp.url} />
          )}
          {agent.endpoints.a2a?.url && (
            <CopyableValue label="A2A Endpoint" value={agent.endpoints.a2a.url} />
          )}
          {!agent.endpoints.ens &&
            !agent.endpoints.did &&
            !agent.endpoints.agentWallet &&
            !agent.endpoints.mcp?.url &&
            !agent.endpoints.a2a?.url && (
              <p className="text-[var(--pixel-gray-500)] text-sm py-2">
                No endpoints configured
              </p>
            )}
        </div>
      </MetadataSection>

      {/* Supported Trust Models */}
      <MetadataSection title="Supported Trust" icon={Shield}>
        <div className="mt-3">
          {agent.supportedTrust.length === 0 ? (
            <p className="text-[var(--pixel-gray-500)] text-sm">No trust models configured</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {agent.supportedTrust.map((trust) => (
                <span
                  key={trust}
                  className="px-2 py-1 bg-[var(--pixel-gray-700)] text-[var(--pixel-gray-300)] text-sm font-mono"
                >
                  {trust}
                </span>
              ))}
            </div>
          )}
        </div>
      </MetadataSection>

      {/* Registration */}
      <MetadataSection title="Registration" icon={FileJson}>
        <div className="space-y-1 mt-3">
          <CopyableValue label="Owner" value={agent.registration.owner} />
          {agent.registration.contractAddress && (
            <CopyableValue label="Contract Address" value={agent.registration.contractAddress} />
          )}
          <div className="py-2 border-b border-[var(--pixel-gray-700)]">
            <p className="text-[var(--pixel-gray-500)] text-sm mb-1">Registered At</p>
            <p className="text-[var(--pixel-gray-200)] text-sm">
              {formatDateTimeSafe(agent.registration.registeredAt) ?? 'Unknown'}
            </p>
          </div>
          <div className="py-2">
            <p className="text-[var(--pixel-gray-500)] text-sm mb-1">Status</p>
            <span
              className={cn(
                'px-2 py-0.5 text-sm font-mono',
                agent.active
                  ? 'bg-[var(--pixel-green-pipe)]/20 text-[var(--pixel-green-pipe)]'
                  : 'bg-[var(--pixel-gray-700)] text-[var(--pixel-gray-400)]',
              )}
            >
              {agent.active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </MetadataSection>

      {/* OASF Classification */}
      {agent.oasf && (
        <MetadataSection title="OASF Classification" icon={Code2}>
          <div className="mt-3">
            <pre className="p-3 bg-[var(--pixel-gray-900)] border border-[var(--pixel-gray-700)] overflow-x-auto text-sm text-[var(--pixel-gray-300)] font-mono">
              {JSON.stringify(agent.oasf, null, 2)}
            </pre>
          </div>
        </MetadataSection>
      )}

      {/* Raw Agent Data */}
      <MetadataSection title="Raw Data" icon={Code2}>
        <div className="mt-3">
          <p className="text-[var(--pixel-gray-500)] text-sm mb-2">
            Complete agent data as JSON
          </p>
          <pre className="p-3 bg-[var(--pixel-gray-900)] border border-[var(--pixel-gray-700)] overflow-x-auto text-sm text-[var(--pixel-gray-300)] font-mono max-h-96 overflow-y-auto">
            {JSON.stringify(agent, null, 2)}
          </pre>
        </div>
      </MetadataSection>
    </div>
  );
}
