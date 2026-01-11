'use client';

import { Bell, ExternalLink, Eye, EyeOff, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ChainBadge, type ChainId } from '@/components/atoms';
import type { WatchedAgent } from '@/hooks/use-watchlist';
import { cn } from '@/lib/utils';

/**
 * Props for a single watchlist item
 */
export interface WatchlistItemProps {
  /** The watched agent data */
  agent: WatchedAgent;
  /** Callback when remove is clicked */
  onRemove: (agentId: string) => void;
  /** Callback when notes are updated */
  onUpdateNotes?: (agentId: string, notes: string) => void;
  /** Whether the item is in a loading state */
  isLoading?: boolean;
}

/**
 * Single item in the watchlist
 */
export function WatchlistItem({
  agent,
  onRemove,
  onUpdateNotes,
  isLoading = false,
}: WatchlistItemProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(agent.notes ?? '');

  const handleSaveNotes = () => {
    onUpdateNotes?.(agent.agentId, notesValue);
    setIsEditingNotes(false);
  };

  const hasRecentChange =
    agent.lastChangeAt && agent.lastChangeAt > Date.now() - 24 * 60 * 60 * 1000;

  return (
    <div
      className={cn(
        'p-4 border-2 border-[var(--pixel-gray-700)] bg-[var(--pixel-gray-800)] transition-colors',
        hasRecentChange && 'border-[var(--pixel-gold-coin)]',
        isLoading && 'opacity-50',
      )}
      data-testid={`watchlist-item-${agent.agentId}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/agent/${agent.agentId}`}
              className="font-silkscreen text-[var(--pixel-white)] hover:text-[var(--pixel-blue-text)] transition-colors truncate"
              data-testid={`watchlist-item-link-${agent.agentId}`}
            >
              {agent.name}
            </Link>
            <ChainBadge chainId={agent.chainId as ChainId} />
            {hasRecentChange && (
              <span
                className="px-1.5 py-0.5 text-xs bg-[var(--pixel-gold-coin)]/20 text-[var(--pixel-gold-coin)] border border-[var(--pixel-gold-coin)]"
                data-testid={`watchlist-item-changed-${agent.agentId}`}
              >
                CHANGED
              </span>
            )}
          </div>

          {agent.description && (
            <p className="text-sm text-[var(--pixel-gray-400)] line-clamp-2 mb-2">
              {agent.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-[var(--pixel-gray-500)]">
            {agent.lastReputationScore !== undefined && (
              <span data-testid={`watchlist-item-score-${agent.agentId}`}>
                Score: {agent.lastReputationScore}
              </span>
            )}
            {agent.lastActiveStatus !== undefined && (
              <span
                className={cn(
                  agent.lastActiveStatus
                    ? 'text-[var(--pixel-green-pipe)]'
                    : 'text-[var(--pixel-gray-500)]',
                )}
                data-testid={`watchlist-item-status-${agent.agentId}`}
              >
                {agent.lastActiveStatus ? 'Active' : 'Inactive'}
              </span>
            )}
            <span>Watching since {new Date(agent.watchedAt).toLocaleDateString()}</span>
          </div>

          {/* Notes section */}
          {(agent.notes || isEditingNotes) && (
            <div className="mt-3 pt-3 border-t border-[var(--pixel-gray-700)]">
              {isEditingNotes ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm bg-[var(--pixel-gray-900)] border border-[var(--pixel-gray-600)] text-[var(--pixel-white)] focus:border-[var(--pixel-blue-sky)] focus:outline-none"
                    placeholder="Add a note..."
                    aria-label={`Notes for ${agent.name || 'agent'}`}
                    data-testid={`watchlist-item-notes-input-${agent.agentId}`}
                  />
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-2 py-1 text-xs text-[var(--pixel-blue-text)] hover:text-[var(--pixel-white)] transition-colors"
                    data-testid={`watchlist-item-notes-save-${agent.agentId}`}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNotesValue(agent.notes ?? '');
                      setIsEditingNotes(false);
                    }}
                    className="px-2 py-1 text-xs text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(true)}
                  className="flex items-center gap-1.5 text-sm text-[var(--pixel-gray-400)] hover:text-[var(--pixel-white)] transition-colors"
                  data-testid={`watchlist-item-notes-${agent.agentId}`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  {agent.notes}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!agent.notes && !isEditingNotes && onUpdateNotes && (
            <button
              type="button"
              onClick={() => setIsEditingNotes(true)}
              className="p-1.5 text-[var(--pixel-gray-500)] hover:text-[var(--pixel-white)] transition-colors"
              title="Add note"
              data-testid={`watchlist-item-add-note-${agent.agentId}`}
            >
              <FileText className="w-4 h-4" />
            </button>
          )}
          <Link
            href={`/agent/${agent.agentId}`}
            className="p-1.5 text-[var(--pixel-gray-500)] hover:text-[var(--pixel-blue-text)] transition-colors"
            title="View agent"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => onRemove(agent.agentId)}
            className="p-1.5 text-[var(--pixel-gray-500)] hover:text-[var(--pixel-red-fire)] transition-colors"
            title="Remove from watchlist"
            data-testid={`watchlist-item-remove-${agent.agentId}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Props for WatchlistPanel
 */
export interface WatchlistPanelProps {
  /** List of watched agents */
  watchlist: WatchedAgent[];
  /** Callback when an agent is removed */
  onRemove: (agentId: string) => void;
  /** Callback when notes are updated */
  onUpdateNotes?: (agentId: string, notes: string) => void;
  /** Callback to clear all watched agents */
  onClearAll?: () => void;
  /** Whether the panel is in a loading state */
  isLoading?: boolean;
  /** Maximum number of agents that can be watched */
  maxAgents?: number;
  /** Optional class name */
  className?: string;
  /** Show only agents with recent changes */
  showOnlyChanged?: boolean;
  /** Filter by chain ID */
  filterChainId?: ChainId;
}

/**
 * Panel displaying the user's watchlist with management controls
 */
export function WatchlistPanel({
  watchlist,
  onRemove,
  onUpdateNotes,
  onClearAll,
  isLoading = false,
  maxAgents = 50,
  className,
  showOnlyChanged = false,
  filterChainId,
}: WatchlistPanelProps) {
  // Apply filters
  let filteredWatchlist = watchlist;

  if (showOnlyChanged) {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    filteredWatchlist = filteredWatchlist.filter((a) => a.lastChangeAt && a.lastChangeAt >= cutoff);
  }

  if (filterChainId) {
    filteredWatchlist = filteredWatchlist.filter((a) => a.chainId === filterChainId);
  }

  const changedCount = watchlist.filter(
    (a) => a.lastChangeAt && a.lastChangeAt > Date.now() - 24 * 60 * 60 * 1000,
  ).length;

  return (
    <div className={cn('space-y-4', className)} data-testid="watchlist-panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[var(--pixel-blue-sky)]" />
            <h2 className="font-silkscreen text-[var(--pixel-white)] text-lg">WATCHLIST</h2>
          </div>
          <span className="text-sm text-[var(--pixel-gray-400)]" data-testid="watchlist-count">
            {watchlist.length}/{maxAgents}
          </span>
          {changedCount > 0 && (
            <span
              className="flex items-center gap-1 px-2 py-0.5 text-xs bg-[var(--pixel-gold-coin)]/20 text-[var(--pixel-gold-coin)] border border-[var(--pixel-gold-coin)]"
              data-testid="watchlist-changed-count"
            >
              <Bell className="w-3 h-3" />
              {changedCount} changed
            </span>
          )}
        </div>

        {onClearAll && watchlist.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--pixel-gray-400)] hover:text-[var(--pixel-red-fire)] border border-[var(--pixel-gray-600)] hover:border-[var(--pixel-red-fire)] transition-colors"
            data-testid="watchlist-clear-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Empty state */}
      {watchlist.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[var(--pixel-gray-700)]"
          data-testid="watchlist-empty"
        >
          <EyeOff className="w-12 h-12 text-[var(--pixel-gray-600)] mb-4" />
          <p className="font-silkscreen text-[var(--pixel-gray-400)] text-center mb-2">
            NO AGENTS WATCHED
          </p>
          <p className="text-sm text-[var(--pixel-gray-500)] text-center max-w-xs">
            Add agents to your watchlist to monitor their reputation and status changes.
          </p>
        </div>
      )}

      {/* Filtered empty state */}
      {watchlist.length > 0 && filteredWatchlist.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-[var(--pixel-gray-700)]"
          data-testid="watchlist-filtered-empty"
        >
          <p className="text-sm text-[var(--pixel-gray-400)] text-center">
            No agents match the current filters.
          </p>
        </div>
      )}

      {/* Watchlist items */}
      {filteredWatchlist.length > 0 && (
        <div className="space-y-3" data-testid="watchlist-items">
          {filteredWatchlist.map((agent) => (
            <WatchlistItem
              key={agent.agentId}
              agent={agent}
              onRemove={onRemove}
              onUpdateNotes={onUpdateNotes}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
