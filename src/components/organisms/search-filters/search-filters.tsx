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
import type { Erc8004Version } from '@/types/search';

import {
  CHAIN_SELECTED_STYLES,
  ERC8004_VERSION_OPTIONS,
  PROTOCOLS,
  SUPPORTED_CHAINS,
} from './filter-constants';
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
  // Gap 1: Trust Score & Version Filters
  /** Minimum trust score (0-100) */
  minTrustScore: number;
  /** Maximum trust score (0-100) */
  maxTrustScore: number;
  /** ERC-8004 spec version filter */
  erc8004Version: Erc8004Version | '';
  /** MCP protocol version filter */
  mcpVersion: string;
  /** A2A protocol version filter */
  a2aVersion: string;
  // Gap 3: Curation Filters
  /** Whether to show only curated agents */
  isCurated: boolean;
  /** Curator wallet address filter */
  curatedBy: string;
  // Gap 5: Endpoint Filters
  /** Has email endpoint */
  hasEmail: boolean;
  /** Has OASF endpoint */
  hasOasfEndpoint: boolean;
  // Gap 6: Reachability Filters
  /** Has recent reachability check */
  hasRecentReachability: boolean;
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
    handleTrustScoreChange,
    handleErc8004VersionChange,
    handleMcpVersionChange,
    handleA2aVersionChange,
    handleIsCuratedChange,
    handleCuratedByChange,
    handleHasEmailChange,
    handleHasOasfEndpointChange,
    handleHasRecentReachabilityChange,
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

      {/* Trust Score Range Filter */}
      <div className="space-y-2" data-testid="trust-score-range-filter">
        <div className="flex items-center justify-between">
          <span className="text-[0.625rem] font-[family-name:var(--font-pixel-body)] uppercase text-[var(--pixel-gray-400)]">
            Trust Score
          </span>
          <span className="text-[0.625rem] font-[family-name:var(--font-pixel-body)] text-[var(--pixel-blue-text)]">
            {filters.minTrustScore} - {filters.maxTrustScore}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.minTrustScore}
            onChange={(e) =>
              handleTrustScoreChange(
                Math.min(Number(e.target.value), filters.maxTrustScore),
                filters.maxTrustScore,
              )
            }
            className="flex-1 h-2 appearance-none bg-[var(--pixel-gray-700)] rounded cursor-pointer"
            disabled={disabled}
            data-testid="trust-score-min-slider"
          />
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.maxTrustScore}
            onChange={(e) =>
              handleTrustScoreChange(
                filters.minTrustScore,
                Math.max(Number(e.target.value), filters.minTrustScore),
              )
            }
            className="flex-1 h-2 appearance-none bg-[var(--pixel-gray-700)] rounded cursor-pointer"
            disabled={disabled}
            data-testid="trust-score-max-slider"
          />
        </div>
        <div className="flex justify-between text-[0.5rem] text-[var(--pixel-gray-500)]">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Version Filters Section */}
      <div className="space-y-3 pt-4 border-t border-[var(--pixel-gray-700)]">
        <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider">
          Version Filters
        </span>

        {/* ERC-8004 Version */}
        <div className="space-y-1.5">
          <label
            htmlFor="erc8004-version"
            className="text-[0.5rem] text-[var(--pixel-gray-500)] uppercase"
          >
            ERC-8004 Version
          </label>
          <select
            id="erc8004-version"
            value={filters.erc8004Version}
            onChange={(e) => handleErc8004VersionChange(e.target.value as Erc8004Version | '')}
            className="w-full px-2 py-1.5 text-[0.625rem] bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-600)] text-[var(--pixel-gray-200)] focus:border-[var(--pixel-blue-sky)] focus:outline-none"
            disabled={disabled}
            data-testid="erc8004-version-select"
          >
            {ERC8004_VERSION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* MCP Version */}
        <div className="space-y-1.5">
          <label
            htmlFor="mcp-version"
            className="text-[0.5rem] text-[var(--pixel-gray-500)] uppercase"
          >
            MCP Version
          </label>
          <input
            id="mcp-version"
            type="text"
            value={filters.mcpVersion}
            onChange={(e) => handleMcpVersionChange(e.target.value)}
            placeholder="e.g., 1.0.0"
            className="w-full px-2 py-1.5 text-[0.625rem] bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-600)] text-[var(--pixel-gray-200)] placeholder:text-[var(--pixel-gray-600)] focus:border-[var(--pixel-blue-sky)] focus:outline-none"
            disabled={disabled}
            data-testid="mcp-version-input"
          />
        </div>

        {/* A2A Version */}
        <div className="space-y-1.5">
          <label
            htmlFor="a2a-version"
            className="text-[0.5rem] text-[var(--pixel-gray-500)] uppercase"
          >
            A2A Version
          </label>
          <input
            id="a2a-version"
            type="text"
            value={filters.a2aVersion}
            onChange={(e) => handleA2aVersionChange(e.target.value)}
            placeholder="e.g., 1.0.0"
            className="w-full px-2 py-1.5 text-[0.625rem] bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-600)] text-[var(--pixel-gray-200)] placeholder:text-[var(--pixel-gray-600)] focus:border-[var(--pixel-blue-sky)] focus:outline-none"
            disabled={disabled}
            data-testid="a2a-version-input"
          />
        </div>
      </div>

      {/* Curation Filters Section */}
      <div className="space-y-3 pt-4 border-t border-[var(--pixel-gray-700)]">
        <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider">
          Curation
        </span>

        <Switch
          checked={filters.isCurated}
          onChange={handleIsCuratedChange}
          label="Curated Only"
          description="Show only agents with STAR feedback from curators"
          size="sm"
          disabled={disabled}
          testId="is-curated-toggle"
        />

        {/* Curator Address */}
        <div className="space-y-1.5">
          <label
            htmlFor="curated-by"
            className="text-[0.5rem] text-[var(--pixel-gray-500)] uppercase"
          >
            Curated By (Wallet)
          </label>
          <input
            id="curated-by"
            type="text"
            value={filters.curatedBy}
            onChange={(e) => handleCuratedByChange(e.target.value)}
            placeholder="0x..."
            className="w-full px-2 py-1.5 text-[0.625rem] bg-[var(--pixel-gray-800)] border border-[var(--pixel-gray-600)] text-[var(--pixel-gray-200)] placeholder:text-[var(--pixel-gray-600)] focus:border-[var(--pixel-blue-sky)] focus:outline-none font-mono"
            disabled={disabled}
            data-testid="curated-by-input"
          />
        </div>
      </div>

      {/* Endpoint & Reachability Filters Section */}
      <div className="space-y-3 pt-4 border-t border-[var(--pixel-gray-700)]">
        <span className="text-[var(--pixel-gray-400)] font-[family-name:var(--font-pixel-body)] text-[0.625rem] uppercase tracking-wider">
          Endpoints & Reachability
        </span>

        <Switch
          checked={filters.hasEmail}
          onChange={handleHasEmailChange}
          label="Has Email"
          description="Agent has an email contact endpoint"
          size="sm"
          disabled={disabled}
          testId="has-email-toggle"
        />

        <Switch
          checked={filters.hasOasfEndpoint}
          onChange={handleHasOasfEndpointChange}
          label="Has OASF Endpoint"
          description="Agent has an OASF API endpoint"
          size="sm"
          disabled={disabled}
          testId="has-oasf-endpoint-toggle"
        />

        <Switch
          checked={filters.hasRecentReachability}
          onChange={handleHasRecentReachabilityChange}
          label="Recently Verified"
          description="Agent has a recent reachability check"
          size="sm"
          disabled={disabled}
          testId="has-recent-reachability-toggle"
        />
      </div>

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
