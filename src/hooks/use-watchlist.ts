import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './use-local-storage';

/**
 * A watched agent entry.
 */
export interface WatchedAgent {
  /** Agent ID in format "chainId:tokenId" */
  agentId: string;
  /** Agent name for display without re-fetching */
  name: string;
  /** Chain ID for filtering */
  chainId: number;
  /** Optional description snippet */
  description?: string;
  /** Timestamp when added to watchlist */
  watchedAt: number;
  /** Last known reputation score for change detection */
  lastReputationScore?: number;
  /** Last known active status */
  lastActiveStatus?: boolean;
  /** Timestamp of last detected change */
  lastChangeAt?: number;
  /** Notes added by user */
  notes?: string;
}

/**
 * Types of changes that can be tracked
 */
export type WatchChangeType = 'reputation' | 'status' | 'metadata' | 'all';

/**
 * Storage key for watchlist data.
 * Note: useLocalStorage adds 'agent-explorer-' prefix automatically
 */
const STORAGE_KEY = 'watchlist';

/**
 * Maximum number of watched agents allowed.
 */
export const MAX_WATCHED_AGENTS = 50;

/**
 * Return type for useWatchlist hook.
 */
export interface UseWatchlistResult {
  /** List of watched agents */
  watchlist: WatchedAgent[];
  /** Number of watched agents */
  watchCount: number;
  /** Check if an agent is being watched */
  isWatching: (agentId: string) => boolean;
  /** Check if watchlist is at max capacity */
  isAtLimit: boolean;
  /** Add an agent to watchlist */
  addToWatchlist: (agent: Omit<WatchedAgent, 'watchedAt'>) => boolean;
  /** Remove an agent from watchlist */
  removeFromWatchlist: (agentId: string) => void;
  /** Toggle watch status */
  toggleWatch: (agent: Omit<WatchedAgent, 'watchedAt'>) => boolean;
  /** Update agent data (e.g., after detecting a change) */
  updateWatchedAgent: (agentId: string, updates: Partial<WatchedAgent>) => void;
  /** Add or update notes for a watched agent */
  setAgentNotes: (agentId: string, notes: string) => void;
  /** Clear all watched agents */
  clearWatchlist: () => void;
  /** Get watched agents by chain */
  getWatchlistByChain: (chainId: number) => WatchedAgent[];
  /** Get agents with recent changes */
  getRecentlyChanged: (since?: number) => WatchedAgent[];
  /** Export watchlist as JSON */
  exportWatchlist: () => string;
  /** Import watchlist from JSON */
  importWatchlist: (json: string) => { imported: number; errors: number };
}

/**
 * Validate a watched agent entry.
 */
function isValidWatchedAgent(agent: unknown): agent is WatchedAgent {
  if (!agent || typeof agent !== 'object') return false;
  const a = agent as Record<string, unknown>;
  return (
    typeof a.agentId === 'string' &&
    a.agentId.includes(':') &&
    typeof a.name === 'string' &&
    typeof a.chainId === 'number' &&
    typeof a.watchedAt === 'number'
  );
}

