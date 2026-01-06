import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_WATCHED_AGENTS, useWatchlist, type WatchedAgent } from './use-watchlist';

// Mock localStorage
const mockLocalStorage: Record<string, string> = {};

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      mockLocalStorage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete mockLocalStorage[key];
    }),
  });

  // Clear mock storage
  for (const key of Object.keys(mockLocalStorage)) {
    delete mockLocalStorage[key];
  }
});

const createMockAgent = (id: string, chainId = 11155111): Omit<WatchedAgent, 'watchedAt'> => ({
  agentId: id,
  name: `Agent ${id}`,
  chainId,
  description: `Description for ${id}`,
});

describe('useWatchlist', () => {
  describe('initial state', () => {
    it('returns empty watchlist by default', () => {
      const { result } = renderHook(() => useWatchlist());

      expect(result.current.watchlist).toEqual([]);
      expect(result.current.watchCount).toBe(0);
      expect(result.current.isAtLimit).toBe(false);
    });

    it('loads existing watchlist from localStorage', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      expect(result.current.watchlist).toHaveLength(1);
      expect(result.current.watchlist[0].agentId).toBe('11155111:1');
    });
  });

  describe('isWatching', () => {
    it('returns false for unwatched agent', () => {
      const { result } = renderHook(() => useWatchlist());

      expect(result.current.isWatching('11155111:1')).toBe(false);
    });

    it('returns true for watched agent', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      expect(result.current.isWatching('11155111:1')).toBe(true);
      expect(result.current.isWatching('11155111:2')).toBe(false);
    });
  });

  describe('addToWatchlist', () => {
    it('adds agent to watchlist', () => {
      const { result } = renderHook(() => useWatchlist());
      const agent = createMockAgent('11155111:1');

      act(() => {
        result.current.addToWatchlist(agent);
      });

      expect(result.current.watchlist).toHaveLength(1);
      expect(result.current.watchlist[0].agentId).toBe('11155111:1');
      expect(result.current.watchlist[0].watchedAt).toBeDefined();
    });

    it('returns true when agent is added', () => {
      const { result } = renderHook(() => useWatchlist());
      const agent = createMockAgent('11155111:1');

      let added = false;
      act(() => {
        added = result.current.addToWatchlist(agent);
      });

      expect(added).toBe(true);
    });

    it('does not add duplicate agent', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());
      const agent = createMockAgent('11155111:1');

      let added = false;
      act(() => {
        added = result.current.addToWatchlist(agent);
      });

      expect(added).toBe(false);
      expect(result.current.watchlist).toHaveLength(1);
    });

    it('adds new agents at the beginning of the list', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() - 1000 },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      act(() => {
        result.current.addToWatchlist(createMockAgent('11155111:2'));
      });

      expect(result.current.watchlist[0].agentId).toBe('11155111:2');
      expect(result.current.watchlist[1].agentId).toBe('11155111:1');
    });

    it('respects MAX_WATCHED_AGENTS limit', () => {
      const existingWatchlist: WatchedAgent[] = Array.from(
        { length: MAX_WATCHED_AGENTS },
        (_, i) => ({
          ...createMockAgent(`11155111:${i}`),
          watchedAt: Date.now() - i,
        }),
      );
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      let added = false;
      act(() => {
        added = result.current.addToWatchlist(createMockAgent('11155111:999'));
      });

      expect(added).toBe(false);
      expect(result.current.watchlist).toHaveLength(MAX_WATCHED_AGENTS);
      expect(result.current.isAtLimit).toBe(true);
    });

    it('preserves optional fields like lastReputationScore', () => {
      const { result } = renderHook(() => useWatchlist());
      const agent = {
        ...createMockAgent('11155111:1'),
        lastReputationScore: 85,
        lastActiveStatus: true,
      };

      act(() => {
        result.current.addToWatchlist(agent);
      });

      expect(result.current.watchlist[0].lastReputationScore).toBe(85);
      expect(result.current.watchlist[0].lastActiveStatus).toBe(true);
    });
  });

  describe('removeFromWatchlist', () => {
    it('removes agent from watchlist', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
        { ...createMockAgent('11155111:2'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      act(() => {
        result.current.removeFromWatchlist('11155111:1');
      });

      expect(result.current.watchlist).toHaveLength(1);
      expect(result.current.watchlist[0].agentId).toBe('11155111:2');
    });

    it('does nothing if agent not in watchlist', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      act(() => {
        result.current.removeFromWatchlist('11155111:999');
      });

      expect(result.current.watchlist).toHaveLength(1);
    });
  });

  describe('toggleWatch', () => {
    it('adds agent when not watching', () => {
      const { result } = renderHook(() => useWatchlist());
      const agent = createMockAgent('11155111:1');

      let watching = false;
      act(() => {
        watching = result.current.toggleWatch(agent);
      });

      expect(watching).toBe(true);
      expect(result.current.isWatching('11155111:1')).toBe(true);
    });

    it('removes agent when already watching', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());
      const agent = createMockAgent('11155111:1');

      let watching = true;
      act(() => {
        watching = result.current.toggleWatch(agent);
      });

      expect(watching).toBe(false);
      expect(result.current.isWatching('11155111:1')).toBe(false);
    });
  });

  describe('updateWatchedAgent', () => {
    it('updates agent properties', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now(), lastReputationScore: 70 },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      act(() => {
        result.current.updateWatchedAgent('11155111:1', {
          lastReputationScore: 85,
          lastChangeAt: Date.now(),
        });
      });

      expect(result.current.watchlist[0].lastReputationScore).toBe(85);
      expect(result.current.watchlist[0].lastChangeAt).toBeDefined();
    });

    it('preserves agentId and watchedAt', () => {
      const watchedAt = Date.now() - 10000;
      const existingWatchlist: WatchedAgent[] = [{ ...createMockAgent('11155111:1'), watchedAt }];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      act(() => {
        result.current.updateWatchedAgent('11155111:1', {
          agentId: 'hacked:id',
          watchedAt: 0,
          name: 'Updated Name',
        } as Partial<WatchedAgent>);
      });

      expect(result.current.watchlist[0].agentId).toBe('11155111:1');
      expect(result.current.watchlist[0].watchedAt).toBe(watchedAt);
      expect(result.current.watchlist[0].name).toBe('Updated Name');
    });

    it('does nothing for non-existent agent', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      act(() => {
        result.current.updateWatchedAgent('11155111:999', { name: 'New Name' });
      });

      expect(result.current.watchlist).toHaveLength(1);
      expect(result.current.watchlist[0].name).toBe('Agent 11155111:1');
    });
  });

  describe('setAgentNotes', () => {
    it('sets notes for an agent', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      act(() => {
        result.current.setAgentNotes('11155111:1', 'Important agent to monitor');
      });

      expect(result.current.watchlist[0].notes).toBe('Important agent to monitor');
    });

    it('trims whitespace from notes', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      act(() => {
        result.current.setAgentNotes('11155111:1', '  Note with spaces  ');
      });

      expect(result.current.watchlist[0].notes).toBe('Note with spaces');
    });

    it('removes notes when empty string', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now(), notes: 'Existing note' },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      act(() => {
        result.current.setAgentNotes('11155111:1', '');
      });

      expect(result.current.watchlist[0].notes).toBeUndefined();
    });
  });

  describe('clearWatchlist', () => {
    it('removes all agents from watchlist', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
        { ...createMockAgent('11155111:2'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      act(() => {
        result.current.clearWatchlist();
      });

      expect(result.current.watchlist).toHaveLength(0);
      expect(result.current.watchCount).toBe(0);
    });
  });

  describe('getWatchlistByChain', () => {
    it('filters watchlist by chain ID', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1', 11155111), watchedAt: Date.now() },
        { ...createMockAgent('84532:2', 84532), watchedAt: Date.now() },
        { ...createMockAgent('11155111:3', 11155111), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      const sepoliaAgents = result.current.getWatchlistByChain(11155111);

      expect(sepoliaAgents).toHaveLength(2);
      expect(sepoliaAgents.every((a) => a.chainId === 11155111)).toBe(true);
    });

    it('returns empty array for chain with no agents', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1', 11155111), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      const polygonAgents = result.current.getWatchlistByChain(80002);

      expect(polygonAgents).toHaveLength(0);
    });
  });

  describe('getRecentlyChanged', () => {
    it('returns agents with recent changes', () => {
      const now = Date.now();
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: now - 100000, lastChangeAt: now - 1000 },
        { ...createMockAgent('11155111:2'), watchedAt: now - 100000 },
        { ...createMockAgent('11155111:3'), watchedAt: now - 100000, lastChangeAt: now - 2000 },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      const recentlyChanged = result.current.getRecentlyChanged();

      expect(recentlyChanged).toHaveLength(2);
      expect(recentlyChanged[0].agentId).toBe('11155111:1'); // Most recent first
      expect(recentlyChanged[1].agentId).toBe('11155111:3');
    });

    it('filters by custom time window', () => {
      const now = Date.now();
      const oneHourAgo = now - 60 * 60 * 1000;
      const twoHoursAgo = now - 2 * 60 * 60 * 1000;

      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: now - 100000, lastChangeAt: now - 1000 },
        { ...createMockAgent('11155111:2'), watchedAt: now - 100000, lastChangeAt: twoHoursAgo },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      const recentlyChanged = result.current.getRecentlyChanged(oneHourAgo);

      expect(recentlyChanged).toHaveLength(1);
      expect(recentlyChanged[0].agentId).toBe('11155111:1');
    });

    it('returns empty array when no changes', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      const recentlyChanged = result.current.getRecentlyChanged();

      expect(recentlyChanged).toHaveLength(0);
    });
  });

  describe('exportWatchlist', () => {
    it('exports watchlist as JSON', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      const exported = result.current.exportWatchlist();
      const parsed = JSON.parse(exported);

      expect(parsed.version).toBe(1);
      expect(parsed.exportedAt).toBeDefined();
      expect(parsed.watchlist).toHaveLength(1);
      expect(parsed.watchlist[0].agentId).toBe('11155111:1');
    });
  });

  describe('importWatchlist', () => {
    it('imports valid watchlist data', () => {
      const { result } = renderHook(() => useWatchlist());

      const importData = JSON.stringify({
        version: 1,
        watchlist: [
          { agentId: '11155111:1', name: 'Agent 1', chainId: 11155111, watchedAt: Date.now() },
          { agentId: '84532:2', name: 'Agent 2', chainId: 84532, watchedAt: Date.now() },
        ],
      });

      let importResult = { imported: 0, errors: 0 };
      act(() => {
        importResult = result.current.importWatchlist(importData);
      });

      expect(importResult.imported).toBe(2);
      expect(importResult.errors).toBe(0);
      expect(result.current.watchlist).toHaveLength(2);
    });

    it('skips invalid entries', () => {
      const { result } = renderHook(() => useWatchlist());

      const importData = JSON.stringify({
        watchlist: [
          { agentId: '11155111:1', name: 'Valid', chainId: 11155111, watchedAt: Date.now() },
          {
            agentId: 'invalid-no-colon',
            name: 'Invalid',
            chainId: 11155111,
            watchedAt: Date.now(),
          },
          { name: 'Missing agentId', chainId: 11155111, watchedAt: Date.now() },
        ],
      });

      let importResult = { imported: 0, errors: 0 };
      act(() => {
        importResult = result.current.importWatchlist(importData);
      });

      expect(importResult.imported).toBe(1);
      expect(importResult.errors).toBe(2);
    });

    it('skips duplicate agents', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      const importData = JSON.stringify({
        watchlist: [
          { agentId: '11155111:1', name: 'Duplicate', chainId: 11155111, watchedAt: Date.now() },
          { agentId: '11155111:2', name: 'New', chainId: 11155111, watchedAt: Date.now() },
        ],
      });

      let importResult = { imported: 0, errors: 0 };
      act(() => {
        importResult = result.current.importWatchlist(importData);
      });

      expect(importResult.imported).toBe(1);
      expect(importResult.errors).toBe(1);
      expect(result.current.watchlist).toHaveLength(2);
    });

    it('handles invalid JSON', () => {
      const { result } = renderHook(() => useWatchlist());

      let importResult = { imported: 0, errors: 0 };
      act(() => {
        importResult = result.current.importWatchlist('not valid json');
      });

      expect(importResult.imported).toBe(0);
      expect(importResult.errors).toBe(1);
    });

    it('respects MAX_WATCHED_AGENTS during import', () => {
      const existingWatchlist: WatchedAgent[] = Array.from(
        { length: MAX_WATCHED_AGENTS - 1 },
        (_, i) => ({
          ...createMockAgent(`11155111:${i}`),
          watchedAt: Date.now() - i,
        }),
      );
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      const importData = JSON.stringify({
        watchlist: [
          { agentId: '84532:100', name: 'New 1', chainId: 84532, watchedAt: Date.now() },
          { agentId: '84532:101', name: 'New 2', chainId: 84532, watchedAt: Date.now() },
        ],
      });

      let importResult = { imported: 0, errors: 0 };
      act(() => {
        importResult = result.current.importWatchlist(importData);
      });

      expect(importResult.imported).toBe(1);
      expect(result.current.watchlist).toHaveLength(MAX_WATCHED_AGENTS);
    });
  });

  describe('watchCount and isAtLimit', () => {
    it('watchCount reflects actual count', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
        { ...createMockAgent('11155111:2'), watchedAt: Date.now() },
        { ...createMockAgent('11155111:3'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      expect(result.current.watchCount).toBe(3);
    });

    it('isAtLimit is true when at max capacity', () => {
      const existingWatchlist: WatchedAgent[] = Array.from(
        { length: MAX_WATCHED_AGENTS },
        (_, i) => ({
          ...createMockAgent(`11155111:${i}`),
          watchedAt: Date.now() - i,
        }),
      );
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      expect(result.current.isAtLimit).toBe(true);
    });

    it('isAtLimit is false when below max capacity', () => {
      const existingWatchlist: WatchedAgent[] = [
        { ...createMockAgent('11155111:1'), watchedAt: Date.now() },
      ];
      mockLocalStorage['agent-explorer-watchlist'] = JSON.stringify(existingWatchlist);

      const { result } = renderHook(() => useWatchlist());

      expect(result.current.isAtLimit).toBe(false);
    });
  });
});
