/**
 * API route for matching agents to intent template
 * POST /api/intents/:id/match - Match agents to template roles
 */

import { BackendError, backendFetch } from '@/lib/api/backend';
import { mapIntentTemplate } from '@/lib/api/mappers';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { BackendIntentTemplate } from '@/types/backend';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/intents/:id/match
 * Match agents to the required roles in the intent template
 *
 * Returns the intent template with matchedAgents populated
 */
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return errorResponse('Intent template ID is required', 'MISSING_ID', 400);
    }

    // Call backend to match agents
    const response = await backendFetch<BackendIntentTemplate>(`/api/v1/intents/${id}/match`, {
      method: 'POST',
      cache: 'no-store',
    });

    // Map to frontend format
    const template = mapIntentTemplate(response.data);

    return successResponse(template, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    // Handle not found
    if (error instanceof BackendError && error.code === 'NOT_FOUND') {
      return errorResponse('Intent template not found', 'INTENT_NOT_FOUND', 404);
    }
    // Handle no agents found for matching
    if (error instanceof BackendError && error.code === 'NO_MATCHING_AGENTS') {
      return errorResponse(
        'No agents found matching the required roles',
        'NO_MATCHING_AGENTS',
        404,
      );
    }
    return handleRouteError(error, 'Failed to match agents to intent', 'MATCH_INTENT_ERROR');
  }
}
