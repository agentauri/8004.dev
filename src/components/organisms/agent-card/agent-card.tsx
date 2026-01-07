import Link from 'next/link';
import { type JSX, memo } from 'react';
import {
  AgentAvatar,
  BookmarkButton,
  type ChainId,
  CompareCheckbox,
  CopyButton,
  RelevanceScore,
  type TrendDirection,
  TrendIndicator,
  ValidationBadge,
  type ValidationStatus,
  type ValidationType,
  WatchButton,
} from '@/components/atoms';
import { AgentBadges, CapabilityTag, type CapabilityType } from '@/components/molecules';
import { cn } from '@/lib/utils';
import type { OASFItem } from '@/types';

/**
 * @deprecated Use OASFItem from @/types instead
 */
export type OasfClassification = OASFItem;

export interface AgentCardAgent {
  /** Agent ID (address) */
  id: string;
  /** Agent name */
  name: string;
  /** Agent description */
  description?: string;
  /** Agent image URL */
  image?: string;
  /** Chain ID where agent is registered */
  chainId: ChainId;
  /** Whether agent is currently active */
  isActive: boolean;
  /** Whether agent is verified */
  isVerified?: boolean;
  /** Trust score (0-100) - reputation based */
  trustScore?: number;
  /** Agent capabilities/protocols */
  capabilities?: CapabilityType[];
  /** Relevance score from semantic search (0-100) */
  relevanceScore?: number;
  /** Match reasons from semantic search */
  matchReasons?: string[];
  /** Validation type */
  validationType?: ValidationType;
  /** Validation status */
  validationStatus?: ValidationStatus;
  /** Reputation trend direction */
  reputationTrend?: TrendDirection;
  /** Reputation change percentage */
  reputationChange?: number;
  /** OASF skills classification */
  oasfSkills?: OasfClassification[];
  /** OASF domains classification */
  oasfDomains?: OasfClassification[];
  /** OASF classification source */
  oasfSource?: 'creator-defined' | 'llm-classification' | 'none';
  /** Agent wallet address */
  walletAddress?: string;
  /** Supported trust mechanisms */
  supportedTrust?: string[];
  /** Number of reputation feedbacks */
  reputationCount?: number;
}

export interface AgentCardProps {
  /** Agent data */
  agent: AgentCardAgent;
  /** Optional click handler (if not using Link) */
  onClick?: () => void;
  /** Optional additional class names */
  className?: string;
  /** Whether the agent is bookmarked */
  isBookmarked?: boolean;
  /** Callback when bookmark toggle is clicked */
  onBookmarkToggle?: () => void;
  /** Whether the agent is selected for comparison */
  isSelectedForCompare?: boolean;
  /** Callback when compare checkbox is clicked */
  onCompareToggle?: () => void;
  /** Whether selection is disabled (e.g., max agents reached) */
  isCompareDisabled?: boolean;
  /** Whether the agent is being watched */
  isWatched?: boolean;
  /** Callback when watch toggle is clicked */
  onWatchToggle?: () => void;
}

/**
 * AgentCard displays a summary card for an agent in search results.
 *
 * @example
 * ```tsx
 * <AgentCard
 *   agent={{
 *     id: '0x1234...',
 *     name: 'AI Assistant',
 *     description: 'A helpful AI agent',
 *     chainId: 11155111,
 *     isActive: true,
 *     trustScore: 85,
 *     capabilities: ['mcp', 'a2a'],
 *   }}
 * />
 * ```
 */
