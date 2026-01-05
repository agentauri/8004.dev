/**
 * API route for getting leaderboard (agents ranked by reputation)
 * GET /api/leaderboard?chains=11155111,84532&period=7d&mcp=true&limit=20&cursor=abc
 *
 * NOTE: Falls back to mock data if backend endpoint is not available.
 * Remove mock fallback once backend implements /api/v1/leaderboard
 */

import { BackendError, backendFetch } from '@/lib/api/backend';
import { mapLeaderboardEntries } from '@/lib/api/mappers';
import {
  handleRouteError,
  parseBoolParam,
  parseIntParam,
  successResponse,
} from '@/lib/api/route-helpers';
import type { BackendLeaderboardEntry, BackendLeaderboardResponse } from '@/types/backend';
import type { LeaderboardPeriod } from '@/types/leaderboard';

const VALID_PERIODS = ['all', '30d', '7d', '24h'] as const;

function isValidPeriod(value: string): value is LeaderboardPeriod {
  return VALID_PERIODS.includes(value as LeaderboardPeriod);
}

/**
 * Generate mock leaderboard data for development/testing
 * TODO: Remove once backend implements /api/v1/leaderboard
 */
function getMockLeaderboardEntries(limit: number): BackendLeaderboardEntry[] {
  const mockEntries: BackendLeaderboardEntry[] = [
    {
      rank: 1,
      agentId: '11155111:42',
      name: 'CodeReview Pro',
      score: 95,
      feedbackCount: 156,
      trend: 'up',
      hasMcp: true,
      hasA2a: true,
      x402Support: false,
      chainId: 11155111,
    },
    {
      rank: 2,
      agentId: '84532:15',
      name: 'Trading Assistant',
      score: 92,
      feedbackCount: 203,
      trend: 'up',
      hasMcp: true,
      hasA2a: false,
      x402Support: true,
      chainId: 84532,
    },
    {
      rank: 3,
      agentId: '11155111:88',
      name: 'Data Analyzer',
      score: 89,
      feedbackCount: 98,
      trend: 'stable',
      hasMcp: false,
      hasA2a: true,
      x402Support: false,
      chainId: 11155111,
    },
    {
      rank: 4,
      agentId: '80002:23',
      name: 'Content Writer',
      score: 87,
      feedbackCount: 145,
      trend: 'up',
      hasMcp: true,
      hasA2a: true,
      x402Support: true,
      chainId: 80002,
    },
    {
      rank: 5,
      agentId: '84532:67',
      name: 'Security Scanner',
      score: 85,
      feedbackCount: 67,
      trend: 'down',
      hasMcp: true,
      hasA2a: false,
      x402Support: false,
      chainId: 84532,
    },
    {
      rank: 6,
      agentId: '11155111:101',
      name: 'Research Assistant',
      score: 82,
      feedbackCount: 89,
      trend: 'up',
      hasMcp: true,
      hasA2a: true,
      x402Support: false,
      chainId: 11155111,
    },
    {
      rank: 7,
      agentId: '80002:55',
      name: 'Translation Bot',
      score: 79,
      feedbackCount: 134,
      trend: 'stable',
      hasMcp: false,
      hasA2a: true,
      x402Support: true,
      chainId: 80002,
    },
    {
      rank: 8,
      agentId: '84532:33',
      name: 'Image Generator',
      score: 76,
      feedbackCount: 212,
      trend: 'down',
      hasMcp: true,
      hasA2a: false,
      x402Support: true,
      chainId: 84532,
    },
    {
      rank: 9,
      agentId: '11155111:77',
      name: 'Code Debugger',
      score: 74,
      feedbackCount: 56,
      trend: 'up',
      hasMcp: true,
      hasA2a: true,
      x402Support: false,
      chainId: 11155111,
    },
    {
      rank: 10,
      agentId: '80002:12',
      name: 'Sentiment Analyzer',
      score: 71,
      feedbackCount: 78,
      trend: 'stable',
      hasMcp: false,
      hasA2a: false,
      x402Support: false,
      chainId: 80002,
    },
  ];
  return mockEntries.slice(0, limit);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate period
    const periodParam = searchParams.get('period') ?? 'all';
    const period = isValidPeriod(periodParam) ? periodParam : 'all';

    // Parse limit and validate
    const limitParam = parseIntParam(searchParams.get('limit'));
    const limit = Math.min(Math.max(limitParam ?? 20, 1), 100);

    // Parse optional cursor for pagination
    const cursor = searchParams.get('cursor') ?? undefined;

    // Parse chain filters (comma-separated)
    const chainsParam = searchParams.get('chains');
    const chains = chainsParam
      ? chainsParam
          .split(',')
          .map((c) => Number.parseInt(c.trim(), 10))
          .filter((c) => !Number.isNaN(c))
      : undefined;

    // Parse protocol filters
    const mcp = parseBoolParam(searchParams.get('mcp'));
    const a2a = parseBoolParam(searchParams.get('a2a'));
    const x402 = parseBoolParam(searchParams.get('x402'));

    // Build query params for backend
    const params: Record<string, string> = {
      period,
      limit: String(limit),
    };

    if (cursor) {
      params.cursor = cursor;
    }
    if (chains && chains.length > 0) {
      params.chains = chains.join(',');
    }
    if (mcp !== undefined) {
      params.mcp = String(mcp);
    }
    if (a2a !== undefined) {
      params.a2a = String(a2a);
    }
    if (x402 !== undefined) {
      params.x402 = String(x402);
    }

    let entries: BackendLeaderboardEntry[] = [];
    let meta: BackendLeaderboardResponse['meta'] | undefined;

    try {
      const response = await backendFetch<BackendLeaderboardResponse>('/api/v1/leaderboard', {
        params,
        next: { revalidate: 60 }, // Cache for 1 minute
      });

      // Backend returns { data: BackendLeaderboardEntry[], meta: {...} }
      entries = response.data?.data ?? [];
      meta = response.data?.meta;
    } catch (error) {
      // Fallback to mock data if backend endpoint not available
      if (error instanceof BackendError && error.status === 404) {
        console.warn('Backend /api/v1/leaderboard not available, using mock data');
        entries = getMockLeaderboardEntries(limit);
      } else {
        throw error;
      }
    }

    const mappedEntries = mapLeaderboardEntries(entries);

    return successResponse(
      {
        entries: mappedEntries,
        total: meta?.total ?? entries.length,
        hasMore: meta?.hasMore ?? false,
        nextCursor: meta?.nextCursor,
        meta: {
          period: meta?.period ?? period,
          generatedAt: meta?.generatedAt ?? new Date().toISOString(),
        },
      },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        },
      },
    );
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch leaderboard', 'LEADERBOARD_ERROR');
  }
}
