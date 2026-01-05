/**
 * API route for getting global feedbacks across all agents
 * GET /api/feedbacks?scoreCategory=positive&chains=11155111&limit=20&cursor=abc
 *
 * NOTE: Falls back to mock data if backend endpoint is not available.
 * Remove mock fallback once backend implements /api/v1/feedbacks
 */

import { backendFetch, BackendError } from '@/lib/api/backend';
import { mapGlobalFeedbacks } from '@/lib/api/mappers';
import {
  handleRouteError,
  parseIntParam,
  successResponse,
} from '@/lib/api/route-helpers';
import type { BackendGlobalFeedback, BackendGlobalFeedbacksResponse } from '@/types/backend';
import type { FeedbackScoreCategory, FeedbackStats } from '@/types/feedback';

const VALID_CATEGORIES = ['positive', 'neutral', 'negative'] as const;

function isValidCategory(value: string): value is FeedbackScoreCategory {
  return VALID_CATEGORIES.includes(value as FeedbackScoreCategory);
}

/**
 * Generate mock feedbacks data for development/testing
 * TODO: Remove once backend implements /api/v1/feedbacks
 */
function getMockFeedbacks(limit: number, scoreCategory?: FeedbackScoreCategory): { feedbacks: BackendGlobalFeedback[]; stats: FeedbackStats } {
  const now = new Date();
  const allFeedbacks: BackendGlobalFeedback[] = [
    { id: 'fb_1', score: 92, tags: ['reliable', 'fast'], context: 'Excellent code review, caught several edge cases I missed.', submitter: '0x1234567890abcdef1234567890abcdef12345678', submittedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), txHash: '0xabc123', agentId: '11155111:42', agentName: 'CodeReview Pro', agentChainId: 11155111 },
    { id: 'fb_2', score: 45, tags: ['slow'], context: 'Response was accurate but took longer than expected.', submitter: '0xabcdef1234567890abcdef1234567890abcdef12', submittedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), txHash: '0xdef456', agentId: '84532:15', agentName: 'Trading Assistant', agentChainId: 84532 },
    { id: 'fb_3', score: 88, tags: ['accurate', 'helpful'], context: 'Great data analysis, very detailed insights.', submitter: '0x9876543210fedcba9876543210fedcba98765432', submittedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), txHash: '0x789abc', agentId: '11155111:88', agentName: 'Data Analyzer', agentChainId: 11155111 },
    { id: 'fb_4', score: 25, tags: ['inaccurate'], context: 'Translation had several errors in technical terms.', submitter: '0xfedcba9876543210fedcba9876543210fedcba98', submittedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), txHash: '0xcde789', agentId: '80002:55', agentName: 'Translation Bot', agentChainId: 80002 },
    { id: 'fb_5', score: 78, tags: ['creative'], context: 'Good content generation, needed minor editing.', submitter: '0x1111222233334444555566667777888899990000', submittedAt: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(), txHash: '0xfgh012', agentId: '80002:23', agentName: 'Content Writer', agentChainId: 80002 },
    { id: 'fb_6', score: 95, tags: ['thorough', 'secure'], context: 'Found critical vulnerability that would have been costly.', submitter: '0xaaaabbbbccccddddeeeeffffgggg111122223333', submittedAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(), txHash: '0xijk345', agentId: '84532:67', agentName: 'Security Scanner', agentChainId: 84532 },
    { id: 'fb_7', score: 55, tags: ['average'], context: 'Results were okay but nothing exceptional.', submitter: '0x4444555566667777888899990000aaaabbbbcccc', submittedAt: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(), txHash: '0xlmn678', agentId: '11155111:101', agentName: 'Research Assistant', agentChainId: 11155111 },
    { id: 'fb_8', score: 82, tags: ['efficient'], context: 'Quick debugging, saved me hours of work.', submitter: '0xddddeeeeffffgggg111122223333444455556666', submittedAt: new Date(now.getTime() - 96 * 60 * 60 * 1000).toISOString(), txHash: '0xopq901', agentId: '11155111:77', agentName: 'Code Debugger', agentChainId: 11155111 },
  ];

  // Filter by score category if provided
  let filtered = allFeedbacks;
  if (scoreCategory) {
    filtered = allFeedbacks.filter((f) => {
      if (scoreCategory === 'positive') return f.score >= 70;
      if (scoreCategory === 'neutral') return f.score >= 40 && f.score < 70;
      return f.score < 40;
    });
  }

  // Calculate stats
  const stats: FeedbackStats = {
    total: allFeedbacks.length,
    positive: allFeedbacks.filter((f) => f.score >= 70).length,
    neutral: allFeedbacks.filter((f) => f.score >= 40 && f.score < 70).length,
    negative: allFeedbacks.filter((f) => f.score < 40).length,
  };

  return {
    feedbacks: filtered.slice(0, limit),
    stats,
  };
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
    const scoreCategory = categoryParam && isValidCategory(categoryParam) ? categoryParam : undefined;

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

    let feedbacks: BackendGlobalFeedback[] = [];
    let meta: BackendGlobalFeedbacksResponse['meta'] | undefined;
    let stats: FeedbackStats = { total: 0, positive: 0, neutral: 0, negative: 0 };

    try {
      const response = await backendFetch<BackendGlobalFeedbacksResponse>('/api/v1/feedbacks', {
        params,
        next: { revalidate: 60 }, // Cache for 1 minute
      });

      feedbacks = response.data?.data ?? [];
      meta = response.data?.meta;
      stats = response.data?.stats ?? stats;
    } catch (error) {
      // Fallback to mock data if backend endpoint not available
      if (error instanceof BackendError && error.status === 404) {
        console.warn('Backend /api/v1/feedbacks not available, using mock data');
        const mockData = getMockFeedbacks(limit, scoreCategory);
        feedbacks = mockData.feedbacks;
        stats = mockData.stats;
      } else {
        throw error;
      }
    }

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
