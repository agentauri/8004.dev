/**
 * API route for individual intent template
 * GET /api/intents/:id - Get intent template details
 */

import { BackendError, backendFetch } from '@/lib/api/backend';
import { mapIntentTemplate } from '@/lib/api/mappers';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { BackendIntentTemplate } from '@/types/backend';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/intents/:id
 * Get a single intent template with full workflow steps
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return errorResponse('Intent template ID is required', 'MISSING_ID', 400);
    }

    // Fetch intent template from backend
    const response = await backendFetch<BackendIntentTemplate>(`/api/v1/intents/${id}`, {
      next: { revalidate: 60 },
    });

    // Map to frontend format
    const template = mapIntentTemplate(response.data);

    return successResponse(template, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    // Handle not found
    if (error instanceof BackendError && error.code === 'NOT_FOUND') {
      return errorResponse('Intent template not found', 'INTENT_NOT_FOUND', 404);
    }
    return handleRouteError(error, 'Failed to fetch intent template', 'FETCH_INTENT_ERROR');
  }
}
