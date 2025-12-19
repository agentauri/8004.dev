/**
 * API route for getting chain information and agent counts
 * GET /api/chains
 */

import { backendFetch } from '@/lib/api/backend';
import { handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { BackendChainStats } from '@/types/backend';

export async function GET() {
  try {
    const response = await backendFetch<BackendChainStats[]>('/api/v1/chains', {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    // Map backend response to frontend format
    const chains = response.data.map((chain) => ({
      chainId: chain.chainId,
      name: chain.name,
      shortName: chain.shortName,
      explorerUrl: chain.explorerUrl,
      totalCount: chain.totalCount,
      withMetadataCount: chain.withRegistrationFileCount,
      activeCount: chain.activeCount,
    }));

    return successResponse(chains);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch chain information', 'CHAINS_ERROR');
  }
}
