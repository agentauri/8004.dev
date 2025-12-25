/**
 * Custom hook for SearchFilters event handlers
 *
 * Uses a ref to track current filters to avoid recreating callbacks
 * on every filter change. This improves performance by keeping stable
 * callback references for child components.
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { ChainId } from '@/components/atoms';
import type { CapabilityType, FilterMode } from '@/components/molecules';
import { EMPTY_FILTERS, STATUS_OPTIONS } from './filter-constants';
import type { SearchFiltersState } from './search-filters';

interface FilterCounts {
  active?: number;
  inactive?: number;
  mcp?: number;
  a2a?: number;
  x402?: number;
}

interface UseFilterHandlersReturn {
  handleStatusChange: (status: string[]) => void;
  handleProtocolToggle: (protocol: CapabilityType) => void;
  handleFilterModeChange: (mode: FilterMode) => void;
  handleReputationChange: (minReputation: number, maxReputation: number) => void;
  handleChainToggle: (chainId: ChainId) => void;
  handleSkillsChange: (skills: string[]) => void;
  handleDomainsChange: (domains: string[]) => void;
  handleShowAllAgentsChange: (showAllAgents: boolean) => void;
  handleClearAll: () => void;
  statusOptionsWithCounts: Array<{ value: string; label: string; count?: number }>;
  hasActiveFilters: boolean;
}

export function useFilterHandlers(
  filters: SearchFiltersState,
  onFiltersChange: (filters: SearchFiltersState) => void,
  counts: FilterCounts = {},
): UseFilterHandlersReturn {
  // Use ref to track current filters without causing callback recreation
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const handleStatusChange = useCallback(
    (status: string[]) => {
      onFiltersChange({ ...filtersRef.current, status });
    },
    [onFiltersChange],
  );

  const handleProtocolToggle = useCallback(
    (protocol: CapabilityType) => {
      const current = filtersRef.current;
      const newProtocols = current.protocols.includes(protocol)
        ? current.protocols.filter((p) => p !== protocol)
        : [...current.protocols, protocol];
      onFiltersChange({ ...current, protocols: newProtocols });
    },
    [onFiltersChange],
  );

  const handleFilterModeChange = useCallback(
    (mode: FilterMode) => {
      onFiltersChange({ ...filtersRef.current, filterMode: mode });
    },
    [onFiltersChange],
  );

  const handleReputationChange = useCallback(
    (minReputation: number, maxReputation: number) => {
      onFiltersChange({ ...filtersRef.current, minReputation, maxReputation });
    },
    [onFiltersChange],
  );

  const handleChainToggle = useCallback(
    (chainId: ChainId) => {
      const current = filtersRef.current;
      const newChains = current.chains.includes(chainId)
        ? current.chains.filter((c) => c !== chainId)
        : [...current.chains, chainId];
      onFiltersChange({ ...current, chains: newChains });
    },
    [onFiltersChange],
  );

  const handleSkillsChange = useCallback(
    (skills: string[]) => {
      onFiltersChange({ ...filtersRef.current, skills });
    },
    [onFiltersChange],
  );

  const handleDomainsChange = useCallback(
    (domains: string[]) => {
      onFiltersChange({ ...filtersRef.current, domains });
    },
    [onFiltersChange],
  );

  const handleShowAllAgentsChange = useCallback(
    (showAllAgents: boolean) => {
      onFiltersChange({ ...filtersRef.current, showAllAgents });
    },
    [onFiltersChange],
  );

  const handleClearAll = useCallback(() => {
    onFiltersChange(EMPTY_FILTERS);
  }, [onFiltersChange]);

  const statusOptionsWithCounts = useMemo(
    () =>
      STATUS_OPTIONS.map((opt) => ({
        ...opt,
        count: counts[opt.value as keyof typeof counts],
      })),
    [counts],
  );

  const hasActiveFilters = useMemo(
    () =>
      filters.status.length > 0 ||
      filters.protocols.length > 0 ||
      filters.chains.length > 0 ||
      filters.minReputation > 0 ||
      filters.maxReputation < 100 ||
      filters.skills.length > 0 ||
      filters.domains.length > 0 ||
      filters.showAllAgents,
    [filters],
  );

  return {
    handleStatusChange,
    handleProtocolToggle,
    handleFilterModeChange,
    handleReputationChange,
    handleChainToggle,
    handleSkillsChange,
    handleDomainsChange,
    handleShowAllAgentsChange,
    handleClearAll,
    statusOptionsWithCounts,
    hasActiveFilters,
  };
}
