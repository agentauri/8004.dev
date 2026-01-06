import type { MetadataRoute } from 'next';

import { fetchAllAgentsForSitemap, getAgentLastModified } from '@/lib/api/sitemap-helpers';

const BASE_URL = 'https://www.8004.dev';

/**
 * Generate dynamic sitemap for SEO
 * Includes both static pages and dynamic agent pages
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with fixed last modified dates
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/taxonomy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/trending`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/compose`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Fetch all agents for dynamic pages
  const agents = await fetchAllAgentsForSitemap();

  // Generate agent page entries
  const agentPages: MetadataRoute.Sitemap = agents.map((agent) => ({
    url: `${BASE_URL}/agent/${agent.id}`,
    lastModified: getAgentLastModified(agent),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...agentPages];
}
