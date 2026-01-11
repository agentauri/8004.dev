/**
 * SearchFilters configuration constants
 */

import type React from 'react';
import type { ChainId } from '@/components/atoms';
import type { CapabilityType } from '@/components/molecules';
import { CHAINS } from '@/lib/constants/chains';
import type { Erc8004Version } from '@/types/search';

export const SUPPORTED_CHAINS: ChainId[] = [11155111, 84532, 80002];

export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const;

export const PROTOCOLS: CapabilityType[] = ['mcp', 'a2a', 'x402'];

/**
 * ERC-8004 version options for dropdown
 */
export const ERC8004_VERSION_OPTIONS: Array<{ value: Erc8004Version | ''; label: string }> = [
  { value: '', label: 'Any Version' },
  { value: 'v0.4', label: 'v0.4' },
  { value: 'v1.0', label: 'v1.0' },
];

// Pre-computed chain styles to avoid creating new objects on each render
export const CHAIN_SELECTED_STYLES: Record<ChainId, React.CSSProperties> = SUPPORTED_CHAINS.reduce(
  (acc, chainId) => {
    const chain = CHAINS[chainId];
    acc[chainId] = { backgroundColor: chain.color, borderColor: chain.color, color: '#fff' };
    return acc;
  },
  {} as Record<ChainId, React.CSSProperties>,
);

// Default empty filter state
export const EMPTY_FILTERS = {
  status: [],
  protocols: [],
  chains: [],
  filterMode: 'AND' as const,
  minReputation: 0,
  maxReputation: 100,
  skills: [],
  domains: [],
  showAllAgents: false,
  // Gap 1: Trust Score & Version Filters
  minTrustScore: 0,
  maxTrustScore: 100,
  erc8004Version: '' as Erc8004Version | '',
  mcpVersion: '',
  a2aVersion: '',
  // Gap 3: Curation Filters
  isCurated: false,
  curatedBy: '',
  // Gap 5: Endpoint Filters
  hasEmail: false,
  hasOasfEndpoint: false,
  // Gap 6: Reachability Filters
  hasRecentReachability: false,
};
