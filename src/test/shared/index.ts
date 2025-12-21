/**
 * Shared test utilities for filter testing
 * Used by both Vitest integration tests and Playwright E2E tests
 */

export * from './test-matrix';
export * from './pairwise-generator';
export * from './filter-validators';

// Re-export commonly used generators
import { generateEdgeCaseTests, generateSingleFilterTests, generateSortingTests } from './test-matrix';
import { generatePairwiseSubset, generatePairwiseTestCases } from './pairwise-generator';

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
  return cases.singleFilter.length + cases.pairwise.length + cases.edgeCases.length + cases.sorting.length;
}
