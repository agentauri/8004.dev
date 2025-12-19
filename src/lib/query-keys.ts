/**
 * TanStack Query key factory for type-safe query keys
 */

import type { SearchParams } from '@/types/search';

export const queryKeys = {
  all: ['agents'] as const,

  // Agent lists
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params: SearchParams) => [...queryKeys.lists(), params] as const,

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

  // Platform stats
  stats: () => ['stats'] as const,

  // Related agents
  relatedAgents: () => [...queryKeys.all, 'related'] as const,
  related: (agentId: string, limit?: number, crossChain?: boolean) =>
    [...queryKeys.relatedAgents(), agentId, { limit, crossChain }] as const,

  // Similar agents (OASF-based similarity)
  similarAgents: () => [...queryKeys.all, 'similar'] as const,
  similar: (agentId: string, limit?: number) =>
    [...queryKeys.similarAgents(), agentId, { limit }] as const,
} as const;
