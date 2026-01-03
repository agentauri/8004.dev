/**
 * API route for evaluations
 * GET /api/evaluations - List evaluations with optional filters
 * POST /api/evaluations - Create new evaluation request
 */

import { BackendError, backendFetch } from '@/lib/api/backend';
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

/** Valid evaluation status values */
const VALID_STATUSES: BackendEvaluationStatus[] = ['pending', 'running', 'completed', 'failed'];

/**
 * GET /api/evaluations
 * List evaluations with optional filters
 *
 * Query params:
 * - status: Filter by evaluation status (pending, running, completed, failed)
 * - limit: Number of results (1-100, default: 20)
 * - cursor: Pagination cursor
 */
export async function GET(request: Request) {
  try {
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

    // Fetch evaluations from backend
    const response = await backendFetch<BackendEvaluationsResponse['data']>('/api/v1/evaluations', {
      params: backendParams,
      next: { revalidate: 30 },
    });

    // Map to frontend format
    const evaluations = mapEvaluations(response.data);

    return successResponse(evaluations, {
      meta: response.meta,
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
    });
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch evaluations', 'FETCH_EVALUATIONS_ERROR');
  }
}

/** Request body for creating an evaluation */
interface CreateEvaluationRequest {
  agentId: string;
  benchmarks?: string[];
}

/**
 * POST /api/evaluations
 * Create a new evaluation request
 *
 * Body:
 * - agentId: Agent ID to evaluate (required, format: chainId:tokenId)
 * - benchmarks: Optional array of specific benchmark names to run
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = (await request.json()) as CreateEvaluationRequest;

    // Validate agentId
    if (!body.agentId) {
      return errorResponse('agentId is required', 'MISSING_AGENT_ID', 400);
    }

    const agentIdValidation = validateAgentId(body.agentId);
    if (!agentIdValidation.valid) {
      return errorResponse(agentIdValidation.error, agentIdValidation.code, 400);
    }

    // Validate benchmarks if provided
    if (body.benchmarks !== undefined) {
      if (!Array.isArray(body.benchmarks)) {
        return errorResponse('benchmarks must be an array', 'INVALID_BENCHMARKS', 400);
      }
      if (body.benchmarks.some((b) => typeof b !== 'string' || b.trim() === '')) {
        return errorResponse('benchmarks must be non-empty strings', 'INVALID_BENCHMARKS', 400);
      }
    }

    // Build request payload
    const payload: { agentId: string; benchmarks?: string[] } = {
      agentId: body.agentId,
    };

    if (body.benchmarks && body.benchmarks.length > 0) {
      payload.benchmarks = body.benchmarks;
    }

    // Create evaluation via backend
    const response = await backendFetch<BackendEvaluation>('/api/v1/evaluations', {
      method: 'POST',
      body: payload,
      cache: 'no-store',
    });

    // Map to frontend format using the single mapEvaluation function
    const { mapEvaluation } = await import('@/lib/api/mappers');
    const evaluation = mapEvaluation(response.data);

    return successResponse(evaluation, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    // Handle specific error cases
    if (error instanceof BackendError) {
      if (error.code === 'NOT_FOUND') {
        return errorResponse('Agent not found', 'AGENT_NOT_FOUND', 404);
      }
      if (error.code === 'EVALUATION_IN_PROGRESS') {
        return errorResponse(
          'An evaluation is already in progress for this agent',
          'EVALUATION_IN_PROGRESS',
          409,
        );
      }
    }
    return handleRouteError(error, 'Failed to create evaluation', 'CREATE_EVALUATION_ERROR');
  }
}
