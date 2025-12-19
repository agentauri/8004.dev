/**
 * API route for getting OASF taxonomy
 * GET /api/taxonomy?type=skill|domain
 */

import { backendFetch } from '@/lib/api/backend';
import { handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { BackendTaxonomy } from '@/types/backend';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Build params
    const params: Record<string, string | undefined> = {};
    if (type === 'skill' || type === 'domain') {
      params.type = type;
    }

    const response = await backendFetch<BackendTaxonomy>('/api/v1/taxonomy', {
      params,
      next: { revalidate: 3600 }, // Cache for 1 hour (taxonomy rarely changes)
    });

    return successResponse(response.data);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch taxonomy', 'TAXONOMY_ERROR');
  }
}
