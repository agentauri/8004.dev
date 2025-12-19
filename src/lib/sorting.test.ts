import { describe, expect, it } from 'vitest';
import type { AgentSummary } from '@/types/agent';
import { sortAgents } from './sorting';

// Helper to create mock agents
function createMockAgent(overrides: Partial<AgentSummary> = {}): AgentSummary {
  return {
    id: '11155111:1',
    chainId: 11155111,
    tokenId: '1',
    name: 'Test Agent',
    description: 'A test agent',
    active: true,
    x402support: false,
    hasMcp: true,
    hasA2a: false,
    supportedTrust: [],
    ...overrides,
  };
}

describe('sortAgents', () => {
  describe('empty array handling', () => {
    it('returns empty array for empty input', () => {
      expect(sortAgents([], 'name', 'asc')).toEqual([]);
    });
  });

  describe('sort by name', () => {
    it('sorts by name ascending (A-Z)', () => {
      const agents = [
        createMockAgent({ name: 'Zebra Agent', tokenId: '1' }),
        createMockAgent({ name: 'Alpha Agent', tokenId: '2' }),
        createMockAgent({ name: 'Beta Agent', tokenId: '3' }),
      ];

      const sorted = sortAgents(agents, 'name', 'asc');

      expect(sorted.map((a) => a.name)).toEqual(['Alpha Agent', 'Beta Agent', 'Zebra Agent']);
    });

    it('sorts by name descending (Z-A)', () => {
      const agents = [
        createMockAgent({ name: 'Alpha Agent', tokenId: '1' }),
        createMockAgent({ name: 'Zebra Agent', tokenId: '2' }),
        createMockAgent({ name: 'Beta Agent', tokenId: '3' }),
      ];

      const sorted = sortAgents(agents, 'name', 'desc');

      expect(sorted.map((a) => a.name)).toEqual(['Zebra Agent', 'Beta Agent', 'Alpha Agent']);
    });

    it('handles case-insensitive sorting', () => {
      const agents = [
        createMockAgent({ name: 'zebra Agent', tokenId: '1' }),
        createMockAgent({ name: 'Alpha Agent', tokenId: '2' }),
        createMockAgent({ name: 'BETA Agent', tokenId: '3' }),
      ];

      const sorted = sortAgents(agents, 'name', 'asc');

      expect(sorted.map((a) => a.name)).toEqual(['Alpha Agent', 'BETA Agent', 'zebra Agent']);
    });

    it('handles identical names', () => {
      const agents = [
        createMockAgent({ name: 'Same Name', tokenId: '1' }),
        createMockAgent({ name: 'Same Name', tokenId: '2' }),
      ];

      const sorted = sortAgents(agents, 'name', 'asc');

      expect(sorted).toHaveLength(2);
      expect(sorted.every((a) => a.name === 'Same Name')).toBe(true);
    });
  });

  describe('sort by createdAt (using tokenId)', () => {
    it('sorts by tokenId ascending (oldest first)', () => {
      const agents = [
        createMockAgent({ tokenId: '100', name: 'Agent C' }),
        createMockAgent({ tokenId: '1', name: 'Agent A' }),
        createMockAgent({ tokenId: '50', name: 'Agent B' }),
      ];

      const sorted = sortAgents(agents, 'createdAt', 'asc');

      expect(sorted.map((a) => a.tokenId)).toEqual(['1', '50', '100']);
    });

    it('sorts by tokenId descending (newest first)', () => {
      const agents = [
        createMockAgent({ tokenId: '1', name: 'Agent A' }),
        createMockAgent({ tokenId: '100', name: 'Agent C' }),
        createMockAgent({ tokenId: '50', name: 'Agent B' }),
      ];

      const sorted = sortAgents(agents, 'createdAt', 'desc');

      expect(sorted.map((a) => a.tokenId)).toEqual(['100', '50', '1']);
    });
  });

  describe('sort by reputation', () => {
    it('sorts by reputation ascending (lowest first)', () => {
      const agents = [
        createMockAgent({ reputationScore: 80, name: 'High Rep' }),
        createMockAgent({ reputationScore: 20, name: 'Low Rep' }),
        createMockAgent({ reputationScore: 50, name: 'Mid Rep' }),
      ];

      const sorted = sortAgents(agents, 'reputation', 'asc');

      expect(sorted.map((a) => a.reputationScore)).toEqual([20, 50, 80]);
    });

    it('sorts by reputation descending (highest first)', () => {
      const agents = [
        createMockAgent({ reputationScore: 20, name: 'Low Rep' }),
        createMockAgent({ reputationScore: 80, name: 'High Rep' }),
        createMockAgent({ reputationScore: 50, name: 'Mid Rep' }),
      ];

      const sorted = sortAgents(agents, 'reputation', 'desc');

      expect(sorted.map((a) => a.reputationScore)).toEqual([80, 50, 20]);
    });

    it('treats undefined reputation as 0', () => {
      const agents = [
        createMockAgent({ reputationScore: 50, name: 'Has Rep' }),
        createMockAgent({ reputationScore: undefined, name: 'No Rep' }),
        createMockAgent({ reputationScore: 25, name: 'Low Rep' }),
      ];

      const sorted = sortAgents(agents, 'reputation', 'asc');

      expect(sorted.map((a) => a.name)).toEqual(['No Rep', 'Low Rep', 'Has Rep']);
    });

    it('treats null reputation as 0', () => {
      const agents = [
        createMockAgent({ reputationScore: 50, name: 'Has Rep' }),
        // biome-ignore lint/suspicious/noExplicitAny: Testing null handling requires bypassing type system
        createMockAgent({ reputationScore: null as any, name: 'Null Rep' }),
      ];

      const sorted = sortAgents(agents, 'reputation', 'asc');

      expect(sorted.map((a) => a.name)).toEqual(['Null Rep', 'Has Rep']);
    });
  });

  describe('sort by relevance', () => {
    it('sorts by relevance ascending (lowest first)', () => {
      const agents = [
        createMockAgent({ relevanceScore: 90, name: 'High Rel' }),
        createMockAgent({ relevanceScore: 30, name: 'Low Rel' }),
        createMockAgent({ relevanceScore: 60, name: 'Mid Rel' }),
      ];

      const sorted = sortAgents(agents, 'relevance', 'asc');

      expect(sorted.map((a) => a.relevanceScore)).toEqual([30, 60, 90]);
    });

    it('sorts by relevance descending (highest first)', () => {
      const agents = [
        createMockAgent({ relevanceScore: 30, name: 'Low Rel' }),
        createMockAgent({ relevanceScore: 90, name: 'High Rel' }),
        createMockAgent({ relevanceScore: 60, name: 'Mid Rel' }),
      ];

      const sorted = sortAgents(agents, 'relevance', 'desc');

      expect(sorted.map((a) => a.relevanceScore)).toEqual([90, 60, 30]);
    });

    it('treats undefined relevance as 0', () => {
      const agents = [
        createMockAgent({ relevanceScore: 50, name: 'Has Rel' }),
        createMockAgent({ relevanceScore: undefined, name: 'No Rel' }),
      ];

      const sorted = sortAgents(agents, 'relevance', 'desc');

      expect(sorted.map((a) => a.name)).toEqual(['Has Rel', 'No Rel']);
    });
  });

  describe('immutability', () => {
    it('does not mutate the original array', () => {
      const agents = [
        createMockAgent({ name: 'Zebra', tokenId: '1' }),
        createMockAgent({ name: 'Alpha', tokenId: '2' }),
      ];
      const originalOrder = [...agents];

      sortAgents(agents, 'name', 'asc');

      expect(agents).toEqual(originalOrder);
    });

    it('returns a new array instance', () => {
      const agents = [createMockAgent({ name: 'Agent', tokenId: '1' })];

      const sorted = sortAgents(agents, 'name', 'asc');

      expect(sorted).not.toBe(agents);
    });
  });

  describe('single element array', () => {
    it('returns array with single element unchanged', () => {
      const agents = [createMockAgent({ name: 'Only Agent', tokenId: '1' })];

      const sorted = sortAgents(agents, 'name', 'asc');

      expect(sorted).toEqual(agents);
      expect(sorted).not.toBe(agents); // Still a new array
    });
  });

  describe('default/unknown sort field', () => {
    it('falls back to relevance for unknown sort field', () => {
      const agents = [
        createMockAgent({ relevanceScore: 30, name: 'Low' }),
        createMockAgent({ relevanceScore: 90, name: 'High' }),
      ];

      // @ts-expect-error - Testing unknown sort field
      const sorted = sortAgents(agents, 'unknown', 'desc');

      expect(sorted.map((a) => a.relevanceScore)).toEqual([90, 30]);
    });
  });
});
