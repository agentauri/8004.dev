/**
 * API route for getting trending agents (highest reputation growth)
 * GET /api/trending?period=7d&limit=5
 *
 * NOTE: Falls back to mock data if backend endpoint is not available.
 * Remove mock fallback once backend implements /api/v1/trending
 */

import { BackendError, backendFetch } from '@/lib/api/backend';
import { mapTrendingAgents } from '@/lib/api/mappers';
import { handleRouteError, parseIntParam, successResponse } from '@/lib/api/route-helpers';
import type { BackendTrendingAgent } from '@/types/backend';

/**
 * Backend trending entry structure (actual BE response)
 */
interface BETrendingEntry {
  agent: {
    id: string;
    name: string;
    image?: string;
    chainId: number;
  };
  currentScore: number;
  previousScore: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Backend trending response structure (actual BE response)
 */
interface BETrendingResponse {
  success: boolean;
  data: BETrendingEntry[];
  meta: {
    period: string;
    dataAvailable: boolean;
    message?: string;
  };
}

/**
 * Transform BE trending entry to FE expected format
 */
function transformBETrendingEntry(entry: BETrendingEntry): BackendTrendingAgent {
  const [, tokenId] = entry.agent.id.split(':');
  return {
    agentId: entry.agent.id,
    chainId: entry.agent.chainId,
    tokenId: tokenId ?? '0',
    name: entry.agent.name,
    image: entry.agent.image,
    currentScore: entry.currentScore,
    previousScore: entry.previousScore,
    scoreChange: entry.change,
    percentageChange: entry.changePercent,
    trend: entry.trend,
    // These fields are not available from BE trending endpoint
    active: null,
    hasMcp: null,
    hasA2a: null,
    x402Support: null,
  };
}

const VALID_PERIODS = ['24h', '7d', '30d'] as const;
type ValidPeriod = (typeof VALID_PERIODS)[number];

function isValidPeriod(value: string): value is ValidPeriod {
  return VALID_PERIODS.includes(value as ValidPeriod);
}

/**
 * Generate mock trending data for development/testing
 * TODO: Remove once backend implements /api/v1/trending
 */
function getMockTrendingAgents(limit: number): BackendTrendingAgent[] {
  const mockAgents: BackendTrendingAgent[] = [
    {
      agentId: '11155111:42',
      chainId: 11155111,
      tokenId: '42',
      name: 'CodeReview Pro',
      currentScore: 92,
      previousScore: 78,
      scoreChange: 14,
      percentageChange: 17.9,
      trend: 'up',
      active: true,
      hasMcp: true,
      hasA2a: true,
      x402Support: false,
    },
    {
      agentId: '84532:15',
      chainId: 84532,
      tokenId: '15',
      name: 'Trading Assistant',
      currentScore: 87,
      previousScore: 72,
      scoreChange: 15,
      percentageChange: 20.8,
      trend: 'up',
      active: true,
      hasMcp: true,
      hasA2a: false,
      x402Support: true,
    },
    {
      agentId: '11155111:88',
      chainId: 11155111,
      tokenId: '88',
      name: 'Data Analyzer',
      currentScore: 85,
      previousScore: 74,
      scoreChange: 11,
      percentageChange: 14.9,
      trend: 'up',
      active: true,
      hasMcp: false,
      hasA2a: true,
      x402Support: false,
    },
    {
      agentId: '80002:23',
      chainId: 80002,
      tokenId: '23',
      name: 'Content Writer',
      currentScore: 81,
      previousScore: 70,
      scoreChange: 11,
      percentageChange: 15.7,
      trend: 'up',
      active: true,
      hasMcp: true,
      hasA2a: true,
      x402Support: true,
    },
    {
      agentId: '84532:67',
      chainId: 84532,
      tokenId: '67',
      name: 'Security Scanner',
      currentScore: 79,
      previousScore: 68,
      scoreChange: 11,
      percentageChange: 16.2,
      trend: 'up',
      active: true,
      hasMcp: true,
      hasA2a: false,
      x402Support: false,
    },
  ];
  return mockAgents.slice(0, limit);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate period
    const periodParam = searchParams.get('period') ?? '7d';
    const period = isValidPeriod(periodParam) ? periodParam : '7d';

    // Parse and validate limit
    const limitParam = parseIntParam(searchParams.get('limit'));
    const limit = Math.min(Math.max(limitParam ?? 5, 1), 10);

    let agents: BackendTrendingAgent[] = [];
    let generatedAt = new Date().toISOString();
    const nextRefreshAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min cache

    try {
      // Fetch from BE - note: BE returns different structure than FE expects
      const response = await backendFetch<BETrendingResponse>('/api/v1/trending', {
        params: { period, limit },
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      // Transform BE response to FE expected format
      if (response.data && Array.isArray(response.data)) {
        agents = response.data.map(transformBETrendingEntry);
      }
      generatedAt = new Date().toISOString();
    } catch (error) {
      // Fallback to mock data if backend endpoint not available or returns error
      if (error instanceof BackendError && (error.status === 404 || error.status === 500)) {
        console.warn('Backend /api/v1/trending not available, using mock data');
        agents = getMockTrendingAgents(limit);
      } else {
        throw error;
      }
    }

    const mappedAgents = mapTrendingAgents(agents);

    return successResponse(
      {
        agents: mappedAgents,
        period,
        generatedAt,
        nextRefreshAt,
      },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch trending agents', 'TRENDING_ERROR');
  }
}
