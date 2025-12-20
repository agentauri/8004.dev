import { ExternalLink, Globe, Key, Wallet } from 'lucide-react';
import type React from 'react';
import { CopyButton } from '@/components/atoms';
import { CapabilityTag } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { AgentEndpoints as AgentEndpointsType } from '@/types/agent';

export interface AgentEndpointsProps {
  /** Agent endpoints data */
  endpoints: AgentEndpointsType;
  /** Whether agent supports X402 */
  x402Support?: boolean;
  /** Optional additional class names */
  className?: string;
}

interface EndpointRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  isUrl?: boolean;
}

function EndpointRow({ label, value, icon, isUrl = false }: EndpointRowProps): React.JSX.Element {
  const hasValue = value && value.trim().length > 0;
  const displayValue = hasValue ? value : 'Not available';
  // Only show as URL if it's a valid URL (non-empty)
  const showAsUrl = isUrl && hasValue;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--pixel-gray-700)] last:border-b-0">
      <div className="text-[var(--pixel-gray-500)] shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-[var(--pixel-gray-500)] font-[family-name:var(--font-pixel-body)] mb-1">
          {label}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm font-mono truncate',
              hasValue ? 'text-[var(--pixel-gray-200)]' : 'text-[var(--pixel-gray-500)] italic',
            )}
            title={hasValue ? value : undefined}
          >
            {displayValue}
          </span>
          {hasValue && <CopyButton text={value} size="sm" label={`Copy ${label}`} />}
          {showAsUrl && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--pixel-blue-text)] hover:text-[var(--pixel-gray-100)] transition-colors"
              aria-label={`Open ${label} in new tab`}
            >
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * AgentEndpoints displays the connectivity endpoints for an agent.
 * Shows MCP, A2A, ENS, DID, and agent wallet information.
 *
 * @example
 * ```tsx
 * <AgentEndpoints
 *   endpoints={{
 *     mcp: { url: 'https://mcp.example.com', version: '1.0' },
 *     a2a: { url: 'https://a2a.example.com', version: '1.0' },
 *     ens: 'agent.eth',
 *   }}
 *   x402Support={true}
 * />
 * ```
 */
export function AgentEndpoints({
  endpoints,
  x402Support = false,
  className,
}: AgentEndpointsProps): React.JSX.Element {
  const hasEndpoints =
    endpoints.mcp || endpoints.a2a || endpoints.ens || endpoints.did || endpoints.agentWallet;

  return (
    <div
      className={cn(
        'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="agent-endpoints"
    >
      <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
        ENDPOINTS & CAPABILITIES
      </h2>

      {/* Capability tags */}
      <div className="flex gap-2 flex-wrap mb-4">
        {endpoints.mcp && <CapabilityTag type="mcp" />}
        {endpoints.a2a && <CapabilityTag type="a2a" />}
        {x402Support && <CapabilityTag type="x402" />}
      </div>

      {/* Endpoints list */}
      {hasEndpoints ? (
        <div className="space-y-0">
          {endpoints.mcp && (
            <EndpointRow
              label={`MCP Endpoint (v${endpoints.mcp.version})`}
              value={endpoints.mcp.url}
              icon={<Globe size={16} />}
              isUrl
            />
          )}
          {endpoints.a2a && (
            <EndpointRow
              label={`A2A Endpoint (v${endpoints.a2a.version})`}
              value={endpoints.a2a.url}
              icon={<Globe size={16} />}
              isUrl
            />
          )}
          {endpoints.ens && (
            <EndpointRow label="ENS Name" value={endpoints.ens} icon={<Globe size={16} />} />
          )}
          {endpoints.did && (
            <EndpointRow label="DID" value={endpoints.did} icon={<Key size={16} />} />
          )}
          {endpoints.agentWallet && (
            <EndpointRow
              label="Agent Wallet"
              value={endpoints.agentWallet}
              icon={<Wallet size={16} />}
            />
          )}
        </div>
      ) : (
        <p className="text-sm text-[var(--pixel-gray-500)]">No endpoints configured</p>
      )}
    </div>
  );
}
