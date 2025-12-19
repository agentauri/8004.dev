import { ArrowLeft, MessageSquare, Share2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';
import {
  AgentAvatar,
  ChainBadge,
  type ChainId,
  CopyButton,
  HealthBadge,
  StatusBadge,
  TrustScore,
} from '@/components/atoms';
import { cn } from '@/lib/utils';

export interface AgentHeaderProps {
  /** Agent ID */
  id: string;
  /** Agent name */
  name: string;
  /** Chain ID where agent is registered */
  chainId: ChainId;
  /** Whether agent is currently active */
  isActive: boolean;
  /** Trust score (0-100) */
  trustScore?: number;
  /** Overall health score (0-100) */
  healthScore?: number;
  /** Number of warnings for this agent */
  warningsCount?: number;
  /** Agent image URL */
  image?: string;
  /** Number of feedbacks received */
  feedbackCount?: number;
  /** Number of validations */
  validationCount?: number;
  /** Optional additional class names */
  className?: string;
}

/**
 * AgentHeader displays the main header section of an agent detail page.
 * Shows agent name, chain, status, trust score, and back navigation.
 *
 * @example
 * ```tsx
 * <AgentHeader
 *   id="11155111:123"
 *   name="AI Trading Bot"
 *   chainId={11155111}
 *   isActive={true}
 *   trustScore={85}
 * />
 * ```
 */
export function AgentHeader({
  id,
  name,
  chainId,
  isActive,
  trustScore,
  healthScore,
  warningsCount,
  image,
  feedbackCount,
  validationCount,
  className,
}: AgentHeaderProps): React.JSX.Element {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name} - Agent Explorer`,
          text: `Check out ${name} on Agent Explorer`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus('copied');
        setTimeout(() => setShareStatus('idle'), 2000);
      }
    } catch {
      // User cancelled share or clipboard failed
    }
  };

  return (
    <div className={cn('space-y-6', className)} data-testid="agent-header">
      {/* Back navigation */}
      <Link
        href="/explore"
        className={cn(
          'inline-flex items-center gap-2 text-sm',
          'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-blue-sky)]',
          'transition-colors',
        )}
        data-testid="back-link"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        <span className="font-[family-name:var(--font-pixel-body)]">Back to Explore</span>
      </Link>

      {/* Agent info */}
      <div className="flex items-start gap-3 md:gap-4">
        {/* Agent avatar */}
        <AgentAvatar name={name} image={image} size="lg" className="shrink-0" />

        {/* Agent details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <h1 className="font-[family-name:var(--font-pixel-display)] text-lg md:text-xl text-[var(--pixel-gray-100)]">
              {name}
            </h1>
            <StatusBadge status={isActive ? 'active' : 'inactive'} />
            <button
              type="button"
              onClick={handleShare}
              className={cn(
                'p-1.5 rounded transition-colors',
                'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-blue-sky)]',
                'hover:bg-[var(--pixel-gray-700)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--pixel-blue-sky)]',
              )}
              title={shareStatus === 'copied' ? 'Link copied!' : 'Share agent'}
              data-testid="share-button"
            >
              <Share2 size={16} aria-hidden="true" />
              <span className="sr-only">
                {shareStatus === 'copied' ? 'Link copied!' : 'Share agent'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2 text-[var(--pixel-gray-400)] text-xs md:text-sm font-mono">
            <span title={id} className="truncate max-w-[180px] md:max-w-none">
              {id}
            </span>
            <CopyButton text={id} size="sm" label="Copy agent ID" />
          </div>

          <div className="flex items-center gap-3 md:gap-4 mt-3 md:mt-4 flex-wrap">
            <ChainBadge chainId={chainId} />
            {trustScore !== undefined && <TrustScore score={trustScore} showScore />}
            {healthScore !== undefined && (
              <HealthBadge score={healthScore} data-testid="health-badge" />
            )}
            {warningsCount !== undefined && warningsCount > 0 && (
              <span
                className="badge-pixel text-[var(--pixel-gold-coin)] border-[var(--pixel-gold-coin)]"
                data-testid="warnings-badge"
                title={`${warningsCount} warning${warningsCount !== 1 ? 's' : ''}`}
              >
                {warningsCount} WARN
              </span>
            )}

            {/* Feedback and Validation counts */}
            {(feedbackCount !== undefined || validationCount !== undefined) && (
              <div className="flex items-center gap-3 text-[var(--pixel-gray-400)]">
                {feedbackCount !== undefined && (
                  <div
                    className="flex items-center gap-1.5 text-xs font-[family-name:var(--font-pixel-body)]"
                    title={`${feedbackCount} feedback${feedbackCount !== 1 ? 's' : ''}`}
                  >
                    <MessageSquare size={14} aria-hidden="true" />
                    <span>{feedbackCount}</span>
                  </div>
                )}
                {validationCount !== undefined && (
                  <div
                    className="flex items-center gap-1.5 text-xs font-[family-name:var(--font-pixel-body)]"
                    title={`${validationCount} validation${validationCount !== 1 ? 's' : ''}`}
                  >
                    <ShieldCheck size={14} aria-hidden="true" />
                    <span>{validationCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
