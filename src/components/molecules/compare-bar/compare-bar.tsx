import { GitCompareArrows, X } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { cn } from '@/lib/utils';

export interface CompareBarAgent {
  /** Unique agent identifier (chainId:tokenId) */
  id: string;
  /** Agent display name */
  name: string;
}

export interface CompareBarProps {
  /** List of selected agents */
  agents: CompareBarAgent[];
  /** Maximum number of agents that can be selected */
  maxAgents?: number;
  /** Minimum number of agents required for comparison */
  minAgents?: number;
  /** Callback when an agent is removed */
  onRemove: (agentId: string) => void;
  /** Callback when all agents are cleared */
  onClearAll: () => void;
  /** URL for the compare page */
  compareUrl: string;
  /** Optional additional class names */
  className?: string;
}

/**
 * A floating bar that displays selected agents for comparison.
 * Shows agent names as removable chips and provides navigation to compare page.
 *
 * @example
 * ```tsx
 * <CompareBar
 *   agents={[
 *     { id: '11155111:123', name: 'Trading Bot' },
 *     { id: '84532:456', name: 'Code Agent' }
 *   ]}
 *   onRemove={(id) => removeAgent(id)}
 *   onClearAll={() => clearAll()}
 *   compareUrl="/compare?agents=11155111:123,84532:456"
 * />
 * ```
 */
export function CompareBar({
  agents,
  maxAgents = 4,
  minAgents = 2,
  onRemove,
  onClearAll,
  compareUrl,
  className,
}: CompareBarProps): React.JSX.Element | null {
  // Don't render if no agents selected
  if (agents.length === 0) {
    return null;
  }

  const canCompare = agents.length >= minAgents;
  const isMaxSelected = agents.length >= maxAgents;

  return (
    <div
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-3 px-4 py-3',
        'bg-[var(--pixel-gray-dark)] border-2 border-[var(--pixel-gray-700)]',
        'shadow-[0_0_20px_rgba(0,0,0,0.5)]',
        'animate-in slide-in-from-bottom-4 duration-300',
        className,
      )}
      role="region"
      aria-label="Agent comparison bar"
      data-testid="compare-bar"
    >
      {/* Icon and count */}
      <div className="flex items-center gap-2 text-[var(--pixel-blue-sky)]">
        <GitCompareArrows size={20} aria-hidden="true" />
        <span className="font-silkscreen text-sm">
          {agents.length}/{maxAgents}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--pixel-gray-600)]" aria-hidden="true" />

      {/* Agent chips */}
      <div className="flex items-center gap-2 max-w-md overflow-x-auto">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1',
              'bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-600)]',
              'text-sm text-[var(--pixel-white)]',
              'group',
            )}
            data-testid={`compare-bar-agent-${agent.id}`}
          >
            <span className="truncate max-w-[100px]">{agent.name}</span>
            <button
              type="button"
              onClick={() => onRemove(agent.id)}
              className={cn(
                'p-0.5 rounded-sm',
                'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-red-fire)]',
                'hover:bg-[var(--pixel-red-fire)]/10',
                'transition-colors',
              )}
              aria-label={`Remove ${agent.name} from comparison`}
              data-testid={`compare-bar-remove-${agent.id}`}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      {/* Max selection indicator */}
      {isMaxSelected && (
        <span className="text-xs text-[var(--pixel-gold-coin)] font-silkscreen">MAX</span>
      )}

      {/* Divider */}
      <div className="w-px h-6 bg-[var(--pixel-gray-600)]" aria-hidden="true" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Clear all button */}
        <button
          type="button"
          onClick={onClearAll}
          className={cn(
            'px-3 py-1.5',
            'text-sm font-silkscreen',
            'text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)]',
            'transition-colors',
          )}
          aria-label="Clear all selected agents"
          data-testid="compare-bar-clear"
        >
          Clear
        </button>

        {/* Compare button */}
        {canCompare ? (
          <Link
            href={compareUrl}
            className={cn(
              'px-4 py-1.5',
              'font-silkscreen text-sm',
              'bg-[var(--pixel-blue-sky)] text-[var(--pixel-black)]',
              'border-2 border-[var(--pixel-blue-sky)]',
              'hover:bg-[var(--pixel-blue-sky)]/80',
              'transition-colors',
            )}
            data-testid="compare-bar-compare-button"
          >
            Compare
          </Link>
        ) : (
          <span
            className={cn(
              'px-4 py-1.5',
              'font-silkscreen text-sm',
              'bg-[var(--pixel-gray-700)] text-[var(--pixel-gray-500)]',
              'border-2 border-[var(--pixel-gray-600)]',
              'cursor-not-allowed',
            )}
            data-testid="compare-bar-compare-disabled"
            aria-label={`Select at least ${minAgents} agents to compare`}
          >
            Compare
          </span>
        )}
      </div>
    </div>
  );
}
