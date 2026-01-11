/**
 * API route for getting global feedbacks across all agents
 * GET /api/feedbacks?scoreCategory=positive&chains=11155111&limit=20&cursor=abc
 */

import { backendFetch } from '@/lib/api/backend';
import { mapGlobalFeedbacks } from '@/lib/api/mappers';
import { handleRouteError, parseIntParam, successResponse } from '@/lib/api/route-helpers';
import type { BackendGlobalFeedbacksResponse } from '@/types/backend';
import type { FeedbackScoreCategory, FeedbackStats } from '@/types/feedback';

const VALID_CATEGORIES = ['positive', 'neutral', 'negative'] as const;

function isValidCategory(value: string): value is FeedbackScoreCategory {
  return VALID_CATEGORIES.includes(value as FeedbackScoreCategory);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse limit and validate
    const limitParam = parseIntParam(searchParams.get('limit'));
    const limit = Math.min(Math.max(limitParam ?? 20, 1), 100);

    // Parse optional cursor for pagination
    const cursor = searchParams.get('cursor') ?? undefined;

    // Parse score category filter
    const categoryParam = searchParams.get('scoreCategory');
    const scoreCategory =
      categoryParam && isValidCategory(categoryParam) ? categoryParam : undefined;

    // Parse chain filters (comma-separated)
    const chainsParam = searchParams.get('chains');
    const chains = chainsParam
      ? chainsParam
          .split(',')
          .map((c) => Number.parseInt(c.trim(), 10))
          .filter((c) => !Number.isNaN(c))
      : undefined;

    // Parse date filters
    const startDate = searchParams.get('startDate') ?? undefined;
    const endDate = searchParams.get('endDate') ?? undefined;

    // Parse agent search
    const agentSearch = searchParams.get('agentSearch') ?? undefined;

    // Build query params for backend
    const params: Record<string, string> = {
      limit: String(limit),
    };

    if (cursor) {
      params.cursor = cursor;
    }
    if (scoreCategory) {
      params.scoreCategory = scoreCategory;
    }
    if (chains && chains.length > 0) {
      params.chains = chains.join(',');
    }
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    if (agentSearch) {
      params.agentSearch = agentSearch;
    }

    const response = await backendFetch<BackendGlobalFeedbacksResponse>('/api/v1/feedbacks', {
      params,
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    const feedbacks = response.data?.data ?? [];
    const meta = response.data?.meta;
    const stats: FeedbackStats = response.data?.stats ?? {
      total: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    const mappedFeedbacks = mapGlobalFeedbacks(feedbacks);

    return successResponse(
      {
        feedbacks: mappedFeedbacks,
        total: meta?.total ?? feedbacks.length,
        hasMore: meta?.hasMore ?? false,
        nextCursor: meta?.nextCursor,
        stats,
      },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        },
      },
    );
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch feedbacks', 'FEEDBACKS_ERROR');
  }
}
