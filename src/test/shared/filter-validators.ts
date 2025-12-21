/**
 * Response validation helpers for filter testing
 * Validates that API responses match the applied filters
 */

import type { AgentSummary } from '@/types/agent';
import type { FilterTestCase, TestFiltersState } from './test-matrix';

/**
 * Validation result for a single agent
 */
export interface AgentValidationResult {
  valid: boolean;
  agent: AgentSummary;
  violations: string[];
}

/**
 * Validation result for a full response
 */
export interface ResponseValidationResult {
  valid: boolean;
  totalAgents: number;
  validAgents: number;
  violations: AgentValidationResult[];
}

/**
 * Validate that an agent matches the applied filters
 */
export function validateAgentMatchesFilters(
  agent: AgentSummary,
  filters: TestFiltersState,
  filterMode: 'AND' | 'OR' = 'AND'
): AgentValidationResult {
  const violations: string[] = [];

  // Protocol filters (AND mode: all required, OR mode: any required)
  if (filters.protocols.length > 0) {
    if (filterMode === 'AND') {
      // All protocols must be present
      if (filters.protocols.includes('mcp') && !agent.hasMcp) {
        violations.push(`Expected hasMcp=true for MCP filter`);
      }
      if (filters.protocols.includes('a2a') && !agent.hasA2a) {
        violations.push(`Expected hasA2a=true for A2A filter`);
      }
      if (filters.protocols.includes('x402') && !agent.x402Support) {
        violations.push(`Expected x402Support=true for x402 filter`);
      }
    } else {
      // At least one protocol must be present
      const hasAny =
        (filters.protocols.includes('mcp') && agent.hasMcp) ||
        (filters.protocols.includes('a2a') && agent.hasA2a) ||
        (filters.protocols.includes('x402') && agent.x402Support);
      if (!hasAny) {
        violations.push(`Expected at least one of [${filters.protocols.join(', ')}] in OR mode`);
      }
    }
  }

  // Chain filter
  if (filters.chains.length > 0) {
    if (!filters.chains.includes(agent.chainId)) {
      violations.push(`Expected chainId to be one of [${filters.chains.join(', ')}], got ${agent.chainId}`);
    }
  }

  // Status filter
  if (filters.status.length > 0 && filters.status.length < 2) {
    // Only validate if not "both" selected
    if (filters.status.includes('active') && !filters.status.includes('inactive')) {
      if (!agent.active) {
        violations.push(`Expected active=true for 'active' status filter`);
      }
    }
    if (filters.status.includes('inactive') && !filters.status.includes('active')) {
      if (agent.active) {
        violations.push(`Expected active=false for 'inactive' status filter`);
      }
    }
  }

  // Reputation range
  const reputation = agent.reputationScore ?? 0;
  if (filters.minReputation > 0 && reputation < filters.minReputation) {
    violations.push(`Expected reputation >= ${filters.minReputation}, got ${reputation}`);
  }
  if (filters.maxReputation < 100 && reputation > filters.maxReputation) {
    violations.push(`Expected reputation <= ${filters.maxReputation}, got ${reputation}`);
  }

  return {
    valid: violations.length === 0,
    agent,
    violations,
  };
}

/**
 * Validate that all agents in a response match the applied filters
 */
export function validateResponseMatchesFilters(
  agents: AgentSummary[],
  testCase: FilterTestCase
): ResponseValidationResult {
  const violations: AgentValidationResult[] = [];

  for (const agent of agents) {
    const result = validateAgentMatchesFilters(agent, testCase.filters, testCase.filters.filterMode);
    if (!result.valid) {
      violations.push(result);
    }
  }

  return {
    valid: violations.length === 0,
    totalAgents: agents.length,
    validAgents: agents.length - violations.length,
    violations,
  };
}

/**
 * Assert that the correct API endpoint was used
 */
export function assertCorrectEndpoint(
  fetchCall: { url: string; options?: RequestInit },
  expectedEndpoint: 'GET' | 'POST'
): void {
  const { url, options } = fetchCall;
  const method = options?.method ?? 'GET';

  if (expectedEndpoint === 'POST') {
    if (method !== 'POST' || !url.includes('/api/search')) {
      throw new Error(
        `Expected POST to /api/search, got ${method} to ${url}. ` +
          `Queries with text should use POST /api/search endpoint.`
      );
    }
  } else {
    if (method !== 'GET' || !url.includes('/api/agents')) {
      throw new Error(
        `Expected GET to /api/agents, got ${method} to ${url}. ` +
          `Queries without text should use GET /api/agents endpoint.`
      );
    }
  }
}

/**
 * Validate that sorting is correctly applied
 */
export function validateSorting(agents: AgentSummary[], sortBy: string, sortOrder: 'asc' | 'desc'): boolean {
  if (agents.length < 2) return true;

  const getSortValue = (agent: AgentSummary): string | number => {
    switch (sortBy) {
      case 'name':
        return agent.name.toLowerCase();
      case 'reputation':
        return agent.reputationScore ?? 0;
      case 'createdAt':
        return agent.createdAt ?? '';
      default:
        return agent.relevanceScore ?? 0;
    }
  };

  for (let i = 1; i < agents.length; i++) {
    const prev = getSortValue(agents[i - 1]);
    const curr = getSortValue(agents[i]);

    if (sortOrder === 'asc') {
      if (prev > curr) {
        return false;
      }
    } else {
      if (prev < curr) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Format validation result for error messages
 */
export function formatValidationResult(result: ResponseValidationResult): string {
  if (result.valid) {
    return `All ${result.totalAgents} agents passed validation`;
  }

  const lines = [`Validation failed: ${result.violations.length}/${result.totalAgents} agents have violations`];

  for (const violation of result.violations.slice(0, 5)) {
    // Limit output
    lines.push(`  Agent ${violation.agent.id}:`);
    for (const v of violation.violations) {
      lines.push(`    - ${v}`);
    }
  }

  if (result.violations.length > 5) {
    lines.push(`  ... and ${result.violations.length - 5} more violations`);
  }

  return lines.join('\n');
}
