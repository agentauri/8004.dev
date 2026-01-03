/**
 * API route for intent templates
 * GET /api/intents - List intent templates with optional filters
 */

import { backendFetch } from '@/lib/api/backend';
import { mapIntentTemplates } from '@/lib/api/mappers';
import { handleRouteError, successResponse } from '@/lib/api/route-helpers';
import { validateLimit } from '@/lib/api/validation';
import type { BackendIntentTemplate } from '@/types/backend';

interface BackendIntentsResponse {
  data: BackendIntentTemplate[];
  meta: {
    total: number;
    limit: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

/**
 * GET /api/intents
 * List intent templates with optional filters
 *
 * Query params:
 * - category: Filter by template category
 * - limit: Number of results (1-100, default: 20)
 * - cursor: Pagination cursor
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Build backend query params
    const backendParams: Record<string, string | number | undefined> = {};

    // Category filter
    const category = searchParams.get('category');
    if (category) {
      backendParams.category = category;
    }

    // Pagination
    const limit = validateLimit(searchParams.get('limit'), 100, 20);
    backendParams.limit = limit;

    const cursor = searchParams.get('cursor');
    if (cursor) backendParams.cursor = cursor;

    // Fetch intent templates from backend
    const response = await backendFetch<BackendIntentsResponse['data']>('/api/v1/intents', {
      params: backendParams,
      next: { revalidate: 60 },
    });

    // Map to frontend format
    const templates = mapIntentTemplates(response.data);

    return successResponse(templates, {
      meta: response.meta,
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    });
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch intent templates', 'FETCH_INTENTS_ERROR');
  }
}
