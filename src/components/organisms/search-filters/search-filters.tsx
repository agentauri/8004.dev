import type React from 'react';
import { type ChainId, Switch } from '@/components/atoms';
import {
  CapabilityTag,
  type CapabilityType,
  FilterGroup,
  type FilterMode,
  FilterModeToggle,
  PresetSelector,
  ReputationRangeFilter,
  TaxonomyFilter,
} from '@/components/molecules';
import { CHAINS } from '@/lib/constants/chains';
import { cn } from '@/lib/utils';
import type { FilterPreset } from '@/types/filter-preset';

import { CHAIN_SELECTED_STYLES, PROTOCOLS, SUPPORTED_CHAINS } from './filter-constants';
import { useFilterHandlers } from './use-filter-handlers';

/**
 * All filters are now supported by the backend API.
 * Updated 2025-12-11: All features enabled after backend fixes.
 */

export interface SearchFiltersState {
  /** Selected status filters */
  status: string[];
  /** Selected protocol/capability filters */
  protocols: CapabilityType[];
  /** Selected chain filters */
  chains: ChainId[];
  /** Filter mode (AND/OR) */
  filterMode: FilterMode;
  /** Minimum reputation score */
  minReputation: number;
  /** Maximum reputation score */
  maxReputation: number;
  /** Selected OASF skill slugs */
  skills: string[];
  /** Selected OASF domain slugs */
  domains: string[];
  /** Show all agents including inactive and without registration file */
  showAllAgents: boolean;
}

export interface SearchFiltersProps {
  /** Current filter state */
  filters: SearchFiltersState;
  /** Callback when filters change */
  onFiltersChange: (filters: SearchFiltersState) => void;
  /** Counts for each filter option */
  counts?: {
    active?: number;
    inactive?: number;
    mcp?: number;
    a2a?: number;
    x402?: number;
  };
  /** Available filter presets */
  presets?: FilterPreset[];
  /** Currently selected preset ID */
  selectedPresetId?: string;
  /** Callback when a preset is selected */
  onPresetSelect?: (preset: FilterPreset) => void;
  /** Callback to save current filters as a new preset */
  onPresetSave?: () => void;
  /** Callback to delete a preset */
  onPresetDelete?: (presetId: string) => void;
  /** Whether filters have unsaved changes */
  hasUnsavedChanges?: boolean;
  /** Whether filters are disabled */
  disabled?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * SearchFilters provides filtering controls for agent search results.
 *
 * @example
 * ```tsx
 * <SearchFilters
 *   filters={{ status: ['active'], protocols: ['mcp'], filterMode: 'AND', minReputation: 0, maxReputation: 100 }}
 *   onFiltersChange={setFilters}
 * />
 * ```
 */
export function SearchFilters({
  filters,
  onFiltersChange,
  counts = {},
  presets,
  selectedPresetId,
  onPresetSelect,
  onPresetSave,
  onPresetDelete,
  hasUnsavedChanges = false,
  disabled = false,
  className,
}: SearchFiltersProps): React.JSX.Element {
  const {
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
  } = useFilterHandlers(filters, onFiltersChange, counts);

  return (
    <div
      className={cn('space-y-6', disabled && 'opacity-50 pointer-events-none', className)}
      data-testid="search-filters"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-pixel-heading)] text-[var(--pixel-gray-200)] text-sm uppercase tracking-wider">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="font-[family-name:var(--font-pixel-body)] text-[0.625rem] text-[var(--pixel-gray-400)] hover:text-[var(--pixel-primary)] transition-colors uppercase"
            data-testid="clear-filters"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Presets */}
      {presets && presets.length > 0 && onPresetSelect && (
        <PresetSelector
          presets={presets}
          selectedPresetId={selectedPresetId}
          onSelect={onPresetSelect}
          onSave={onPresetSave}
          onDelete={onPresetDelete}
          canSave={hasUnsavedChanges}
          disabled={disabled}
        />
      )}

      {/* Filter Mode Toggle */}
      <div className="flex items-center gap-3">
        <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider">
          Filter Mode
        </span>
        <FilterModeToggle
          value={filters.filterMode}
          onChange={handleFilterModeChange}
          disabled={disabled}
        />
      </div>

      <FilterGroup
        label="Status"
        options={statusOptionsWithCounts}
        selected={filters.status}
        onChange={handleStatusChange}
      />

      {/* Chain Filter */}
      <div className="space-y-3">
        <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider">
          Chains
        </span>
        <div className="flex flex-wrap gap-2" data-testid="chain-filter-group">
          {SUPPORTED_CHAINS.map((chainId) => {
            const chain = CHAINS[chainId];
            const isSelected = filters.chains.includes(chainId);
            return (
              <button
                key={chainId}
                type="button"
                onClick={() => handleChainToggle(chainId)}
                className={cn(
                  'px-2.5 py-1.5 text-[0.625rem] font-[family-name:var(--font-pixel-body)] uppercase border transition-colors',
                  isSelected
                    ? 'border-current'
                    : 'bg-transparent border-[var(--pixel-gray-600)] text-[var(--pixel-gray-400)] hover:border-[var(--pixel-gray-400)] hover:text-[var(--pixel-gray-200)]',
                )}
                style={isSelected ? CHAIN_SELECTED_STYLES[chainId] : undefined}
                aria-pressed={isSelected}
                data-testid={`chain-filter-${chainId}`}
              >
                {chain.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* OASF Taxonomy Filters */}
      <TaxonomyFilter
        type="skill"
        selected={filters.skills}
        onChange={handleSkillsChange}
        disabled={disabled}
      />

      <TaxonomyFilter
        type="domain"
        selected={filters.domains}
        onChange={handleDomainsChange}
        disabled={disabled}
      />

      <div className="space-y-3">
        <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider">
          Protocols
        </span>
        <div className="flex flex-wrap gap-2">
          {PROTOCOLS.map((protocol) => (
            <CapabilityTag
              key={protocol}
              type={protocol}
              interactive
              selected={filters.protocols.includes(protocol)}
              onClick={() => handleProtocolToggle(protocol)}
            />
          ))}
        </div>
      </div>

      {/* Reputation Range Filter */}
      <ReputationRangeFilter
        minValue={filters.minReputation}
        maxValue={filters.maxReputation}
        onChange={handleReputationChange}
        disabled={disabled}
      />

      {/* Show All Agents Toggle */}
      <div className="pt-4 border-t border-[var(--pixel-gray-700)]">
        <Switch
          checked={filters.showAllAgents}
          onChange={handleShowAllAgentsChange}
          label="Show all agents"
          description="Include inactive agents and agents without metadata"
          disabled={disabled}
          testId="show-all-agents-toggle"
        />
      </div>
    </div>
  );
}
