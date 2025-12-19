/**
 * Custom hook for SearchFilters event handlers
 */

import { useCallback, useMemo } from 'react';
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
  const handleStatusChange = useCallback(
    (status: string[]) => {
      onFiltersChange({ ...filters, status });
    },
    [filters, onFiltersChange],
  );

  const handleProtocolToggle = useCallback(
    (protocol: CapabilityType) => {
      const newProtocols = filters.protocols.includes(protocol)
        ? filters.protocols.filter((p) => p !== protocol)
        : [...filters.protocols, protocol];
      onFiltersChange({ ...filters, protocols: newProtocols });
    },
    [filters, onFiltersChange],
  );

  const handleFilterModeChange = useCallback(
    (mode: FilterMode) => {
      onFiltersChange({ ...filters, filterMode: mode });
    },
    [filters, onFiltersChange],
  );

  const handleReputationChange = useCallback(
    (minReputation: number, maxReputation: number) => {
      onFiltersChange({ ...filters, minReputation, maxReputation });
    },
    [filters, onFiltersChange],
  );

  const handleChainToggle = useCallback(
    (chainId: ChainId) => {
      const newChains = filters.chains.includes(chainId)
        ? filters.chains.filter((c) => c !== chainId)
        : [...filters.chains, chainId];
      onFiltersChange({ ...filters, chains: newChains });
    },
    [filters, onFiltersChange],
  );

  const handleSkillsChange = useCallback(
    (skills: string[]) => {
      onFiltersChange({ ...filters, skills });
    },
    [filters, onFiltersChange],
  );

  const handleDomainsChange = useCallback(
    (domains: string[]) => {
      onFiltersChange({ ...filters, domains });
    },
    [filters, onFiltersChange],
  );

  const handleShowAllAgentsChange = useCallback(
    (showAllAgents: boolean) => {
      onFiltersChange({ ...filters, showAllAgents });
    },
    [filters, onFiltersChange],
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