export const AgentCard = memo(function AgentCard({
  agent,
  onClick,
  className,
  isBookmarked,
  onBookmarkToggle,
  isSelectedForCompare,
  onCompareToggle,
  isCompareDisabled,
  isWatched,
  onWatchToggle,
}: AgentCardProps): JSX.Element {
  // Agent ID is in format "chainId:tokenId" (e.g., "11155111:123")
  const agentId = agent.id;

  const cardContent = (
    <>
      <div className="flex items-start gap-3 md:gap-4">
        <AgentAvatar name={agent.name} image={agent.image} size="md" className="shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
            <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-100)] text-sm md:text-base truncate">
              {agent.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--pixel-gray-500)] text-xs md:text-sm font-mono">
            <span title={`Agent ID: ${agentId}`} className="truncate max-w-[140px] md:max-w-none">
              {agentId}
            </span>
            <CopyButton text={agentId} size="xs" label="Copy agent ID" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {onCompareToggle && (
            <CompareCheckbox
              checked={isSelectedForCompare ?? false}
              onChange={onCompareToggle}
              disabled={isCompareDisabled && !isSelectedForCompare}
              label={`${isSelectedForCompare ? 'Remove' : 'Add'} ${agent.name} ${isSelectedForCompare ? 'from' : 'to'} comparison`}
              size="sm"
            />
          )}
          {onBookmarkToggle && (
            <BookmarkButton
              isBookmarked={isBookmarked ?? false}
              onToggle={onBookmarkToggle}
              size="sm"
              label={`${isBookmarked ? 'Remove' : 'Add'} ${agent.name} ${isBookmarked ? 'from' : 'to'} bookmarks`}
            />
          )}
          {onWatchToggle && (
            <WatchButton
              isWatched={isWatched ?? false}
              onToggle={onWatchToggle}
              size="sm"
              label={`${isWatched ? 'Stop' : 'Start'} watching ${agent.name}`}
            />
          )}
        </div>
      </div>

      {agent.description && (
        <p className="mt-3 md:mt-4 text-[var(--pixel-gray-400)] text-sm line-clamp-2">
          {agent.description}
        </p>
      )}

      {/* OASF Skills and Domains Tags */}
      {agent.oasfSkills?.length || agent.oasfDomains?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {agent.oasfSkills?.slice(0, 3).map((skill) => (
            <span
              key={skill.slug}
              className="px-2 py-0.5 text-[0.625rem] bg-[var(--pixel-blue-sky)]/20 text-[var(--pixel-blue-text)] rounded font-[family-name:var(--font-pixel-body)] uppercase"
              title={`${skill.slug} (${Math.round(skill.confidence * 100)}% confidence)`}
            >
              {skill.slug.split('/').pop()}
            </span>
          ))}
          {agent.oasfDomains?.slice(0, 2).map((domain) => (
            <span
              key={domain.slug}
              className="px-2 py-0.5 text-[0.625rem] bg-[var(--pixel-gold-coin)]/20 text-[var(--pixel-gold-coin)] rounded font-[family-name:var(--font-pixel-body)] uppercase"
              title={`${domain.slug} (${Math.round(domain.confidence * 100)}% confidence)`}
            >
              {domain.slug.split('/').pop()}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4">
        <AgentBadges
          chainId={agent.chainId}
          isActive={agent.isActive}
          isVerified={agent.isVerified}
          trustScore={agent.trustScore}
          reputationCount={agent.reputationCount}
          hasSupportedTrust={Boolean(agent.supportedTrust?.length)}
        />
      </div>

      {/* Relevance score, validation, and trend indicators */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {agent.relevanceScore !== undefined && (
          <RelevanceScore score={agent.relevanceScore} size="sm" />
        )}
        {agent.validationType && agent.validationStatus && agent.validationType !== 'none' && (
          <ValidationBadge type={agent.validationType} status={agent.validationStatus} />
        )}
        {agent.reputationTrend && (
          <TrendIndicator
            direction={agent.reputationTrend}
            change={agent.reputationChange}
            size="sm"
          />
        )}
      </div>

      {/* Match reasons from semantic search */}
      {agent.matchReasons && agent.matchReasons.length > 0 && (
        <div className="mt-2 text-xs text-[var(--pixel-gray-500)]">
          <span className="text-[var(--pixel-gold-coin)]">Matched:</span>{' '}
          {agent.matchReasons.slice(0, 2).join(', ')}
          {agent.matchReasons.length > 2 && (
            <span className="text-[var(--pixel-gray-600)]">
              {' '}
              +{agent.matchReasons.length - 2} more
            </span>
          )}
        </div>
      )}

      {/* Protocols and Supported Trust */}
      {agent.capabilities?.length || agent.supportedTrust?.length ? (
        <div className="mt-4 flex gap-2 flex-wrap items-center">
          {agent.capabilities?.map((capability) => (
            <CapabilityTag key={capability} type={capability} />
          ))}
          {/* Filter out trust values already shown as capabilities */}
          {agent.supportedTrust
            ?.filter(
              (trust) => !agent.capabilities?.includes(trust.toLowerCase() as CapabilityType),
            )
            .map((trust) => (
              <span
                key={trust}
                className="px-2 py-0.5 bg-[var(--pixel-green-pipe)]/20 text-[var(--pixel-green-pipe)] text-[0.625rem] uppercase font-[family-name:var(--font-pixel-body)]"
              >
                {trust}
              </span>
            ))}
        </div>
      ) : null}

      {/* Wallet Address - own line */}
      {agent.walletAddress && (
        <div className="mt-3 flex items-center gap-1.5 text-sm text-[var(--pixel-gray-400)] font-mono">
          <span title={agent.walletAddress}>
            {`${agent.walletAddress.slice(0, 6)}...${agent.walletAddress.slice(-4)}`}
          </span>
          <CopyButton text={agent.walletAddress} size="xs" label="Copy wallet address" />
        </div>
      )}
    </>
  );

  const cardClasses = cn(
    'block h-full p-3 md:p-4 border-2 transition-all cursor-pointer bg-[var(--pixel-gray-800)]',
    'hover:translate-y-[-2px]',
    agent.isActive
      ? [
          // Active: prominent green border with glow
          'border-[var(--pixel-green-pipe)] shadow-[0_0_8px_var(--glow-green)]',
          'hover:shadow-[0_0_16px_var(--glow-green)]',
        ]
      : [
          // Inactive: muted gray with reduced opacity
          'border-[var(--pixel-gray-700)] opacity-70',
          'hover:opacity-100 hover:border-[var(--pixel-gray-600)]',
        ],
    className,
  );

  if (onClick) {
    return (
      <div
        className={cardClasses}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        data-testid="agent-card"
        data-agent-id={agent.id}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/agent/${agent.id}`}
      className={cardClasses}
      data-testid="agent-card"
      data-agent-id={agent.id}
    >
      {cardContent}
    </Link>
  );
});
