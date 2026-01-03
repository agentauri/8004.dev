import Link from 'next/link';
import type React from 'react';
import { memo } from 'react';
import { ScoreGauge } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/types';

export interface TeamMemberCardProps {
  /** Team member data */
  member: TeamMember;
  /** Optional click handler to view agent details */
  onViewAgent?: (agentId: string) => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * TeamMemberCard displays a team member's role and contribution in a composed team.
 *
 * Shows the agent's assigned role, their contribution description, and their
 * compatibility score with other team members. Links to the agent detail page.
 *
 * @example
 * ```tsx
 * <TeamMemberCard
 *   member={{
 *     agentId: '11155111:123',
 *     role: 'Code Analyzer',
 *     contribution: 'Analyzes code for vulnerabilities',
 *     compatibilityScore: 92,
 *   }}
 *   onViewAgent={(id) => router.push(`/agent/${id}`)}
 * />
 * ```
 */
export const TeamMemberCard = memo(function TeamMemberCard({
  member,
  onViewAgent,
  className,
}: TeamMemberCardProps): React.JSX.Element {
  const cardContent = (
    <>
      {/* Role Badge */}
      <div className="mb-3">
        <span
          className={cn(
            'inline-block px-2 py-1',
            'font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider',
            'bg-[var(--pixel-blue-sky)]/20 text-[var(--pixel-blue-sky)]',
            'border border-[var(--pixel-blue-sky)]/40',
          )}
        >
          {member.role}
        </span>
      </div>

      {/* Agent ID */}
      <div className="mb-2">
        <span
          className="font-mono text-xs text-[var(--pixel-gray-400)]"
          title={`Agent ID: ${member.agentId}`}
        >
          {member.agentId}
        </span>
      </div>

      {/* Contribution */}
      <p className="text-sm text-[var(--pixel-gray-300)] line-clamp-3 mb-4 min-h-[3.75rem]">
        {member.contribution}
      </p>

      {/* Compatibility Score */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--pixel-gray-700)]">
        <span className="font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider text-[var(--pixel-gray-500)]">
          Compatibility
        </span>
        <ScoreGauge score={member.compatibilityScore} label="Compat" size="sm" showValue={false} />
      </div>
    </>
  );

  const cardClasses = cn(
    'block p-4 border-2 transition-all bg-[var(--pixel-gray-dark)]',
    'border-[var(--pixel-gray-700)]',
    'hover:border-[var(--pixel-blue-sky)] hover:shadow-[0_0_12px_var(--glow-blue)]',
    'hover:translate-y-[-2px]',
    'cursor-pointer',
    className,
  );

  if (onViewAgent) {
    return (
      <div
        className={cardClasses}
        onClick={() => onViewAgent(member.agentId)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onViewAgent(member.agentId);
          }
        }}
        role="button"
        tabIndex={0}
        data-testid="team-member-card"
        data-agent-id={member.agentId}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/agent/${member.agentId}`}
      className={cardClasses}
      data-testid="team-member-card"
      data-agent-id={member.agentId}
    >
      {cardContent}
    </Link>
  );
});
