/**
 * API route for getting evaluation details
 * GET /api/evaluations/:id
 */

import { BackendError, backendFetch } from '@/lib/api/backend';
import { mapEvaluation } from '@/lib/api/mappers';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { BackendEvaluation } from '@/types/backend';

/** Evaluation ID pattern: UUID or alphanumeric string */
const EVALUATION_ID_PATTERN = /^[a-zA-Z0-9-]+$/;

/** Maximum evaluation ID length to prevent DoS */
const MAX_ID_LENGTH = 100;

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Validate evaluation ID format
 *
 * @param id - Evaluation ID to validate
 * @returns Validation result with error details if invalid
 */
function validateEvaluationId(id: string | undefined): {
  valid: boolean;
  error?: string;
  code?: string;
} {
  if (!id || typeof id !== 'string') {
    return {
      valid: false,
      error: 'Evaluation ID is required',
      code: 'MISSING_EVALUATION_ID',
    };
  }

  if (id.length > MAX_ID_LENGTH) {
    return {
      valid: false,
      error: `Evaluation ID too long. Maximum length: ${MAX_ID_LENGTH}`,
      code: 'EVALUATION_ID_TOO_LONG',
    };
  }

  if (!EVALUATION_ID_PATTERN.test(id)) {
    return {
      valid: false,
      error: 'Invalid evaluation ID format',
      code: 'INVALID_EVALUATION_ID',
    };
  }

  return { valid: true };
}

/**
 * GET /api/evaluations/:id
 * Get evaluation details by ID
 *
 * Returns:
 * - Evaluation with benchmark results and aggregated scores
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate evaluation ID format
    const validation = validateEvaluationId(id);
    if (!validation.valid) {
      return errorResponse(validation.error!, validation.code!, 400);
    }

    // Fetch evaluation from backend
    const response = await backendFetch<BackendEvaluation>(`/api/v1/evaluations/${id}`, {
      next: { revalidate: 30 },
    });

    // Map to frontend format
    const evaluation = mapEvaluation(response.data);

    return successResponse(evaluation, {
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
    });
  } catch (error) {
    // Handle not found
    if (error instanceof BackendError && error.code === 'NOT_FOUND') {
      return errorResponse('Evaluation not found', 'EVALUATION_NOT_FOUND', 404);
    }
    return handleRouteError(error, 'Failed to fetch evaluation', 'FETCH_EVALUATION_ERROR');
  }
}
