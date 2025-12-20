'use client';

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Coins,
  ExternalLink,
  Lock,
  Shield,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { ValidationBadge } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { AgentValidation, ValidationStatus, ValidationType } from '@/types/agent';

export interface ValidationSectionProps {
  /** List of validations for the agent */
  validations: AgentValidation[];
  /** Agent ID for explorer links */
  agentId?: string;
  /** Whether the section is in loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/** Configuration for validation type display */
const VALIDATION_TYPE_CONFIG: Record<
  ValidationType,
  { icon: React.ElementType; label: string; description: string }
> = {
  tee: {
    icon: Shield,
    label: 'TEE Attestation',
    description:
      'Hardware-based Trusted Execution Environment validation ensures code runs in a secure enclave.',
  },
  zkml: {
    icon: Lock,
    label: 'zkML Proof',
    description: 'Zero-knowledge machine learning proof cryptographically verifies model behavior.',
  },
  stake: {
    icon: Coins,
    label: 'Economic Stake',
    description: 'Economic security through staked collateral backing agent behavior.',
  },
  none: {
    icon: AlertCircle,
    label: 'No Validation',
    description: 'This agent has no on-chain validation.',
  },
};

/** Configuration for validation status display */
const STATUS_CONFIG: Record<
  ValidationStatus,
  { icon: React.ElementType; label: string; color: string; bgColor: string }
> = {
  valid: {
    icon: CheckCircle,
    label: 'COMPLETED',
    color: 'text-[var(--pixel-green-pipe)]',
    bgColor: 'bg-[rgba(0,216,0,0.15)]',
  },
  pending: {
    icon: Clock,
    label: 'PENDING',
    color: 'text-[var(--pixel-gold-coin)]',
    bgColor: 'bg-[rgba(252,192,60,0.15)]',
  },
  expired: {
    icon: XCircle,
    label: 'EXPIRED',
    color: 'text-[var(--pixel-gray-400)]',
    bgColor: 'bg-[rgba(136,136,136,0.15)]',
  },
  none: {
    icon: AlertCircle,
    label: 'NONE',
    color: 'text-[var(--pixel-gray-500)]',
    bgColor: 'bg-[rgba(58,58,58,0.15)]',
  },
};

/**
 * Format timestamp for display
 */
function formatDate(timestamp: string | undefined): string {
  if (!timestamp) return 'Unknown';
  try {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * ValidationSection displays detailed validation information for an agent.
 * Shows validation type, status, attestation details, and timeline.
 *
 * Features:
 * - List view of all validations
 * - Type-specific icons and descriptions
 * - Status with timestamps
 * - Links to external explorer for verification
 *
 * @example
 * ```tsx
 * <ValidationSection
 *   validations={[
 *     { type: 'tee', status: 'valid', attestationId: '0x123...', timestamp: '2024-01-01' },
 *     { type: 'stake', status: 'pending', validatorAddress: '0xabc...' },
 *   ]}
 *   agentId="11155111:42"
 * />
 * ```
 */
export function ValidationSection({
  validations,
  agentId,
  isLoading = false,
  className,
}: ValidationSectionProps): React.JSX.Element {
  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={cn('space-y-4', className)}
        data-testid="validation-section"
        data-loading="true"
      >
        <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-200)] text-sm uppercase tracking-wider">
          Validations
        </h3>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 bg-[var(--pixel-gray-dark)] border border-[var(--pixel-gray-700)] animate-pulse"
            >
              <div className="h-4 bg-[var(--pixel-gray-700)] rounded w-32 mb-2" />
              <div className="h-3 bg-[var(--pixel-gray-700)] rounded w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (validations.length === 0) {
    return (
      <div
        className={cn('space-y-4', className)}
        data-testid="validation-section"
        data-empty="true"
      >
        <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-200)] text-sm uppercase tracking-wider">
          Validations
        </h3>
        <div className="p-6 bg-[var(--pixel-gray-dark)] border border-[var(--pixel-gray-700)] text-center">
          <AlertCircle className="w-8 h-8 text-[var(--pixel-gray-500)] mx-auto mb-2" />
          <p className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-sm">
            No validations registered for this agent
          </p>
          <p className="text-[var(--pixel-gray-500)] text-xs mt-1">
            Validations provide cryptographic or economic guarantees about agent behavior.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)} data-testid="validation-section">
      <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-200)] text-sm uppercase tracking-wider">
        Validations ({validations.length})
      </h3>

      <div className="space-y-3">
        {validations.map((validation, index) => {
          const typeConfig = VALIDATION_TYPE_CONFIG[validation.type];
          const statusConfig = STATUS_CONFIG[validation.status];
          const TypeIcon = typeConfig.icon;
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={`${validation.type}-${validation.attestationId || index}`}
              className={cn(
                'p-4 bg-[var(--pixel-gray-dark)] border border-[var(--pixel-gray-700)]',
                'hover:border-[var(--pixel-gray-600)] transition-colors',
              )}
              data-testid={`validation-item-${validation.type}`}
            >
              {/* Header with badge and status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--pixel-gray-700)] rounded">
                    <TypeIcon
                      className="w-5 h-5 text-[var(--pixel-blue-text)]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h4 className="font-[family-name:var(--font-pixel-body)] text-[var(--pixel-gray-200)] text-sm">
                      {typeConfig.label}
                    </h4>
                    <p className="text-[var(--pixel-gray-500)] text-xs mt-0.5">
                      {typeConfig.description}
                    </p>
                  </div>
                </div>
                <ValidationBadge type={validation.type} status={validation.status} />
              </div>

              {/* Status and timestamps */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--pixel-gray-400)]">
                <div
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2 py-1',
                    'font-[family-name:var(--font-pixel-body)] text-[10px] uppercase tracking-wider',
                    'border border-current rounded-sm',
                    statusConfig.color,
                    statusConfig.bgColor,
                  )}
                  data-testid="validation-status-badge"
                >
                  <StatusIcon className="w-3 h-3" aria-hidden="true" />
                  <span>{statusConfig.label}</span>
                </div>

                {validation.timestamp && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Registered: {formatDate(validation.timestamp)}</span>
                  </div>
                )}

                {validation.expiresAt && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Expires: {formatDate(validation.expiresAt)}</span>
                  </div>
                )}
              </div>

              {/* Attestation details */}
              {(validation.attestationId || validation.validatorAddress) && (
                <div className="mt-3 pt-3 border-t border-[var(--pixel-gray-700)]">
                  {validation.attestationId && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--pixel-gray-500)]">Attestation ID:</span>
                      <code className="text-[var(--pixel-gray-300)] font-mono bg-[var(--pixel-gray-700)] px-1.5 py-0.5">
                        {validation.attestationId.slice(0, 10)}...
                        {validation.attestationId.slice(-8)}
                      </code>
                    </div>
                  )}

                  {validation.validatorAddress && (
                    <div className="flex items-center justify-between text-xs mt-1.5">
                      <span className="text-[var(--pixel-gray-500)]">Validator:</span>
                      <code className="text-[var(--pixel-gray-300)] font-mono bg-[var(--pixel-gray-700)] px-1.5 py-0.5">
                        {validation.validatorAddress.slice(0, 10)}...
                        {validation.validatorAddress.slice(-8)}
                      </code>
                    </div>
                  )}
                </div>
              )}

              {/* Explorer link */}
              {agentId && validation.attestationId && (
                <a
                  href={`https://8004scan.io/agent/${agentId}/validation/${validation.attestationId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'mt-3 flex items-center gap-1.5 text-xs text-[var(--pixel-blue-text)]',
                    'hover:text-[var(--pixel-gray-200)] transition-colors',
                  )}
                  data-testid="validation-explorer-link"
                >
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  Verify on Explorer
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
