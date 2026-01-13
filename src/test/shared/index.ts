/**
 * Shared test utilities for filter testing
 * Used by both Vitest integration tests and Playwright E2E tests
 */

import type { SearchFiltersState } from '@/components/organisms/search-filters';

export * from './filter-validators';
export * from './pairwise-generator';
export * from './test-matrix';

import { generatePairwiseSubset, generatePairwiseTestCases } from './pairwise-generator';
// Re-export commonly used generators
import {
  generateEdgeCaseTests,
  generateSingleFilterTests,
  generateSortingTests,
} from './test-matrix';

/**
 * Creates a complete SearchFiltersState with defaults, allowing partial overrides.
 * Use this in tests to ensure all required filter properties are present.
 *
 * @param overrides - Partial filter state to merge with defaults
 * @returns Complete SearchFiltersState
 *
 * @example
 * ```ts
 * const filters = createTestFilters({ protocols: ['mcp'] });
 * // Returns full SearchFiltersState with mcp protocol selected
 * ```
 */
export function createTestFilters(overrides: Partial<SearchFiltersState> = {}): SearchFiltersState {
  return {
    status: [],
    protocols: [],
    chains: [],
    filterMode: 'AND',
    minReputation: 0,
    maxReputation: 100,
    skills: [],
    domains: [],
    showAllAgents: false,
    // Gap 1: Trust Score Filters
    minTrustScore: 0,
    maxTrustScore: 100,
    // Gap 3: Curation Filters
    isCurated: false,
    curatedBy: '',
    // Gap 5: Endpoint Filters
    hasEmail: false,
    hasOasfEndpoint: false,
    // Gap 6: Reachability Filters
    hasRecentReachability: false,
    ...overrides,
  };
}

/**
 * Pre-generated test cases for both frameworks
 * Using lazy initialization to avoid console output during imports
 */
let _allTestCases: {
  singleFilter: ReturnType<typeof generateSingleFilterTests>;
  pairwise: ReturnType<typeof generatePairwiseTestCases>;
  edgeCases: ReturnType<typeof generateEdgeCaseTests>;
  sorting: ReturnType<typeof generateSortingTests>;
} | null = null;

export function getAllTestCases() {
  if (!_allTestCases) {
    _allTestCases = {
      singleFilter: generateSingleFilterTests(),
      pairwise: generatePairwiseTestCases(),
      edgeCases: generateEdgeCaseTests(),
      sorting: generateSortingTests(),
    };
  }
  return _allTestCases;
}

/**
 * Get a subset of pairwise tests for faster E2E runs
 */
export function getPairwiseSubset(count = 50): ReturnType<typeof generatePairwiseTestCases> {
  return generatePairwiseSubset(count);
}

/**
 * Get total test count for reporting
 */
export function getTotalTestCount(): number {
  const cases = getAllTestCases();
  return (
    cases.singleFilter.length +
    cases.pairwise.length +
    cases.edgeCases.length +
    cases.sorting.length
  );
}
