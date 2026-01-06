'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

/** Maximum number of agents that can be compared at once */
export const MAX_COMPARE_AGENTS = 4;

/** Minimum number of agents required for comparison */
export const MIN_COMPARE_AGENTS = 2;

/** URL parameter key for agent IDs */
export const COMPARE_PARAM_KEY = 'agents';

export interface UseCompareAgentsReturn {
  /** Array of selected agent IDs */
  selectedAgentIds: string[];
  /** Number of selected agents */
  selectedCount: number;
  /** Whether an agent is selected for comparison */
  isSelected: (agentId: string) => boolean;
  /** Whether the maximum number of agents is selected */
  isMaxSelected: boolean;
  /** Whether comparison can be started (min agents selected) */
  canCompare: boolean;
  /** Add an agent to comparison */
  addAgent: (agentId: string) => void;
  /** Remove an agent from comparison */
  removeAgent: (agentId: string) => void;
  /** Toggle agent selection */
  toggleAgent: (agentId: string) => void;
  /** Clear all selected agents */
  clearAll: () => void;
  /** Get the comparison URL */
  getCompareUrl: () => string;
  /** Navigate to comparison page */
  goToCompare: () => void;
}

/**
 * Parse agent IDs from URL search params
 */
function parseAgentIds(searchParams: URLSearchParams): string[] {
  const agentsParam = searchParams.get(COMPARE_PARAM_KEY);
  if (!agentsParam) return [];

  return agentsParam
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
    .slice(0, MAX_COMPARE_AGENTS);
}

/**
 * Serialize agent IDs to URL search params
 */
function serializeAgentIds(agentIds: string[]): URLSearchParams {
  const params = new URLSearchParams();
  if (agentIds.length > 0) {
    params.set(COMPARE_PARAM_KEY, agentIds.join(','));
  }
  return params;
}

/**
 * Hook to manage agent comparison selection with URL state sync.
 * Stores selected agent IDs in URL for shareable comparison links.
 *
 * @example
 * ```tsx
 * const {
 *   selectedAgentIds,
 *   isSelected,
 *   toggleAgent,
 *   canCompare,
 *   goToCompare
 * } = useCompareAgents();
 *
 * // In agent card
 * <CompareCheckbox
 *   checked={isSelected(agent.id)}
 *   onChange={() => toggleAgent(agent.id)}
 *   disabled={!isSelected(agent.id) && isMaxSelected}
 * />
 *
 * // In compare bar
 * <button onClick={goToCompare} disabled={!canCompare}>
 *   Compare {selectedCount} agents
 * </button>
 * ```
 */
export function useCompareAgents(): UseCompareAgentsReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse selected agent IDs from URL
  const selectedAgentIds = useMemo(() => parseAgentIds(searchParams), [searchParams]);

  const selectedCount = selectedAgentIds.length;
  const isMaxSelected = selectedCount >= MAX_COMPARE_AGENTS;
  const canCompare = selectedCount >= MIN_COMPARE_AGENTS;

  // Check if an agent is selected
  const isSelected = useCallback(
    (agentId: string): boolean => {
      return selectedAgentIds.includes(agentId);
    },
    [selectedAgentIds],
  );

  // Update URL with new agent IDs
  const updateUrl = useCallback(
    (newAgentIds: string[]) => {
      // Preserve other search params
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.delete(COMPARE_PARAM_KEY);

      if (newAgentIds.length > 0) {
        currentParams.set(COMPARE_PARAM_KEY, newAgentIds.join(','));
      }

      const search = currentParams.toString();
      const url = search ? `${pathname}?${search}` : pathname;
      router.push(url, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Add an agent to comparison
  const addAgent = useCallback(
    (agentId: string) => {
      if (selectedAgentIds.includes(agentId)) return;
      if (selectedAgentIds.length >= MAX_COMPARE_AGENTS) return;

      updateUrl([...selectedAgentIds, agentId]);
    },
    [selectedAgentIds, updateUrl],
  );

  // Remove an agent from comparison
  const removeAgent = useCallback(
    (agentId: string) => {
      if (!selectedAgentIds.includes(agentId)) return;

      updateUrl(selectedAgentIds.filter((id) => id !== agentId));
    },
    [selectedAgentIds, updateUrl],
  );

  // Toggle agent selection
  const toggleAgent = useCallback(
    (agentId: string) => {
      if (selectedAgentIds.includes(agentId)) {
        removeAgent(agentId);
      } else {
        addAgent(agentId);
      }
    },
    [selectedAgentIds, addAgent, removeAgent],
  );

  // Clear all selected agents
  const clearAll = useCallback(() => {
    updateUrl([]);
  }, [updateUrl]);

  // Get the comparison URL
  const getCompareUrl = useCallback((): string => {
    if (selectedAgentIds.length === 0) return '/compare';
    const params = serializeAgentIds(selectedAgentIds);
    return `/compare?${params.toString()}`;
  }, [selectedAgentIds]);

  // Navigate to comparison page
  const goToCompare = useCallback(() => {
    if (!canCompare) return;
    router.push(getCompareUrl());
  }, [router, canCompare, getCompareUrl]);

  return {
    selectedAgentIds,
    selectedCount,
    isSelected,
    isMaxSelected,
    canCompare,
    addAgent,
    removeAgent,
    toggleAgent,
    clearAll,
    getCompareUrl,
    goToCompare,
  };
}
