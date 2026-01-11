/**
 * API route for getting leaderboard (agents ranked by reputation)
 * GET /api/leaderboard?chains=11155111,84532&period=7d&mcp=true&limit=20&cursor=abc
 */

import { backendFetch } from '@/lib/api/backend';
import { mapLeaderboardEntries } from '@/lib/api/mappers';
import {
  handleRouteError,
  parseBoolParam,
  parseIntParam,
  successResponse,
} from '@/lib/api/route-helpers';
import type { BackendLeaderboardResponse } from '@/types/backend';
import type { LeaderboardPeriod } from '@/types/leaderboard';

const VALID_PERIODS = ['all', '30d', '7d', '24h'] as const;

function isValidPeriod(value: string): value is LeaderboardPeriod {
  return VALID_PERIODS.includes(value as LeaderboardPeriod);
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

    const response = await backendFetch<BackendLeaderboardResponse>('/api/v1/leaderboard', {
      params,
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    // Backend returns { data: BackendLeaderboardEntry[], meta: {...} }
    const entries = response.data?.data ?? [];
    const meta = response.data?.meta;

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
