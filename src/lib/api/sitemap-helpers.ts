/**
 * Sitemap helpers for fetching all agents
 *
 * These functions are used by the dynamic sitemap generator
 * to fetch all agents across all chains for SEO.
 */

import type { BackendAgent } from '@/types/backend';
import { backendFetch } from './backend';

/**
 * Minimal agent data needed for sitemap generation
 */
export interface SitemapAgent {
  id: string;
  chainId: number;
  tokenId: string;
  lastUpdatedAt?: string;
}

/**
 * Fetch all agents for sitemap generation
 * Uses cursor-based pagination to fetch all agents across all chains
 *
 * @returns Array of minimal agent data for sitemap
 */
export async function fetchAllAgentsForSitemap(): Promise<SitemapAgent[]> {
  const allAgents: SitemapAgent[] = [];
  let cursor: string | undefined;
  const limit = 100; // Max per page

  try {
    do {
      const response = await backendFetch<BackendAgent[]>('/api/v1/agents', {
        params: {
          limit,
          ...(cursor ? { cursor } : {}),
        },
        // Don't cache sitemap fetches - we want fresh data
        cache: 'no-store',
        // 60 second timeout for large fetches
        timeout: 60000,
      });

      const agents = response.data || [];
      const meta = response.meta;

      // Map to minimal sitemap data
      const mappedAgents = agents.map((agent) => ({
        id: agent.id,
        chainId: agent.chainId,
        tokenId: agent.tokenId,
        lastUpdatedAt: agent.lastUpdatedAt,
      }));

      allAgents.push(...mappedAgents);

      // Get next cursor from meta
      cursor = meta?.nextCursor;
    } while (cursor);

    return allAgents;
  } catch (error) {
    console.error('[Sitemap] Failed to fetch agents:', error);
    // Return empty array on error - sitemap will just have static pages
    return [];
  }
}

/**
 * Get the last modified date for an agent
 * Falls back to current date if not available
 */
export function getAgentLastModified(agent: SitemapAgent): Date {
  if (agent.lastUpdatedAt) {
    const date = new Date(agent.lastUpdatedAt);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }
  return new Date();
}
