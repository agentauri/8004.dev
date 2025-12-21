/**
 * Pairwise test case generator
 * Generates test cases that cover all pairs of parameter values at least once
 * Based on the IPO (In-Parameter-Order) algorithm
 */

import type { ChainId } from '@/components/atoms';
import type { CapabilityType } from '@/components/molecules/capability-tag';
import type { FilterMode } from '@/components/molecules/filter-mode-toggle';
import type { SearchSortField, SearchSortOrder } from '@/types/search';
import {
  CHAIN_SUBSETS,
  createDefaultFilters,
  type FilterTestCase,
  PROTOCOL_SUBSETS,
  STATUS_OPTIONS,
  type TestFiltersState,
} from './test-matrix';

/**
 * Parameter space for pairwise generation
 */
interface ParameterSpace {
  query: string[];
  protocols: CapabilityType[][];
  chains: number[][];
  status: string[][];
  filterMode: FilterMode[];
  reputation: Array<{ min: number; max: number }>;
  showAllAgents: boolean[];
  sortBy: SearchSortField[];
  sortOrder: SearchSortOrder[];
}

/**
 * Default parameter space for filter testing
 */
const DEFAULT_PARAMETER_SPACE: ParameterSpace = {
  query: ['', 'trading', 'agent'],
  protocols: PROTOCOL_SUBSETS.slice(0, 5), // Limit to reduce combinations: [], [mcp], [a2a], [x402], [mcp, a2a]
  chains: CHAIN_SUBSETS.slice(0, 5), // Limit: [], [sep], [base], [poly], [sep, base]
  status: STATUS_OPTIONS,
  filterMode: ['AND', 'OR'],
  reputation: [
    { min: 0, max: 100 },
    { min: 50, max: 100 },
    { min: 0, max: 50 },
    { min: 25, max: 75 },
  ],
  showAllAgents: [false, true],
  sortBy: ['relevance', 'name', 'reputation', 'createdAt'],
  sortOrder: ['asc', 'desc'],
};

/**
 * Generate a unique key for a pair of parameter values
 */
function pairKey(param1: string, val1: unknown, param2: string, val2: unknown): string {
  return `${param1}:${JSON.stringify(val1)}|${param2}:${JSON.stringify(val2)}`;
}

/**
 * Count how many uncovered pairs a test case covers
 */
function countCoveredPairs(
  testCase: Record<string, unknown>,
  paramNames: string[],
  uncoveredPairs: Set<string>,
): number {
  let count = 0;
  for (let i = 0; i < paramNames.length; i++) {
    for (let j = i + 1; j < paramNames.length; j++) {
      const key = pairKey(
        paramNames[i],
        testCase[paramNames[i]],
        paramNames[j],
        testCase[paramNames[j]],
      );
      if (uncoveredPairs.has(key)) count++;
    }
  }
  return count;
}

/**
 * Remove covered pairs from the uncovered set
 */
function removeCoveredPairs(
  testCase: Record<string, unknown>,
  paramNames: string[],
  uncoveredPairs: Set<string>,
): void {
  for (let i = 0; i < paramNames.length; i++) {
    for (let j = i + 1; j < paramNames.length; j++) {
      const key = pairKey(
        paramNames[i],
        testCase[paramNames[i]],
        paramNames[j],
        testCase[paramNames[j]],
      );
      uncoveredPairs.delete(key);
    }
  }
}

/**
 * Seeded random number generator for reproducible tests
 */
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

/**
 * Generate pairwise test cases using greedy algorithm
 */