/**
 * Hook for managing a watchlist of agents to monitor for changes.
 *
 * The watchlist allows users to track agents they're interested in and
 * receive notifications when those agents' reputation, status, or
 * metadata changes.
 *
 * @example
 * ```tsx
 * function AgentCard({ agent }: { agent: Agent }) {
 *   const { isWatching, toggleWatch } = useWatchlist();
 *   const watching = isWatching(agent.id);
 *
 *   return (
 *     <button onClick={() => toggleWatch({
 *       agentId: agent.id,
 *       name: agent.name,
 *       chainId: agent.chainId,
 *       lastReputationScore: agent.reputationScore,
 *       lastActiveStatus: agent.active,
 *     })}>
 *       {watching ? 'Unwatch' : 'Watch'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useWatchlist(): UseWatchlistResult {
  const { value: watchlist, setValue: setWatchlist } = useLocalStorage<WatchedAgent[]>(
    STORAGE_KEY,
    [],
  );

  // Create a Set of watched agent IDs for O(1) lookup
  const watchedIds = useMemo(() => new Set(watchlist.map((a) => a.agentId)), [watchlist]);

  const watchCount = watchlist.length;
  const isAtLimit = watchCount >= MAX_WATCHED_AGENTS;

  const isWatching = useCallback(
    (agentId: string): boolean => {
      return watchedIds.has(agentId);
    },
    [watchedIds],
  );

  const addToWatchlist = useCallback(
    (agent: Omit<WatchedAgent, 'watchedAt'>): boolean => {
      // Check conditions synchronously before setState to avoid race condition
      // where `added` variable is set inside async callback but returned immediately
      if (watchedIds.has(agent.agentId)) {
        return false; // Already watching
      }

      if (watchlist.length >= MAX_WATCHED_AGENTS) {
        return false; // At limit
      }

      setWatchlist((prevWatchlist) => {
        // Double-check in callback in case of concurrent updates
        if (prevWatchlist.some((a) => a.agentId === agent.agentId)) {
          return prevWatchlist;
        }

        if (prevWatchlist.length >= MAX_WATCHED_AGENTS) {
          return prevWatchlist;
        }

        const newWatchedAgent: WatchedAgent = {
          ...agent,
          watchedAt: Date.now(),
        };

        return [newWatchedAgent, ...prevWatchlist];
      });

      return true;
    },
    [setWatchlist, watchedIds, watchlist.length],
  );

  const removeFromWatchlist = useCallback(
    (agentId: string): void => {
      setWatchlist((prev) => prev.filter((a) => a.agentId !== agentId));
    },
    [setWatchlist],
  );

  const toggleWatch = useCallback(
    (agent: Omit<WatchedAgent, 'watchedAt'>): boolean => {
      if (isWatching(agent.agentId)) {
        removeFromWatchlist(agent.agentId);
        return false;
      }
      return addToWatchlist(agent);
    },
    [isWatching, addToWatchlist, removeFromWatchlist],
  );

  const updateWatchedAgent = useCallback(
    (agentId: string, updates: Partial<WatchedAgent>): void => {
      setWatchlist((prev) =>
        prev.map((agent) => {
          if (agent.agentId !== agentId) return agent;
          return {
            ...agent,
            ...updates,
            // Don't allow updating these fields via this method
            agentId: agent.agentId,
            watchedAt: agent.watchedAt,
          };
        }),
      );
    },
    [setWatchlist],
  );

  const setAgentNotes = useCallback(
    (agentId: string, notes: string): void => {
      updateWatchedAgent(agentId, { notes: notes.trim() || undefined });
    },
    [updateWatchedAgent],
  );

  const clearWatchlist = useCallback((): void => {
    setWatchlist([]);
  }, [setWatchlist]);

  const getWatchlistByChain = useCallback(
    (chainId: number): WatchedAgent[] => {
      return watchlist.filter((a) => a.chainId === chainId);
    },
    [watchlist],
  );

  const getRecentlyChanged = useCallback(
    (since?: number): WatchedAgent[] => {
      const cutoff = since ?? Date.now() - 24 * 60 * 60 * 1000; // Default: last 24 hours
      return watchlist
        .filter((a) => a.lastChangeAt && a.lastChangeAt >= cutoff)
        .sort((a, b) => (b.lastChangeAt ?? 0) - (a.lastChangeAt ?? 0));
    },
    [watchlist],
  );

  const exportWatchlist = useCallback((): string => {
    return JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        watchlist,
      },
      null,
      2,
    );
  }, [watchlist]);

  const importWatchlist = useCallback(
    (json: string): { imported: number; errors: number } => {
      let imported = 0;
      let errors = 0;

      try {
        const data = JSON.parse(json);

        if (Array.isArray(data.watchlist)) {
          const existingIds = new Set(watchlist.map((a) => a.agentId));
          const validAgents: WatchedAgent[] = [];

          for (const agent of data.watchlist) {
            if (isValidWatchedAgent(agent) && !existingIds.has(agent.agentId)) {
              if (watchlist.length + validAgents.length < MAX_WATCHED_AGENTS) {
                validAgents.push(agent);
                imported++;
              }
            } else {
              errors++;
            }
          }

          if (validAgents.length > 0) {
            setWatchlist((prev) => [...validAgents, ...prev]);
          }
        }
      } catch {
        errors++;
      }

      return { imported, errors };
    },
    [watchlist, setWatchlist],
  );

  return {
    watchlist,
    watchCount,
    isWatching,
    isAtLimit,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatch,
    updateWatchedAgent,
    setAgentNotes,
    clearWatchlist,
    getWatchlistByChain,
    getRecentlyChanged,
    exportWatchlist,
    importWatchlist,
  };
}
