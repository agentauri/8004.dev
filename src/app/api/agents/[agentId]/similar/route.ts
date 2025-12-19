/**
 * API route for getting similar agents
 * GET /api/agents/:agentId/similar
 */

import { BackendError, backendFetch } from '@/lib/api/backend';
import { mapSimilarAgents } from '@/lib/api/mappers';
import { errorResponse, handleRouteError, successResponse } from '@/lib/api/route-helpers';
import type { BackendSimilarAgent } from '@/types/backend';

interface RouteParams {
  params: Promise<{ agentId: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { agentId } = await params;

    // Validate agent ID format (chainId:tokenId)
    if (!agentId || !agentId.includes(':')) {
      return errorResponse(
        'Invalid agent ID format. Expected: chainId:tokenId',
        'INVALID_AGENT_ID',
        400,
      );
    }

    // Parse limit from query params, default to 10, max 20
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(Number(limitParam) || 10, 1), 20);

    const response = await backendFetch<BackendSimilarAgent[]>(
      `/api/v1/agents/${agentId}/similar?limit=${limit}`,
      {
        next: { revalidate: 300 }, // 5 minute cache
      },
    );

    const similarAgents = mapSimilarAgents(response.data);

    return successResponse({
      agents: similarAgents,
      meta: {
        total: similarAgents.length,
        limit,
        targetAgent: agentId,
      },
    });
  } catch (error) {
    // Special handling for not found
    if (error instanceof BackendError && error.code === 'NOT_FOUND') {
      return errorResponse('Agent not found', 'AGENT_NOT_FOUND', 404);
    }
    return handleRouteError(error, 'Failed to fetch similar agents', 'FETCH_ERROR');
  }
}