export function generatePairwiseTestCases(
  paramSpace: ParameterSpace = DEFAULT_PARAMETER_SPACE,
  seed = 12345,
): FilterTestCase[] {
  const random = seededRandom(seed);
  const paramNames = Object.keys(paramSpace) as (keyof ParameterSpace)[];
  const result: FilterTestCase[] = [];

  // Track all pairs that need coverage
  const uncoveredPairs = new Set<string>();

  // Generate all pairs that need to be covered
  for (let i = 0; i < paramNames.length; i++) {
    for (let j = i + 1; j < paramNames.length; j++) {
      const param1 = paramNames[i];
      const param2 = paramNames[j];
      for (const val1 of paramSpace[param1]) {
        for (const val2 of paramSpace[param2]) {
          uncoveredPairs.add(pairKey(param1, val1, param2, val2));
        }
      }
    }
  }

  const initialPairCount = uncoveredPairs.size;
  let testIndex = 0;

  // Greedy algorithm: generate test cases that cover the most uncovered pairs
  while (uncoveredPairs.size > 0 && testIndex < 200) {
    // Safety limit
    let bestCase: Record<string, unknown> | null = null;
    let bestCoverage = 0;

    // Try random combinations to find one with good coverage
    for (let attempt = 0; attempt < 100; attempt++) {
      const candidate: Record<string, unknown> = {};
      for (const param of paramNames) {
        const values = paramSpace[param];
        candidate[param] = values[Math.floor(random() * values.length)];
      }

      const coverage = countCoveredPairs(candidate, paramNames as string[], uncoveredPairs);
      if (coverage > bestCoverage) {
        bestCase = candidate;
        bestCoverage = coverage;
      }
    }

    if (bestCase && bestCoverage > 0) {
      result.push(convertToTestCase(bestCase, testIndex));
      removeCoveredPairs(bestCase, paramNames as string[], uncoveredPairs);
      testIndex++;
    } else {
      break;
    }
  }

  // Log coverage stats
  const coveredPairs = initialPairCount - uncoveredPairs.size;
  console.log(
    `Pairwise: Generated ${result.length} test cases covering ${coveredPairs}/${initialPairCount} pairs (${((coveredPairs / initialPairCount) * 100).toFixed(1)}%)`,
  );

  return result;
}

/**
 * Convert raw parameter values to a FilterTestCase
 */
function convertToTestCase(params: Record<string, unknown>, index: number): FilterTestCase {
  const query = params.query as string;
  const protocols = params.protocols as CapabilityType[];
  const chains = params.chains as ChainId[];
  const status = params.status as string[];
  const filterMode = params.filterMode as FilterMode;
  const reputation = params.reputation as { min: number; max: number };
  const showAllAgents = params.showAllAgents as boolean;
  const sortBy = params.sortBy as SearchSortField;
  const sortOrder = params.sortOrder as SearchSortOrder;

  const filters: TestFiltersState = {
    ...createDefaultFilters(),
    status,
    protocols,
    chains,
    filterMode,
    minReputation: reputation.min,
    maxReputation: reputation.max,
    showAllAgents,
    skills: [],
    domains: [],
  };

  // Generate descriptive name
  const parts: string[] = [];
  if (query) parts.push(`q="${query}"`);
  if (protocols.length > 0) parts.push(`protocols=[${protocols.join(',')}]`);
  if (chains.length > 0) parts.push(`chains=[${chains.length}]`);
  if (status.length > 0) parts.push(`status=[${status.join(',')}]`);
  if (filterMode === 'OR') parts.push('OR mode');
  if (reputation.min > 0 || reputation.max < 100)
    parts.push(`rep=${reputation.min}-${reputation.max}`);
  if (showAllAgents) parts.push('showAll');
  if (sortBy !== 'relevance' || sortOrder !== 'desc') parts.push(`sort=${sortBy}:${sortOrder}`);

  const name = parts.length > 0 ? parts.join(', ') : 'default filters';

  return {
    id: `pairwise-${index.toString().padStart(3, '0')}`,
    name: `Pairwise ${index + 1}: ${name}`,
    query,
    filters,
    sortBy,
    sortOrder,
    expectedEndpoint: query.trim() ? 'POST' : 'GET',
    category: 'combination',
  };
}

/**
 * Generate a subset of pairwise tests for faster E2E runs
 */
export function generatePairwiseSubset(count: number, seed = 12345): FilterTestCase[] {
  const allCases = generatePairwiseTestCases(DEFAULT_PARAMETER_SPACE, seed);
  // Take evenly distributed subset
  const step = Math.max(1, Math.floor(allCases.length / count));
  const subset: FilterTestCase[] = [];
  for (let i = 0; i < allCases.length && subset.length < count; i += step) {
    subset.push(allCases[i]);
  }
  return subset;
}
