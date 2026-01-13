/**
 * Serialize state to URL search params
 */

import { DEFAULT_PAGE_SIZE } from '@/components/atoms';
import type { UrlSearchState } from './parse-url-params';

export function serializeToUrl(state: UrlSearchState): URLSearchParams {
  const params = new URLSearchParams();

  // Query
  if (state.query.trim()) {
    params.set('q', state.query.trim());
  }

  // Page parameter removed - cursor-based pagination is managed in React state
  // Do not serialize page to URL

  // Page size (only if not default)
  if (state.pageSize !== DEFAULT_PAGE_SIZE) {
    params.set('limit', String(state.pageSize));
  }

  // Status filter
  if (state.filters.status.length === 1) {
    params.set('active', state.filters.status[0] === 'active' ? 'true' : 'false');
  }

  // Protocol filters
  if (state.filters.protocols.includes('mcp')) {
    params.set('mcp', 'true');
  }
  if (state.filters.protocols.includes('a2a')) {
    params.set('a2a', 'true');
  }
  if (state.filters.protocols.includes('x402')) {
    params.set('x402', 'true');
  }

  // Chain filters (comma-separated)
  if (state.filters.chains.length > 0) {
    params.set('chains', state.filters.chains.join(','));
  }

  // Reputation range (only if not default)
  if (state.filters.minReputation > 0) {
    params.set('minRep', String(state.filters.minReputation));
  }
  if (state.filters.maxReputation < 100) {
    params.set('maxRep', String(state.filters.maxReputation));
  }

  // Filter mode (only if OR, since AND is default)
  if (state.filters.filterMode === 'OR') {
    params.set('filterMode', 'OR');
  }

  // Skills (comma-separated slugs)
  if (state.filters.skills.length > 0) {
    params.set('skills', state.filters.skills.join(','));
  }

  // Domains (comma-separated slugs)
  if (state.filters.domains.length > 0) {
    params.set('domains', state.filters.domains.join(','));
  }

  // Show all agents toggle (only if true)
  if (state.filters.showAllAgents) {
    params.set('showAll', 'true');
  }

  // Sorting (only if not default)
  if (state.sortBy !== 'relevance') {
    params.set('sort', state.sortBy);
  }
  if (state.sortOrder !== 'desc') {
    params.set('order', state.sortOrder);
  }

  // Gap 1: Trust Score Range (only if not default)
  if (state.filters.minTrustScore > 0) {
    params.set('minTrust', String(state.filters.minTrustScore));
  }
  if (state.filters.maxTrustScore < 100) {
    params.set('maxTrust', String(state.filters.maxTrustScore));
  }

  // Gap 1: Version filters removed from UI

  // Gap 3: Curation filters (only if set)
  if (state.filters.isCurated) {
    params.set('isCurated', 'true');
  }
  if (state.filters.curatedBy) {
    params.set('curatedBy', state.filters.curatedBy);
  }

  // Gap 5: Endpoint filters (only if true)
  if (state.filters.hasEmail) {
    params.set('hasEmail', 'true');
  }
  if (state.filters.hasOasfEndpoint) {
    params.set('hasOasfEndpoint', 'true');
  }

  // Gap 6: Reachability filters (only if true)
  if (state.filters.hasRecentReachability) {
    params.set('hasRecentReachability', 'true');
  }

  return params;
}
