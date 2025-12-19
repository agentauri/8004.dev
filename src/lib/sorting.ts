/**
 * Client-side sorting utilities for agents
 *
 * Used to sort agent results in the frontend since the backend
 * semantic search endpoint doesn't support server-side sorting.
 */

import type { SortField, SortOrder } from '@/components/molecules/sort-selector';
import type { AgentSummary } from '@/types/agent';

/**
 * Sort agents by the specified field and order
 *
 * @param agents - Array of agents to sort
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order (asc or desc)
 * @returns New sorted array (does not mutate original)
 *
 * @example
 * ```typescript
 * const sorted = sortAgents(agents, 'name', 'asc');
 * ```
 */
export function sortAgents(
  agents: AgentSummary[],
  sortBy: SortField,
  sortOrder: SortOrder,
): AgentSummary[] {
  // Return early for empty arrays
  if (agents.length === 0) {
    return [];
  }

  const sorted = [...agents].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        // Alphabetical sorting (case-insensitive)
        comparison = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        break;

      case 'createdAt':
        // Use tokenId as proxy for creation order
        // Higher tokenId = more recently created
        comparison = parseInt(a.tokenId, 10) - parseInt(b.tokenId, 10);
        break;

      case 'reputation':
        // Sort by reputation score (null/undefined treated as 0)
        comparison = (a.reputationScore ?? 0) - (b.reputationScore ?? 0);
        break;

      default:
        // Sort by relevance score from semantic search (null/undefined treated as 0)
        // For relevance, we want highest scores first by default
        comparison = (a.relevanceScore ?? 0) - (b.relevanceScore ?? 0);
        break;
    }

    // Apply sort order
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
}
