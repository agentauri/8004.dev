import { Calendar, ExternalLink, FileText, Hash, Link as LinkIcon, User } from 'lucide-react';
import type React from 'react';
import { CopyButton } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { AgentRegistration as AgentRegistrationType } from '@/types/agent';

export interface AgentRegistrationProps {
  /** Agent registration data */
  registration: AgentRegistrationType;
  /** Last updated timestamp (ISO string) */
  lastUpdatedAt?: string;
  /** Optional additional class names */
  className?: string;
}

interface RegistrationRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  explorerUrl?: string;
  /** If true, value is treated as an external URL */
  isExternalUrl?: boolean;
}

const CHAIN_EXPLORERS: Record<number, string> = {
  11155111: 'https://sepolia.etherscan.io',
  84532: 'https://sepolia.basescan.org',
  80002: 'https://amoy.polygonscan.com',
};

function getExplorerUrl(chainId: number, type: 'address' | 'token', value: string): string {
  const baseUrl = CHAIN_EXPLORERS[chainId] || 'https://etherscan.io';
  if (type === 'address') {
    return `${baseUrl}/address/${value}`;
  }
  return `${baseUrl}/token/${value}`;
}

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

function truncateAddress(address: string): string {
  if (address.length <= 13) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function RegistrationRow({
  label,
  value,
  icon,
  explorerUrl,
  isExternalUrl = false,
}: RegistrationRowProps): React.JSX.Element {
  const hasValue = value && value.trim().length > 0;
  const displayValue = hasValue
    ? value.startsWith('0x')
      ? truncateAddress(value)
      : value
    : 'Not available';
  // Only show explorer link if we have a valid value
  const showExplorerLink = explorerUrl && hasValue;
  // Show external URL link for URLs (not addresses)
  const showExternalUrl = isExternalUrl && hasValue;

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
          {hasValue && (value.startsWith('0x') || isExternalUrl) && (
            <CopyButton text={value} size="sm" label={`Copy ${label}`} />
          )}
          {showExplorerLink && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--pixel-blue-sky)] hover:text-[var(--pixel-gray-100)] transition-colors"
              aria-label={`View ${label} on block explorer`}
            >
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
          {showExternalUrl && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--pixel-blue-sky)] hover:text-[var(--pixel-gray-100)] transition-colors"
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
 * AgentRegistration displays the on-chain registration information for an agent.
 * Shows owner, contract address, token ID, and registration date.
 *
 * @example
 * ```tsx
 * <AgentRegistration
 *   registration={{
 *     chainId: 11155111,
 *     tokenId: '123',
 *     contractAddress: '0x1234...',
 *     metadataUri: 'ipfs://...',
 *     owner: '0xabcd...',
 *     registeredAt: '2024-01-15T10:30:00Z',
 *   }}
 * />
 * ```
 */
export function AgentRegistration({
  registration,
  lastUpdatedAt,
  className,
}: AgentRegistrationProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'p-4 bg-[var(--pixel-gray-800)] border-2 border-[var(--pixel-gray-700)]',
        className,
      )}
      data-testid="agent-registration"
    >
      <h2 className="font-[family-name:var(--font-pixel-heading)] text-sm text-[var(--pixel-gray-100)] mb-4">
        REGISTRATION INFO
      </h2>

      <div className="space-y-0">
        <RegistrationRow
          label="Owner"
          value={registration.owner}
          icon={<User size={16} />}
          explorerUrl={getExplorerUrl(registration.chainId, 'address', registration.owner)}
        />
        <RegistrationRow
          label="Contract"
          value={registration.contractAddress}
          icon={<FileText size={16} />}
          explorerUrl={getExplorerUrl(
            registration.chainId,
            'address',
            registration.contractAddress,
          )}
        />
        <RegistrationRow label="Token ID" value={registration.tokenId} icon={<Hash size={16} />} />
        <RegistrationRow
          label="Agent URI"
          value={registration.metadataUri}
          icon={<LinkIcon size={16} />}
          isExternalUrl
        />
        <RegistrationRow
          label="Registered"
          value={formatDate(registration.registeredAt)}
          icon={<Hash size={16} />}
        />
        {lastUpdatedAt && (
          <RegistrationRow
            label="Last Updated"
            value={formatDate(lastUpdatedAt)}
            icon={<Calendar size={16} />}
          />
        )}
      </div>
    </div>
  );
}
