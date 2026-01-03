/**
 * API route for getting evaluations for a specific agent
 * GET /api/agents/:agentId/evaluations
 */

import { backendFetch } from '@/lib/api/backend';
import { mapEvaluations } from '@/lib/api/mappers';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import { validateAgentId, validateLimit } from '@/lib/api/validation';
import type { BackendEvaluation, BackendEvaluationStatus } from '@/types/backend';

interface BackendEvaluationsResponse {
  data: BackendEvaluation[];
  meta: {
    total: number;
    limit: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

interface RouteParams {
  params: Promise<{ agentId: string }>;
}

/** Valid evaluation status values */
const VALID_STATUSES: BackendEvaluationStatus[] = ['pending', 'running', 'completed', 'failed'];

/**
 * GET /api/agents/:agentId/evaluations
 * Get evaluations for a specific agent
 *
 * Query params:
 * - status: Filter by evaluation status (pending, running, completed, failed)
 * - limit: Number of results (1-100, default: 20)
 * - cursor: Pagination cursor
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { agentId } = await params;

    // Validate agent ID format (chainId:tokenId) with strict validation
    const validation = validateAgentId(agentId);
    if (!validation.valid) {
      return errorResponse(validation.error, validation.code, 400);
    }

    const { searchParams } = new URL(request.url);

    // Build backend query params
    const backendParams: Record<string, string | number | undefined> = {};

    // Status filter validation
    const status = searchParams.get('status');
    if (status) {
      if (!VALID_STATUSES.includes(status as BackendEvaluationStatus)) {
        return errorResponse(
          `Invalid status. Valid values: ${VALID_STATUSES.join(', ')}`,
          'INVALID_STATUS',
          400,
        );
      }
      backendParams.status = status;
    }

    // Pagination
    const limit = validateLimit(searchParams.get('limit'), 100, 20);
    backendParams.limit = limit;

    const cursor = searchParams.get('cursor');
    if (cursor) backendParams.cursor = cursor;

    // Fetch evaluations for this agent from backend
    const response = await backendFetch<BackendEvaluationsResponse['data']>(
      `/api/v1/agents/${agentId}/evaluations`,
      {
        params: backendParams,
        next: { revalidate: 30 },
      },
    );

    // Map to frontend format
    const evaluations = mapEvaluations(response.data);

    return successResponse(evaluations, {
      meta: response.meta,
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
    });
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch agent evaluations', 'FETCH_EVALUATIONS_ERROR');
  }
}
