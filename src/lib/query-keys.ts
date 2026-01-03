/**
 * TanStack Query key factory for type-safe query keys
 *
 * Uses stable serialization for query keys to ensure consistent caching.
 * Object params are serialized to deterministic strings to avoid cache
 * fragmentation from different object references with identical values.
 */

import type { EvaluationStatus } from '@/types/agent';
import type { SearchParams } from '@/types/search';

/**
 * Create a stable, deterministic string from an object by sorting keys.
 * This ensures that { a: 1, b: 2 } and { b: 2, a: 1 } produce the same key.
 */
function stableSerialize(obj: Record<string, unknown>): string {
  const sortedKeys = Object.keys(obj).sort();
  const sorted: Record<string, unknown> = {};
  for (const key of sortedKeys) {
    const value = obj[key];
    // Recursively sort nested objects and arrays
    if (Array.isArray(value)) {
      const processed = value.map((item) =>
        typeof item === 'object' && item !== null
          ? JSON.parse(stableSerialize(item as Record<string, unknown>))
          : item,
      );
      // Sort primitive arrays for stable cache keys (e.g., chains: [84532, 11155111] === [11155111, 84532])
      if (processed.length > 0 && typeof processed[0] !== 'object') {
        processed.sort((a, b) => {
          if (typeof a === 'number' && typeof b === 'number') return a - b;
          return String(a).localeCompare(String(b));
        });
      }
      sorted[key] = processed;
    } else if (typeof value === 'object' && value !== null) {
      sorted[key] = JSON.parse(stableSerialize(value as Record<string, unknown>));
    } else {
      sorted[key] = value;
    }
  }
  return JSON.stringify(sorted);
}

export const queryKeys = {
  all: ['agents'] as const,

  // Agent lists - uses stable serialization to prevent cache fragmentation
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params: SearchParams) =>
    [...queryKeys.lists(), stableSerialize(params as Record<string, unknown>)] as const,

  // Individual agents
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (agentId: string) => [...queryKeys.details(), agentId] as const,

  // Agent reputation
  reputations: () => [...queryKeys.all, 'reputation'] as const,
  reputation: (agentId: string) => [...queryKeys.reputations(), agentId] as const,

  // Agent feedback
  feedbacks: () => [...queryKeys.all, 'feedback'] as const,
  feedback: (agentId: string) => [...queryKeys.feedbacks(), agentId] as const,

  // Chain stats
  chains: () => ['chains'] as const,

  // Evaluations
  evaluations: () => ['evaluations'] as const,
  evaluation: (id: string) => [...queryKeys.evaluations(), id] as const,
  agentEvaluations: (agentId: string) => [...queryKeys.evaluations(), 'agent', agentId] as const,
  evaluationsByStatus: (status: EvaluationStatus) =>
    [...queryKeys.evaluations(), 'status', status] as const,

  // Events (for cache invalidation tracking)
  events: () => ['events'] as const,
  eventsByType: (type: string) => [...queryKeys.events(), type] as const,

  // Intents
  intents: () => ['intents'] as const,
  intent: (id: string) => [...queryKeys.intents(), id] as const,
  intentsByCategory: (category: string) => [...queryKeys.intents(), 'category', category] as const,
  intentMatches: (id: string) => [...queryKeys.intents(), id, 'matches'] as const,

  // Platform stats
  stats: () => ['stats'] as const,

  // Related agents - uses stable serialization for options
  relatedAgents: () => [...queryKeys.all, 'related'] as const,
  related: (agentId: string, limit?: number, crossChain?: boolean) =>
    [...queryKeys.relatedAgents(), agentId, stableSerialize({ limit, crossChain })] as const,

  // Similar agents (OASF-based similarity) - uses stable serialization for options
  similarAgents: () => [...queryKeys.all, 'similar'] as const,
  similar: (agentId: string, limit?: number) =>
    [...queryKeys.similarAgents(), agentId, stableSerialize({ limit })] as const,

  // Teams / Composition
  teams: () => ['teams'] as const,
  composition: (id: string) => [...queryKeys.teams(), 'composition', id] as const,
  composeTask: (task: string) => [...queryKeys.teams(), 'task', stableSerialize({ task })] as const,
} as const;
