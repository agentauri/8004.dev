/**
 * API route for getting trending agents (highest reputation growth)
 * GET /api/trending?period=7d&limit=5
 *
 * NOTE: Falls back to mock data if backend endpoint is not available.
 * Remove mock fallback once backend implements /api/v1/trending
 */

import { backendFetch, BackendError } from '@/lib/api/backend';
import { mapTrendingAgents } from '@/lib/api/mappers';
import { handleRouteError, parseIntParam, successResponse } from '@/lib/api/route-helpers';
import type { BackendTrendingResponse, BackendTrendingAgent } from '@/types/backend';

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
      name: 'CodeReview Pro',
      currentScore: 92,
      previousScore: 78,
      scoreChange: 14,
      percentageChange: 17.9,
      trend: 'up',
      hasMcp: true,
      hasA2a: true,
      x402Support: false,
      chainId: 11155111,
    },
    {
      agentId: '84532:15',
      name: 'Trading Assistant',
      currentScore: 87,
      previousScore: 72,
      scoreChange: 15,
      percentageChange: 20.8,
      trend: 'up',
      hasMcp: true,
      hasA2a: false,
      x402Support: true,
      chainId: 84532,
    },
    {
      agentId: '11155111:88',
      name: 'Data Analyzer',
      currentScore: 85,
      previousScore: 74,
      scoreChange: 11,
      percentageChange: 14.9,
      trend: 'up',
      hasMcp: false,
      hasA2a: true,
      x402Support: false,
      chainId: 11155111,
    },
    {
      agentId: '80002:23',
      name: 'Content Writer',
      currentScore: 81,
      previousScore: 70,
      scoreChange: 11,
      percentageChange: 15.7,
      trend: 'up',
      hasMcp: true,
      hasA2a: true,
      x402Support: true,
      chainId: 80002,
    },
    {
      agentId: '84532:67',
      name: 'Security Scanner',
      currentScore: 79,
      previousScore: 68,
      scoreChange: 11,
      percentageChange: 16.2,
      trend: 'up',
      hasMcp: true,
      hasA2a: false,
      x402Support: false,
      chainId: 84532,
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
    let nextRefreshAt: string | undefined;

    try {
      const response = await backendFetch<BackendTrendingResponse['data']>('/api/v1/trending', {
        params: { period, limit },
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      agents = response.data?.agents ?? [];
      generatedAt = response.data?.generatedAt ?? generatedAt;
      nextRefreshAt = response.data?.nextRefreshAt;
    } catch (error) {
      // Fallback to mock data if backend endpoint not available
      if (error instanceof BackendError && error.status === 404) {
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
