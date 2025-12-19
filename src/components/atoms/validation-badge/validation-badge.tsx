import { Coins, Lock, ShieldCheck, ShieldOff } from 'lucide-react';
import type React from 'react';
import { cn } from '@/lib/utils';

export type ValidationType = 'tee' | 'zkml' | 'stake' | 'none';
export type ValidationStatus = 'valid' | 'pending' | 'expired' | 'none';

export interface ValidationBadgeProps {
  /** The validation type (TEE, zkML, stake-based, or none) */
  type: ValidationType;
  /** The validation status */
  status: ValidationStatus;
  /** Optional attestation ID for verified validations */
  attestationId?: string;
  /** Optional additional class names */
  className?: string;
}

interface ValidationConfig {
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  colorClass: string;
  glowClass: string;
  bgClass: string;
}

const TYPE_CONFIG: Record<
  ValidationType,
  Omit<ValidationConfig, 'colorClass' | 'glowClass' | 'bgClass'>
> = {
  tee: {
    label: 'TEE',
    icon: ShieldCheck,
  },
  zkml: {
    label: 'ZKML',
    icon: Lock,
  },
  stake: {
    label: 'STAKE',
    icon: Coins,
  },
  none: {
    label: 'NONE',
    icon: ShieldOff,
  },
};

const STATUS_STYLE: Record<
  ValidationStatus,
  Pick<ValidationConfig, 'colorClass' | 'glowClass' | 'bgClass'>
> = {
  valid: {
    colorClass: 'text-[var(--pixel-green-pipe)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-green)]',
    bgClass: 'bg-[rgba(0,216,0,0.1)]',
  },
  pending: {
    colorClass: 'text-[var(--pixel-gold-coin)]',
    glowClass: 'shadow-[0_0_8px_var(--glow-gold)]',
    bgClass: 'bg-[rgba(252,192,60,0.1)]',
  },
  expired: {
    colorClass: 'text-[var(--pixel-gray-400)]',
    glowClass: '',
    bgClass: 'bg-[rgba(136,136,136,0.1)]',
  },
  none: {
    colorClass: 'text-[var(--pixel-gray-700)]',
    glowClass: '',
    bgClass: 'bg-[rgba(58,58,58,0.1)]',
  },
};

/**
 * ValidationBadge displays the validation method and status for ERC-8004 agents.
 * Supports TEE attestation, zkML proof, stake-based validation, or no validation.
 *
 * @example
 * ```tsx
 * <ValidationBadge type="tee" status="valid" attestationId="0x123..." />
 * <ValidationBadge type="zkml" status="pending" />
 * <ValidationBadge type="stake" status="valid" />
 * <ValidationBadge type="none" status="none" />
 * ```
 */
export function ValidationBadge({
  type,
  status,
  attestationId,
  className,
}: ValidationBadgeProps): React.JSX.Element {
  const typeConfig = TYPE_CONFIG[type];
  const statusStyle = STATUS_STYLE[status];
  const Icon = typeConfig.icon;

  return (
    <span
      className={cn(
        'badge-pixel gap-1',
        statusStyle.colorClass,
        statusStyle.glowClass,
        statusStyle.bgClass,
        className,
      )}
      data-testid="validation-badge"
      data-type={type}
      data-status={status}
      {...(attestationId ? { 'data-attestation': attestationId } : {})}
      {...(attestationId ? { title: `Attestation: ${attestationId}` } : {})}
    >
      <Icon className="w-3 h-3" aria-hidden={true} />
      {typeConfig.label}
    </span>
  );
}
