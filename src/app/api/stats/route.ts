/**
 * API route for getting platform statistics
 * GET /api/stats
 */

import { backendFetch } from '@/lib/api/backend';
import { handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { BackendPlatformStats } from '@/types/backend';

export async function GET() {
  try {
    const response = await backendFetch<BackendPlatformStats>('/api/v1/stats', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    // Map backend response to frontend format
    const stats = {
      totalAgents: response.data.totalAgents,
      withMetadata: response.data.withRegistrationFile,
      activeAgents: response.data.activeAgents,
      chainBreakdown: response.data.chainBreakdown.map((chain) => ({
        chainId: chain.chainId,
        name: chain.shortName,
        total: chain.totalCount,
        withMetadata: chain.withRegistrationFileCount,
        active: chain.activeCount,
      })),
    };

    return successResponse(stats);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch platform statistics', 'STATS_ERROR');
  }
}
